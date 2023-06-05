const fs = require('fs');
const http = require('http');
const { URLSearchParams } = require('url');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('dados.db');
const readFile = fs.readFileSync('page.html', 'utf8');
const saveFile = fs.readFileSync('savePage.html', 'utf8');
db.run('CREATE TABLE IF NOT EXISTS dados (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR, email VARCHAR, number VARCHAR)');

const server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (req.method === 'POST') {
        let body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            const formDataInfo = new URLSearchParams(body);
            const nome = formDataInfo.get('nome');
            const email = formDataInfo.get('email');
            const number = formDataInfo.get('number');
            db.run('INSERT INTO dados (nome, email, number) VALUES (?, ?, ?)', [nome, email, number], function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.end(saveFile);
                }
            });
        });
    } else if (req.method === 'GET') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end(readFile);
    }
});

server.listen(3000, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Servidor Online na porta 3000');
    }
});
