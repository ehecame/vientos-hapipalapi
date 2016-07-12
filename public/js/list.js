var source
var projectTemplate

$(document).ready(function () {
  source = $('#project-template').html()
  projectTemplate = Handlebars.compile(source)
  addAllProjects()
  setTopBarBtnsFunc()
})

function addAllProjects () {
  $('.project').remove()
  $.get(
    '/api/projects',
    function (data) {
      addProjects(data)
    }
  )
}

function filterCategory (e) {
  $('.project').remove()
  $.get(
    '/api/project/category/' + e.id,
    function (data) {
      addProjects(data)
    }
  )
}

function filterByKeyWords () {
  $('.project').remove()
  var keywords = $('#keyWordsInput').val()
  console.log('keywords: ' + keywords)
  $.get(
    '/api/project/keywords/' + keywords,
    function (data) {
      addProjects(data)
    }
  )
}

function addProjects (projectList) {
  var projectHtml
  $.each(projectList, function (i, p) {
    projectHtml = projectTemplate(p)
    $('#list').append(projectHtml)
  })
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

function setTopBarBtnsFunc () {
  $('#categoriesBtn').click(categoriesBtnClicked)
  $('#typesBtn').click(typesBtnClicked)
  $('#waysOfCollaborationBtn').click(waysOfCollaborationBtnClicked)
// $('#evetnsBtn').click(evetnsBtnClicked)
}

function categoriesBtnClicked () {
  $('#categoriesContainer').show()
  $('#categoriesBtn').removeClass('btn-default')
  $('#categoriesBtn').addClass('btn-success')
  $('#typesContainer').hide()
  $('#typesBtn').addClass('btn-default')
  $('#typesBtn').removeClass('btn-success')
  $('#waysOfCollaborationContainer').hide()
  $('#waysOfCollaborationBtn').addClass('btn-default')
  $('#waysOfCollaborationBtn').removeClass('btn-success')
}

function typesBtnClicked () {
  $('#typesContainer').show()
  $('#typesBtn').removeClass('btn-default')
  $('#typesBtn').addClass('btn-success')
  $('#categoriesContainer').hide()
  $('#categoriesBtn').addClass('btn-default')
  $('#categoriesBtn').removeClass('btn-success')
  $('#waysOfCollaborationContainer').hide()
  $('#waysOfCollaborationBtn').addClass('btn-default')
  $('#waysOfCollaborationBtn').removeClass('btn-success')
}

function waysOfCollaborationBtnClicked () {
  $('#waysOfCollaborationContainer').show()
  $('#waysOfCollaborationBtn').removeClass('btn-default')
  $('#waysOfCollaborationBtn').addClass('btn-success')
  $('#categoriesContainer').hide()
  $('#categoriesBtn').addClass('btn-default')
  $('#categoriesBtn').removeClass('btn-success')
  $('#typesContainer').hide()
  $('#typesBtn').addClass('btn-default')
  $('#typesBtn').removeClass('btn-success')
}
