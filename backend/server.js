'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var node = require('./nodes');
var tree = require('./trees');

// Constants
const PORT = 5000;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Huho, you\'re not supposed to be here are you?\n');
});

app.use(bodyParser.json());

var init_node = new node("[init]", "init", "init");
init_node.original = true;
var main_tree = new tree(init_node);

console.log(main_tree.getAllBranches());
console.log(main_tree.getAllBranch("master"));
console.log(main_tree.remove("master", '373bc0a7cda5676ce0ac4e1352a8373d'));

// Adds a node to the tree and in the correct branch
// If the branch doesn't exist, it will return an error
app.post('/addnode', function(request, response){
  try{
    if(request.body.commit_message == undefined || request.body.data_name == undefined || request.body.data == undefined)
      throw "No commit message or data name or data found in sent JSON object";

    var new_node = new node(request.body.commit_message, request.body.data_name, request.body.data);
    if(request.body.branch == undefined)
      throw "No branch found in sent JSON object";
    main_tree.addNode(request.body.branch, new_node);

    response.send(new_node.toJSON());
  }
  catch(e){
    response.send({
      "error" : e
    });
  }
});

// Gets the head of a branch
// If the branch doesn't exist, it will return an error
app.post('/gethead', function(request, response){
  try{
    if(request.body.branch == undefined)
        throw "No branch found in sent JSON object";
    response.send(main_tree.getHead(request.body.branch));
  }
  catch(e){
    response.send({
      "error" : e
    });
  }
});

// Get all nodes in a branch, starting from the head
// If the branch doesn't exist, it will return an error
app.post('/getfullbranch', function(request, response){
  try{
    if(request.body.branch == undefined)
        throw "No branch found in sent JSON object";
    response.send(main_tree.getAllBranch(request.body.branch));
  }
  catch(e){
    response.send({
      "error" : e
    });
  }
});

app.get('/getallbranches', function(request, response){
  try{
    response.send(main_tree.getAllBranches());
  }
  catch(e){
    response.send({
      "error" : e
    });
  }
});

// Adds a branch in the tree
// If the branch doesn't exist, it will return an error
app.post('/newbranch', function(request, response){
  try{
    if(request.body.commit_message == undefined || request.body.data_name == undefined || request.body.data == undefined)
      throw "No commit message or data name or data found in sent JSON object";

    var new_node = new node(request.body.commit_message, request.body.data_name, request.body.data);
    if(main_tree == undefined || main_tree.getLastWorkingBranch() == undefined){
      throw "Cannot create a new branch since the tree is empty";
    }
    else{
      if(request.body.branch == undefined)
        throw "No branch found in sent JSON object";
      main_tree.addBranch(request.body.branch, new_node);
    }
    response.send(new_node.toJSON());
  }
  catch(e){
    response.send({
      "error" : e
    });
  }
});

app.post('/removenode', function(request, response){
  try{
    if(request.body.branch == undefined || request.body.hash == undefined)
      throw "No branch or hash specified";
    response.send(main_tree.remove(request.body.branch, request.body.hash));
  }
  catch(e){
    response.send({
      "error" : e
    });
  }
});

app.get('/integrity', function(request, response){
  try{
    response.send({"integrity":main_tree.integrity()});
  }
  catch(e){
    response.send({
      "error" : e
    });
  }
});

app.post('/merge', function(request, response){
  try{
    if(request.body.branchfrom == undefined || request.body.branchto == undefined)
      throw "Branches were not specified";
    response.send(main_tree.merge(request.body.branchfrom, request.body.branchto));
  }
  catch(e){
    response.send({
      "error" : e
    });
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
