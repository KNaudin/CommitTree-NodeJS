var md5 = require('md5');

class node {
    constructor(commit_message, data_name, data) {
      this.commit_message = commit_message;
      this.data_name = data_name;
      this.data = data;
      this.children = [];
      this.branch = "master";
      this.original = false;
      this.computeHash();
    }

    addChild(child){
        this.children.push(child);
        this.computeHash();
        return child;
    }

    getChildren(){
        return this.children;
    }

    getAllChildren(){
        var family = [];
        family.push(this.toJSON());
        this.children.forEach(function(child){
            family.push(child.getAllChildren());
        });
        return family;
    }

    setOwner(owner){
        this.branch = owner;
    }

    toJSON(){
        return {
            "commit_message" : this.commit_message,
            "data_name" : this.data_name,
            "data" : this.data,
            "hash" : this.hash,
            "branch": this.branch
        };
    }

    computeHash(){
        if(this.children.length == 0){
            this.hash = md5(this.data+this.branch);
        }
        else{
            var datas = this.data;
            this.children.forEach(function(child){
                datas += child.data+child.owner;
            })
            this.hash = md5(datas);
        }
    }

    remove(hash){
        try{
            for(i=0;i<this.children.length;i++){
                if(this.children[i].hash == hash){
                    if(this.children[i].children.length == 0){
                        this.children.splice(i, 1);
                        throw "Removed node";
                    }
                    else if(this.children[i].children.length == 1){
                        this.children.push(this.children[i].children[0]);
                        this.children.splice(i, 1);
                        throw "Removed node";
                    }
                    else{
                        throw "Cannot remove a commit with at least 2 children";
                    }
                }
                else{
                    this.children[i].remove(hash);
                }
            }
            this.computeHash();
        }
        catch(e){
            return e;
        }
    }

    integrity(){
        var hashes = this.hash;
        this.children.forEach(function(child){
            hashes += child.integrity();
        })
        return hashes;
    }
  }

  module.exports = node;
