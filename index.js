var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var isemail = require('isemail');
var nodemailer = require('nodemailer');
var fs = require("fs");
// Get content from file
var contents = fs.readFileSync("auth.json");
var resume = fs.readFileSync("resume.docx");
// Define to JSON type
var jsonContent = JSON.parse(contents);
var userb = jsonContent.username;
var passw = jsonContent.password;
var file = "text.txt";
var Confirm = require('prompt-confirm');

/////////////////////////////
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: userb, // generated ethereal user
        pass: passw  // generated ethereal password
    }
});
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


/////////
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}









var contents = fs.readFileSync(file, 'utf8');

var pageToVisit = "https://news.ycombinator.com/item?id=15824597"
console.log("Visiting page " + pageToVisit);
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
function searchForWord($, word) {
  var bodyText = $('html > body').text();
  var counter = 0;
  while(bodyText.indexOf('@',counter) != -1)
  {
    var index = bodyText.indexOf('@',counter);

  //  sendMail();
    //console.log();
  if(isemail.validate(bodyText.substring(bodyText.lastIndexOf(' ',index)+1,bodyText.indexOf('.com',index)+4)))
{
  mailOptions.text = contents.replace(/company/g, bodyText.substring(index+1,bodyText.indexOf('.',index)));
  transporter.sendMail(mailOptions);
    console.log(bodyText.substring(bodyText.lastIndexOf(' ',index)+1,bodyText.indexOf('.com',index)+4));
    sleep(1000000);

}
    counter = index +1;
    var prompt = new Confirm('Send this' + mailOptions.text + 'to' + mailOptions.to);
    //prompt.ask(function(answer) {
  //console.log(answer)
    //  if(answer)
    //  {


//}
  //});
  }
  return false;
}
function sendMail(){
  transporter.sendMail(mailOptions);


}

    // create reusable transporter object using the default SMTP transport


  //console.log(bodyText);
