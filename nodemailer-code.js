"use strict";
const nodemailer = require("nodemailer");
const myMod = require('./routes/users').emailCreated;
// async..await is not allowed in global scope, must use a wrapper


async function sendUserDetails(){
var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'manu.kapoor@outlook.com',
        pass: 'Kapoor@91'
    }
});
// const emailCreated = myMod.emailCreated
 console.log(`email is from nodemailer ${myMod}`)
  const mailOptions = {
    from: 'manu.kapoor@outlook.com',
    to : 'manu.kapoor91@gmail.com',
    subject: 'Login credentials for Chatttel',
    text: "Hello world? Manu", // plain text body
    html: "<div><label>Username:</div>" // html body
};

  // send mail with defined transport object

  let info = await transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.redirect('/');
    }
  });

}

sendUserDetails().catch(console.error);



