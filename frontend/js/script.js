$(document).ready(function() {
	$("#commitPanel").hide();
	var graph = createGraph();

	$("#test").on("click", function(){
		graph.refresh();
	});

	$("#addNodeButton").on("click", function(event){
		event.preventDefault();
		addNodeForm(graph);
	}); 

	$("#addBranchButton").on("click", function(event){
		event.preventDefault();
		addBranchForm(graph);
	}); 
	
});

function createGraph()
{
	var graph = new Graph("gitgraph");
	graph.bindClickOnCommit(function(commit){
		graph.setActive(commit);
		$("#commitPanel").show();
		$("#commitPanel_name").text(commit.message);
	})

	graph.addBranch("master");
	graph.commit("test");
	graph.commit("Premeir jet", "595+26", "Romain BOURG");
	graph.addBranch("Developpement");
	graph.commit("backend");
	graph.commit("frontend");

	graph.checkout("master");
	graph.commit("Coin");
	graph.commit("merge preparation");

	graph.addBranch("crise");
	graph.commit("Nothing to see here");

	graph.merge("Developpement", "master")
	graph.checkout("Developpement");
	graph.commit("coin");
	graph.merge("crise", "master");
	graph.merge("Developpement", "master");
	graph.delete("Developpement");
	graph.delete("crise");
	graph.checkout("master");

	return graph;

}

function addNodeForm(graph){
	var data = {
		data_name : $("#inputCommitName").val(),
		commit_message: $("#inputCommitMessage").val(), 
		data : $("#inputCommitData").val()
	};

	if(data.data_name != "" && data.commit_message != "" && data.commit_data != ""){
		$("#addNodeForm")[0].reset();
		$.ajax({
		type: "POST",
		url: "http://127.0.0.1:8080/addnode",
		data: JSON.stringify(data),
		success: function(data, status){
			if(status == "success"){
				graph.commit(data.commit_message);
				graph.refresh();
			}

		},
		dataType: "json",
		contentType: "application/json"
	});
	}
}

function addBranchForm(graph){
	var data = {
		branch_name : $("#inputBranchName").val(),
	};
	if(data.branch_name != "")
	{
		$("#addBranchForm")[0].reset();
		console.log("ajout branch "+data.branch_name);
		graph.addBranch(data.branch_name);
		graph.refresh();
	}
}