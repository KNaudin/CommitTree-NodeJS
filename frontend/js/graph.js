class Graph
{
	constructor(elemId){
		var myTemplateConfig = {
		  colors: [ "#9993FF", "#47E8D4", "#6BDB52", "#F85BB5", "#FFA657", "#F85BB5" ], // branches colors, 1 per column
		  branch: {
		    lineWidth: 8,
		    spacingX: 50,
		    showLabel: true,                  // display branch names on graph
		  },
		  commit: {
		    spacingY: -80,
		    dot: {
		      size: 12
		    },
		    message: {
		      displayAuthor: true,
		      displayBranch: true,
		      displayHash: false,
		      font: "normal 12pt Arial"
		    },
		    shouldDisplayTooltipsInCompactMode: true, // default = true
		    tooltipHTMLFormatter: function ( commit ) {
		      return "" + commit.sha1 + "" + ": " + commit.message;
		    }
		  }
		};

		this.data = new GitGraph({
		  template: myTemplateConfig,
		  orientation: "horizontal",
		  mode: "compact",
		  elementId: elemId
		});

		this.branchList = [];
		this.clickOnCommitCallback = null;
		this.currentBranch = "";
	}

	getBranchList(){
		return this.branchList;
	}

	getBranch(branchName){
		for(var i in this.branchList)
			if(this.branchList[i].name == branchName)
				return this.branchList[i];
		return null;
	}

	addBranch(branchName){
		if(!this.getBranch(branchName))
		{
			var branch = this.data.branch(branchName);
			this.branchList.push(branch);
		}

	}

	commit(msg="No text", sha1="", author="unknown"){
		if(this.branchList.length)
		{
			var that = this;
			this.data.commit({
				sha1: sha1,
				message: msg,
				author: author,
				onClick: function(commit) {
					that.eventClickOnCommit(commit);
				}
			});
		}
	}

	checkout(branchName){
		var branch = this.getBranch(branchName);
		if(branch)
		{
			branch.checkout();
			this.currentBranch = branchName;
		}	
	}

	merge(branch, branchTo, mergeMessage="merge"){
		var branch1 = this.getBranch(branch);
		var branch2 = this.getBranch(branchTo);

		if(branch1 && branch2)
			branch1.merge(branch2, mergeMessage);
	}

	bindClickOnCommit(callback){
		this.clickOnCommitCallback = callback;
	}

	eventClickOnCommit(commit){
		if(this.clickOnCommitCallback)
			this.clickOnCommitCallback(commit);
	}

	setActive(commit){
		for(var i in this.data.commits)
			this.data.commits[i].dotSize = 12;
		commit.dotSize = 15;
		this.refresh();
	}

	delete(branchName){
		var branch = this.getBranch(branchName);
		if(branch)
		{
			branch.delete();

			this.branchList = this.branchList.filter(function(item) {
			    return item !== branch
			});
		}
	}

	refresh(){
		this.data.render();
	}

}
