$(document).ready(function () {
  initiateSectionBtnsFunc()
  initiateCollaborationFunc()
  initiateOffersAndNeedsFunc()
  initiateProjectFunc()
  initiateInterestsSkillsFunc()
})

function initiateSectionBtnsFunc () {
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

function initiateCollaborationFunc () {
  $('.myProject').click(myProjectClicked)
}

function initiateOffersAndNeedsFunc () {
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
