
let editingTaskID = null;

$(document).ready(function(){

    $('#addTaskBtn').click(function(){
       $('#addTaskForm').fadeIn();
	   clearForm();
	   $("#addTaskForm").data('task-id', '');
    });


    $('#closeForm').click(function(){

        $("#addTaskForm").fadeOut();
        
    })


	//add and update	
    $('#addTaskForm').submit(function(e){
		e.preventDefault();
		
		const taskData = {
			name: $('#taskName').val(),
			description: $('#description').val(),
			status: $('#taskStatus').val(),
			dueDate: $('#dueDate').val()
			};
			
			if(editingTaskID){
				$.ajax({
					
					url: `http://localhost:8080/tasks/${editingTaskID}`,
					type: "PUT",
					contentType: "application/json",
					headers: {
						"Authorization": "Bearer " + localStorage.getItem("token")
					},
					data: JSON.stringify(taskData),
					success:function(res){
						alert("Task Updated Successfully !!!");
						$('#addTaskForm').fadeOut();
						viewTask();
						editingTaskID = null;
					}
				});
			}
		    else{
				
				$.ajax({
					
					url: "http://localhost:8080/tasks",
					type: "POST",
					contentType: "application/json",
					headers: {
						"Authorization": "Bearer " + localStorage.getItem("token") 
					},
					data:JSON.stringify(taskData),
					success:function(response){
						alert("Task Added Successfully");
						$('#addTaskForm').fadeOut();
						 viewTask();
					} ,
				    error:function(xhr){

		                 alert("Something went Wrong !!!");
					     console.log(xhr.responseText);
					 }
				})
			}
		
    })

    $("#viewTaskBtn").click(function(){
        $("#ViewTask").fadeIn();
		$("#taskListContent").fadeIn();
		$("#summaryContent").hide();
		
		$(".taskListTab").addClass("active");
		$(".summaryTab").removeClass("active");
		viewTask();
		
		
		
		$(".taskListTab").click(function(){
			$(this).addClass("active");
			$(".summaryTab").removeClass("active");
			

			$("#taskListContent").fadeIn();
			$("#summaryContent").fadeOut();
		});
		
		$(".summaryTab").click(function(){
			$(this).addClass("active");
			$(".taskListTab").removeClass("active");

		    $("#summaryContent").fadeIn();
			$("#taskListContent").fadeOut();
			$(".watermark").fadeOut();
			renderSummaryChart(taskDataGraph);
			renderSummaryPieChart(taskDataGraph);
			});
    });
	
	
	$('#taskTable tbody').on('click', '.editBtn', function(){
		let editingTaskID = $(this).data('id');
		editTask(editingTaskID);
	});

	$('#taskTable tbody').on('click', ".deleteBtn", function(){
		let deleteID = $(this).data('id');
		deleteTask(deleteID);
	})
	
	//table creation
	window.taskTable = $("#taskTable").DataTable({ // uppercase D
	    aaSorting: [],
	    bPagination: true,
		pageLength:5,
	    bLengthChange:false,
	    searching: true,
	    info: false,
		oLanguage: {
				sSearch: "",
				sInfoEmpty: "",
				sInfoFiltered: "" 
			},
			
	    columns: [ // you can also switch from aoColumns -> columns
	        { width: '10%', searchable: false, sortable: false },
	        { width: '20%' },
	        { width: '40%' },
	        { width: '15%' },
	        { width: '15%' }
	    ]
	});

	$('.dataTables_filter input').attr('placeholder', 'Search');
	
	
	
});


//function to add task just for refrence 
 function addTask(){

        var addData = {
            name: $("#taskName").val(),
            description: $("#description").val(),
            status: $("#taskStatus").val(),
            dueDate: $("#dueDate").val()
        };

        $.ajax({

            url: "http://localhost:8080/tasks",
            type: "POST",
            contentType: "application/json",
			headers:{
				"Authorization": "Bearer " + localStorage.getItem("token") 
			},
            data:JSON.stringify(addData),
            success:function(response){

                alert("Task added Successfully!!!");
				
				$("#taskName, #description, #taskStatus, #dueDate").val(""); 
            },
            error:function(xhr){

                alert("Something went Wrong !!!");
                console.log(xhr.responseText);
            }
        });
    }
	
	
	//view table
	function viewTask(){
		
		$.ajax({
			url:"http://localhost:8080/tasks/my-tasks",
			type: "GET",
			contentType: "application/json",
			headers: {
			           "Authorization": "Bearer " + localStorage.getItem("token")
			       },
			success: function(data){
				
				populateTable(data);
			},
			error: function(xhr){
				console.log("Error fetching tasks:", xhr.responseText);
			}
		});
	}


let taskDataGraph = [];	
	//populate the table	
function populateTable(data){
		
       let table = window.taskTable;
	   table.clear();
	   taskDataGraph = [];
	   
	   
	  if (!data || data.length === 0) {
	      table.row.add([
	          "",
	          "<span style='display:block; text-align:center;'>No Data Available</span>",
	          "",
	          "",
	          ""
	      ]);
		  table.draw();
	      return;
	  }
	  
		data.forEach(task=> {
			
			let formattedDate = task.dueDate ? task.dueDate : ""; 
			
			let row = [
                 `<button class="btn btn-success editBtn" data-id="${task.id}">Edit </button>
                 <button class="btn btn-danger deleteBtn" data-id="${task.id}">Delete </button>`,
				 task.name,
				 task.description,
				 task.status,
				 formattedDate	
			];
			
			table.row.add(row);
			
			taskDataGraph.push({
					name:task.name,
					status:task.status
				});
			
		});
		table.draw(); 
		
	}
	

	//edit the btn and shows pre-fill form 
	function editTask(taskID){
		
		console.log("Edit task ID: ", taskID);
		
		$.ajax({
			url:`http://localhost:8080/tasks/${taskID}`,
			type: "GET",
			contentType: "application/json",
			headers:{
				"Authorization": "Bearer " + localStorage.getItem("token")
			},
		
			success: function(task){
				
				editingTaskID = taskID;
				console.log("Status from backend:", task.status);

				$("#taskName").val(task.name);
				$("#description").val(task.description);
				$("#taskStatus").val(task.status);
			    $("#dueDate").val(task.dueDate);
		        $("#addTaskForm").fadeIn();
			}
		});
	}
	

	//delete btn function
	function deleteTask(deleteID){
		
		if(confirm("Delete this task?")){
			$.ajax({
				url: `http://localhost:8080/tasks/${deleteID}`,
				type: "DELETE",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("token")
				},
				success: function(res){
					alert("Task deleted sucessfully !!!");
					viewTask();
				},
				error: function(xhr){
					alert("Wrong");
					console.log("Delete failed", xhr.responseText);
				}
			});
		}
	}
	
	
	
	//clear's the form for adding new task
	function clearForm(){
		
		$("#taskName").val('');
		$("#description").val('');
		$("#taskStatus").val('');
	    $("#dueDate").val('');
		
		editingTaskID = null;
	}
	
	
	function renderSummaryChart(tasks){
		
		const pending = tasks.filter(t=>t.status === "Pending").length;
		const inProgess = tasks.filter(t=>t.status === "In Progress").length;
		const complete = tasks.filter(t=>t.status === "Completed").length;
		
		const ctx = document.getElementById("barChart").getContext("2d");
		
		if(window.taskChart instanceof Chart) {
			window.taskChart.destroy();
			}
		
		window.taskChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: ['Pending', 'In Progress', 'Completed'],
				datasets: [{
					label: 'Task Summary',
					data: [pending, inProgess, complete],
					backgroundColor: [
					                   'rgba(255, 159, 64)',   // pending
					                   'rgba(54, 162, 235)',   // in progress
					                   'rgba(75, 192, 192)'    // completed
					               ],
					               borderColor: [
					                   'rgba(255, 159, 64, 1)',
					                   'rgba(54, 162, 235, 1)',
					                   'rgba(75, 192, 192, 1)'
					               ],
					               borderWidth: 2
				}]
			},
			
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
				                legend: {
				                   
									labels: {font: {size:30}}
				                },
								title: {
									display: true, text: 'Task Status Summary', font: { size: 32}
								}
				            },
				scales: {
					x: {
					     ticks: {
					     font: { size: 22, weight: 'bold' }
					            }
					        },
				     y: {
				          beginAtZero: true
				      }
				  }
			}
		});
		
		
	}
	
	
	function renderSummaryPieChart(tasks) {

	    const pending = tasks.filter(t => t.status === "Pending").length;
	    const inProgress = tasks.filter(t => t.status === "In Progress").length;
	    const complete = tasks.filter(t => t.status === "Completed").length;

	    const piectx = document.getElementById("pieChart").getContext("2d");

	    if (window.taskChart1 instanceof Chart) {
	        window.taskChart1.destroy();
	    }

	    window.taskChart1 = new Chart(piectx, {
	        type: "pie",
	        data: {
	            labels: ["Pending", "In Progress", "Completed"],
	            datasets: [{
	                data: [pending, inProgress, complete],
	                backgroundColor: [
	                    "rgba(255, 159, 64)",   // Pending
	                    "rgba(54, 162, 235)",   // In Progress
	                    "rgba(75, 192, 192)"    // Completed
	                ],
	                borderColor: [
	                    "rgba(255, 159, 64, 1)",
	                    "rgba(54, 162, 235, 1)",
	                    "rgba(75, 192, 192, 1)"
	                ],
	                borderWidth: 1
	            }]
	        },
	        options: {
	            responsive: true,
	            plugins: {
	                legend: {
	                    position: "bottom",
						labels: {font: {size: 24, weight: 'bold' }}
	                },
					title: {
						display: true, text: 'Task Status Summary', font: { size: 32}
					}
	            }
	        }
	    });
	}
