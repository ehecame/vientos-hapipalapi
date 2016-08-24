var map
var markers = new L.FeatureGroup()
var source
var projectCellTemplate

$(document).ready(function () {
  source = $('#project-cell-template').html()
  projectCellTemplate = Handlebars.compile(source)
  setCloseMapSideBarFunc()
  $('#btnCloseToMe').click(centerMapMyLocation)
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
  setTopBarBtnsFunc()
  setCategoryBarFunc()
})

function addAllProjects () {
  removeAllMarkers()
  $.get(
    '/api/projects',
    function (data) {
      console.log(data.length)
      addMarkers(data)
      addProjectCells(data)
    }
  )
  map.addLayer(markers)
  $('')
}

function addProjectCells(projectList){
  $('#projectsGrid').html('')
  $.each(projectList, function (i, p) {
    $('#projectsGrid').append(projectCellTemplate(p))
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
      addProjectCells(data)
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
    },
    {
      type: 'ontransition',
      label: 'En Transición',
      color: '#d45bc9'
    },
  ]
  return projectTypes[Math.floor((Math.random() * 7))]
}

function addMarkers (projectList) {
  var marker
  var myIcon
  console.log(projectList)
  $.each(projectList, function (i, m) {
    m.categoryIcon = getCategoryIcon(m.categories_ids[0])
    if (!m.projectType) {
      m.projectType = getRandomProjectType()
    } else {
      console.log('ya tiene projectType')
    }
    if (!m.categories) {
      console.log('No tengo categorías =S : ' + m.name)
    }
    var icon = m.categories ? m.categories[0].icon : m.categoryIcon
    if (m.latitude && m.longitude) {
      myIcon = L.divIcon({
        html: '<div class="myIcon fa-stack fa-2x">' +
          '<i class="fa fa-map-marker fa-stack-2x" style="color:' + m.projectType.color + ';"></i>' +
          '<i class="fa fa-circle fa-stack-1x" style="margin-top: -.2em; color:' + m.projectType.color + ';"></i> ' +
          '<i class="fa ' + icon + ' fa-stack-1x" style="margin-top: -.3em; font-size: .7em; color: white; " ></i>' +
          '<div class="markerPopUp">' +
          '<div class="markerPopUpName">' + m.name + '</div>' +
          '</div>' +
          '</div> ',
        popupAnchor: new L.Point(-5, -40)
      })
      marker = L.marker([m.latitude, m.longitude], {icon: myIcon, riseOnHover: true})
      marker.on('mouseover', function (e) {
        $(this._icon).find('.markerPopUp').show()
        $(this._icon).find('.markerPopUpName').show()
      })
      marker.on('mouseout', function (e) {
        $(this._icon).find('.markerPopUp').hide()
      })
      marker.on('click', function (e) {
        map.setView([m.latitude, m.longitude + .006], 16, {animate: true})
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

function showMapSideBar (m) {
  console.log(m)
  if (m.logo) {
    $('#mapSideBar').find('#projectLogo').css('background-image', 'url("/img/' + m.logo + '")')
    $('#mapSideBar').find('#projectLogo').show()
  }
  else
    $('#mapSideBar').find('#projectLogo').hide()
  $('#mapSideBar').find('#projectName').html(m.name)
  $('#mapSideBar').find('#projectDescription').html(m.description)
  $('#mapSideBar').find('#projectProfileLink').attr('href', '/project/' + m._id)
  $('#mapSideBar').find('#projectType').html(m.projectType.label)
  $('#mapSideBar').find('#projectType').css('background-color', m.projectType.color)
  if (m.facebook) {
    $('#mapSideBar').find('#projectFacebook').attr('href', m.facebook)
    $('#mapSideBar').find('#projectFacebook').show()
  } else {
    $('#mapSideBar').find('#projectFacebook').hide()
  }
  if (m.twitter) {
    console.log('tiene twitter')
    $('#mapSideBar').find('#projectTwitter').attr('href', m.twitter)
    $('#mapSideBar').find('#projectTwitter').show()
  } else {
    $('#mapSideBar').find('#projectTwitter').hide()
  }
  if (m.webpage) {
    console.log('tiene web')
    $('#mapSideBar').find('#projectWebSite').attr('href', m.webpage)
    $('#mapSideBar').find('#projectWebSite').attr('tittle', m.webpage)
    $('#mapSideBar').find('#projectWebSite').show()
  } else {
    $('#mapSideBar').find('#projectWebSite').hide()
  }
  if (m.phone) {
    console.log('tiene phone')
    $('#mapSideBar').find('#projectPhone span').html(m.phone)
    $('#mapSideBar').find('#projectPhone').show()
  } else {
    $('#mapSideBar').find('#projectPhone').hide()
  }
  if (m.mobile) {
    console.log('tiene mobile')
    $('#mapSideBar').find('#projectMobile span').html(m.mobile)
    $('#mapSideBar').find('#projectMobile').show()
  } else {
    $('#mapSideBar').find('#projectMobile').hide()
  }
  if (m.email) {
    console.log('tiene email')
    $('#mapSideBar').find('#projectEmail span').html(m.email)
    $('#mapSideBar').find('#projectEmail').show()
  } else {
    $('#mapSideBar').find('#projectEmail').hide()
  }
  if (m.address) {
    console.log('tiene address')
    $('#mapSideBar').find('#projectAddress span').html(m.address)
    $('#mapSideBar').find('#projectAddress').show()
  }
  else
    $('#mapSideBar').find('#projectAddress').hide()
  if (m.offers) {
    $('#mapSideBar').find('#projectOffers').html(createOffersMarkup(m.offers))
  }
  if (m.needs) {
    $('#mapSideBar').find('#projectNeeds').html(createNeedsMarkup(m.needs))
  }
  if (!m.offers && !m.needs) {
    $('#offersNeedsRow').hide()
  } else {
    $('#offersNeedsRow').show()
  }
  if (m.schedule) {
    console.log('tiene schedule')
    $('#mapSideBar').find('#projectSchedule').html(createScheduleMarkup(m.schedule))
    $('#mapSideBar').find('#scheduleSec').show()
  } else {
    $('#mapSideBar').find('#scheduleSec').hide()
  }
  $('#btnCloseToMe').tooltip('hide')
  $('#mapSideBar').show()
  $('#mapSideBar').animate({width: '45%'})
}

function createOffersMarkup (offers) {
  var html = ''
  $.each(offers, function (i, offer) {
    html += '<div class="need"><i class="fa fa-circle"></i>' + offer.title + '</div>'
  })
  return html
}

function createNeedsMarkup (needs) {
  var html = ''
  $.each(needs, function (i, need) {
    html += '<div class="need"><i class="fa fa-circle"></i>' + need.title + '</div>'
  })
  return html
}

function createScheduleMarkup (schedule) {
  var html = ''
  console.log(schedule)
  $.each(schedule, function (i, day) {
    console.log(day)
    html += '<div class="day">' + day.days + ' : ' + day.hours + '</div>'
  })
  return html
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
      if ($(e.target).parent('.myIcon').length == 0 && !$(e.target).is('.myIcon')) {
        hideMapSideBar()
      }
    }
  })
}

function setTopBarBtnsFunc () {
  $('#categoriesBtn').click(categoriesBtnClicked)
  $('#typesBtn').click(typesBtnClicked)
  $('#waysOfCollaborationBtn').click(waysOfCollaborationBtnClicked)
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

function categoriesBtnClicked () {
  $('#categoriesContainer').removeClass('hidden')
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
  $('#typesContainer').removeClass('hidden')
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
  $('#waysOfCollaborationContainer').removeClass('hidden')
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
