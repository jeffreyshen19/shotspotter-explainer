const margin={top:50,right:15,bottom:70,left:55};let map,histogram,histogramData,width=document.getElementById("vis").offsetWidth-margin.left-margin.right-20,height=document.getElementById("vis").offsetHeight-margin.top-margin.bottom,currentHistogram=-1,layers={};var scrollVis=function(){// Which visualization we currently are on
var a=-1,b=0,c=[],d=[],e=function(a){a.each(function(a){f(a),g(a)})},f=function(a){// Initialize geoJSON layers
for(let b in map=L.map("map",{zoomControl:!1,scrollWheelZoom:!1,doubleClickZoom:!1,dragging:!1}),a){let c={};// Styling options
"kcBoundaries"==b?c={color:"#2e3131",weight:2,opacity:.7,fillOpacity:0}:"kcMaxBusLines"===b?c={color:"#1f3a93",weight:3}:"kccc39"===b?c={color:"#1e824c",weight:3}:"kcShotSpotterApproxCoverageArea"===b?c={color:"#cf000f",weight:2,opacity:.7,fillOpacity:0}:"kcShotspotterActivations"===b?c={radius:2,fillColor:"#cf000f",color:"#2e3131",weight:.5,opacity:.5,fillOpacity:1}:"kcUrbanRenewalAreas"===b?c={radius:4,fillColor:"#2e3131",weight:0,opacity:1,fillOpacity:1}:void 0,"kcBoundaries"==b||"kcBGsWithData"===b||"kcMaxBusLines"===b||"troostAve"===b||"kccc39"===b||"kcShotSpotterApproxCoverageArea"===b?layers[b]=L.geoJSON(a[b],{style:c}):"kcEvictions"===b||"kcUrbanRenewalAreas"===b||"kcShotspotterActivations"===b?layers[b]=L.geoJSON(a[b],{pointToLayer:function(a,b){return L.circleMarker(b,c)}}):void 0}// Fit
map.fitBounds(layers.kcBoundaries.getBounds()),layers.kcShotspotterActivations.addTo(map),layers.kcBGsWithData.addTo(map),layers.kcShotspotterActivations.setStyle({fillOpacity:0,opacity:0}),layers.kcBGsWithData.setStyle({fillOpacity:0,opacity:0}),layers.kcccFocus=L.layerGroup([[39.069872,-94.552827,"31st & Prospect"],[39.070495,-94.571334,"31st & Troost"]].map(function(a,b){return L.circleMarker([a[0],a[1]],{radius:4,fillColor:"#1e824c",weight:0,opacity:1,fillOpacity:1}).bindTooltip(a[2],{permanent:!0,direction:0==b?"right":"left"})})),layers.kccc39.bindTooltip("39th Street Corridor",{permanent:!0,direction:"left",offset:L.point([-50,0])}),layers.troostAve.bindTooltip("Troost Ave",{permanent:!0,direction:"left"}),L.tileLayer("https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=lTdR1t9ghN06990FNZFA",{attribution:"<a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>"}).addTo(map)},g=function(a){c[0]=function(){layers.kcShotSpotterApproxCoverageArea.addTo(map),layers.kcBoundaries.addTo(map),map.flyToBounds(layers.kcBoundaries.getBounds())},d[0]=function(){},c[1]=function(){map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(),{padding:[5,5]}),layers.kcShotspotterActivations.setStyle({fillOpacity:0,opacity:0}),d3.select("#legend-3").style("display","none")},d[1]=function(){},c[2]=function(){layers.kcShotspotterActivations.setStyle({fillOpacity:.5,opacity:1}),layers.kcShotspotterActivations.eachLayer(function(a){a.setRadius(2)}),d3.select("#legend-3").style("display","inline-block")},d[2]=function(){},c[3]=function(){layers.kcShotspotterActivations.eachLayer(function(a){a.setRadius(2*Math.sqrt(a.feature.properties.Activations))})},d[3]=function(){},c[4]=function(){},d[4]=function(){},c[5]=function(){},d[5]=function(){},c[6]=function(){},d[6]=function(){},c[7]=function(){layers.kcBGsWithData.setStyle({fillOpacity:0,opacity:0}),map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(),{padding:[5,5]}),layers.kcShotspotterActivations.setStyle({fillOpacity:.5,opacity:1})},d[7]=function(){},c[8]=function(){map.flyToBounds(layers.kcBoundaries.getBounds()),layers.kcShotspotterActivations.setStyle({fillOpacity:0,opacity:0}),layers.kcBGsWithData.setStyle({fillOpacity:1,opacity:1});let b=d3.scaleLinear().domain([0,a.maxViolentCrimeRate]).range(["white","#2e3131"]);layers.kcBGsWithData.setStyle(function(a){return{color:b(a.properties["VIOLENT CRIME RATE"])}})},d[8]=function(){},c[9]=function(){map.flyToBounds([[39.152465,-94.609998],[39.018955,-94.509757]]);let b=d3.scaleLinear().domain([0,a.maxViolentCrimeRate]).range(["white","#2e3131"]);layers.kcBGsWithData.setStyle(function(a){return{color:b(a.properties["VIOLENT CRIME RATE"])}})},d[9]=function(){},c[10]=function(){layers.kcBGsWithData.setStyle({fillOpacity:1,opacity:1}),layers.kcBGsWithData.eachLayer(function(a){"290950034002"==a.feature.properties.GEOID&&a.setStyle({color:"#eeee00"})})},d[10]=function(){},c[11]=function(){layers.kcBGsWithData.setStyle({fillOpacity:0,opacity:0}),map.removeLayer(layers.kcMaxBusLines)},d[11]=function(){},c[12]=function(){layers.kcMaxBusLines.addTo(map),layers.kcShotSpotterApproxCoverageArea.bringToFront(),map.removeLayer(layers.troostAve)},d[12]=function(){},c[13]=function(){map.removeLayer(layers.kcMaxBusLines),layers.troostAve.addTo(map),layers.kcShotSpotterApproxCoverageArea.bringToFront()},d[13]=function(){},c[14]=function(){layers.kcBGsWithData.setStyle({fillOpacity:0,opacity:0})},d[14]=function(){},c[15]=function(){let a=d3.scaleLinear().domain([0,1]).range(["white","#1f3a93"]);layers.kcBGsWithData.setStyle({fillOpacity:1,opacity:1}),layers.kcBGsWithData.setStyle(function(b){return{color:a(b.properties.PCT_BLACK)}})},d[15]=function(){},c[16]=function(){layers.kcBGsWithData.setStyle({fillOpacity:1,opacity:1}),map.removeLayer(layers.kcUrbanRenewalAreas);let a=d3.scaleLinear().domain([0,1]).range(["white","#1f3a93"]);layers.kcBGsWithData.setStyle({fillOpacity:1,opacity:1}),layers.kcBGsWithData.setStyle(function(b){return{color:a(b.properties.PCT_BLACK)}})},d[16]=function(){},c[17]=function(){layers.kcBGsWithData.setStyle({fillOpacity:0,opacity:0}),layers.kcUrbanRenewalAreas.addTo(map),map.removeLayer(layers.kccc39),map.removeLayer(layers.kcccFocus)},d[17]=function(){},c[18]=function(){layers.kccc39.addTo(map),layers.kcccFocus.addTo(map)},d[18]=function(){},c[19]=function(){layers.kcBGsWithData.setStyle({fillOpacity:0,opacity:0}),layers.kccc39.addTo(map),layers.kcccFocus.addTo(map),layers.troostAve.addTo(map),layers.kcUrbanRenewalAreas.addTo(map)},d[19]=function(){},c[20]=function(){map.removeLayer(layers.kccc39),map.removeLayer(layers.kcccFocus),map.removeLayer(layers.troostAve),map.removeLayer(layers.kcUrbanRenewalAreas);let a=d3.scaleLinear().domain([-1.5,0,1.5]).range(["#1f3a93","white","#cf000f"]);layers.kcBGsWithData.setStyle({fillOpacity:1,opacity:1}),layers.kcBGsWithData.setStyle(function(b){return{color:b.properties.PCT_CHANGE_RENT?a(b.properties.PCT_CHANGE_RENT):"rgba(0, 0, 0, 0)"}})},d[20]=function(){},c[21]=function(){let a=d3.scaleLinear().domain([0,25]).range(["white","#cf000f"]);layers.kcBGsWithData.setStyle({fillOpacity:1,opacity:1}),layers.kcBGsWithData.setStyle(function(b){return{color:a(b.properties["eviction.rate"])}})},d[21]=function(){}};// return chart function
return e.activate=function(d){b=d;var e=0>b-a?-1:1,f=d3.range(a+e,b+e,e);f.forEach(function(a){c[a]()}),a=b},e.update=function(a,b){d[a](b)},e};// Load all files, then display
Promise.all([d3.json("data/public/kansas-city-bgs.geojson"),d3.json("data/public/kansas-city-boundaries-mo.geojson"),d3.json("data/public/kansas-city-max-buslines.geojson"),d3.json("data/public/kansas-city-shotspotter-activations-grouped.geojson"),d3.json("data/public/kansas-city-shotspotter-approx-coverage-area.geojson"),d3.json("data/public/kansas-city-urban-renewal-areas.geojson"),d3.json("data/public/troost-ave.geojson"),d3.json("data/public/kccc-39.geojson")]).then(function(a){a={kcBGsWithData:a[0],kcBoundaries:a[1],kcMaxBusLines:a[2],kcShotspotterActivations:a[3],kcShotSpotterApproxCoverageArea:a[4],kcUrbanRenewalAreas:a[5],troostAve:a[6],kccc39:a[7]};// Cast to real
let b=0;return a.kcBGsWithData.features=a.kcBGsWithData.features.map(function(a){return["2013 MEDIAN GROSS RENT","2013 PCT BLACK","2013 PCT HISPANIC","2013 PCT WHITE","2019 MEDIAN GROSS RENT","PCT_BLACK","PCT_HISPANIC","PCT_WHITE","TOTAL"].forEach(function(c){a.properties[c]=parseFloat(a.properties[c]),b=Math.max(b,a.properties["VIOLENT CRIME RATE"])}),a}),a.maxViolentCrimeRate=b,a}).then(function(a){var b=scrollVis();d3.select("#vis").datum(a).call(b);var c=scroller().container(d3.select("#scrolling-vis"));c(d3.selectAll(".step")),c.on("active",function(a){d3.selectAll(".step").classed("active",function(b,c){return c===a}).style("opacity",function(b,c){return c===a?1:.1}),b.activate(a)}),c.on("progress",function(a,c){b.update(a,c)})}).catch(function(a){// handle error here
console.log(a)});