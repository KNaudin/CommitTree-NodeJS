class tree{
    constructor(head){
        this.branches = new Map();
        this.branches.set('master', head);
        this.last_working_branch = 'master';
    }

    addNode(branch, node){
        if(this.branches.has(branch)){
            var old_head = this.branches.get(branch);
            node.addChild(old_head);
            node.setOwner(branch);
            this.branches.set(branch, node);
        }
        else{
            throw "No branch named "+branch;
        }
    }

    addBranch(branch, node){
        if(this.branches.has(branch))
            throw "Branch "+branch+" already exists";
        else{
            this.branches.set(branch, node);
        }
    }

    getHead(branch){
        if(this.branches.has(branch)){
            return this.branches.get(branch);
        }
        else{
            throw "No branch named "+branch;
        }
    }

    getAllBranch(branch){
        if(this.branches.has(branch)){
            var full_branch = [];
            full_branch.push(this.branches.get(branch).getAllChildren());
            return full_branch;
        }
        else{
            throw "No branch named "+branch;
        }
    }

    getLastWorkingBranch(){
        return this.last_working_branch;
    }

    getAllBranches(){
        var branches = [];
        this.branches.forEach(function(value, key){
            branches.push(key);
        });
        return branches;
    }
}

module.exports = tree;
