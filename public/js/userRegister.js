$(document).ready(function(){
	$('#inputName').blur(validateName)
	$('#inputLastName').blur(validateLastName)
	$('#inputUserName').blur(validateUserName)
	$('#inputEmail').blur(validateEmail)
	$('#inputPassword').blur(validatePasswords)
	$('#inputConfirmPassword').blur(validatePasswords)
	$('#inputCode').blur(validateCode)
	if($('#inputCode').val().length>1) 
		validateCode()
})

function onRegisterBtnClicked () {
	if(validateRegister()){
	  var form = $('#registerForm').serialize()
	  console.log(form)
	  $.post(
	    '/api/user/register',
	    form,
	    function (data) {
	      window.location.href = "/user/welcome"
	    }
	  )
	}
}

function validateRegister(){
	var vName = $('#validName').val() == 1
	var vLastName = $('#validLastName').val() == 1
	var vUserName = $('#validUserName').val() == 1
	var vEmail = $('#validEmail').val() == 1
	var vPasswords = $('#validPasswords').val() == 1
	var vCode = $('#validCode').val() == 1
	if(vUserName && vEmail && vPasswords && vCode)
		$('#userRegisterBtn').removeClass('disabled')
	else
		$('#userRegisterBtn').addClass('disabled')

}

function validateName(){
	console.log($('#inputName').val())
	var valid = $('#inputName').val().length > 1
	if(valid){
		showFeedback($('#inputName').parents('.form-group'),{type:'success'})
		$('#validPasswords').val(1)
	}
	else{
		showFeedback($('#inputName').parents('.form-group'),{type:'warning', text:'tu nombre es requerido'})
		$('#validPasswords').val(0)
	}
}

function validateLastName(){
	console.log($('#inputLastName').val())
	var valid = $('#inputLastName').val().length > 1
	if(valid){
		showFeedback($('#inputLastName').parents('.form-group'),{type:'success'})
		$('#validPasswords').val(1)
	}
	else{
		showFeedback($('#inputLastName').parents('.form-group'),{type:'warning', text:'tu apellido es requerido'})
		$('#validPasswords').val(0)
	}
}

function validateUserName(){
	var userNameInput = $('#inputUserName')
	var username = userNameInput.val()
	var userNameFormGroup = userNameInput.parents('.form-group')
	if(username == ""){
		showFeedback(userNameFormGroup, {
			type:'warning',
			text:'El nombre de usuario es requerido'
		})
		$('#validUserName').val(0)
		validateRegister()
	}
	else {
		$.get({
			url: '/api/user/existsusername',
			data: {username: username},
			success: function(res){
				console.log(res)
				if(res){
					showFeedback(userNameFormGroup, {
						type:'error',
						text:'Ese nombre de usuario ya está siendo usado'
					})
					$('#validUserName').val(0)
					validateRegister()
				}
				else{
					showFeedback(userNameFormGroup, {type:'success'})
					$('#validUserName').val(1)
					validateRegister()
				}
			}
		})
	}
}

function validateEmail(){
	var emailInput = $('#inputEmail')
	var email = emailInput.val()
	var emailFormGroup = emailInput.parents('.form-group')
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var valid = re.test(email);
	if(!valid){
		var warning = {
			type: 'warning',
			text: 'el formato del correo es incorrecto'
		}
		if(email.length<1)
			warning.text = 'el email es requerido'
		showFeedback(emailFormGroup, warning)
		$('#validEmail').val(0)
		validateRegister()
	}
	else {
		$.get({
			url: '/api/user/existsemail',
			data: {email: email},
			success: function(res){
				console.log(res)
				if(res){
					showFeedback(emailFormGroup, {
						type:'error',
						text:'Ese email ya está siendo usado'
					})
					$('#validEmail').val(0)
					validateRegister()
				}
				else{
					showFeedback(emailFormGroup, {type:'success'})
					$('#validEmail').val(1)
					validateRegister()
				}
			}
		})
	}
}

function validatePasswords(){
	var confirmePass = $('#inputConfirmPassword').val()
	var pass = $('#inputPassword').val()
	if(confirmePass.length>1 && confirmePass.length>1){
		if(confirmePass == pass){
			showFeedback($('#inputConfirmPassword').parents('.form-group'),{type:'success'})
			showFeedback($('#inputPassword').parents('.form-group'),{type:'success'})
			$('#validPasswords').val(1)
			validateRegister()
		}
		else{
			showFeedback($('#inputConfirmPassword').parents('.form-group'),{
				type:'error', 
				text: 'la confirmación de la contraseña no coincide'
			})
			showFeedback($('#inputPassword').parents('.form-group'),{type:'neutral'})
			$('#validPasswords').val(0)
			validateRegister()
		}
	}else{
		showFeedback($('#inputConfirmPassword').parents('.form-group'),{type:'neutral'})
		$('#validPasswords').val(0)
		validateRegister()
	}	
}

function validateCode(){
	var code = $('#inputCode').val()
	console.log(code)
	if(code.length<1){
		showFeedback($('#inputCode').parents('.form-group'),{
			type:'warning',
			text: 'el código de registro es requerido'
		})
		$('#validCode').val(0)
		validateRegister()
	}
	else {
		$.get({
			url: '/api/code/goodcode',
			data: {code: code},
			success: function(res){
				console.log(res)
				if(res){
					showFeedback($('#inputCode').parents('.form-group'),{type:'success'})
					$('#validCode').val(1)
					validateRegister()
				}
				else{
					showFeedback($('#inputCode').parents('.form-group'),{
						type:'error',
						text: 'el código es incorrecto'
					})
					$('#validCode').val(0)
					validateRegister()
				}
			}
		})
	}
}

function submitRegister(e){
	console.log('registrando')
	$.post(
    '/api/user/register',
    $('#registerForm').serialize(),
    function (data) {
      console.log(data)
    }
  )
  return false
}

function showFeedback(formGroup, options){
	console.log(options)
	console.log(formGroup)
	if(options.type == 'error') {
		formGroup.removeClass('has-success').removeClass('has-warning').addClass('has-error').addClass('has-feedback')
		formGroup.find('.glyphicon').removeClass('glyphicon-ok').removeClass('glyphicon-warning').addClass('glyphicon-remove')
		formGroup.find('.help-block').removeClass('hidden').text(options.text)
	}
	else if (options.type == 'success'){
		formGroup.removeClass('has-error').removeClass('has-warning').addClass('has-success').addClass('has-feedback')
		formGroup.find('.glyphicon').removeClass('glyphicon-warning').removeClass('glyphicon-remove').addClass('glyphicon-ok')
		formGroup.find('.help-block').addClass('hidden')
	} else if (options.type == 'warning'){
		formGroup.addClass('has-warning').addClass('has-feedback').removeClass('has-succes').removeClass('has-error')
		formGroup.find('.glyphicon').removeClass('glyphicon-ok').removeClass('glyphicon-remove').addClass('glyphicon-warning')
		formGroup.find('.help-block').removeClass('hidden').text(options.text)
	} else { //neutral
		formGroup.removeClass('has-warning').removeClass('has-feedback').removeClass('has-succes').removeClass('has-error')
		formGroup.find('.glyphicon').removeClass('glyphicon-ok').removeClass('glyphicon-remove').removeClass('glyphicon-warning')
		formGroup.find('.help-block').addClass('hidden')
	}

}

// TODO onchange para email y username
// alertas para cuando ya están ocupados

// TODO verificar contraseña y comparar con confirmación

// TODO Ponerle captcha
