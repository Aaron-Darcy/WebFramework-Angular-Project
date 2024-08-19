var express = require("express");
var bodyParser = require("body-parser");

var model = require('./model/db.js');  //

var cors = require('cors')
var app = express();
app.use(express.json());

// serves files in public folder
app.use(express.static('public'));
app.use(cors());

//
// routes
//

// /teams
app.route('/teams')
  .get(function(req,res){
    model.getTeams(req,res)
  }
)
// /players
app.route('/players')
  .get(function(req,res){
    model.getPlayers(req,res)
  }
)

// /results
app.route('/results')
  .get(function(req,res){
    model.getResults(req,res)
  }
)

// /results/?
app.route('/results/:round')
  .get(function(req,res){
    model.getResultsByRound(req,res)
  }
)

// /login
app.post('/login', function(req, res) {
  model.login(req, res); 
});

// /results/update
app.post('/results/update', function(req, res) {
  model.updateResult(req, res);
});

// /results/id (delete)
app.delete('/results/:id', function(req, res) {
  model.deleteResult(req, res);
});


var myServer = app.listen(3000, function() {
  console.log("Server listening on port 3000");
});

