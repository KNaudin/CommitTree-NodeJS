var md5 = require('md5');

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
            var head = this.branches.get(this.getLastWorkingBranch());
            node.setOwner(branch);
            node.addChild(head);
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

    remove(branch, hash){
        try{
            if(this.branches.has(branch)){
                var main_node = this.branches.get(branch);
                if(main_node.hash == hash){
                    if(main_node.original)
                        throw "Cannot remove original node";
                    if(main_node.children.length == 0){
                        this.branches.delete(branch);
                        throw "Removed node";
                    }
                    else if(main_node.children.length == 1){
                        this.branches.set(banch, main_node.children[0]);
                        throw "Removed node";
                    }
                    else{
                        throw "Cannot remove a commit with at least 2 children";
                    }
                    return main_node.toJSON();
                }
                else{
                    return main_node.remove(hash);
                }
            }
            else{
                throw "No branch named "+branch;
            }
        }
        catch(e){
            return e;
        }

    }

    integrity(){
        var hashes = "";
        this.branches.forEach(function(head){
            hashes += head.integrity();
        });
        return md5(hashes);
    }

    merge(branch_from, branch_to){
        try{
            if(this.branches.has(branch_from) && this.branches.has(branch_to)){
                var node = new node("merged "+branch_from+" with "+branch_to, "merge", "merge");
                node.addChild(this.branches.get(branch_from));
                node.addChild(this.branches.get(branch_to));
                node.setOwner(branch_to);
                this.branches.set(branch_to, node);
                return node;
            }
            else{
                throw "Branches don't exist";
            }
        }
        catch(e){
            return e;
        }
    }
}

module.exports = tree;
