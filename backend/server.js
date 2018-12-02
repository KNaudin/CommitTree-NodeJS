'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var node = require('./nodes');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Huho, you\'re not supposed to be here are you?\n');
});

app.use(bodyParser.json());

app.post('/addnode', function(request, response){
  try{
    console.log("data: "+request.body.data);
    var new_node = new node(request.body.commit_message, request.body.data_name, request.body.data);
    console.log(new_node);
    response.send(new_node.toJSON());
  }
  catch(e){
    response.send({
      "error" : "Couldn't parse JSON. Expecting commit_message data_name and data"
    });
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);