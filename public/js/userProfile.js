var map;
var marker;
var circle; 

$(document).ready(function () {
  initiateSectionBtnsFunc()
  initiateCollaborationFunc()
  initiateOffersAndNeedsFunc()
  initiateProjectFunc()
  initiateInterestsSkillsFunc()
  initializeConfigurationFunc()
  autosize($('textarea'))
})

function initiateSectionBtnsFunc () {
  $('#sectionTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
    if(typeof map !== 'undefined') map.invalidateSize()
  })
}

// function sectionBtnClicked () {
//   var id = $(this).attr('id')
//   $('.userProfileSec').addClass('hidden')
//   $('.sectionBtn').removeClass('selected')
//   if (id == 'homeBtn') {
//     $('#homeBtn').addClass('selected')
//     $('#secHome').removeClass('hidden')
//   }
//   if (id == 'projectsBtn') {
//     $('#projectsBtn').addClass('selected')
//     $('#secProjects').removeClass('hidden')
//   }
//   if (id == 'offersAndNeedsBtn') {
//     $('#offersAndNeedsBtn').addClass('selected')
//     $('#secOffersAndNeeds').removeClass('hidden')
//   }
//   if (id == 'interestsBtn') {
//     $('#interestsBtn').addClass('selected')
//     $('#secInterests').removeClass('hidden')
//   }
//   if (id == 'configurationBtn') {
//     $('#configurationBtn').addClass('selected')
//     $('#secConfiguration').removeClass('hidden')
//   }
// }

function initiateCollaborationFunc () {
  $('.myProject').click(myProjectClicked)
}

function initiateOffersAndNeedsFunc () {
  $('.collaborationCategoryTitle').click(collaborationCategoryTitleClicked)
  $('#newOfferBtn').click(openAddCollaboration)
  $('#newNeedBtn').click(openAddCollaboration)
  $('.addCollaborationBtn').click(addCollaboration)
  $('.editIcon').click(openEditCollaboration)
  $('.deleteIcon').click(deleteCollaboration)
  $('.editCollaborationBtn').click(editCollaboration)
  $('.cancelEditCollaborationBtn').click(closeEditCollaboration)
}

function collaborationCategoryTitleClicked () {
  var sec = $(this).siblings('.collaborationCategoryList').first()
  if (sec.hasClass('hidden')) {
    $(this).find('.fa-caret-right').addClass('fa-caret-down').removeClass('fa-caret-right')
    sec.removeClass('hidden')
  } else {
    $(this).find('.fa-caret-down').addClass('fa-caret-right').removeClass('fa-caret-down')
    sec.addClass('hidden')
  }
}

function newOfferOrNeedBtnClicked () {
  $('#newOfferNeedModal').modal('show')
}

function onOpenNewOfferNeedModal (event) {
  console.log($(event.relatedTarget))
}



function initiateProjectFunc () {
  $('.myProject').click(myProjectClicked)
  $('.suggestedProject').click(projectClicked)
  $('.likedProject').click(projectClicked)
// $('#projectModal').on('show.bs.modal', onOpenProjectModal)
}

function myProjectClicked () {
  // TODO falta para cuando no es dummie
  window.open('/project/pilot', '_blanc')
}

function projectClicked () {
  console.log('projectClicked')
  $('#projectModal').modal('show')
}

function onOpenProjectModal (event) {
  var project = $(event.relatedTarget)
// var modal = $(this)
// modal.find('.modal-title').text('New message to ' + project.find())
// modal.find('.modal-body input').val(recipient)
}

//Category

function categoryClicked () {
  var cat = $(this)
  console.log(cat)
  if (cat.hasClass('selected')) {
    cat.removeClass('selected')
    console.log(cat[0].id)
    var data = {categories: cat[0].id}
    $.ajax({
      url: '/api/user/categories',
      type: 'DELETE',
      success: function (res) {
        console.log(res)
        interest.remove()
      },
      data: data
    })
  } else {
    cat.addClass('selected')
    console.log(cat[0].id)
    var data = {categories: cat[0].id}
    $('#newInterestInput').val('')
    $.ajax({
      url: '/api/user/categories',
      type: 'POST',
      success: function (res) {console.log(res)},
      data: data
    })
  }
}

//Interests

function initiateInterestsSkillsFunc () {
  $('.category').click(categoryClicked)
  $('#addInterestBtn').click(addInterest)
  $('#addSkillBtn').click(addSkill)
  $('#newInterestInput').keyup(function (event) {
    if (event.keyCode == 13) {
      $('#addInterestBtn').click()
    }
  })
  $('#interestList a').click(removeInterest)
  $('#newSkillInput').keyup(function (event) {
    if (event.keyCode == 13) {
      if($('#skillWantToSelect').val())
        $('#addSkillBtn').click()
      else {
        $('#skillWantToSelect').next().find('.multiselect').click()
      }
    }
  })
  $('#skillList a').click(removeSkill)
  $('#skillWantToSelect').multiselect({
    allSelectedText: 'No existen opciones ',
    nonSelectedText: 'Selecciona algunas opciones',
    nSelectedText: 'Seleccionadas'
  })
}

function addInterest () {
  if ($('#newInterestInput').val().length > 0) {
    $('#interestList').append('<span class="label label-default">' + $('#newInterestInput').val() + '<i class="fa fa-times mr-l-10"></i></span>')
    var data = {interests: $('#newInterestInput').val()}
    $('#newInterestInput').val('')
        $.ajax({
          url: '/api/user/interests',
          type: 'POST',
          success: function (res) {console.log(res)},
          data: data
        })
  }
}

function removeInterest (e) {
  e.preventDefault()
  var interest = $(this).parent()[0]
  console.log(interest.innerText)
  var data = {interests: interest.innerText}
  $.ajax({
    url: '/api/user/interests',
    type: 'DELETE',
    success: function (res) {
      console.log(res)
      interest.remove()
    },
    data: data
  })
}

//Skills

function addSkill () {
  var wantTos = $('#skillWantToSelect').val()
  var skill = $('#newSkillInput').val()
  var wantToIconsHTML = ''
  $.each(wantTos, function (i, w) {
    wantToIconsHTML += '<i class="fa fa-' + wantTos[i] + ' mr-l-5"></i>'
  })
  
  if(skill && wantTos){
    data = {
      skill: skill,
      wantTo: wantTos
    }
    console.log(data)
    $.ajax({
        url: '/api/user/skills',
        type: 'POST',
        success: function (res) {
          console.log(res)
          $('#skillList').append(
            '<li class="list-group-item skill">'+
              '<span class="badge"><a href="#"><i class="fa fa-times"></i></a></span>' + 
              skill + wantToIconsHTML +
            '</li>')
          $('#newSkillInput').val('')
        },
        data: data
    })
  }  
}

function removeSkill (e) {
  e.preventDefault()
  var skill = $(this).parent().parent()[0]
  var data = {skill: skill.innerText.trim()}
  console.log(data);
  $.ajax({
    url: '/api/user/skills',
    type: 'DELETE',
    success: function (res) {
      console.log(res)
      skill.remove()
    },
    data: data
  })
}

//Picture

function uploadPicture () {
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

//Collaboration 

function openAddCollaboration(){
  $(this).addClass('hidden')
  $(this).siblings('.addCollaborationSec').removeClass('hidden')
}

function addCollaboration(){
  console.log('addCollaboration')
  var collaboration = $(this).parents('.addCollaborationSec')
  console.log(collaboration)
  var data = {
    offerOrNeed: collaboration.parent().attr('id'),
    title: collaboration.find('.newCollaborationTitle').val(),
    type:  collaboration.find('.newCollaborationType').val(),
  }
  console.log(data)
  $.ajax({
    url: '/api/user/collaboration',
    type: 'POST',
    success: function (res) {
      collaboration.find('.newCollaborationTitle').val('')
      collaboration.addClass('hidden')
      data.offerOrNeed = data.offerOrNeed.slice(0,-1)
      var newCollaborationHtml = $('#collaboration-template').html()
      var collaborationTemplate = Handlebars.compile(newCollaborationHtml)
      var colCatId = data.type+data.offerOrNeed.capitalize()
      console.log(colCatId)
      var newColCatList = $('#'+colCatId+'ColCatList')
      console.log(newColCatList)
      newColCatList.append(collaborationTemplate(data))
      newColCatList.removeClass('hidden')
      $('#'+colCatId+'ColCat').removeClass('hidden')
      var colCatNum = +($('#'+colCatId+'ColCat').find('.label').text())
      $('#'+colCatId+'ColCat').find('.label').text(colCatNum+1)
      $('#new'+data.offerOrNeed.capitalize()+'Btn').removeClass('hidden')
    },
    data: data
  })
  return false
}

function closeAddCollaboration(){
  $(this).parents('.addCollaborationSec').addClass('hidden')
  return false
}

function openEditCollaboration(){
  console.log($(this))
  $(this).siblings('.editCollaboration').removeClass('hidden')
  return false
}

function deleteCollaboration(){
  var collaboration = $(this).parent()
  var data = {
    offerOrNeed: collaboration.attr('class'),
    title: collaboration.find('.collaborationTitle').text(),
  }
  $.ajax({
    url: '/api/user/collaboration',
    type: 'DELETE',
    success: function (res) {
      var oldCatNum = +(collaboration.parent().parent().find('.label').text())
      console.log(oldCatNum)
      collaboration.parent().parent().find('.label').text(oldCatNum-1)
      if(oldCatNum==1) collaboration.parent().parent().addClass('hidden')
      collaboration.remove()
    },
    data: data
  })
  return false
}

function closeEditCollaboration(){
  $(this).parents('.editCollaboration').addClass('hidden')
  return false
}

function editCollaboration(){
  var collaboration = $(this).parents('.editCollaboration').parent()
  var data = {
    offerOrNeed: collaboration.attr('class'),
    oldTitle: collaboration.find('.collaborationTitle').text(),
    newTitle: collaboration.find('.newCollaborationTitle').val(),
    newType:  collaboration.find('.newCollaborationType').val(),
  }
  $.ajax({
    url: '/api/user/collaboration',
    contentType: 'application/json; charset=UTF-8',
    type: 'PUT',
    success: function (res) {
      console.log(res)
      collaboration.find('.collaborationTitle').text(data.newTitle)
      collaboration.find('.editCollaboration').addClass('hidden')
      console.log(collaboration.parent().attr('id'))
      console.log(collaboration.parent().attr('id').indexOf(data.newType))
      if(collaboration.parent().attr('id').indexOf(data.newType) == -1){
        console.log('diferenteTipo')
        var oldCat = collaboration.parent().parent()
        console.log(oldCat)
        var newColCatList = $('#'+data.newType+data.offerOrNeed.capitalize()+'ColCatList')
        console.log(newColCatList)
        newColCatList.append(collaboration.detach())
        var oldCatNum = +(oldCat.find('.label').text())
        oldCat.find('.label').text(oldCatNum-1)
        if(oldCatNum==1) oldCat.addClass('hidden')
        var newCat = $('#'+data.newType+data.offerOrNeed.capitalize()+'ColCat')
        var newCatNum = +(newCat.find('.label').text())
        newCat.find('.label').text(newCatNum+1)
        newCat.removeClass('hidden')
      }
    },
    data: data
  })
  return false
}

// Configuration

function initializeConfigurationFunc(){
  $('#changeLocationBtn').click(setChangeLocation)
  $('#expandMapBtn').click(expandMap)  
  $('#btnCloseToMe').click(centerMapMyLocation)
  $('#btnCloseToMe').tooltip({placement: 'top'})
  //$('changeLocationBtn').tooltip({placement: 'right'})
  $('#editProfileBtn').click(editProfile)
  $('#personalDataForm :input').on('input', function(){
    $('#editProfileBtn').removeClass('disabled')
  })
  initializeMap()
}

function initializeMap () {
  var hasLocation = ($('#lat').val() != '')
  console.log(hasLocation)
  var lat = hasLocation ? $('#lat').val() : '19.43211483346452'
  var lon = hasLocation ? $('#lon').val() : '-99.12551879882812'
  console.log(lat)
  console.log(lon)
  map = L.map('mapConf', {zoomControl: false, center: [lat, lon], zoom: 13})
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'ralexrdz.nnh64i75',
    accessToken: 'pk.eyJ1IjoicmFsZXhyZHoiLCJhIjoiY2lmdHB2aGo2MTZ4MnQ1bHkzeDJyaDMzNyJ9.UHhEm9gA1_uwAztXjb7iTQ'
  }).addTo(map)
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map)
  if(hasLocation){
    circle = L.circle([lat, lon], 2000, {
      color: '#38c12d',
      fillColor: '#38c12d',
      fillOpacity: 0.5
    }).addTo(map).bindPopup('Recomendaremos más proyectos y colaboraciones dentro de esta zona')
    marker = L.marker([lat, lon]).addTo(map)
  }  
}

function expandMap(){
  $('#mapConf').css('height',400)
  map.invalidateSize()
  $('#expandMapBtn').addClass('hidden')
  return false
}

function setChangeLocation(){
  console.log('changing location')
  if(circle) map.removeLayer(circle)
  if(marker) map.removeLayer(marker)
  map.on('click', function (e) {
    if(circle) map.removeLayer(circle)
    if(marker) map.removeLayer(marker)
    marker = L.marker([e.latlng.lat, e.latlng.lng])
    $('#lat').val(e.latlng.lat)
    $('#lon').val(e.latlng.lng)
    circle = L.circle([e.latlng.lat, e.latlng.lng], 2000, {
      color: '#38c12d',
      fillColor: '#38c12d',
      fillOpacity: 0.5
    }).addTo(map).bindPopup('Recomendaremos más proyectos y colaboraciones dentro de esta zona')
    map.addLayer(marker)
    map.addLayer(circle)
    $('#editProfileBtn').removeClass('disabled')
  })
  expandMap()
  $('#btnCloseToMe').removeClass('hidden')  
  $('#btnCloseToMe').tooltip('show')
  return false
}

function centerMapMyLocation (e) {
  navigator.geolocation.getCurrentPosition(setMapView)
}

function setMapView (location) {
  map.setView([location.coords.latitude, location.coords.longitude], 15)
}

function updateProfilePicture(){
  var pictureName = $('#pictureFileInput').val()
  console.log(pictureName)
  $.ajax({
    url: '/api/user',
    type: 'PUT',
    data: {profilePicture: pictureName},
    success: function (data) {
      console.log(data)
    }
  })
  if ($('#pictureFileInput')[0].files.length > 0) {
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
  return false
}

function editProfile(){
  console.log('editando perfil')
  var editProfileForm = form2js('personalDataForm', '.')
  var doUpdate = true
  if(editProfileForm.password)
    doUpdate = ($('#passwordInput').val() == $('#confirmPasswordInput').val())
  console.log(editProfileForm)
  if(doUpdate)
    $.ajax({
      url: '/api/user',
      type: 'PUT',
      data: editProfileForm,
      success: function (data) {
        console.log(data)
      }
    })
  else
    alert('por favor confirma la contraseña')
  return false
}