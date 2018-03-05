var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 13, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var shortest = 0;

function init() {
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
	
}

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			
			SendRequest();	
			renderMap();

		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}



function renderMap() {
	me = new google.maps.LatLng(myLat, myLng);

	// Update map and go there...
	map.panTo(me);
	
	
	marker = new google.maps.Marker({
		position: me,
		title: " Username: qrsXYLSLFw, Distance to closest passenger: " + shortest / 1609.344,
		icon: "baby.jpg"
	});
	marker.setMap(map);
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}


function print_map(lat, long, name) {

var obj = new google.maps.LatLng(lat, long);
var me = new google.maps.LatLng(myLat, myLng);

var distance = google.maps.geometry.spherical.computeDistanceBetween(obj, me)


if (shortest == 0 || shortest > distance)
{
	shortest = distance;
	renderMap();
}


// Update map and go there...

// Create a marker
	var marker = new google.maps.Marker({
	position: obj,
	title: " Username: " + name + " Distance from me: " + distance / 1609.344,
	icon: "person.png"
	});
	marker.setMap(map);

	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
	infowindow.setContent(marker.title);
	infowindow.open(map, marker);
});

}

function SendRequest()
{

	// A global variable `request`
	var request;

	// Step 1: Make an instance of the XMLHttpRequest object to make an HTTP GET request
	request = new XMLHttpRequest();

	// Step 2: Initialize HTTP request
	//request.domain = "herokuapp.com";
	request.open("POST", "https://jordan-marsh.herokuapp.com/rides", true);

	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	// Step 3: Set up handler / callback function to deal with HTTP response
	request.onreadystatechange = function() {
  	// Step 5: If the request is completed and HTTP status is OK, get the response data
  	if (request.readyState == 4 && request.status == 200) {
  		
     	var result = request.responseText;
     	var obj = JSON.parse(result);
     	elem = document.getElementById("req");
     	elem.innerHTML = result;
     
     	//console.log(obj);
     	//console.log(obj.passengers.length);

     	for (i = 0; i < obj.passengers.length ; i++)
     	{
     		var lat = obj.passengers[i].lat;
     		var long = obj.passengers[i].lng;
     		var name = obj.passengers[i].username;
     		print_map(lat,long,name);

     	}
     
     	
     
  		}
	}

	// Step 4: Send ("fire off") the request
	//request.send();

	request.send("username=qrsXYLSLFw&lat=" + myLat + "&lng=" + myLng);

}