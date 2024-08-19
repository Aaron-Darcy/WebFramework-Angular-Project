var mysql = require('mysql');

///////////////////////////////////////////////////////////////////////////////////////////

// Setup MySQL connection
// timezone is very NB

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'gaanfl2024',
  timezone: 'utc+0'  
});

connection.connect(function(err){
	if(err) throw err;
	console.log(`Sucessfully connected to MySQL database gaaNFL2024`);
});

///////////////////////////////////////////////////////////////////////////////////////////

// GET /teams
exports.getTeams = function(req,res){

  // add your code here to get teams
  connection.query(`SELECT * FROM gaanfl2024.teams`, function(err, rows, fields) {
      if (err) throw err;

      res.status(200);  // OK
      res.send(JSON.stringify(rows));	  
  });	
}
// Get players
exports.getPlayers = function(req,res){
  connection.query(`SELECT * FROM gaanfl2024.players`, function(err, rows, fields) {
      if (err) throw err;

      res.status(200);  // OK
      res.send(JSON.stringify(rows));	  
  });	
}

// Get results
exports.getResults = function(req,res){

  connection.query(`SELECT * FROM gaanfl2024.results`, function(err, rows, fields) {
      if (err) throw err;

      res.status(200);  // OK
      res.send(JSON.stringify(rows));	  
  });	
}

// Get results/byround/
exports.getResultsByRound = function(req, res) {
  const round = req.params.round; 

  // Use the connection object to execute the query with the round parameter
  connection.query('SELECT * FROM gaanfl2024.results WHERE round = ?', [round], function(err, rows, fields) {
    if (err) {
      console.error('Error while fetching results: ', err);
      res.status(500).send('Server error');
    }
    res.status(200); 
    res.send(JSON.stringify(rows));	
  });	
};

// Login endpoint
exports.login = (req, res,) =>  {
  const email = req.body.email;
  const password = req.body.password;

  // Query the database for a user with the provided email
  connection.query('SELECT * FROM gaanfl2024.users WHERE email = ?', [email], function(err, rows, fields) {
    if (err) {
      console.error('Error while fetching user: ', err);
      res.status(500).send('Server error');
      return;
    }
    
    // If user is found
    if (rows.length > 0) {
      const user = rows[0];
      
      // Check if the provided password matches the one in the database
      if (user.password === password) {
        // Passwords match
        res.status(200).send({ message: 'Login successful' });
      } else {
        // Passwords don't match
        res.status(401).send({ message: 'Login failed' });
      }
    } else {
      // No user found with the provided email
      res.status(404).send({ message: 'User not found' });
    }
  });
};

// Update Result Admin method
exports.updateResult = function(req, res) {
  // Extract data from request body
  const { id, team1Score, team2Score } = req.body;
  // SQL query to update result based on id
  const sql = 'UPDATE gaanfl2024.results SET team1Score = ?, team2Score = ? WHERE id = ?';

  // Execute the SQL query
  connection.query(sql, [team1Score, team2Score, id], function(err, result) {
    if (err) {
      console.error('Error while updating result: ', err);
      res.status(500).send('Server error');
      return;
    }
    // Check if any rows were affected by the query
    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Result updated successfully' });
    } else {
      res.status(404).send({ message: 'Result not found' });
    }
  });
}

// Delete Result Admin Method
exports.deleteResult = function(req, res) {
  // Extract id from request parameters
  const id = req.params.id; 
  // SQL query to delete result based on id
  const sql = 'DELETE FROM gaanfl2024.results WHERE id = ?';

  // Execute the SQL query
  connection.query(sql, [id], function(err, result) {
    if (err) {
      console.error('Error while deleting result: ', err);
      res.status(500).send('Server error');
      return;
    }
    // Check if any rows were affected by the query
    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Result deleted successfully' });
    } else {
      res.status(404).send({ message: 'Result not found' });
    }
  });
}



