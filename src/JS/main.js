const margin = {top: 50, right: 15, bottom: 70, left: 55};
let width = document.getElementById("vis").offsetWidth - margin.left - margin.right - 20,
    height = document.getElementById("vis").offsetHeight - margin.top - margin.bottom;

let map, histogram, histogramData, currentHistogram = -1;
let layers = {};

const colors = {
  white: "#f9f9f9",
  blue: "#1f3a93",
  black: "#2e3131",
  green: "#1e824c",
  red: "#cf000f",
  yellow: '#eeee00'
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
      setupSections(data);
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
            "color": colors.black,
            "weight": 2,
            "opacity": 0.7,
            "fillOpacity": 0,
          };
          break;
        case "kcMaxBusLines":
          style = {
            "color": colors.blue,
            "weight": 3
          };
          break;
        case "kccc39":
          style = {
            "color": colors.black,
            "weight": 3
          };
          break;
        case "kcShotSpotterApproxCoverageArea":
          style = {
            "color": colors.red,
            "weight": 2,
            "opacity": 0.7,
            "fillOpacity": 0,
          };
          break;
        case "kcShotspotterActivations":
          style = {
            radius: 2,
            fillColor: colors.red,
            color: colors.black,
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: 1,
          }
          break;
        case "kcUrbanRenewalAreas":
          style = {
            radius: 4,
            fillColor: colors.black,
            weight: 0,
            opacity: 1,
            fillOpacity: 1,
          }
      }

      // Render based off point or polygon
      switch(key){
        case "kcBoundaries":
        case "kcBGsWithData":
        case "kcMaxBusLines":
        case "troostAve":
        case "kccc39":
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
    layers.kcBGsWithData.addTo(map);

    layers.kcShotspotterActivations.setStyle({"fillOpacity": 0, "opacity": 0});
    hideChloropleth();

    layers.kcccFocus = L.layerGroup([
      [39.069872, -94.552827, "31st & Prospect"],
      [39.070495, -94.571334, "31st & Troost"]
    ].map(function(coords, i){
      return L.circleMarker([coords[0], coords[1]], {
        radius: 4,
        fillColor: colors.black,
        weight: 0,
        opacity: 1,
        fillOpacity: 1
      }).bindTooltip(coords[2], {
        permanent: true,
        direction: i == 0 ? "right" : "left",
      });
    }));

    layers.kccc39.bindTooltip("39th Street Corridor", {
      permanent: true,
      direction: "left",
      offset: L.point([-50, 0])
    });

    layers.troostAve.bindTooltip("Troost Ave", {
      permanent: true,
      direction: "left",
    })

    // Add background tile
    L.tileLayer('https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=lTdR1t9ghN06990FNZFA', {
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map);
  };

  // Handles display logic for sections
  var setupSections = function (data) {
    activateFunctions[0] = function(){
      layers.kcShotSpotterApproxCoverageArea.addTo(map);
      layers.kcBoundaries.addTo(map);
      map.flyToBounds(layers.kcBoundaries.getBounds());
    };
    updateFunctions[0] = function(){};

    activateFunctions[1] = function(){
      map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(), {padding: [5, 5]});
      layers.kcShotspotterActivations.setStyle({"fillOpacity": 0, "opacity": 0});
      d3.select("#legend-3").style("display", "none");
    };
    updateFunctions[1] = function(){};

    activateFunctions[2] = function(){
      layers.kcShotspotterActivations.setStyle({"fillOpacity": 0.5, "opacity": 1});
      layers.kcShotspotterActivations.eachLayer(function (marker) {
        marker.setRadius(2);
      });
      d3.select("#legend-3").style("display", "inline-block");
      d3.select("#chloropleth-legend").style("display", "none");
    };
    updateFunctions[2] = function(){};

    activateFunctions[3] = function(){
      layers.kcShotspotterActivations.eachLayer(function (marker) {
        marker.setRadius(2 * Math.sqrt(marker.feature.properties.Activations));
      });
      showShotSpotterLegend();
    };
    updateFunctions[3] = function(){};

    activateFunctions[4] = function(){};
    updateFunctions[4] = function(){};
    activateFunctions[5] = function(){};
    updateFunctions[5] = function(){};
    activateFunctions[6] = function(){};
    updateFunctions[6] = function(){};

    activateFunctions[7] = function(){
      hideChloropleth();
      showShotSpotterLegend();
      map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(), {padding: [5, 5]});
      layers.kcShotspotterActivations.setStyle({"fillOpacity": 0.5, "opacity": 1});
    };
    updateFunctions[7] = function(){};

    activateFunctions[8] = function(){
      d3.select("#legend-3").style("display", "none");
      map.flyToBounds(layers.kcBoundaries.getBounds());
      layers.kcShotspotterActivations.setStyle({"fillOpacity": 0, "opacity": 0});
      generateChloropleth([0, data.maxViolentCrimeRate], [colors.white, colors.black], "VIOLENT CRIME RATE", "Violent Crime per 1k People", (x) => Math.round(x * 1000));
    };
    updateFunctions[8] = function(){};

    activateFunctions[9] = function(){
      map.flyToBounds([
        [39.152465, -94.609998],
        [39.018955, -94.509757]
      ]);
      generateChloropleth([0, data.maxViolentCrimeRate], [colors.white, colors.black], "VIOLENT CRIME RATE", "Violent Crime per 1k People", (x) => Math.round(x * 1000));
    };
    updateFunctions[9] = function(){};

    activateFunctions[10] = function(){
      generateChloropleth([0, data.maxViolentCrimeRate], [colors.white, colors.black], "VIOLENT CRIME RATE", "Violent Crime per 1k People", (x) => Math.round(x * 1000));
      layers.kcBGsWithData.eachLayer(function (layer) {
        if(layer.feature.properties.GEOID == '290950034002') {
          layer.setStyle({color: colors.yellow});
        }
      });
    };
    updateFunctions[10] = function(){};

    activateFunctions[11] = function(){
      hideChloropleth();
      d3.select("#legend-4").style("display", "none");
      map.removeLayer(layers.kcMaxBusLines);
    };
    updateFunctions[11] = function(){};
    //
    activateFunctions[12] = function(){
      d3.select("#legend-4").style("display", "inline-block");
      layers.kcMaxBusLines.addTo(map);
      layers.kcShotSpotterApproxCoverageArea.bringToFront();
      map.removeLayer(layers.troostAve);
    };
    updateFunctions[12] = function(){};

    activateFunctions[13] = function(){
      map.removeLayer(layers.kcMaxBusLines);
      d3.select("#legend-4").style("display", "none");
      layers.troostAve.addTo(map);
      layers.kcShotSpotterApproxCoverageArea.bringToFront();
    };
    updateFunctions[13] = function(){};

    activateFunctions[14] = function(){
      hideChloropleth();
    };
    updateFunctions[14] = function(){};

    activateFunctions[15] = function(){
      generateChloropleth([0, 1], [colors.white, colors.blue], "PCT_BLACK", "Percent Black", (x) => Math.round(x * 100) + "%");
    };
    updateFunctions[15] = function(){};

    activateFunctions[16] = function(){
      map.removeLayer(layers.kcUrbanRenewalAreas);
      generateChloropleth([0, 1], [colors.white, colors.blue], "PCT_BLACK", "Percent Black", (x) => Math.round(x * 100) + "%");
      d3.select("#legend-5").style("display", "none");
    };
    updateFunctions[16] = function(){};

    activateFunctions[17] = function(){
      hideChloropleth();
      d3.select("#legend-5").style("display", "inline-block");
      layers.kcUrbanRenewalAreas.addTo(map);
      map.removeLayer(layers.kccc39);
      map.removeLayer(layers.kcccFocus);
    };
    updateFunctions[17] = function(){};

    activateFunctions[18] = function(){
      layers.kccc39.addTo(map);
      layers.kcccFocus.addTo(map);
    };
    updateFunctions[18] = function(){};

    activateFunctions[19] = function(){
      hideChloropleth();
      layers.kccc39.addTo(map);
      layers.kcccFocus.addTo(map);
      layers.troostAve.addTo(map);
      layers.kcUrbanRenewalAreas.addTo(map);
      d3.select("#legend-5").style("display", "inline-block");
    };
    updateFunctions[19] = function(){};

    activateFunctions[20] = function(){
      d3.select("#legend-5").style("display", "none");
      map.removeLayer(layers.kccc39);
      map.removeLayer(layers.kcccFocus);
      map.removeLayer(layers.troostAve);
      map.removeLayer(layers.kcUrbanRenewalAreas);
      generateChloropleth([-1.5, 0, 1.5], [colors.blue, colors.white, colors.red], "PCT_CHANGE_RENT", "Percent Change in Median Gross Rent", (x) => Math.round(x * 100) + "%", true);
    };
    updateFunctions[20] = function(){};

    activateFunctions[21] = function(){
      generateChloropleth([0, 25], [colors.white, colors.red], "eviction.rate", "Eviction Rate", (x) => Math.round(x * 100) + "%");
    };
    updateFunctions[21] = function(){};

    activateFunctions[22] = function(){
      generateChloropleth([-0.5, 0, 0.5], [colors.red, colors.white, colors.blue], "PCT_CHANGE_BLACK", "Percent Change Black Population", (x) => Math.round(x * 100) + "%",true);
    };
    updateFunctions[22] = function(){};

    activateFunctions[23] = function(){};
    updateFunctions[23] = function(){};
    activateFunctions[24] = function(){};
    updateFunctions[24] = function(){};
  };

  function generateChloropleth(domain, range, column, legendTitle, format, diverging){

    // Update map
    let colorScale = d3.scaleLinear()
      .domain(domain)
      .range(range);

    layers.kcBGsWithData.setStyle(function(feature) {
      return {
        color: feature.properties[column] ? colorScale(feature.properties[column]) : "rgba(0, 0, 0, 0)"
      }
    });

    // Show map
    layers.kcBGsWithData.setStyle({"fillOpacity": 1, "opacity": 1});

    // Update legend
    d3.select("#chloropleth-legend").style("display", "block");
    d3.select("#color-scale").html("");
    d3.select("#chloropleth-title").text(legendTitle);

    const NUM_STEPS = 5;
    const min = domain[0], max = domain[domain.length - 1], step_size = (max - min) / (NUM_STEPS - (diverging ? 1 : 0));

    for(let i = 0; i < NUM_STEPS; i++){
      let element = d3.select("#color-scale").append("div");

      element.append("div")
        .attr("class", "legend-item")
        .style("background", colorScale(min + i * step_size));

      element.append("span")
        .text(format(min + i * step_size));
    }

  }

  function hideChloropleth(){
    layers.kcBGsWithData.setStyle({"fillOpacity": 0, "opacity": 0});
    d3.select("#chloropleth-legend").style("display", "none");
  }

  function showShotSpotterLegend(){
    d3.select("#chloropleth-legend").style("display", "block");
    d3.select("#color-scale").html("");
    d3.select("#chloropleth-title").text("ShotSpotter activations");

    [1, 24, 48].forEach(function(activations, i){
      let radius = 2 * Math.sqrt(activations);
      let offset = 2 * Math.sqrt(48) - radius;

      let element = d3.select("#color-scale")
        .append("div")
          .attr("class", "level")
          .style("margin-bottom", (i == 2 ? 0 : radius / 2) + "px")
          .style("margin-left", offset + "px")
        .append("div")
          .attr("class", "level-left");

      element.append("div")
        .attr("class", "legend-item level-item")
        .style("border-radius", "100%")
        .style("border", "1px solid rgba(46, 48, 48, 0.5)")
        .style("background-color", "rgba(207, 0, 15)")
        .style("width", 2 * radius + "px")
        .style("height", 2 * radius + "px")
        .style("margin-right", offset + 5 + "px");

      element.append("span")
        .text(activations);
    });
  }

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
  d3.json("data/public/kansas-city-max-buslines.geojson"),
  d3.json("data/public/kansas-city-shotspotter-activations-grouped.geojson"),
  d3.json("data/public/kansas-city-shotspotter-approx-coverage-area.geojson"),
  d3.json("data/public/kansas-city-urban-renewal-areas.geojson"),
  d3.json("data/public/troost-ave.geojson"),
  d3.json("data/public/kccc-39.geojson"),
]).then(function(data){ // Process data
  data = {
    "kcBGsWithData": data[0],
    "kcBoundaries": data[1],
    "kcMaxBusLines": data[2],
    "kcShotspotterActivations": data[3],
    "kcShotSpotterApproxCoverageArea": data[4],
    "kcUrbanRenewalAreas": data[5],
    "troostAve": data[6],
    "kccc39": data[7],
  };

  // Cast to real
  let maxViolentCrimeRate = 0;
  data.kcBGsWithData.features = data.kcBGsWithData.features.map(function(feature){
    ["2013 MEDIAN GROSS RENT", "2013 PCT BLACK", "2013 PCT HISPANIC", "2013 PCT WHITE", "2019 MEDIAN GROSS RENT", "PCT_BLACK", "PCT_HISPANIC", "PCT_WHITE", "TOTAL"].forEach(function(key){
      feature.properties[key] = parseFloat(feature.properties[key]);
      maxViolentCrimeRate = Math.max(maxViolentCrimeRate, feature.properties["VIOLENT CRIME RATE"])
    });
    return feature;
  });

  data.maxViolentCrimeRate = maxViolentCrimeRate;

  return data;
})
.then(function(data) {
  d3.select("#loading").style("display", "none");
  d3.select("#map").style("display", "block");
  d3.select("#legend").style("display", "block");

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

  // TODO: remove
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
    //   }, 50);
    // });

}).catch(function(err) {
  // handle error here
  console.log(err);
});
