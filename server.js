const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./userdb'); 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());




app.post('/api/register', (req, result) => {
  const { name, email, password } = req.body;
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], (err, res) => {
    if (err) {
      console.error('Error registering user:', err);
      result.status(500).send('Error registering user');
    } else {
      console.log('User registered successfully');
      result.status(200).send('User registered successfully');
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT name FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    }

    if (results.length > 0) {
      res.json({ name: results[0].name });
    } else {
      res.status(401).send('Invalid email or password');
    }
  });
});


app.get('/alldata', (req, res) => {
  const query = 'SELECT * FROM users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    }
    res.json(results); // Send the retrieved data as JSON
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
