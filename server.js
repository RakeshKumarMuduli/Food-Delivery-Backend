const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./userdb'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


const SECRET_KEY = 'your_jwt_secret_key';

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

app.post('/api/login',  (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    const { rows } =  db.query(`SELECT * FROM users WHERE email ='${email}'`);

    console.log(rows);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    const validPassword =  bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
