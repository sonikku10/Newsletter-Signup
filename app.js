//jshint esversion:7

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));


//Use Static Folders to bring over CSS/Images
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.emailAddress;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/614e2352ed";

  const options = {
    method: "POST",
    auth: "lee1:pf5fdbf0af5c2e314447dee414929018-us17"
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });


  request.write(jsonData);
  request.end();


});

//Failure page redirects back to root upon POST
app.post("/failure", function(req, res){
  res.redirect("/");
});

//Node Listening on Heroku node OR local 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("Serv is running on Port 3000");
});



//API apiKey
//cf5fdbf0af5c2e314447dee414929018-us17

//listID
//614e2352ed
