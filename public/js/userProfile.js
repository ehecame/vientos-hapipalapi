$(document).ready(function () {
  addSectionBtnsFunc()
  addCollaborationFunc()
  addOffersAndNeedsFunc()
  addProjectFunc()
  addInterestsFunc()
})

function addSectionBtnsFunc () {
  $('#sectionTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
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
  $('#newOfferBtn').click(newOfferOrNeedBtnClicked)
  $('#newNeedBtn').click(newOfferOrNeedBtnClicked)
  $('#newOfferNeedModal').on('show.bs.modal', onOpenNewOfferNeedModal)
}

function collaborationCategoryTitleClicked () {
  var sec = $(this).siblings('.collaborationCategorySec').first()
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
