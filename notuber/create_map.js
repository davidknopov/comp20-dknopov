
var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);

var myOptions = {
	zoom: 13, 
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var shortest = 0;
var type;

function init() {
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
	
}

function getMyLocation() {
	if (navigator.geolocation) { 
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;		
			SendRequest();	
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}



function renderMap() {
	me = new google.maps.LatLng(myLat, myLng);

	map.panTo(me);


	if ( type == "passenger")
	{
		title = " Username: qrsXYLSLFw, Miles to Closest Passenger " + shortest / 1609.344;
	}
	else if ( type == "vehicle")
	{
		title = " Username: qrsXYLSLFw, Miles to Closest Driver " + shortest / 1609.344;
	}

	
	
	marker = new google.maps.Marker({
		position: me,
		title: title,
		icon: "baby.jpg"
	});
	marker.setMap(map);
		
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}


function print_map(lat, long, name,type) {

	var obj = new google.maps.LatLng(lat, long);
	var me = new google.maps.LatLng(myLat, myLng);

	var distance = google.maps.geometry.spherical.computeDistanceBetween(obj, me)

	if (shortest == 0 || shortest > distance)
	{
		shortest = distance;
		renderMap();
	}

	

	if (type == "vehicle")
	{
		icon = "car.png";
	}
	if (type == "passenger")
	{
		icon = "person.png";
	}


	var marker = new google.maps.Marker({
		position: obj,
		title: " Username: " + name + " Distance from me: " + distance / 1609.344,
		icon: icon
		});

	marker.setMap(map);


	google.maps.event.addListener(marker, 'click', function() {
	infowindow.setContent(marker.title);
	infowindow.open(map, marker);
});

}

function SendRequest()
{
	var request;

	request = new XMLHttpRequest();


	request.open("POST", "https://pure-basin-27130.herokuapp.com/rides", true);

	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function() {

  	if (request.readyState == 4 && request.status == 200) {
  		
     	var result = request.responseText;
     	console.log(responseText);
     	var obj = JSON.parse(result);
     	if ( obj.passengers != undefined)
     	{
     		type = "passenger";
     		for (i = 0; i < obj.passengers.length ; i++)
     		{
     			var lat = obj.passengers[i].lat;
     			var long = obj.passengers[i].lng;
     			var name = obj.passengers[i].username;
     			print_map(lat,long,name,type);
     		}
     	}
     	if ( obj.vehicles != undefined)
     	{
     		type = "vehicle";
     		for (i = 0; i < obj.vehicles.length ; i++)
     		{
     			var lat = obj.vehicles[i].lat;
     			var long = obj.vehicles[i].lng;
     			var name = obj.vehicles[i].username;
     			print_map(lat,long,name,type);
     		}
     	}
  	}
	}
	request.send("username=qrsXYLSLFw&lat=" + myLat + "&lng=" + myLng);

}