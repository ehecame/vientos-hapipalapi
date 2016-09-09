
var configMap
var marker

$(document).ready(function () {
  initializeConfigMap()
})

function initializeConfigMap(){
	var lat = $('#projectLat0').val() ? $('#projectLat0').val() : '19.43211483346452'
  var lon = $('#projectLon0').val() ? $('#projectLon0').val() : '-99.12551879882812'
  console.log('lat:' + lat)
  console.log('lon:' + lon)
	configMap = L.map('mapConf', {zoomControl: false}).setView([lat, lon], 15)
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'ralexrdz.nnh64i75',
    accessToken: 'pk.eyJ1IjoicmFsZXhyZHoiLCJhIjoiY2lmdHB2aGo2MTZ4MnQ1bHkzeDJyaDMzNyJ9.UHhEm9gA1_uwAztXjb7iTQ'
  }).addTo(configMap)
  if($('#projectLat0').val()){
    marker = L.marker([lat, lon]).addTo(configMap)
    configMap.addLayer(marker)
  }
  configMap.on('click', function (e) {
    if (marker)
      configMap.removeLayer(marker)
    marker = L.marker([e.latlng.lat, e.latlng.lng])
    configMap.addLayer(marker)
    $('#hdnInputLat').val(e.latlng.lat)
    $('#hdnInputLng').val(e.latlng.lng)
    $('#editProfileBtn').removeClass('disabled')
  })
}

function createProjectCode(){
	var projID = $(window.location.href.split('/')).last()[0]
	$.ajax({
    url: '/api/project/addcode',
    type: 'POST',
    success: function (res) {console.log(res)},
    data: {id: projID}
	})
	return false
}