var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
 
// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: {
    api_key: 'key-3fb021d1-4c55218e',
    domain: 'one of your domain names listed at your https://mailgun.com/app/domains'
  },
  proxy: 'http://user:pass@localhost:8080' // optional proxy, default is false
}
 
var nodemailerMailgun = nodemailer.createTransport(mg(auth));
 
nodemailerMailgun.sendMail({
  from: 'myemail@example.com',
  to: 'chattel6@gmail.com', // An array if you have multiple recipients.
  cc:'second@domain.com',
  bcc:'secretagent@company.gov',
  subject: 'Hey you, awesome!',
  'h:Reply-To': 'reply2this@company.com',
  //You can use "html:" to send HTML email content. It's magic!
  html: '<b>Wow Big powerful letters</b>',
  //You can use "text:" to send plain-text content. It's oldschool!
  text: 'Mailgun rocks, pow pow!'
}, function (err, info) {
  if (err) {
    console.log('Error: ' + err);
  }
  else {
    console.log('Response: ' + info);
  }
});