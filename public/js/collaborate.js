var map
var markers 
var source
var projectCellTemplate

$(document).ready(function () {
  source = $('#project-cell-template').html()
  projectCellTemplate = Handlebars.compile(source)
  $('#btnCloseToMe').click(centerMapMyLocation)
  markers = new L.FeatureGroup()
  initializeMap()
  if (getUrlParameter('cat')) {
    filterCategory(getUrlParameter('cat'))
    $('#' + getUrlParameter('cat')).addClass('selected')
  } else {
    addAllProjects()
  }
  $('#btnCloseToMe').tooltip({placement: 'bottom'})
  $('#btnCloseToMe').tooltip('show')
  $('.nano').nanoScroller()
  var elements = document.getElementsByTagName('*')
  for (var id = 0; id < elements.length; ++id) { elements[id].oncontextmenu = null; }
  $('#backToProjectsGrid').click(hideSideBar)
  setTopBarBtnsFunc()
  setCategoryBarFunc()
  setTypeBarFunc()
  setCollaborationWayBarFunc()
})

function addAllProjects () {
  removeAllMarkers()
  $.get(
    '/api/projects',
    function (data) {
      addMarkers(data)
      addProjectCells(data)
      $('.nano').nanoScroller()
    }
  )
  map.addLayer(markers)
}

function addProjectCells(projectList){
  var project;
  $('#projectsGrid').html('')
  $.each(projectList, function (i, p) {
    project = projectCellTemplate(p)
    $('#projectsGrid').append(project)
    $('#projectsGrid #projectCell_'+p._id).on('click', function (e) {
      e.preventDefault()
      map.setView([p.latitude, p.longitude], 16, {animate: true})
      showSideBar(p)
    })
  })
  $('.card').flip({trigger: 'hover'})
  $('.projectCell').removeClass('hidden')

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
}

function removeAllMarkers () {
  map.removeLayer(markers)
  markers = new L.FeatureGroup()
}

function filterCategory (id) {
  removeAllMarkers()
  $.get(
    '/api/project/category/' + id,
    function (data) {
      addMarkers(data)
      addProjectCells(data)
      $('.projectCard').click(showSideBar)
      $('.nano').nanoScroller()
    }
  )
  map.addLayer(markers)
}

function filterType (id) {
  removeAllMarkers()
  $.get(
    '/api/project/type/' + id,
    function (data) {
      addMarkers(data)
      addProjectCells(data)
      $('.projectCard').click(showSideBar)
      $('.nano').nanoScroller()
    }
  )
  map.addLayer(markers)
}

function filterCollaborationWay(id){
  removeAllMarkers()
  $.get(
    '/api/project/collaborationway/' + id,
    function (data) {
      addMarkers(data)
      addProjectCells(data)
      $('.projectCard').click(showSideBar)
      $('.nano').nanoScroller()
    }
  )
  map.addLayer(markers)
}

function filterByKeyWords () {
  removeAllMarkers()
  var keywords = $('#keyWordsInput').val()
  $.get(
    '/api/project/keywords/' + keywords,
    function (data) {
      addMarkers(data)
      addProjectCells(data)
      $('.projectCard').click(showSideBar)
      $('.nano').nanoScroller()
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
      type: 'cooperative',
      label: 'Cooperativa',
      color: '#800000'
    },
    {
      type: 'collective',
      label: 'Colectivo',
      color: '#008B8B'
    },
    {
      type: 'ngo',
      label: 'ONG',
      color: '#556B2F'
    },
    {
      type: 'ethicalbusiness',
      label: 'Negocio Ético',
      color: '#B8860B'
    },
    {
      type: 'neighborsorg',
      label: 'Organización vecinal',
      color: '#C63D1E'
    },
    {
      type: 'startup',
      label: 'Startup',
      color: '#58376C'
    }
  ]
  return projectTypes[Math.floor((Math.random() * 6))]
}

function addMarkers (projectList) {
  var marker
  var myIcon
  $.each(projectList, function (i, m) {
    m.categoryIcon = getCategoryIcon(m.categories[0].catId)
    if (!m.projectType) {
      m.projectType = getRandomProjectType()
    } else {
    }
    if (!m.categories) {
    }
    var icon = m.categories ? m.categories[0].icon : m.categoryIcon
    if (m.locations && m.locations.length>0) {
      myIcon = L.divIcon({
        html: '<div class="myIcon ' + (m.pilot ? '' : 'opa' ) +' fa-stack fa-2x">' +
          '<i class="fa fa-map-marker fa-stack-2x" style="color:' + m.projectType.color + ';"></i>' +
          '<i class="fa fa-circle fa-stack-1x" style="margin-top: -.2em; color:' + m.projectType.color + ';"></i> ' +
          '<i class="fa ' + icon + ' fa-stack-1x" style="margin-top: -.3em; font-size: .7em; color: white; " ></i>' +
          '<div class="markerPopUp">' +
          '<div class="markerPopUpName">' + m.name + '</div>' +
          '</div>' +
          '</div> ',
        popupAnchor: new L.Point(-5, -40)
      })
      marker = L.marker([m.locations[0].lat, m.locations[0].lon], {icon: myIcon, riseOnHover: true})
      marker.on('mouseover', function (e) {
        $(this._icon).find('.markerPopUp').show()
        $(this._icon).find('.markerPopUpName').show()
      })
      marker.on('mouseout', function (e) {
        $(this._icon).find('.markerPopUp').hide()
      })
      marker.on('click', function (e) {
        map.setView([m.locations[0].lat, m.locations[0].lon], 16, {animate: true})
        showSideBar(m)
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
  if (id == '5660de8ca17bb1a413dd1add') return 'fa-transgender-alt'
  if (id == '55663309a660da482b648a33') return 'fa-medkit'
  if (id == '556644179cfb86a021e5a150') return 'fa-book'
  if (id == '559e910a46343c3bccee7fbe') return 'fa-users'
  if (id == '559e90f046343c3bccee7fbd') return 'fa-cutlery'
  if (id == '562814bbb82163c71dea5f9f') return 'fa-bullhorn'
  if (id == '562815b2b82163c71dea5fa3') return 'fa-cogs'
  if (id == '562815bfb82163c71dea5fa4') return 'fa-bicycle'
  if (id == '566327d38bf85d71b6c069c1') return 'fa-home'
  if (id == '566353d1c3671ef030500668') return 'fa-scissors'
  else return 'fa-puzzle-piece'
}

function showSideBar (m) {

  if(!m.pilot){
    $('#projectProfileLink').addClass('hidden')
  } else{
    $('#projectProfileLink').removeClass('hidden')
  }
  if (m.logo) {
    $('#projectDetails').find('#projectLogo').css('background-image', 'url("/img/' + m.logo + '")')
    $('#projectDetails').find('#projectLogo').show()
  }
  else
    $('#projectDetails').find('#projectLogo').hide()
  $('#projectDetails').find('#projectName').html(m.name)
  $('#projectDetails').find('#projectDescription').html(m.description)
  $('#projectDetails').find('#projectProfileLink').attr('href', '/project/' + m._id)
  $('#projectDetails').find('#projectType').html(m.projectType.label)
  $('#projectDetails').find('#projectType').css('background-color', m.projectType.color)
  if (m.facebook) {
    $('#projectDetails').find('#projectFacebook').attr('href', m.facebook)
    $('#projectDetails').find('#projectFacebook').show()
  } else {
    $('#projectDetails').find('#projectFacebook').hide()
  }
  if (m.twitter) {
    $('#projectDetails').find('#projectTwitter').attr('href', m.twitter)
    $('#projectDetails').find('#projectTwitter').show()
  } else {
    $('#projectDetails').find('#projectTwitter').hide()
  }
  if (m.webpage) {
    $('#projectDetails').find('#projectWebSite').attr('href', m.webpage)
    $('#projectDetails').find('#projectWebSite').attr('tittle', m.webpage)
    $('#projectDetails').find('#projectWebSite').show()
  } else {
    $('#projectDetails').find('#projectWebSite').hide()
  }
  if (m.phone) {
    $('#projectDetails').find('#projectPhone span').html(m.phone)
    $('#projectDetails').find('#projectPhone').show()
  } else {
    $('#projectDetails').find('#projectPhone').hide()
  }
  if (m.mobile) {
    $('#projectDetails').find('#projectMobile span').html(m.mobile)
    $('#projectDetails').find('#projectMobile').show()
  } else {
    $('#projectDetails').find('#projectMobile').hide()
  }
  if (m.email) {
    $('#projectDetails').find('#projectEmail span').html(m.email)
    $('#projectDetails').find('#projectEmail').show()
  } else {
    $('#projectDetails').find('#projectEmail').hide()
  }
  if (m.address) {
    $('#projectDetails').find('#projectAddress span').html(m.address)
    $('#projectDetails').find('#projectAddress').show()
  }
  else
    $('#projectDetails').find('#projectAddress').hide()
  if (m.offers) {
    $('#projectDetails').find('#projectOffers').html(createOffersMarkup(m.offers))
  }
  if (m.needs) {
    $('#projectDetails').find('#projectNeeds').html(createNeedsMarkup(m.needs))
  }
  if (!m.offers && !m.needs) {
    $('#offersNeedsRow').hide()
  } else {
    $('#offersNeedsRow').show()
  }
  if (m.schedule) {
    $('#projectDetails').find('#projectSchedule').html(createScheduleMarkup(m.schedule))
    $('#projectDetails').find('#scheduleSec').show()
  } else {
    $('#projectDetails').find('#scheduleSec').hide()
  }
  $('#projectsGrid').addClass('hidden')
  $('#projectDetails').removeClass('hidden')
  $('#backToProjectsGrid').removeClass("hidden")
  setTimeout(function(){$('.nano').nanoScroller()},500)
}

function createOffersMarkup (offers) {
  var html = ''
  $.each(offers, function (i, offer) {
    html += '<div class="offer"><img src="svg/'+offer.type+'" class="icon"><span class="colLabel">' + offer.title + '</span></div>'
  })
  return html
}

function createNeedsMarkup (needs) {
  var html = ''
  $.each(needs, function (i, need) {
    html += '<div class="need"><img src="svg/'+need.type+'" class="icon"><span class="colLabel">' + need.title + '</span></div>'
  })
  return html
}

function createScheduleMarkup (schedule) {
  var html = ''
  $.each(schedule, function (i, day) {
    html += '<div class="day">' + day.days + ' : ' + day.hours + '</div>'
  })
  return html
}

function hideSideBar () {
  $('#projectDetails').addClass("hidden")
  $('#backToProjectsGrid').addClass("hidden")
  $('#projectsGrid').removeClass('hidden')
  $('.nano').nanoScroller()
}

function setTopBarBtnsFunc () {
  $('#categoriesBtn').click(categoriesBtnClicked)
  $('#typesBtn').click(typesBtnClicked)
  $('#waysOfCollaborationBtn').click(waysOfCollaborationBtnClicked)
  $('#keyWordsInput').keyup(function (event) {
    if (event.keyCode == 13) {
      $('#loginBtn').click()
    }
  })
// $('#projectsBtn').click(projectsBtnClicked)
// $('#businessBtn').click(businessBtnClicked)
// $('#evetnsBtn').click(evetnsBtnClicked)
}

function setCategoryBarFunc () {
  $('.categoryBtn').click(categoryBtnClicked)
}

function categoryBtnClicked () {
  filterCategory(this.id)
  $('.categoryBtn').removeClass('selected')
  $(this).addClass('selected')
}

function setCollaborationWayBarFunc(){
  $('.collaborationWay').click(collaborationBtnClicked)
}

function collaborationBtnClicked(){
  filterCollaborationWay(this.id)
  $('.collaborationWay').removeClass('selected')
  $(this).addClass('selected')
}

function setTypeBarFunc (){
  $('.typeBtn').click(typeBtnClicked)
}

function typeBtnClicked (){
  filterType(this.id)
  $('.typeBtn').removeClass('selected')
  $(this).addClass('selected')
}

function categoriesBtnClicked () {
  $('#categoriesContainer').toggleClass('hidden')
  $('#categoriesBtn').removeClass('btn-default')
  $('#categoriesBtn').addClass('btn-success')
  $('#typesContainer').addClass('hidden')
  $('#typesBtn').addClass('btn-default')
  $('#typesBtn').removeClass('btn-success')
  $('#waysOfCollaborationContainer').addClass('hidden')
  $('#waysOfCollaborationBtn').addClass('btn-default')
  $('#waysOfCollaborationBtn').removeClass('btn-success')
}

function typesBtnClicked () {
  $('#typesContainer').toggleClass('hidden')
  $('#typesBtn').removeClass('btn-default')
  $('#typesBtn').addClass('btn-success')
  $('#categoriesContainer').addClass('hidden')
  $('#categoriesBtn').addClass('btn-default')
  $('#categoriesBtn').removeClass('btn-success')
  $('#waysOfCollaborationContainer').addClass('hidden')
  $('#waysOfCollaborationBtn').addClass('btn-default')
  $('#waysOfCollaborationBtn').removeClass('btn-success')
}

function waysOfCollaborationBtnClicked () {
  $('#waysOfCollaborationContainer').toggleClass('hidden')
  $('#waysOfCollaborationBtn').removeClass('btn-default')
  $('#waysOfCollaborationBtn').addClass('btn-success')
  $('#categoriesContainer').addClass('hidden')
  $('#categoriesBtn').addClass('btn-default')
  $('#categoriesBtn').removeClass('btn-success')
  $('#typesContainer').addClass('hidden')
  $('#typesBtn').addClass('btn-default')
  $('#typesBtn').removeClass('btn-success')
}

function getUrlParameter (sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=')

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1]
    }
  }
}
