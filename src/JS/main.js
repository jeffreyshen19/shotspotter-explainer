
const margin = {top: 50, right: 15, bottom: 70, left: 55};
let width = document.getElementById("vis").offsetWidth - margin.left - margin.right - 20,
    height = document.getElementById("vis").offsetHeight - margin.top - margin.bottom;

let map, histogram, histogramData, currentHistogram = -1;
let layers = {};

function hideLayer(layer){
    map.removeLayer(layer);
}

function showLayer(layer){
    layer.addTo(map);
}

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
      dragging: false
    }).setView([39.092,-94.856], 9);

    // Add background tile
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Initialize geoJSON layers
    for(let key in data){
      let style = {};

      // Styling options
      switch(key){
        case "kcBoundaries":
          style = {
            "color": "#1f3a93",
            "weight": 2,
            "opacity": 0.5,
            "fillOpacity": 0.05,
          };
          break;
        case "kcShotspotterActivations":
          style = {
            radius: 2,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
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
        case "kcShotspotterActivations":
        case "kcUrbanRenewalAreas":
          layers[key] = L.geoJSON(data[key], {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, style);
            }
          });
          break;
      }
    }

    showLayer(layers.kcShotspotterActivations);
    layers.kcShotspotterActivations.setStyle({"opacity": 0});

  };

  // Handles display logic for sections
  var setupSections = function () {
    activateFunctions[0] = function(){
      hideLayer(layers.kcBoundaries);
      //Todo; set frame here
    };
    updateFunctions[0] = function(){};

    activateFunctions[1] = function(){
      showLayer(layers.kcBoundaries);
      map.fitBounds(layers.kcBoundaries.getBounds());
    };
    updateFunctions[1] = function(){};

    activateFunctions[2] = function(){
      map.flyToBounds(layers.kcBoundaries.getBounds());
      layers.kcShotspotterActivations.setStyle({"opacity": 0, "fillOpacity": 0});
    };
    updateFunctions[2] = function(){};

    activateFunctions[3] = function(){
      layers.kcShotspotterActivations.setStyle({"opacity": 1, "fillOpacity": 0.9});
      map.flyToBounds(layers.kcShotspotterActivations.getBounds(), {padding: [50, 50]});
    };
    updateFunctions[3] = function(){};

    activateFunctions[4] = function(){

    };
    updateFunctions[4] = function(){};
    //
    // activateFunctions[5] = function(){
    //   d3.select("#img3").transition().duration(500).style("opacity", "0");
    //   displayHistogram(0, false);
    // };
    // updateFunctions[5] = function(){};
    //
    // activateFunctions[6] = function(){displayHistogram(0)};
    // updateFunctions[6] = function(){};
    //
    // activateFunctions[7] = function(){displayHistogram(1)};
    // updateFunctions[7] = function(){};
    //
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
  d3.json("data/public/kansas-city-bgs-race-rent-crime.geojson"),
  d3.json("data/public/kansas-city-boundaries-mo.geojson"),
  d3.json("data/public/kansas-city-evictions.geojson"),
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
