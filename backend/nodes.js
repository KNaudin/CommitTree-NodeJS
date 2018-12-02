class node {
    constructor(commit_message, data_name, data) {
      this.commit_message = commit_message;
      this.data_name = data_name;
      this.data = data;
    }

    toJSON(){
        return {
            "commit_message" : this.commit_message,
            "data_name" : this.data_name,
            "data" : this.data
        };
    }
  }

  module.exports = node;