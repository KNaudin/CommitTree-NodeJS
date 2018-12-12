var SERVER = "http://127.0.0.1:5000"
$(document).ready(function() {
	prepareFrontEnd();



	/*
	var data  ={

	};
	$.ajax({
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

	$('body').on('click', '.checkoutButton', function(e) {
	    var branchName = $(e.currentTarget).attr("checkoutName");
		graph.checkout(branchName);
		refreshPage(graph);
	});

	refreshPage(graph);
}

function refreshPage(graph){
	$("#tableBranch").empty();
	for(var b in graph.getBranchList()){
		var branch = graph.getBranchList()[b];
		var supprButton = "<button class='btn btn-warning checkoutButton' checkoutName='"+branch.name+"'>checkout</button>";
		var branchName = (graph.currentBranch == branch.name || graph.getBranchList().length == 1) ? "<b>"+branch.name+"</b>" : branch.name;
		var elem = "<tr><td>"+branchName+"</td><td>"+supprButton+"</td>";

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
		$("#commitPanel_branch").text(commit.branch.name);
		$("#commitPanel_date").text(commit.date);
		$("#commitPanel_SHA1").text(commit.sha1);
		$("#commitPanel_author").text(commit.author);
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
	/*
	graph.addBranch("master");
	var data = {
		data_name : "Main branch",
		commit_message: "Init main branch",
		data : "d",
		branch: "master"
	};
	$.ajax({
		type: "POST",
		crossDomain: true,
		url: SERVER+"/addnode",
		data: JSON.stringify(data),
		success: function(dataReceived, status){
			if(status == "success"){
				if(dataReceived.error !== undefined)
					alert(dataReceived.error);
				else {
					graph.commit(data.commit_message);
					graph.refresh();
				}
			}

		},
		dataType: "json",
		contentType: "application/json"
	});

	graph.currentBranch = "master";*/

	$.ajax({
		type: "GET",
		url: SERVER+"/getallbranches",
		success: function(data, status){
			if(status == "success"){
				for(var b in data)
				{
					var branchData = {
						branch: data[b]
					};
					$.ajax({
						type: "POST",
						url: SERVER+"/getfullbranch",
						data: JSON.stringify(branchData),
						success: function(dataReceived, status){
							if(status == "success"){
								createBranchFromData(graph, branchData.branch, dataReceived[0]);
							}

						},
						dataType: "json",
						contentType: "application/json"
					});
					graph.addBranch(data[b]);
				}
				graph.currentBranch = data[0];
				graph.checkout(graph.currentBranch);
				refreshPage(graph);
			}

		},
		dataType: "json",
		contentType: "application/json"
	});

	return graph;

}

function createBranchFromData(graph, branch, data)
{
	if(data.length > 1){
		createBranchFromData(graph, branch, data[1]);
		graph.checkout(branch);
		graph.commit(data[0].commit_message, data[0].hash , data[0].data);
		graph.refresh();
	}
	else
	{
		graph.checkout(branch);
		graph.commit(data[0].commit_message, data[0].hash , data[0].data);
		graph.refresh();
	}

}

function addNodeForm(graph){
	var data = {
		data_name : $("#inputCommitName").val(),
		commit_message: $("#inputCommitMessage").val(),
		data : $("#inputCommitData").val(),
		author : ($("#inputCommitAuthor").val() ? $("#inputCommitAuthor").val() : "unknown"),
		branch: graph.currentBranch
	};

	if(data.data_name != "" && data.commit_message != "" && data.commit_data != ""){
		$("#addNodeForm")[0].reset();
		$.ajax({
			type: "POST",
			url: SERVER+"/addnode",
			data: JSON.stringify(data),
			success: function(dataReceived, status){
				if(status == "success"){
					if(dataReceived.error !== undefined)
						alert(dataReceived.error);
					else {
						graph.commit(data.commit_message, "", data.author, data.data);
						graph.refresh();
					}
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
			crossDomain: true,
			url: SERVER+"/newbranch",
			data: JSON.stringify(data),
			success: function(dataReceived, status){
				if(status == "success"){
					if(dataReceived.error !== undefined)
						alert(dataReceived.error);
					else {
						graph.addBranch(data.branch);
						graph.checkout(data.branch);
						graph.commit(data.commit_message);
						graph.refresh();

						refreshPage(graph);
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
