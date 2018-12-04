class node {
    constructor(commit_message, data_name, data) {
      this.commit_message = commit_message;
      this.data_name = data_name;
      this.data = data;
      this.hash = "";
      this.children = [];
      this.branch = "master";
    }

    addChild(child){
        if(this.children.length < 2)
        {
            this.children.push(child);
            return child;
        }
        throw "Couldn't add child node as the parent node already has 2 children";
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
            "hash" : this.hash
        };
    }
  }

  module.exports = node;