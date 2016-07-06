var map
var marker

$(document).ready(function () {
  console.log('hola')
  initializeMap()
// addAllProjects()
})

function onRegisterBtnClicked () {
  var registerForm = form2js('registerForm', '.')
  $.post(
    '/api/project',
    registerForm,
    function (data) {
      console.log(data)
    }
  )
  var formData = new FormData()
  formData.append('file', $('#pictureFileInput')[0].files[0])
  console.log(formData)
  $.ajax({
    url: '/uploadPicture',
    data: formData,
    processData: false,
    contentType: false,
    type: 'POST',
    success: function (data) {
      console.log(data)
    }
  })
}

function addOffer () {
  $('#offers').append('<input class="offerAdded" name="offers.[]" value="' + $('#newOfferInput').val() + '"/>')
}

function addNeed () {
  $('#needs').append('<input class="needAdded" name="needs.[]" value="' + $('#newNeedInput').val() + '"/>')
}

function initializeMap () {
  map = L.map('map').setView([19.34, -99.15], 12)
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'ralexrdz.nnh64i75',
    accessToken: 'pk.eyJ1IjoicmFsZXhyZHoiLCJhIjoiY2lxNDU4NzM4MDFuM2Zubm5oNWNhY21yMCJ9.8nWz6Mkz7-xHvKOY3GqwDQ'
  }).addTo(map)
  map.on('click', function (e) {
    if (marker)
      map.removeLayer(marker)
    marker = L.marker([e.latlng.lat, e.latlng.lng])
    map.addLayer(marker)
    $('#hdnInputLat').val(e.latlng.lat)
    $('#hdnInputLng').val(e.latlng.lng)
  })
}
