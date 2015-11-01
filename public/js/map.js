var map;
var markers = new L.FeatureGroup();

$( document ).ready(function() {
	initializeMap();
	addAllProjects();
});

function addAllProjects(){
	removeAllMarkers();
	$.get( 
		"/api/project", 
		function( data ) {
			console.log(data);
			data.forEach(function(project){
				console.log(project);
				if (project.latitutde){ 
					var marker = L.marker([project.latitutde, project.longitude]);
					marker.bindPopup(project.name, {
		            	showOnMouseOver: true
		        	});
					markers.addLayer(marker);
				}
			})
		}
	);
	map.addLayer(markers);
}

function initializeMap(){
	map = L.map('map').setView([19.3925, -99.1412], 12);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'ralexrdz.nnh64i75',
	    accessToken: 'pk.eyJ1IjoicmFsZXhyZHoiLCJhIjoiY2lmdHB2aGo2MTZ4MnQ1bHkzeDJyaDMzNyJ9.UHhEm9gA1_uwAztXjb7iTQ'
	}).addTo(map);
}

function removeAllMarkers(){
	map.removeLayer(markers);
	markers = new L.FeatureGroup();
}

function filterCategory(e){
	removeAllMarkers();
	$.get( 
		"/api/project/category/"+e.id, 
		function( data ) {
			console.log(data);
			data.forEach(function(project){
				console.log(project);
				if (project.latitutde){ 
					var marker = L.marker([project.latitutde, project.longitude]);
					marker.bindPopup('<a href="'+project.facebook+'">'+project.name+'</a>', {
		            	showOnMouseOver: true
		        	});
					markers.addLayer(marker);
				}
			})
		}
	);
	map.addLayer(markers);
}

function filterByKeyWords(){
	removeAllMarkers();
	var keywords = $("#keyWords").val();
	console.log("keywords: " + keywords);
	$.get(
		"/api/project/keywords/"+keywords, 
		function(data){
			console.log(data);
			data.forEach(function(project){
				if (project.latitutde){ 
					console.log("sí entro");
					var marker = L.marker([project.latitutde, project.longitude]);
					marker.bindPopup('<a href="'+project.facebook+'">'+project.name+'</a>', {
		            	showOnMouseOver: true
		        	});
					markers.addLayer(marker);
				}
			})
		}
	);
	map.addLayer(markers);
}

