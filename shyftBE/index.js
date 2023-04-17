const express = require('express');
const app = express();
var cors = require('cors');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var Datastore = require('nedb');

var students = new Datastore({ filename: 'db/students.db', autoload: true });

// users.ensureIndex({ fieldName: 'username', unique: true }, function (err) {
// });

var Student = (function(){
    return function student(student){
        this.firstname = student.body.firstname;
        this.lastname = student.body.lastname;
        this.dob = student.body.dob;
    };
}());

app.post('/api/students/', function (req, res, next) {
    console.log(req.body);
    students.insert(new Student(req), function (err, user) {
        if (err) return res.status(409).end("Username:" + req.body.username + " already exists");
        else{
            students.find({}, function (err, docs) {
            return res.json(docs);
          });
        }

    });
});


app.get('/api/students/', function (req, res, next) {
    students.find({}, function (err, docs) {
        return res.json(docs);
      });
});


// app.length("/students", (req, res) =>{
//     res.sned
// })


const http = require('http');
const PORT = 3001;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});