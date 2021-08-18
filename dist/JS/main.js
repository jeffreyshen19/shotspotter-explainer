const margin={top:50,right:15,bottom:70,left:55};let map,histogram,histogramData,width=document.getElementById("vis").offsetWidth-margin.left-margin.right-20,height=document.getElementById("vis").offsetHeight-margin.top-margin.bottom,currentHistogram=-1,layers={};const ANIMATION_LENGTH=300,ANIMATION_STEP=10,colors={white:"#f9f9f9",blue:"#1f3a93",black:"#2e3131",green:"#1e824c",red:"#cf000f",yellow:"#eeee00"};var scrollVis=function(){function a(a,b,d,e,f,g){// Update map
let h=d3.scaleLinear().domain(a).range(b);layers.kcBGsWithData.setStyle(function(a){return{color:a.properties[d]?h(a.properties[d]):"rgba(0, 0, 0, 0)"}}),c(layers.kcBGsWithData),d3.select("#chloropleth-legend").style("opacity","1"),d3.select("#color-scale").html(""),d3.select("#chloropleth-title").text(e);const j=a[0],k=a[a.length-1],l=(k-j)/(5-(g?1:0));for(let c,k=0;k<5;k++)c=d3.select("#color-scale").append("div"),c.append("div").attr("class","legend-item").style("background",h(j+k*l)),c.append("span").text(f(j+k*l))}function b(){d(layers.kcBGsWithData),d3.select("#chloropleth-legend").style("opacity","0")}function c(a){if(a.visible)return;let b=0,c=setInterval(function(){a.setStyle({fillOpacity:b/ANIMATION_LENGTH*a.maxFill,opacity:1*(b/ANIMATION_LENGTH)}),b>=ANIMATION_LENGTH&&clearInterval(c),b+=ANIMATION_STEP},ANIMATION_STEP);a.visible=!0}function d(a){if(!a.visible)return;let b=0,c=setInterval(function(){a.setStyle({fillOpacity:a.maxFill-b/ANIMATION_LENGTH*a.maxFill,opacity:1-1*(b/ANIMATION_LENGTH)}),b>=ANIMATION_LENGTH&&clearInterval(c),b+=ANIMATION_STEP},ANIMATION_STEP);a.visible=!1}function e(){d3.select("#chloropleth-legend").style("opacity","1"),d3.select("#color-scale").html(""),d3.select("#chloropleth-title").text("ShotSpotter activations"),[1,24,48].forEach(function(a,b){let c=2*Math.sqrt(a),d=2*Math.sqrt(48)-c,e=d3.select("#color-scale").append("div").attr("class","level").style("margin-bottom",(2==b?0:c/2)+"px").style("margin-left",d+"px").append("div").attr("class","level-left");e.append("div").attr("class","legend-item level-item").style("border-radius","100%").style("border","1px solid rgba(46, 48, 48, 0.5)").style("background-color","rgba(207, 0, 15)").style("width",2*c+"px").style("height",2*c+"px").style("margin-right",d+5+"px"),e.append("span").text(a)})}/**
   * activate -
   *
   * @param index - index of the activated section
   */ // Which visualization we currently are on
var f=-1,g=0,h=[],i=[],j=function(a){a.each(function(a){k(a),l(a)})},k=function(a){// Initialize geoJSON layers
for(let b in map=L.map("map",{zoomControl:!1,scrollWheelZoom:!1,doubleClickZoom:!1,dragging:!1,preferCanvas:!0}),a.layers){let c={};// Styling options
"kcBoundaries"==b?c={color:colors.black,weight:2,opacity:.7,fillOpacity:0}:"kcBGsWithData"===b?c={weight:0,transition:"0.3s all"}:"kcMaxBusLines"===b||"troostAve"===b?c={color:colors.blue,weight:3}:"kccc39"===b?c={color:colors.black,weight:2}:"kcShotSpotterApproxCoverageArea"===b?c={color:colors.red,weight:2,opacity:.7,fillOpacity:0}:"kcShotSpotterActivations"===b?c={radius:2,fillColor:colors.red,color:colors.black,weight:.5,opacity:1,fillOpacity:.5}:"kcUrbanRenewalAreas"===b||"kcccFocus"===b?c={radius:4,fillColor:colors.black,weight:0}:void 0,"kcBoundaries"==b||"kcBGsWithData"===b||"kcMaxBusLines"===b||"troostAve"===b||"kccc39"===b||"kcShotSpotterApproxCoverageArea"===b?layers[b]=L.geoJSON(a.layers[b],{style:c}):"kcUrbanRenewalAreas"===b||"kcShotSpotterActivations"===b?layers[b]=L.geoJSON(a.layers[b],{pointToLayer:function(a,b){return L.circleMarker(b,c)}}):"kcccFocus"===b?layers[b]=L.geoJSON(a.layers[b],{pointToLayer:function(a,b){return L.circleMarker(b,c).bindTooltip(a.properties.label,{permanent:!0,direction:"31st & Troost"==a.properties.label?"left":"right"})}}):void 0,layers[b].addTo(map)}// Fit
map.fitBounds(layers.kcBoundaries.getBounds()),layers.kcShotSpotterActivations.setStyle({opacity:0,fillOpacity:0}),layers.kcccFocus.setStyle({opacity:0,fillOpacity:0}),layers.kcUrbanRenewalAreas.setStyle({opacity:0,fillOpacity:0}),layers.troostAve.setStyle({opacity:0,fillOpacity:0}),layers.kcMaxBusLines.setStyle({opacity:0,fillOpacity:0}),layers.kccc39.setStyle({opacity:0,fillOpacity:0}),layers.kcBGsWithData.setStyle({opacity:0,fillOpacity:0}),layers.kcShotSpotterActivations.visible=!1,layers.kcShotSpotterActivations.maxFill=.5,layers.kcccFocus.visible=!1,layers.kcccFocus.maxFill=1,layers.kcUrbanRenewalAreas.visible=!1,layers.kcUrbanRenewalAreas.maxFill=1,layers.troostAve.visible=!1,layers.troostAve.maxFill=1,layers.kcMaxBusLines.visible=!1,layers.kcMaxBusLines.maxFill=1,layers.kccc39.visible=!1,layers.kccc39.maxFill=1,layers.kcBGsWithData.visible=!1,layers.kcBGsWithData.maxFill=1,b(),layers.kccc39.bindTooltip("39th Street Corridor",{permanent:!0,direction:"left",offset:L.point([-50,0])}),layers.troostAve.bindTooltip("Troost Ave",{permanent:!0,direction:"left"}),L.tileLayer("https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=lTdR1t9ghN06990FNZFA",{attribution:"<a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>"}).addTo(map),d3.select("#loading").style("display","none"),d3.select("#map").style("visibility","visible"),d3.select("#legend").style("visibility","visible")},l=function(f){h[0]=function(){map.flyToBounds(layers.kcBoundaries.getBounds())},i[0]=function(){},h[1]=function(){map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(),{padding:[5,5]}),d(layers.kcShotSpotterActivations),d3.select("#legend-3").style("display","none")},i[1]=function(){},h[2]=function(){layers.kcShotSpotterActivations.eachLayer(function(a){a.setRadius(2)}),c(layers.kcShotSpotterActivations),d3.select("#legend-3").style("display","inline-block"),d3.select("#chloropleth-legend").style("opacity","0")},i[2]=function(){},h[3]=function(){layers.kcShotSpotterActivations.eachLayer(function(a){a.setRadius(2*Math.sqrt(a.feature.properties.Activations))}),e()},i[3]=function(){},h[4]=function(){},i[4]=function(){},h[5]=function(){},i[5]=function(){},h[6]=function(){},i[6]=function(){},h[7]=function(){b(),e(),map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(),{padding:[5,5]}),c(layers.kcShotSpotterActivations)},i[7]=function(){},h[8]=function(){d3.select("#legend-3").style("display","none"),map.flyToBounds(layers.kcBoundaries.getBounds()),d(layers.kcShotSpotterActivations),a([0,f.maxViolentCrimeRate],[colors.white,colors.black],"VIOLENT CRIME RATE","Violent Crime per 1k People",a=>Math.round(1e3*a))},i[8]=function(){},h[9]=function(){map.flyToBounds([[39.152465,-94.609998],[39.018955,-94.509757]]),a([0,f.maxViolentCrimeRate],[colors.white,colors.black],"VIOLENT CRIME RATE","Violent Crime per 1k People",a=>Math.round(1e3*a))},i[9]=function(){},h[10]=function(){a([0,f.maxViolentCrimeRate],[colors.white,colors.black],"VIOLENT CRIME RATE","Violent Crime per 1k People",a=>Math.round(1e3*a)),layers.kcBGsWithData.eachLayer(function(a){"290950034002"==a.feature.properties.GEOID&&a.setStyle({color:colors.yellow})})},i[10]=function(){},h[11]=function(){b(),d3.select("#legend-4").style("display","none"),d(layers.kcMaxBusLines)},i[11]=function(){},h[12]=function(){d3.select("#legend-4").style("display","inline-block"),c(layers.kcMaxBusLines),layers.kcShotSpotterApproxCoverageArea.bringToFront(),d(layers.troostAve)},i[12]=function(){},h[13]=function(){d(layers.kcMaxBusLines),d3.select("#legend-4").style("display","none"),c(layers.troostAve),layers.kcShotSpotterApproxCoverageArea.bringToFront()},i[13]=function(){},h[14]=function(){b()},i[14]=function(){},h[15]=function(){a([0,1],[colors.white,colors.blue],"PCT_BLACK","Percent Black",a=>Math.round(100*a)+"%")},i[15]=function(){},h[16]=function(){d(layers.kcUrbanRenewalAreas),a([0,1],[colors.white,colors.blue],"PCT_BLACK","Percent Black",a=>Math.round(100*a)+"%"),d3.select("#legend-5").style("display","none")},i[16]=function(){},h[17]=function(){b(),d3.select("#legend-5").style("display","inline-block"),c(layers.kcUrbanRenewalAreas),d(layers.kcccFocus),map.removeLayer(layers.kcccFocus)},i[17]=function(){},h[18]=function(){c(layers.kccc39),c(layers.kcccFocus)},i[18]=function(){},h[19]=function(){b(),c(layers.kcccFocus),c(layers.kcUrbanRenewalAreas),c(layers.troostAve),c(layers.kccc39),d3.select("#legend-5").style("display","inline-block")},i[19]=function(){},h[20]=function(){d3.select("#legend-5").style("display","none"),d(layers.kcccFocus),d(layers.kcUrbanRenewalAreas),d(layers.troostAve),d(layers.kccc39),a([-1.5,0,1.5],[colors.blue,colors.white,colors.red],"PCT_CHANGE_RENT","Percent Change in Median Gross Rent",a=>Math.round(100*a)+"%",!0)},i[20]=function(){},h[21]=function(){a([0,25],[colors.white,colors.red],"eviction.rate","Eviction Rate",a=>Math.round(a)+"%")},i[21]=function(){},h[22]=function(){a([-.5,0,.5],[colors.red,colors.white,colors.blue],"PCT_CHANGE_BLACK","Percent Change Black Population",a=>Math.round(100*a)+"%",!0)},i[22]=function(){},h[23]=function(){},i[23]=function(){},h[24]=function(){},i[24]=function(){}};// return chart function
return j.activate=function(a){g=a;var b=0>g-f?-1:1,c=d3.range(f+b,g+b,b);c.forEach(function(a){h[a]()}),f=g},j.update=function(a,b){i[a](b)},j};// Load all files, then display
Promise.all([d3.json("data/public/kansas-city-bgs.geojson"),d3.json("data/public/kansas-city-boundaries-mo.geojson"),d3.json("data/public/kansas-city-max-buslines.geojson"),d3.json("data/public/kansas-city-shotspotter-activations-grouped.geojson"),d3.json("data/public/kansas-city-shotspotter-approx-coverage-area.geojson"),d3.json("data/public/kansas-city-urban-renewal-areas.geojson"),d3.json("data/public/troost-ave.geojson"),d3.json("data/public/kccc-39.geojson"),d3.json("data/public/kccc-areas.geojson")]).then(function(a){// Process data
let b={kcBGsWithData:a[0],kcBoundaries:a[1],kcMaxBusLines:a[2],kcShotSpotterActivations:a[3],kcShotSpotterApproxCoverageArea:a[4],kcUrbanRenewalAreas:a[5],troostAve:a[6],kccc39:a[7],kcccFocus:a[8]},c=0;// Cast to real
return b.kcBGsWithData.features=b.kcBGsWithData.features.map(function(a){return["2013 MEDIAN GROSS RENT","2013 PCT BLACK","2013 PCT HISPANIC","2013 PCT WHITE","2019 MEDIAN GROSS RENT","PCT_BLACK","PCT_HISPANIC","PCT_WHITE","TOTAL"].forEach(function(b){a.properties[b]=parseFloat(a.properties[b]),c=Math.max(c,a.properties["VIOLENT CRIME RATE"])}),a}),{maxViolentCrimeRate:c,layers:b}}).then(function(a){var b=scrollVis();d3.select("#vis").datum(a).call(b);var c=scroller().container(d3.select("#scrolling-vis"));// TODO: remove
c(d3.selectAll(".step")),c.on("active",function(a){d3.selectAll(".step").classed("active",function(b,c){return c===a}).style("opacity",function(b,c){return c===a?1:.1}),b.activate(a)}),c.on("progress",function(a,c){b.update(a,c)})}).catch(function(a){// handle error here
console.log(a)});