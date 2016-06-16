var map
var markers = new L.FeatureGroup()
var source
var projectNoLocTemplate

$(document).ready(function () {
  source = $('#projectNoLocation-template').html()
  projectNoLocTemplate = Handlebars.compile(source)
  setCloseMapSideBarFunc()
  $('#btnCloseToMe').click(centerMapMyLocation)
  initializeMap()
  addAllProjects()
})

function addAllProjects () {
  removeAllMarkers()
  $.get(
    '/api/projects',
    function (data) {
      addMarkers(data)
    // $.each(data, function (i, project) {
    //   console.log(project)
    //   if (project.latitude) {
    //     var marker = L.marker([project.latitude, project.longitude])
    //     marker.bindPopup('<a href="/project/profile/' + project._id + '">' + project.name + '</a>', {
    //       showOnMouseOver: true
    //     })
    //     markers.addLayer(marker)
    //   } else {
    //     var categories = []
    //     $.each(project.categories_ids, function (i, val) {
    //       categories.push($('#' + val).text())
    //     })
    //     project.categories = categories.join('<br>')
    //     $('#projectsNoLocation').html('')
    //     $('#projectsNoLocation').append(projectNoLocTemplate(project))
    //   }
    // })
    }
  )
  map.addLayer(markers)
}

function initializeMap () {
  map = L.map('map', {zoomControl: false}).setView([19.34, -99.15], 12)
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'ralexrdz.nnh64i75',
    accessToken: 'pk.eyJ1IjoicmFsZXhyZHoiLCJhIjoiY2lmdHB2aGo2MTZ4MnQ1bHkzeDJyaDMzNyJ9.UHhEm9gA1_uwAztXjb7iTQ'
  }).addTo(map)
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map)
  L.Icon.Default.imagePath = '/img'
// L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa'
// var redMarker = L.AwesomeMarkers.icon({
//   icon: 'coffee',
//   markerColor: 'red'
// })
}

function removeAllMarkers () {
  map.removeLayer(markers)
  markers = new L.FeatureGroup()
}

function filterCategory (e) {
  removeAllMarkers()
  $.get(
    '/api/project/category/' + e.id,
    function (data) {
      addMarkers(data)
    // data.forEach(function (project) {
    //   console.log(project)
    //   if (project.latitude) {
    //     var marker = L.marker([project.latitude, project.longitude])
    //     marker.bindPopup('<a href="/project/profile/' + project._id + '">' + project.name + '</a>', {
    //       showOnMouseOver: true
    //     })
    //     markers.addLayer(marker)
    //   } else {
    //     var categories = []
    //     $.each(project.categories_ids, function (i, val) {
    //       categories.push($('#' + val).text())
    //     })
    //     project.categories = categories.join('<br>')
    //     $('#projectsNoLocation').html('')
    //     $('#projectsNoLocation').append(projectNoLocTemplate(project))
    //   }
    // })
    }
  )
  map.addLayer(markers)
}

function filterByKeyWords () {
  removeAllMarkers()
  var keywords = $('#keyWordsInput').val()
  console.log('keywords: ' + keywords)
  $.get(
    '/api/project/keywords/' + keywords,
    function (data) {
      addMarkers(data)
    // console.log(data)
    // data.forEach(function (project) {
    //   if (project.latitude) {
    //     var marker = L.marker([project.latitude, project.longitude])
    //     marker.bindPopup('<a href="/project/profile/' + project._id + '">' + project.name + '</a>', {
    //       showOnMouseOver: true
    //     })
    //     markers.addLayer(marker)
    //   }
    // })
    }
  )
  map.addLayer(markers)
}

function centerMapMyLocation (e) {
  navigator.geolocation.getCurrentPosition(setMapView)
}

function setMapView (location) {
  map.setView([location.coords.latitude, location.coords.longitude], 15)
}

function getRandomProjectType () {
  var projectTypes = [
    {
      type: 'Cooperative',
      color: '#800000'
    },
    {
      type: 'Collective',
      color: '#008B8B'
    },
    {
      type: 'NGO',
      color: '#556B2F'
    },
    {
      type: 'Ethical Business',
      color: '#B8860B'
    },
    {
      type: 'Citizen Initiative',
      color: '#C63D1E'
    },
    {
      type: 'Startup',
      color: '#58376C'
    }
  ]
  return projectTypes[Math.floor((Math.random() * 6))]
}

function addMarkers (markerList) {
  var marker
  var myIcon
  console.log(markerList)
  $.each(markerList, function (i, m) {
    m.categoryIcon = getCategoryIcon(m.categories_ids[0])
    m.projectType = getRandomProjectType()
    if (m.latitude && m.longitude) {
      myIcon = L.divIcon({
        html: '<div class="myIcon fa-stack fa-2x">' +
          '<i class="fa fa-map-marker fa-stack-2x" style="color:' + m.projectType.color + ';"></i>' +
          '<i class="fa fa-circle fa-stack-1x" style="margin-top: -.2em; color:' + m.projectType.color + ';"></i> ' +
          '<i class="fa ' + m.categoryIcon + ' fa-stack-1x" style="margin-top: -.3em; font-size: .7em; color: white; " ></i>' +
          '<div class="markerPopUp">' +
          '<div class="markerPopUpTriangle" ></div>' +
          '<div class="markerPopUpName" ><strong>' + m.name + '</strong></div>' +
          '<div class="markerPopUpDescription">' + m.description + '</div>' +
          '</div>' +
          '</div> ',
        popupAnchor: new L.Point(-5, -40)
      })
      marker = L.marker([m.latitude, m.longitude], {icon: myIcon})
      marker.on('mouseover', function (e) {
        $(this._icon).find('.markerPopUp').show()
        $(this._icon).find('.markerPopUpName').show()
        $(this._icon).find('.markerPopUpDescription').show()
      })
      marker.on('mouseout', function (e) {
        popUpBehaviorByZoom()
      })
      marker.on('click', function (e) {
        showMapSideBar(m)
      })
      markers.addLayer(marker)
    }
  })
  map.addLayer(markers)
}

function getCategoryIcon (id) {
  if (id == '56281547b82163c71dea5fa0') return 'fa-globe'
  if (id == '56281497b82163c71dea5f9e') return 'fa-shopping-basket'
  if (id == '5628158bb82163c71dea5fa2') return 'fa-pagelines'
  if (id == '5628145fb82163c71dea5f9d') return 'fa-paint-brush'
  if (id == '5660de8ca17bb1a413dd1add') return 'fa-transgender'
  if (id == '55663309a660da482b648a33') return 'fa-medkit'
  if (id == '556644179cfb86a021e5a150') return 'fa-book'
  if (id == '559e910a46343c3bccee7fbe') return 'fa-users'
  if (id == '559e90f046343c3bccee7fbd') return 'fa-cutlery'
  if (id == '562814bbb82163c71dea5f9f') return 'fa-bullhorn'
  if (id == '562815b2b82163c71dea5fa3') return 'fa-cogs'
  if (id == '562815bfb82163c71dea5fa4') return 'fa-bicycle'
  else return 'fa-puzzle-piece'
}

function popUpBehaviorByZoom () {
  var zoom = map.getZoom()
  if (zoom < 14) {
    $('.markerPopUp').hide()
  } else {
    $('.markerPopUp').show()
    $('.markerPopUpName').show()
    if (zoom < 16) {
      $('.markerPopUpDescription').hide()
    } else {
      $('.markerPopUpDescription').show()
    }
  }
}

function showMapSideBar (m) {
  console.log(m)
  $('#mapSideBar').find('#projectName').html(m.name)
  $('#mapSideBar').find('#projectDescription').html(m.description)
  $('#mapSideBar').find('#projectType').html(m.projectType.type)
  $('#mapSideBar').find('#projectType').css('background-color', m.projectType.color)
  $('#mapSideBar').find('#projectFacebook').attr('href', m.facebook)
  $('#mapSideBar').find('#projectTwitter').attr('href', m.twitter)
  $('#mapSideBar').find('#projectPhone').html(m.phone)
  $('#mapSideBar').find('#projectMobile').html(m.mobile)
  $('#mapSideBar').find('#projectEmail').html(m.email)
  $('#mapSideBar').find('#projectAddress').html(m.address)
  // $('#mapSideBar').find('#projectOffers').html(createOffersMarkup(m.offers))
  // $('#mapSideBar').find('#projectNeeds').html(createNeedsMarkup(m.needs))

  $('#mapSideBar').show()
  $('#mapSideBar').animate({width: '45%'})
}

function hideMapSideBar () {
  $('#mapSideBar').animate({width: '0px'}, function () {
    $('#mapSideBar').hide()
  })
}

function setCloseMapSideBarFunc () {
  $(document).mouseup(function (e) {
    var container = $('#mapSideBar:visible')
    if (container.is(':visible') && // has to be visible
      !container.is(e.target) // if the target of the click isn't the container...
      && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
      hideMapSideBar()
    }
  })
}
