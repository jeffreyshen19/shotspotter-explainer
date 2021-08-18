const margin = {top: 50, right: 15, bottom: 70, left: 55};
let width = document.getElementById("vis").offsetWidth - margin.left - margin.right - 20,
    height = document.getElementById("vis").offsetHeight - margin.top - margin.bottom;

let map, histogram, histogramData, currentHistogram = -1;
let layers = {};

const ANIMATION_LENGTH = 300;
const ANIMATION_STEP = 10;

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
    var canvas = L.canvas();

    // Initialize geoJSON layers
    for(let key in data.layers){
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
        case "kcBGsWithData":
          style = {
            "weight": 0,
            "transition": "0.3s all"
          };
          break;
        case "kcMaxBusLines":
        case "troostAve":
          style = {
            "color": colors.blue,
            "weight": 3
          };
          break;
        case "kccc39":
          style = {
            "color": colors.black,
            "weight": 2
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
        case "kcShotSpotterActivations":
          style = {
            radius: 2,
            fillColor: colors.red,
            color: colors.black,
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.5,
            renderer: canvas,
          }
          break;
        case "kcUrbanRenewalAreas":
        case "kcccFocus":
          style = {
            radius: 4,
            fillColor: colors.black,
            weight: 0,
            opacity: 1,
            fillOpacity: 1
          }
          break;
      }

      // Render based off point or polygon
      switch(key){
        case "kcBoundaries":
        case "kcBGsWithData":
        case "kcMaxBusLines":
        case "troostAve":
        case "kccc39":
        case "kcShotSpotterApproxCoverageArea":
          layers[key] = L.geoJSON(data.layers[key], {
            style: style
          });
          break;
        case "kcUrbanRenewalAreas":
        case "kcShotSpotterActivations":
          layers[key] = L.geoJSON(data.layers[key], {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, style);
            }
          });
          break;
        case "kcccFocus":
          layers[key] = L.geoJSON(data.layers[key], {
            pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, style).bindTooltip(feature.properties.label, {
                permanent: true,
                direction: feature.properties.label == "31st & Troost" ? "left" : "right",
              });
            }
          });
          break;
      }

      layers[key].addTo(map);
      if(!(key == "kcShotSpotterApproxCoverageArea" || key == "kcBoundaries")){
        layers[key].setStyle({"opacity": 0, "fillOpacity": 0});
      }
    }

    // Fit
    map.fitBounds(layers.kcBoundaries.getBounds());
    layers.kcShotSpotterActivations.isScaled = false;
    layers.kcShotSpotterActivations.isVisible = false;

    hideChloropleth();

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

    d3.select("#loading").style("display", "none");
    d3.select("#map").style("visibility", "visible");
    d3.select("#legend").style("visibility", "visible");
  };

  // Handles display logic for sections
  var setupSections = function (data) {
    activateFunctions[0] = function(){
      map.flyToBounds(layers.kcBoundaries.getBounds());
    };
    updateFunctions[0] = function(){};

    activateFunctions[1] = async function(){
      map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(), {padding: [5, 5]});
      hideLegend("#legend-3");
      await hideShotSpotterActivations();
    };
    updateFunctions[1] = function(){};

    activateFunctions[2] = async function(){
      showLegend("#legend-3");
      d3.select("#chloropleth-legend").style("opacity", "0");
      await showShotSpotterActivations(false);
    };
    updateFunctions[2] = function(){};

    activateFunctions[3] = async function(){
      let i = 0;
      showShotSpotterLegend();
      await showShotSpotterActivations(true);
    };

    updateFunctions[3] = function(){};

    activateFunctions[4] = function(){};
    updateFunctions[4] = function(){};
    activateFunctions[5] = function(){};
    updateFunctions[5] = function(){};
    activateFunctions[6] = function(){};
    updateFunctions[6] = function(){};

    activateFunctions[7] = async function(){
      hideChloropleth();
      showShotSpotterLegend();
      map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(), {padding: [5, 5]});
      await showShotSpotterActivations(true);
    };
    updateFunctions[7] = function(){};

    activateFunctions[8] = async function(){
      hideLegend("#legend-3");
      map.flyToBounds(layers.kcBoundaries.getBounds());
      generateChloropleth([0, data.maxViolentCrimeRate], [colors.white, colors.black], "VIOLENT CRIME RATE", "Violent Crime per 1k People", (x) => Math.round(x * 1000));
      await hideShotSpotterActivations();
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
      hideLegend("#legend-4");
      hideLayer(layers.kcMaxBusLines);
    };
    updateFunctions[11] = function(){};
    //
    activateFunctions[12] = function(){
      showLegend("#legend-4");
      showLayer(layers.kcMaxBusLines);
      layers.kcShotSpotterApproxCoverageArea.bringToFront();
      hideLayer(layers.troostAve);
    };
    updateFunctions[12] = function(){};

    activateFunctions[13] = function(){
      hideLayer(layers.kcMaxBusLines);
      hideLegend("#legend-4");
      showLayer(layers.troostAve);
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
      hideLayer(layers.kcUrbanRenewalAreas);
      generateChloropleth([0, 1], [colors.white, colors.blue], "PCT_BLACK", "Percent Black", (x) => Math.round(x * 100) + "%");
      hideLegend("#legend-5");
    };
    updateFunctions[16] = function(){};

    activateFunctions[17] = function(){
      hideChloropleth();
      showLegend("#legend-5");
      showLayer(layers.kcUrbanRenewalAreas);
      hideLayer(layers.kcccFocus);
      hideLayer(layers.kccc39);
    };
    updateFunctions[17] = function(){};

    activateFunctions[18] = function(){
      showLayer(layers.kccc39);
      showLayer(layers.kcccFocus);
    };
    updateFunctions[18] = function(){};

    activateFunctions[19] = function(){
      hideChloropleth();
      showLayer(layers.kcccFocus);
      showLayer(layers.kcUrbanRenewalAreas);
      showLayer(layers.troostAve);
      showLayer(layers.kccc39);
      showLegend("#legend-5");
    };
    updateFunctions[19] = function(){};

    activateFunctions[20] = function(){
      hideLegend("#legend-5");
      hideLayer(layers.kcccFocus);
      hideLayer(layers.kcUrbanRenewalAreas);
      hideLayer(layers.troostAve);
      hideLayer(layers.kccc39);
      generateChloropleth([-1.5, 0, 1.5], [colors.blue, colors.white, colors.red], "PCT_CHANGE_RENT", "Pct. Change Median Gross Rent", (x) => Math.round(x * 100) + "%", true);
    };
    updateFunctions[20] = function(){};

    activateFunctions[21] = function(){
      generateChloropleth([0, 25], [colors.white, colors.red], "eviction.rate", "Eviction Rate", (x) => Math.round(x) + "%");
    };
    updateFunctions[21] = function(){};

    activateFunctions[22] = function(){
      generateChloropleth([-0.5, 0, 0.5], [colors.red, colors.white, colors.blue], "PCT_CHANGE_BLACK", "Pct. Change Black Population", (x) => Math.round(x * 100) + "%",true);
    };
    updateFunctions[22] = function(){};

    activateFunctions[23] = function(){};
    updateFunctions[23] = function(){};
    activateFunctions[24] = function(){};
    updateFunctions[24] = function(){};
  };

  function showLegend(id){
    d3.select(id).style("display", "inline-block").style("opacity", 1);
  }

  function hideLegend(id){
    d3.select(id).style("display", "none").style("opacity", 0);
  }

  async function showShotSpotterActivations(scale){
    return new Promise((resolve, reject) => {
      let i = 0;
      let interval = setInterval(function(){
        if(!layers.kcShotSpotterActivations.isVisible) layers.kcShotSpotterActivations.setStyle({"fillOpacity": i / ANIMATION_LENGTH * 0.5, "opacity": i / ANIMATION_LENGTH});
        layers.kcShotSpotterActivations.eachLayer(function (marker) {
          let radius;

          if(scale) radius = 2 * Math.max(Math.sqrt(i / ANIMATION_LENGTH * marker.feature.properties.Activations), 1);
          else radius = 2 * Math.max(Math.sqrt((1 - i / ANIMATION_LENGTH) * marker.feature.properties.Activations), 1);

          if(scale && !layers.kcShotSpotterActivations.isScaled) marker.setRadius(radius);
          else if(!scale && layers.kcShotSpotterActivations.isScaled) marker.setRadius(radius);
        });
        if(i >= ANIMATION_LENGTH) {
          clearInterval(interval);
          layers.kcShotSpotterActivations.isVisible = true;
          layers.kcShotSpotterActivations.isScaled = scale;
          resolve();
        }
        i += ANIMATION_STEP;
      }, ANIMATION_STEP);
    });

  }

  async function hideShotSpotterActivations(){
    return new Promise((resolve, reject) => {
      let i = 0;
      let interval = setInterval(function(){
        if(layers.kcShotSpotterActivations.isVisible) layers.kcShotSpotterActivations.setStyle({"fillOpacity": 0.5 - i / ANIMATION_LENGTH * 0.5, "opacity": 1 - i / ANIMATION_LENGTH});
        if(i >= ANIMATION_LENGTH) {
          clearInterval(interval);
          layers.kcShotSpotterActivations.isVisible = false;
          resolve();
        }
        i += ANIMATION_STEP;
      }, ANIMATION_STEP);
    });
  }

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
    layers.kcBGsWithData.setStyle({"fillOpacity": 1});

    // Update legend
    d3.select("#chloropleth-legend").style("opacity", "1");
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
    layers.kcBGsWithData.setStyle({"fillOpacity": 0});
    d3.select("#chloropleth-legend").style("opacity", "0");
  }

  function showLayer(layer){
    layer.setStyle({"fillOpacity": 1, "opacity": 1});
  }

  function hideLayer(layer){
    layer.setStyle({"fillOpacity": 0, "opacity": 0});
  }

  function showShotSpotterLegend(){
    d3.select("#chloropleth-legend").style("opacity", "1");
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
  d3.json("data/public/kccc-areas.geojson"),
]).then(function(data){ // Process data
  let layers = {
    "kcBGsWithData": data[0],
    "kcBoundaries": data[1],
    "kcMaxBusLines": data[2],
    "kcShotSpotterActivations": data[3],
    "kcShotSpotterApproxCoverageArea": data[4],
    "kcUrbanRenewalAreas": data[5],
    "troostAve": data[6],
    "kccc39": data[7],
    "kcccFocus": data[8],
  };

  // Cast to real
  let maxViolentCrimeRate = 0;
  layers.kcBGsWithData.features = layers.kcBGsWithData.features.map(function(feature){
    ["2013 MEDIAN GROSS RENT", "2013 PCT BLACK", "2013 PCT HISPANIC", "2013 PCT WHITE", "2019 MEDIAN GROSS RENT", "PCT_BLACK", "PCT_HISPANIC", "PCT_WHITE", "TOTAL"].forEach(function(key){
      feature.properties[key] = parseFloat(feature.properties[key]);
      maxViolentCrimeRate = Math.max(maxViolentCrimeRate, feature.properties["VIOLENT CRIME RATE"])
    });
    return feature;
  });

  return {
    maxViolentCrimeRate: maxViolentCrimeRate,
    layers: layers
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
