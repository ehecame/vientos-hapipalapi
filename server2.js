var nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://mailvientos:EmailVientos11@mail.mayfirst.org')

var mailData = {
    from: '"Vientos" <hola@vientos.org.mx>',
    to: 'tianfut@gmail.com',
    cc: 'ralexrdz@gmail.com',
    subject: '¿Adivina qué, papatzul?',
    text: '¡Ya jalan los mails!'
};

transporter.sendMail(mailData, function(err){
  if(err) console.log(err)
  else console.log('mailenviado')
})
