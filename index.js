const fs = require('fs');
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('newdata.db');

const pageUm = fs.readFileSync('page.html', 'utf8');
const callBackPage = fs.readFileSync('savePage.html', 'utf8');

db.run('CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, email VARCHAR)');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'page.html'));
});

app.post('/', function (req, res) {
    const nome = req.body.nome;
    const email = req.body.email;

    db.run('INSERT INTO usuarios (name, email) VALUES (?, ?)', [nome, email], function (err) {
        if (err) {
            console.log(err);
        } else {
            res.sendFile(path.join(__dirname, 'savePage.html'));
        }
    });
});

app.listen(3000, function () {
    console.log('Server running at http://localhost:3000/');
});
