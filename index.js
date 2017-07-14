var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var app = express();
var port = 8888;
var server = app.listen(port, function() {
    console.log('Listening on port: ' + port);
});
var connection ;
var readFile ;
var testData = [
  {
     "firstName": "John",
     "lastName": "Smith",
     "age": 25,
     "address":{
         "streetAddress": "21 2nd Street",
         "city": "New York",
         "state": "NY",
         "postalCode": "10021"
     }
 },
 {
    "firstName": "Jutatip",
    "lastName": "Marirak",
    "age": 22,
    "address":{
        "streetAddress": "Bangna-Trad",
        "city": "Bangplee",
        "state": "Samutprakarn",
        "postalCode": "10540"
    }
}
];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/hi', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  var name = req.param('name');
  res.send("My id :"+ name);
  
});



 // text file : [object object] but cannot read file
 // fs.writeFile('txtFile.txt', testData, function(err) {
 //   if (err) throw err;
 //   console.log('text file saved!');
 //   console.log('-----------------------');
 // });

//text file : correct data
  function writeFile(){
    fs.writeFile('txtFile.txt', JSON.stringify(testData), function(err) {
      if (err) throw err;
      console.log('-----------Save to text file------------');
    });
  }


// log : number
// fs.readFile('txtFile.txt',function(err, data) {
//   if (err) throw err;
//   console.log(data);
//   console.log('-----------------------');
//   console.log('text file read!');
// });

// log : correct data
function readData(){
  fs.readFile('txtFile.txt',function(err, data) {
    if (err) throw err;
    readFile = JSON.parse(data);
    console.log('-----------Read from txt file------------');
    console.log(JSON.parse(data));
    // insertData();
    selectData();
    // retrieveData();
  });
}

function connectdb(){
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
  });
  connection.connect(function(err) {
    if (err) throw err;
    // console.log("Connected!");
  });
}

function insertData(){
  connectdb();
    for(var i=0; i<readFile.length; i++){
      var firstName = readFile[i].firstName;
      var lastName = readFile[i].lastName;
      var age = readFile[i].age;
      var address = JSON.stringify(readFile[i].address);
      var sql = "INSERT INTO tb_username (firstName, lastName, age, address) VALUES ('"+firstName+"','"+lastName+"','"+age+"','"+address+"')";
      connection.query(sql, function (err, result) {
        if (err) throw err;
      });
    }
  connection.end();
}

function selectData(){
  connectdb();
  // var sql = "SELECT * FROM tb_username WHERE firstName = 'Jutatip'";
  var sql = "SELECT * FROM tb_username";
  connection.query(sql, function (err, result, fields) {
    if(err) throw err;
    console.log('------------Select from DB-----------');
    // console.log(result);
    for(var i=0; i<result.length; i++){
        console.log("FirstName : "+result[i].firstName);
        console.log("LastName : "+result[i].lastName);
        console.log("Age : "+result[i].age);
        console.log("Address : "+result[i].address);
    }
  });
  connection.end();
}

function retrieveData(){
  connectdb();
  var sql = "SELECT * FROM tb_username";
  var retrieveData = [];
  connection.query(sql, function (err, result, fields) {
    if(err) throw err;
    console.log('------------Retrieve from DB-----------');
    //  console.log(result);
    for(var i=0; i<result.length; i++){
        retrieveData.push('{"firstName":"'+result[i].firstName+'", "lastName":"'+result[i].lastName+'","age":'+result[i].age+',"address":'+result[i].address+'}');
    }
    console.log("Retrieved data : "+retrieveData);
  });

  connection.end();
}
