// See post: http://asmaloney.com/2015/06/code/clustering-markers-on-leaflet-maps
//https://bost.ocks.org/mike/leaflet/
//http://bl.ocks.org/d3noob/9267535
//https://github.com/jalbertbowden/leafletjs-kit/tree/master/dvf
//https://www.patrick-wied.at/static/heatmapjs/examples.html
//https://bl.ocks.org/cjrd/6863459



//file upload 
var raw_data;
var reader = new FileReader();
var upload_box = d3.select("#upload_file");

upload_box.on("change",function() {	 reader.readAsText(this.files[0]);});


reader.onload = function(event) {
	var raw_data = event.target.result;
	
	var collection = tsvJSON(raw_data)
	init(collection)
}

//http://techslides.com/convert-csv-to-json-in-javascript
//http://mounirmesselmeni.github.io/2012/11/20/reading-csv-file-with-javascript-and-html5-file-api/

//Chnage raw data to javascript object
function tsvJSON(tsv){
 
  var lines=tsv.split("\n");
 
  var result = [];
 
  var headers=lines[0].split("\t");
 
  for(var i=1; i<lines.length -1; i++){
 
	  var obj = {};
	  var currentline=lines[i].split("\t");
 
	  for(var j=0; j<headers.length ; j++){
		  obj[headers[j]] = currentline[j];
	  }
 
	  result.push(obj);
 
  }
 	// JSON.stringify(result); //JSON
	
  	return result; //JavaScript object

} //end of tsvJSON


//Demo examples using dropdown 
$('.dropdown-menu a').on('click', function(){
    
    if(this.id == "example1"){
     //   fileName = ; 
		d3.tsv("data/circle_data1.tsv", function(collection) {
		/* Add a LatLng object to each item in the dataset */
		
			init(collection);
		});
		
    }
    if(this.id == "example2"){
        fileName = "data/circle_data1.tsv";   
    }
    if(this.id == "example3"){
        fileName = "data/circle_data2.tsv";   
    }
    
})

function init(collection){
    
    d3.select("#load-data").style("visibility","hidden").style("display", "none");
    d3.select("#show-viz").style("visibility","visible")
    
	//http://ivansanchez.gitlab.io/Leaflet.GridLayer.FadeOut/demo.html
	//Adding tiles to map
    var tile1 = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ',noWrap : true } );
    
		tile2 = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS'
					}),
		
		
		tile3 = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
				attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
				}),

		tile4 = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			});
		
	L_PREFER_CANVAS = true;
	
    var map = L.map( 'map', {
        layers:[tile1],
        center: [.1, .1],
        minZoom: 3,
        zoom:1,
        maxZoom: 15
        //worldCopyJump: true,
        //inertia: false
    });


	// layer control
		var layerControlItems = {
		  "<div class='layer-titles'> OSM Landscape </div>": tile1,
		   "<div class='layer-titles'> Terrain </div>": tile2,
		  "<div class='layer-titles'> ESRI World Canvas </div>":tile3,
		  "<div class='layer-titles'> Stamen Toner Lite </div>":tile4
		};
		
		L.control.layers(layerControlItems).addTo(map);

	
	
    /* Initialize the SVG layer */
	//L.svg().addTo(map); // witth new leaflet version
   //map._initPathRoot()    
    
	/* We simply pick up the SVG from the map object */
	//var svg = d3.select("#map").select("svg"),
	//g = svg.append("g");

		
	collection.forEach(function(d){
			d.coordinates = JSON.parse(d.coordinates);
		})
	
	collection.forEach(function(d) {
		d.LatLng = new L.LatLng(d.coordinates[0],
								d.coordinates[1])
	})
	/*
	var feature = g.selectAll("circle")
		.data(collection)
		.enter().append("circle")
		.style("stroke", "black")
		.style("stroke-width", "2px")
		.style("opacity", .6) 
		.style("fill", "red")
		.attr("r", 10);  
	
       feature.append("text")
	   //.attr("dx", function(d){return -20})
	   .text(function(d){return "CIRCLE"})
       
	map.on("viewreset", update);
	update();

	function update() {
		feature.attr("transform", 
		function(d) { 
			return "translate("+ 
				map.latLngToLayerPoint(d.LatLng).x +","+ 
				map.latLngToLayerPoint(d.LatLng).y +")";
			}
		)
	} // end of update 
       
	
	
	function doImage(err, canvas) {
            var img = document.createElement('img');
            var dimensions = map.getSize();
            imgRatio = dimensions.x / dimensions.y;
            img.width = 900;
            img.height = 700 / imgRatio;
            img.src = canvas.toDataURL();
			console.log("hi");
            document.getElementById('images').innerHTML = '';
            document.getElementById('images').appendChild(img);
        }
	
	 d3.select('#saveMap').on('click', function() {
            leafletImage(map, doImage);
        });
	
*/
   addressPoints = collection.map(function (d) { return [d.coordinates[0], d.coordinates[1], "500"] ; });


	var heat = L.heatLayer(addressPoints, {radius: 15}).addTo(map);
} // end of init

