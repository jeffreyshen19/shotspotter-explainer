const margin={top:50,right:15,bottom:70,left:55};let map,histogram,histogramData,width=document.getElementById("vis").offsetWidth-margin.left-margin.right-20,height=document.getElementById("vis").offsetHeight-margin.top-margin.bottom,currentHistogram=-1,layers={};const ANIMATION_LENGTH=150,ANIMATION_STEP=10,colors={white:"#f9f9f9",blue:"#1f3a93",black:"#2e3131",green:"#1e824c",red:"#cf000f",yellow:"#eeee00"};var scrollVis=function(){function a(a){d3.select(a).style("display","inline-block").style("opacity",1)}function b(a){d3.select(a).style("display","none").style("opacity",0)}function c(a){let b=0,c=!layers.kcShotSpotterActivations.isVisible,d=layers.kcShotSpotterActivations.isScaled!=a;if(!d&&!c)return;layers.kcShotSpotterActivations.isVisible=!0,layers.kcShotSpotterActivations.isScaled=a;let e=setInterval(function(){c&&layers.kcShotSpotterActivations.setStyle({fillOpacity:.5*(b/ANIMATION_LENGTH),opacity:b/ANIMATION_LENGTH}),layers.kcShotSpotterActivations.eachLayer(function(c){let e;e=a?2*Math.max(Math.sqrt(b/ANIMATION_LENGTH*c.feature.properties.Activations),1):2*Math.max(Math.sqrt((1-b/ANIMATION_LENGTH)*c.feature.properties.Activations),1),d&&c.setRadius(e)}),b>=ANIMATION_LENGTH&&clearInterval(e),b+=ANIMATION_STEP},ANIMATION_STEP)}function d(){let a=layers.kcShotSpotterActivations.isVisible;if(!a)return;layers.kcShotSpotterActivations.isVisible=!1;let b=0,c=setInterval(function(){layers.kcShotSpotterActivations.setStyle({fillOpacity:.5-.5*(b/ANIMATION_LENGTH),opacity:1-b/ANIMATION_LENGTH}),b>=ANIMATION_LENGTH&&clearInterval(c),b+=ANIMATION_STEP},ANIMATION_STEP)}function e(a,b,c,d,e,f){// Update map
let g=d3.scaleLinear().domain(a).range(b);layers.kcBGsWithData.setStyle(function(a){return{color:a.properties[c]?g(a.properties[c]):"rgba(0, 0, 0, 0)"}}),layers.kcBGsWithData.setStyle({fillOpacity:1}),d3.select("#chloropleth-legend").style("opacity","1"),d3.select("#color-scale").html(""),d3.select("#chloropleth-title").text(d);const h=a[0],i=a[a.length-1],j=(i-h)/(5-(f?1:0));for(let k,l=0;l<5;l++)k=d3.select("#color-scale").append("div"),k.append("div").attr("class","legend-item").style("background",g(h+l*j)),k.append("span").text(e(h+l*j))}function f(){layers.kcBGsWithData.setStyle({fillOpacity:0}),d3.select("#chloropleth-legend").style("opacity","0")}function g(a){a.setStyle({fillOpacity:1,opacity:1})}function h(a){a.setStyle({fillOpacity:0,opacity:0})}function i(){d3.select("#chloropleth-legend").style("opacity","1"),d3.select("#color-scale").html(""),d3.select("#chloropleth-title").text("ShotSpotter activations"),[1,24,48].forEach(function(a,b){let c=2*Math.sqrt(a),d=2*Math.sqrt(48)-c,e=d3.select("#color-scale").append("div").attr("class","level").style("margin-bottom",(2==b?0:c/2)+"px").style("margin-left",d+"px").append("div").attr("class","level-left");e.append("div").attr("class","legend-item level-item").style("border-radius","100%").style("border","1px solid rgba(46, 48, 48, 0.5)").style("background-color","rgba(207, 0, 15)").style("width",2*c+"px").style("height",2*c+"px").style("margin-right",d+5+"px"),e.append("span").text(a)})}/**
   * activate -
   *
   * @param index - index of the activated section
   */ // Which visualization we currently are on
var j=-1,k=0,l=[],m=[],n=function(a){a.each(function(a){o(a),p(a)})},o=function(a){map=L.map("map",{zoomControl:!1,scrollWheelZoom:!1,doubleClickZoom:!1,dragging:!1});var b=L.canvas();// Initialize geoJSON layers
for(let c in a.layers){let d={};// Styling options
// Render based off point or polygon
"kcBoundaries"==c?d={color:colors.black,weight:2,opacity:.7,fillOpacity:0}:"kcBGsWithData"===c?d={weight:0,transition:"0.3s all"}:"kcMaxBusLines"===c||"troostAve"===c?d={color:colors.blue,weight:3}:"kccc39"===c?d={color:colors.black,weight:2}:"kcShotSpotterApproxCoverageArea"===c?d={color:colors.red,weight:2,opacity:.7,fillOpacity:.05}:"kcShotSpotterActivations"===c?d={radius:2,fillColor:colors.red,color:colors.black,weight:.5,opacity:1,fillOpacity:.5,renderer:b}:"kcUrbanRenewalAreas"===c||"kcccFocus"===c?d={radius:4,fillColor:colors.black,weight:0,opacity:1,fillOpacity:1}:void 0,"kcBoundaries"==c||"kcBGsWithData"===c||"kcMaxBusLines"===c||"troostAve"===c||"kccc39"===c||"kcShotSpotterApproxCoverageArea"===c?layers[c]=L.geoJSON(a.layers[c],{style:d}):"kcUrbanRenewalAreas"===c||"kcShotSpotterActivations"===c?layers[c]=L.geoJSON(a.layers[c],{pointToLayer:function(a,b){return L.circleMarker(b,d)}}):"kcccFocus"===c?layers[c]=L.geoJSON(a.layers[c],{pointToLayer:function(a,b){return L.circleMarker(b,d).bindTooltip(a.properties.label,{permanent:!0,direction:"31st & Troost"==a.properties.label?"left":"right",className:"tooltip focus-tooltip"})}}):void 0,layers[c].addTo(map),"kcShotSpotterApproxCoverageArea"==c||"kcBoundaries"==c||layers[c].setStyle({opacity:0,fillOpacity:0})}// Fit
map.fitBounds(layers.kcBoundaries.getBounds()),layers.kcShotSpotterActivations.isScaled=!1,layers.kcShotSpotterActivations.isVisible=!1,f(),layers.kccc39.bindTooltip("39th Street Corridor",{permanent:!0,direction:"left",offset:L.point([-50,0]),className:"tooltip tooltip-39"}),layers.troostAve.bindTooltip("Troost Ave",{permanent:!0,direction:"left",className:"troost-tooltip tooltip"}),L.tileLayer("https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=lTdR1t9ghN06990FNZFA",{attribution:"<a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>"}).addTo(map),d3.select("#loading").style("display","none"),d3.select("#map").style("visibility","visible"),d3.select("#legend").style("visibility","visible")},p=function(j){l[0]=function(){map.flyToBounds(layers.kcBoundaries.getBounds())},m[0]=function(){},l[1]=function(){map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(),{padding:[5,5]}),b("#legend-3"),d()},m[1]=function(){},l[2]=function(){a("#legend-3"),d3.select("#chloropleth-legend").style("opacity","0"),c(!1)},m[2]=function(){},l[3]=function(){i(),c(!0)},m[3]=function(){},l[4]=function(){},m[4]=function(){},l[5]=function(){},m[5]=function(){},l[6]=function(){},m[6]=function(){},l[7]=function(){f(),i(),map.flyToBounds(layers.kcShotSpotterApproxCoverageArea.getBounds(),{padding:[5,5]}),c(!0)},m[7]=function(){},l[8]=function(){b("#legend-3"),map.flyToBounds(layers.kcBoundaries.getBounds()),e([0,j.maxViolentCrimeRate],[colors.white,colors.black],"VIOLENT CRIME RATE","Violent Crime per 1k People",a=>Math.round(1e3*a)),d()},m[8]=function(){},l[9]=function(){map.flyToBounds([[39.152465,-94.609998],[39.018955,-94.509757]]),e([0,j.maxViolentCrimeRate],[colors.white,colors.black],"VIOLENT CRIME RATE","Violent Crime per 1k People",a=>Math.round(1e3*a))},m[9]=function(){},l[10]=function(){e([0,j.maxViolentCrimeRate],[colors.white,colors.black],"VIOLENT CRIME RATE","Violent Crime per 1k People",a=>Math.round(1e3*a)),layers.kcBGsWithData.eachLayer(function(a){"290950034002"==a.feature.properties.GEOID&&a.setStyle({color:colors.yellow})})},m[10]=function(){},l[11]=function(){f(),b("#legend-4"),h(layers.kcMaxBusLines)},m[11]=function(){},l[12]=function(){a("#legend-4"),g(layers.kcMaxBusLines),layers.kcShotSpotterApproxCoverageArea.bringToFront(),h(layers.troostAve),d3.select(".troost-tooltip").style("visibility","hidden")},m[12]=function(){},l[13]=function(){h(layers.kcMaxBusLines),b("#legend-4"),g(layers.troostAve),d3.select(".troost-tooltip").style("visibility","visible"),layers.kcShotSpotterApproxCoverageArea.bringToFront()},m[13]=function(){},l[14]=function(){f()},m[14]=function(){},l[15]=function(){e([0,1],[colors.white,colors.blue],"PCT_BLACK","Percent Black",a=>Math.round(100*a)+"%")},m[15]=function(){},l[16]=function(){h(layers.kcUrbanRenewalAreas),e([0,1],[colors.white,colors.blue],"PCT_BLACK","Percent Black",a=>Math.round(100*a)+"%"),b("#legend-5")},m[16]=function(){},l[17]=function(){f(),a("#legend-5"),d3.selectAll(".focus-tooltip").style("visibility","hidden"),d3.select(".tooltip-39").style("visibility","hidden"),g(layers.kcUrbanRenewalAreas),h(layers.kcccFocus),h(layers.kccc39)},m[17]=function(){},l[18]=function(){d3.selectAll(".focus-tooltip").style("visibility","visible"),d3.select(".tooltip-39").style("visibility","visible"),g(layers.kccc39),g(layers.kcccFocus)},m[18]=function(){},l[19]=function(){f(),g(layers.kcccFocus),g(layers.kcUrbanRenewalAreas),g(layers.troostAve),g(layers.kccc39),d3.selectAll(".focus-tooltip").style("visibility","visible"),d3.select(".tooltip-39").style("visibility","visible"),d3.select(".troost-tooltip").style("visibility","visible"),a("#legend-5")},m[19]=function(){},l[20]=function(){b("#legend-5"),h(layers.kcccFocus),h(layers.kcUrbanRenewalAreas),h(layers.troostAve),h(layers.kccc39),d3.selectAll(".focus-tooltip").style("visibility","hidden"),d3.select(".tooltip-39").style("visibility","hidden"),d3.select(".troost-tooltip").style("visibility","hidden"),e([-1.5,0,1.5],[colors.blue,colors.white,colors.red],"PCT_CHANGE_RENT","Pct. Change Median Gross Rent",a=>Math.round(100*a)+"%",!0)},m[20]=function(){},l[21]=function(){e([0,25],[colors.white,colors.red],"eviction.rate","Eviction Rate",a=>Math.round(a)+"%")},m[21]=function(){},l[22]=function(){e([-.5,0,.5],[colors.red,colors.white,colors.blue],"PCT_CHANGE_BLACK","Pct. Change Black Population",a=>Math.round(100*a)+"%",!0)},m[22]=function(){},l[23]=function(){e([-.5,0,.5],[colors.red,colors.white,colors.blue],"PCT_CHANGE_WHITE","Pct. Change White Population",a=>Math.round(100*a)+"%",!0)},m[23]=function(){}};// return chart function
return n.activate=function(a){k=a;var b=0>k-j?-1:1,c=d3.range(j+b,k+b,b);for(const b of c)l[b]();j=k},n.update=function(a,b){m[a](b)},n};// Load all files, then display
Promise.all([d3.json("data/public/kansas-city-bgs.geojson"),d3.json("data/public/kansas-city-boundaries-mo.geojson"),d3.json("data/public/kansas-city-max-buslines.geojson"),d3.json("data/public/kansas-city-shotspotter-activations-grouped.geojson"),d3.json("data/public/kansas-city-shotspotter-approx-coverage-area.geojson"),d3.json("data/public/kansas-city-urban-renewal-areas.geojson"),d3.json("data/public/troost-ave.geojson"),d3.json("data/public/kccc-39.geojson"),d3.json("data/public/kccc-areas.geojson")]).then(function(a){// Process data
let b={kcBGsWithData:a[0],kcBoundaries:a[1],kcMaxBusLines:a[2],kcShotSpotterActivations:a[3],kcShotSpotterApproxCoverageArea:a[4],kcUrbanRenewalAreas:a[5],troostAve:a[6],kccc39:a[7],kcccFocus:a[8]},c=0;// Cast to real
return b.kcBGsWithData.features=b.kcBGsWithData.features.map(function(a){return["2013 MEDIAN GROSS RENT","2013 PCT BLACK","2013 PCT HISPANIC","2013 PCT WHITE","2019 MEDIAN GROSS RENT","PCT_BLACK","PCT_HISPANIC","PCT_WHITE","TOTAL"].forEach(function(b){a.properties[b]=parseFloat(a.properties[b]),c=Math.max(c,a.properties["VIOLENT CRIME RATE"])}),a}),{maxViolentCrimeRate:c,layers:b}}).then(function(a){// if ('scrollRestoration' in history) {
//   history.scrollRestoration = 'manual';
// }
// window.scrollTo(0,0);
var b=scrollVis();d3.select("#vis").datum(a).call(b);var c=scroller().container(d3.select("#scrolling-vis"));// TODO: remove
c(d3.selectAll(".step")),c.on("active",function(a){d3.selectAll(".step").classed("active",function(b,c){return c===a}).style("opacity",function(b,c){return c===a?1:.1}),b.activate(a)}),c.on("progress",function(a,c){b.update(a,c)})}).catch(function(a){// handle error here
console.log(a)});