//Dependencies
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var isemail = require('isemail');
var nodemailer = require('nodemailer');
var fs = require("fs");
var Confirm = require('prompt-confirm');
var async = require('async');


/* From email auth */
var contents = fs.readFileSync("auth.json");
var jsonContent = JSON.parse(contents);
var userb = jsonContent.username;
var passw = jsonContent.password;

/* Load resume */
var resume = fs.readFileSync("resume.docx");

/* Define page source */
var pageToVisit = "https://news.ycombinator.com/item?id=15824597"

/* transporter specs */
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: userb, // generated ethereal user
        pass: passw  // generated ethereal password
    }
});

/* Email options */
var mailOptions = {
  from: 'billipandey@gmail.com',
  to: 'tanuj98@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
  attachments: [
      {   // utf-8 string as an attachment
          filename: 'resume.docx',
          content: resume
      }
  ]
};

/* Email template */
var file = "text.txt";
var contents = fs.readFileSync(file, 'utf8');
var sent_emails = fs.readFileSync('companies.txt','utf8')
var sent_emails = sent_emails.split(" ");
console.log("Visiting page " + pageToVisit);
console.log(sent_emails);

/* Get HTML source of the destination and parse for '@' */
request(pageToVisit, function(error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   // Check status code (200 is HTTP OK)
   console.log("Status code: " + response.statusCode);
   if(response.statusCode === 200) {
     // Parse the document body
     var $ = cheerio.load(body);
     console.log(searchForWord($,'@'));
     console.log("Page title:  " + $('title').text());
   }
});

/* Parse all email addresses and send Email */
async function searchForWord($, word) {
  var bodyText = $('html > body').text();
  var counter = 0;

  while(bodyText.indexOf('@',counter) != -1){
      var index = bodyText.indexOf('@',counter);

      if(isemail.validate(bodyText.substring(bodyText.lastIndexOf(' ',index)+1,bodyText.indexOf('.com',index)+4))){
        //Generate email text
        mailOptions.text = contents.replace(/company/g, bodyText.substring(index+1,bodyText.indexOf('.',index)));
        console.log(sent_emails[sent_emails.length-1])
        if(sent_emails.indexOf(bodyText.substring(bodyText.lastIndexOf(' ',index)+1,bodyText.indexOf('.com',index)+4)) == -1 )
        {
        mailOptions.to = bodyText.substring(bodyText.lastIndexOf(' ',index)+1,bodyText.indexOf('.com',index)+4)
          fs.appendFileSync('companies.txt', bodyText.substring(bodyText.lastIndexOf(' ',index)+1,bodyText.indexOf('.com',index)+4) + " ");
        }
        //Send Email
            //Specify frequency in seconds
        console.log('Send this' + mailOptions.text + 'to' + mailOptions.to);
        var prompt = new Confirm('Send this' + mailOptions.text + 'to' + mailOptions.to);

          await sendMail(mailOptions, 10);

        //Log email address
        console.log(bodyText.substring(bodyText.lastIndexOf(' ',index)+1,bodyText.indexOf('.com',index)+4));

      }
        counter = index +1;

    }
    return false;
}

/* Synchronously send emails according to the frequency */
function sendMail(mailOptions, frequency){
  return new Promise(function(resolve, reject){
    setTimeout(() => {
      resolve(transporter.sendMail(mailOptions))
    }, frequency*1000)
  })
}

// Adding support for excel storage and read
