function login (e) {
  e.preventDefault()
  $.post(
    '/api/user/login',
    $('#loginForm').serialize(),
    function (data) {
      console.log('buen login')
      console.log(data)
    }
  )
}
