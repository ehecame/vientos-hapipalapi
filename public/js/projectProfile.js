var map

$(document).ready(function () {
  addSectionBtnsFunc()
  addCollaborationFunc()
  addOffersAndNeedsFunc()
  addInterestsFunc()
  initializeMap()
})

function addSectionBtnsFunc () {
  $('#sectionTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
}

function initializeMap () {
  var lat = $('#projectLat0').val()
  var lon = $('#projectLon0').val()
  console.log('lat:' + lat)
  console.log('lon:' + lon)
  map = L.map('map', {zoomControl: false}).setView([lat, lon], 15)
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'ralexrdz.nnh64i75',
    accessToken: 'pk.eyJ1IjoicmFsZXhyZHoiLCJhIjoiY2lmdHB2aGo2MTZ4MnQ1bHkzeDJyaDMzNyJ9.UHhEm9gA1_uwAztXjb7iTQ'
  }).addTo(map)
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map)
  map.addLayer(L.marker([lat, lon]))
}

function sectionBtnClicked () {
  var id = $(this).attr('id')
  $('.userProfileSec').addClass('hidden')
  $('.sectionBtn').removeClass('selected')
  if (id == 'homeBtn') {
    $('#homeBtn').addClass('selected')
    $('#secHome').removeClass('hidden')
  }
  if (id == 'projectsBtn') {
    $('#projectsBtn').addClass('selected')
    $('#secProjects').removeClass('hidden')
  }
  if (id == 'offersAndNeedsBtn') {
    $('#offersAndNeedsBtn').addClass('selected')
    $('#secOffersAndNeeds').removeClass('hidden')
  }
  if (id == 'interestsBtn') {
    $('#interestsBtn').addClass('selected')
    $('#secInterests').removeClass('hidden')
  }
  if (id == 'configurationBtn') {
    $('#configurationBtn').addClass('selected')
    $('#secConfiguration').removeClass('hidden')
  }
}

function addCollaborationFunc () {
  $('.myProject').click(myProjectClicked)
}

function addOffersAndNeedsFunc () {
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

function addProjectFunc () {
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

function addInterestsFunc () {
  $('.category').click(categoryClicked)
  $('#addInterestBtn').click(addInterest)
  $('#addSkillBtn').click(addSkill)
}

function categoryClicked () {
  var cat = $(this)
  if (cat.hasClass('selected')) {
    cat.removeClass('selected')
  } else {
    cat.addClass('selected')
  }
}

function addInterest () {
  $('#interestList').append('<span class="label label-default">' + $('#newInterestInput').val() + '</span>')
  $('#newInterestInput').val('')
}

function addSkill () {
  $('#skillList').append('<li class="list-group-item skill"><span class="badge">' + $('#skillLevelSelect').val() + '</span>' + $('#newSkillInput').val() + '</li>')
  $('#newSkillInput').val('')
}

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

function openAddCollaboration () {
  $(this).addClass('hidden')
  $(this).siblings('.addCollaborationSec').removeClass('hidden')
}

function addCollaboration () {
  console.log('addCollaboration')
  var collaboration = $(this).parents('.addCollaborationSec')
  console.log(collaboration)
  var data = {
    offerOrNeed: collaboration.parent().attr('id'),
    title: collaboration.find('.newCollaborationTitle').val(),
    type: collaboration.find('.newCollaborationType').val(),
    projectId: $(window.location.href.split('/')).last()[0]
  }
  console.log(data)
  $.ajax({
    url: '/api/project/collaboration',
    type: 'POST',
    success: function (res) {
      collaboration.find('.newCollaborationTitle').val('')
      collaboration.addClass('hidden')
      data.offerOrNeed = data.offerOrNeed.slice(0, -1)
      var newCollaborationHtml = $('#collaboration-template').html()
      var collaborationTemplate = Handlebars.compile(newCollaborationHtml)
      var colCatId = data.type + data.offerOrNeed.capitalize()
      var newColCatList = $('#' + colCatId + 'ColCatList')
      console.log(newColCatList)
      newColCatList.append(collaborationTemplate(data))
      newColCatList.removeClass('hidden')
      $('#' + colCatId + 'ColCat').removeClass('hidden')
      var colCatNum = +($('#' + colCatId + 'ColCat').find('.label').text())
      $('#' + colCatId + 'ColCat').find('.label').text(colCatNum + 1)
      $('#new' + data.offerOrNeed.capitalize() + 'Btn').removeClass('hidden')
    },
    data: data
  })
  return false
}

function closeAddCollaboration () {
  $(this).parents('.addCollaborationSec').addClass('hidden')
  return false
}

function openEditCollaboration () {
  console.log($(this))
  $(this).siblings('.editCollaboration').removeClass('hidden')
  return false
}

function deleteCollaboration () {
  var collaboration = $(this).parent()
  var data = {
    offerOrNeed: collaboration.attr('class'),
    title: collaboration.find('.collaborationTitle').text(),
    projectId: $(window.location.href.split('/')).last()[0]
  }
  $.ajax({
    url: '/api/project/collaboration',
    type: 'DELETE',
    success: function (res) {
      console.log(res)
      var oldCatNum = +(collaboration.parent().parent().find('.label').text())
      console.log(oldCatNum)
      collaboration.parent().parent().find('.label').text(oldCatNum - 1)
      if (oldCatNum == 1) collaboration.parent().parent().addClass('hidden')
      collaboration.remove()
    },
    data: data
  })
  return false
}

function closeEditCollaboration () {
  $(this).parents('.editCollaboration').addClass('hidden')
  return false
}

function editCollaboration () {
  var collaboration = $(this).parents('.editCollaboration').parent()
  var data = {
    offerOrNeed: collaboration.attr('class'),
    oldTitle: collaboration.find('.collaborationTitle').text(),
    newTitle: collaboration.find('.newCollaborationTitle').val(),
    newType: collaboration.find('.newCollaborationType').val(),
    projectId: $(window.location.href.split('/')).last()[0]
  }
  $.ajax({
    url: '/api/project/collaboration',
    type: 'PUT',
    success: function (res) {
      console.log(res)
      collaboration.find('.collaborationTitle').text(data.newTitle)
      collaboration.find('.editCollaboration').addClass('hidden')
      console.log(collaboration.parent().attr('id').indexOf(data.newType))
      if (collaboration.parent().attr('id').indexOf(data.newType) == -1) {
        var oldCat = collaboration.parent().parent()
        var newColCatList = $('#' + data.newType + data.offerOrNeed.capitalize() + 'ColCatList')
        newColCatList.append(collaboration.detach())
        var oldCatNum = +(oldCat.find('.label').text())
        oldCat.find('.label').text(oldCatNum - 1)
        if (oldCatNum == 1) oldCat.addClass('hidden')
        var newCat = $('#' + data.newType + data.offerOrNeed.capitalize() + 'ColCat')
        var newCatNum = +(newCat.find('.label').text())
        newCat.find('.label').text(newCatNum + 1)
        newCat.removeClass('hidden')
      }
    },
    data: data
  })
  return false
}
