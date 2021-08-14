const margin={top:50,right:15,bottom:70,left:55};let map,histogram,histogramData,width=document.getElementById("vis").offsetWidth-margin.left-margin.right-20,height=document.getElementById("vis").offsetHeight-margin.top-margin.bottom,currentHistogram=-1;var scrollVis=function(){// Which visualization we currently are on
var a=-1,b=0,c=[],d=[],e=function(a){a.each(function(a){f(a),g()})},f=function(){map=L.map("map").setView([39.092,-94.856],9),L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",{attribution:"&copy; <a href=\"https://stadiamaps.com/\">Stadia Maps</a>, &copy; <a href=\"https://openmaptiles.org/\">OpenMapTiles</a> &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors"}).addTo(map)},g=function(){c[0]=function(){},d[0]=function(){}};// return chart function
return e.activate=function(d){b=d;var e=0>b-a?-1:1,f=d3.range(a+e,b+e,e);f.forEach(function(a){c[a]()}),a=b},e.update=function(a,b){d[a](b)},e},plot=scrollVis();// Load data, then display
// d3.json("/data/la-shade/census-tracts-2012.geojson")
//   .then(function(data){ // Process data
//     let histogramData = [[], [], []]; // Store the tree canopy cover, broken down by the median income of census tracts (lower, middle, upper income)
//
//     data.features.forEach(function(d){
//       let treePercent = parseFloat(d.properties["TREE-PCT"]),
//           medianIncome = parseInt(d.properties["median-income"]);
//
//       if(!isNaN(treePercent) && !isNaN(medianIncome)){
//         if(medianIncome <= 42000) histogramData[0].push(treePercent); //Lower income
//         else if(medianIncome <= 125000) histogramData[1].push(treePercent); //Middle income
//         else histogramData[2].push(treePercent); //Upper income
//       }
//     });
//
//     return {
//       "geojson": data,
//       "histogramData": histogramData
//     };
//   })
//   .then(function(data) {
let data=[];d3.select("#vis").datum(data).call(plot);var scroll=scroller().container(d3.select("#scrolling-vis"));scroll(d3.selectAll(".step")),scroll.on("active",function(a){d3.selectAll(".step").classed("active",function(b,c){return c===a}).style("opacity",function(b,c){return c===a?1:.1}),plot.activate(a)}),scroll.on("progress",function(a,b){plot.update(a,b)});