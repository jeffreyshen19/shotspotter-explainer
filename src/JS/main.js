
const margin = {top: 50, right: 15, bottom: 70, left: 55};
let width = document.getElementById("vis").offsetWidth - margin.left - margin.right - 20,
    height = document.getElementById("vis").offsetHeight - margin.top - margin.bottom;

let map, histogram, histogramData, currentHistogram = -1;
let layers = {};

var scrollVis = function () {

  // Which visualization we currently are on
  var lastIndex = -1;
  var activeIndex = 0;

  var activateFunctions = []; //Functions called at the START of each section
  var updateFunctions = []; //Functions called DURING each section (takes a param progress 0.0 - 1.0)

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function (selection) {
    selection.each(function (data) {
      setupVis(data);
      setupSections();
    });
  };

  // Creates initial elements for all visualizations
  var setupVis = function (data) {
    // Add map
    map = L.map('map', {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false,
    });

    // Initialize geoJSON layers
    for(let key in data){
      let style = {};

      // Styling options
      switch(key){
        case "kcBoundaries":
          style = {
            "color": "#2e3131",
            "weight": 2,
            "opacity": 0.7,
            "fillOpacity": 0,
          };
          break;
        case "kcShotSpotterApproxCoverageArea":
          style = {
            "color": "#cf000f",
            "weight": 2,
            "opacity": 0.7,
            "fillOpacity": 0.05,
          };
          break;
        case "kcShotspotterActivations":
          style = {
            radius: 2,
            fillColor: "#cf000f",
            color: "#2e3131",
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: 1,
          }
      }

      // Render based off point or polygon
      switch(key){
        case "kcBoundaries":
        case "kcBGsWithData":
        case "kcMaxBusLines":
        case "kcShotSpotterApproxCoverageArea":
          layers[key] = L.geoJSON(data[key], {
            style: style
          });
          break;
        case "kcEvictions":
        case "kcUrbanRenewalAreas":
        case "kcShotspotterActivations":
          layers[key] = L.geoJSON(data[key], {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, style);
            }
          });
          break;
      }

    }

    // Fit
    map.fitBounds(layers.kcBoundaries.getBounds());
    layers.kcShotspotterActivations.addTo(map);

    // Add background tile
    L.tileLayer('https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=lTdR1t9ghN06990FNZFA', {
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map);
  };

  // Handles display logic for sections
  var setupSections = function () {
    activateFunctions[0] = function(){
      layers.kcShotSpotterApproxCoverageArea.addTo(map);
      layers.kcBoundaries.addTo(map);
      map.flyToBounds(layers.kcBoundaries.getBounds());
    };
    updateFunctions[0] = function(){};

    activateFunctions[1] = function(){
      map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(), {padding: [5, 5]});
      map.removeLayer(layers.kcShotspotterActivations);
      d3.select("#legend-3").style("display", "none");
    };
    updateFunctions[1] = function(){};

    activateFunctions[2] = function(){
      layers.kcShotspotterActivations.addTo(map);
      layers.kcShotspotterActivations.eachLayer(function (marker) {
        marker.setRadius(2);
      });
      d3.select("#legend-3").style("display", "inline-block");
    };
    updateFunctions[2] = function(){};

    activateFunctions[3] = function(){
      layers.kcShotspotterActivations.eachLayer(function (marker) {
        marker.setRadius(2 * Math.sqrt(marker.feature.properties.Activations));
      });
    };
    updateFunctions[3] = function(){};
    //
    // activateFunctions[4] = function(){
    // };
    // updateFunctions[4] = function(){};
    //
    // activateFunctions[5] = function(){
    //   hideLayer(layers.kcShotSpotterApproxCoverageArea);
    //   layers.kcShotspotterActivations.setStyle({"fillOpacity": 0.5, "opacity": 1});
    // };
    // updateFunctions[5] = function(){};
    //
    // activateFunctions[6] = function(){
    //   layers.kcShotspotterActivations.setStyle({"fillOpacity": 0, "opacity": 0});
    //   showLayer(layers.kcShotSpotterApproxCoverageArea);
    // };
    // updateFunctions[6] = function(){};
    //
    // activateFunctions[7] = function(){};
    // updateFunctions[7] = function(){};

    // activateFunctions[8] = function(){displayHistogram(2)};
    // updateFunctions[8] = function(){};
  };

  // function displayImage(id){
  //   d3.select("#vis").selectAll("img").transition().duration(500).style("opacity", "0");
  //   d3.select("#" + id).transition().duration(500).style("opacity", "1");
  // }
  //
  // function displayHistogram(index, useMedian){
  //   currentHistogram = index;
  //
  //   d3.select("#graph").transition().duration(500).style("opacity", "1");
  //
  //   var x = d3.scaleLinear()
  //       .domain([0, 50])
  //       .range([0, width]);
  //
  //   var bins = histogram(histogramData[index]),
  //       median = d3.median(histogramData[index]),
  //       medianX = x(median);
  //
  //   var y = d3.scaleLinear()
  //       .range([height, 0])
  //       .domain([0, d3.max(bins, function(d) { return d.length; })]);
  //
  //   d3.select('.y.axis')
  //     .transition()
  //     .duration(1000)
  //     .call(d3.axisLeft(y));
  //
  //   d3.select(".y-axis-label")
  //     .transition()
  //     .duration(1000)
  //     .text("Tree Canopy (" + ["Low", "Middle", "Upper"][index] + " Income Tracts)");
  //
  //   // Update median
  //   if(useMedian == false){
  //     d3.select("svg").select(".median-text")
  //       .transition()
  //       .duration(1000)
  //       .style("opacity", "0");
  //
  //     d3.select("svg").select(".median-line")
  //       .transition()
  //       .duration(1000)
  //       .style("opacity", "0");
  //
  //     d3.select("svg").select(".median-arrow")
  //       .transition()
  //       .duration(1000)
  //       .style("opacity", "0");
  //   }
  //   else{
  //     d3.select("svg").select(".median-text")
  //       .transition()
  //       .duration(1000)
  //       .style("opacity", "1")
  //       .attr("transform", `translate(${medianX}, ${-22})`)
  //       .text(`Median (${d3.format(".2%")(median / 100)})`);
  //
  //     d3.select("svg").select(".median-line")
  //       .transition()
  //       .duration(1000)
  //       .style("opacity", "1")
  //       .attr("x1", medianX)
  //       .attr("x2", medianX);
  //
  //     d3.select("svg").select(".median-arrow")
  //       .transition()
  //       .duration(1000)
  //       .style("opacity", "1")
  //       .attr("points", `${medianX},-5 ${medianX - 10},-15 ${medianX + 10},-15`);
  //   }

    // Update bars
  //   d3.select("svg").selectAll("rect")
  //     .data(bins)
  //     .transition()
  //     .duration(1000)
  //     .attr("x", 1)
  //     .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
  //     .attr("width", function(d) { return x(d.x1) - x(d.x0); })
  //     .attr("height", function(d) { return height - y(d.length);});
  // }


  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};

// Load all files, then display
Promise.all([
  d3.json("data/public/kansas-city-bgs.geojson"),
  d3.json("data/public/kansas-city-boundaries-mo.geojson"),
  d3.json("data/public/kansas-city-evictions-bgs-2015.geojson"),
  d3.json("data/public/kansas-city-max-buslines.geojson"),
  d3.json("data/public/kansas-city-shotspotter-activations-grouped.geojson"),
  d3.json("data/public/kansas-city-shotspotter-approx-coverage-area.geojson"),
  d3.json("data/public/kansas-city-urban-renewal-areas.geojson"),
]).then(function(data){ // Process data
  return {
    "kcBGsWithData": data[0],
    "kcBoundaries": data[1],
    "kcEvictions": data[2],
    "kcMaxBusLines": data[3],
    "kcShotspotterActivations": data[4],
    "kcShotSpotterApproxCoverageArea": data[5],
    "kcUrbanRenewalAreas": data[6],
  };
})
.then(function(data) {
  var plot = scrollVis();

  d3.select('#vis')
    .datum(data)
    .call(plot);

  var scroll = scroller()
    .container(d3.select('#scrolling-vis'));

  scroll(d3.selectAll('.step'));

  scroll.on('active', function (index) {
    d3.selectAll('.step')
      .classed("active", function (d, i) { return i === index })
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    plot.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });

  // let resizeTimer;

  // Handle Resize
  // d3.select(window)
  //   .on('resize', function(){
    //   clearTimeout(resizeTimer);
    //   resizeTimer = setTimeout(function() {
    //     width = document.getElementById("vis").offsetWidth - margin.left - margin.right - 20;
    //
    //     var svg = d3.select("#graph").select("svg")
    //       .attr("width", width + margin.left + margin.right)
    //       .attr("height", height + margin.top + margin.bottom);
    //
    //     var x = d3.scaleLinear()
    //       .domain([0, 50])
    //       .range([0, width]);
    //
    //     svg.select(".x.axis")
    //       .call(d3.axisBottom(x).tickFormat((x) => x + "%").ticks(5));
    //
    //     svg.select(".y-axis-label")
    //       .attr("transform",
    //             `translate(${width / 2},${height + 40})`);
    //
    //     histogram = d3.histogram()
    //       .value(function(d) { return d; })
    //       .domain(x.domain())
    //       .thresholds(x.ticks(25));
    //
    //     if(currentHistogram != -1){
    //       var bins = histogram(histogramData[currentHistogram]),
    //           median = d3.median(histogramData[currentHistogram]),
    //           medianX = x(median);
    //
    //       var y = d3.scaleLinear()
    //           .range([height, 0])
    //           .domain([0, d3.max(bins, function(d) { return d.length; })]);
    //
    //       d3.select("svg").select(".median-text")
    //         .attr("transform", `translate(${medianX}, ${-22})`);
    //
    //       d3.select("svg").select(".median-line")
    //         .attr("x1", medianX)
    //         .attr("x2", medianX);
    //
    //       d3.select("svg").select(".median-arrow")
    //         .attr("points", `${medianX},-5 ${medianX - 10},-15 ${medianX + 10},-15`);
    //
    //       d3.select("svg").selectAll("rect")
    //         .attr("x", 1)
    //         .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    //         .attr("width", function(d) { return x(d.x1) - x(d.x0); });
    //     }
    //   }, 50);
    // });

}).catch(function(err) {
  // handle error here
  console.log(err);
});
