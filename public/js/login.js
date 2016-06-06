function login (e) {
  e.preventDefault()
  console.log('try log in')
  $.post(
    '/api/user/login',
    $('#loginForm').serialize(),
    function (data) {
      console.log(data)
      if (data == 'success')
        window.location.href = $('#redirect').val()
    }
  )
}
