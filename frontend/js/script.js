var SERVER = "http://127.0.0.1:5000"
$(document).ready(function() {
	prepareFrontEnd();

	var data = {

	};
	/*$.ajax({
		type: "POST",
		url: SERVER+"/newbranch",
		data: JSON.stringify(data),
		success: function(data, status){
			if(status == "success"){
				graph.commit(data.commit_message);
				graph.refresh();
			}

		},
		dataType: "json",
		contentType: "application/json"
	});*/
});

function prepareFrontEnd(){
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


	for(var b in graph.getBranchList()){
		var branch = graph.getBranchList()[b];
		var supprButton = "<i class='glyphicon glyphicon-trash'></i>";
		var elem = "<tr><td>"+branch.name+"</td><td>"+supprButton+"</td>";
		$("#tableBranch").append(elem);
	}
}

function createGraph()
{
	var graph = new Graph("gitgraph");
	graph.bindClickOnCommit(function(commit){
		graph.setActive(commit);
		$("#commitPanel").show();
		$("#commitPanel_name").text(commit.message);
	})

	/*graph.addBranch("master");
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
	//graph.delete("crise");
	graph.checkout("master");*/
	graph.addBranch("master");
	var data = {
		data_name : "Main branch",
		commit_message: "Init main branch",
		data : "d"
	};
	$.ajax({
		type: "POST",
		url: SERVER+"/addnode",
		data: JSON.stringify(data),
		success: function(dataReceived, status){
			if(status == "success"){
				graph.commit(data.commit_message);
				graph.refresh();
			}

		},
		dataType: "json",
		contentType: "application/json"
	});

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
			url: SERVER+"/addnode",
			data: JSON.stringify(data),
			success: function(dataReceived, status){
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
		branch : $("#inputBranchName").val(),
		commit_message: "Creation of branch "+$("#inputBranchName").val(),
		data_name: "Branch Creation",
		data: ''
	};
	if(data.branch != "")
	{
		$("#addBranchForm")[0].reset();
		$.ajax({
			type: "POST",
			url: SERVER+"/newbranch",
			data: JSON.stringify(data),
			success: function(dataReceived, status){
				if(status == "success"){
					if(dataReceived.error !== undefined) alert(dataReceived.error);
					else {
						graph.addBranch(data.branch);
						graph.commit(data.commit_message);
						graph.refresh();
					}
				}

			},
			error: function (xhr, ajaxOptions, thrownError) {
		    	alert(xhr.status);
		        alert(thrownError);
		    },
			dataType: "json",
			contentType: "application/json"
		});
	}
}
