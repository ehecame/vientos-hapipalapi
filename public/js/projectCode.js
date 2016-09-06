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