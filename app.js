const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
 
const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  //res.send("Server is up and running at port 3000");
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {

  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/05dc5fcc30"
  const options = {
    method: "POST",
    auth: "jahnavi1:9a0bb6835153a75aaff6cb4e0966ad5f-us21"
  }

  const request = https.request(url, options, function(response) {
    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");

})

app.listen(process.env.PORT || 3000, function(req, res) {//process.env.PORT is dyanmic port that heroku will define on the go.
  console.log("Listening to port 3000");
});

//List Id
//9a0bb6835153a75aaff6cb4e0966ad5f-us21

//Audience ID or list Id
//05dc5fcc30

//mailchimp api endpoint
//'https://<dc>.api.mailchimp.com/3.0/'

//the mailchimp do not add already subscribed emails