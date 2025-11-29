$(document).ready(function(){

    $('#addTaskBtn').click(function(){
       $('#addTaskForm').fadeIn();
	   clearForm();
	   $("#addTaskForm").data('task-id', '');
    });


    $('#closeForm').click(function(){

        $("#addTaskForm").fadeOut();
        
    })

    $('#addTaskForm').submit(function(e){
		e.preventDefault();
		addTask();
    })

    $("#viewTaskBtn").click(function(){
        $("#ViewTask").fadeIn();
		viewTask();
    })
	
	$('#taskTable tbody').on('click', '.editBtn', function(){
		let editingTaskID = $(this).data('id');
		editTask(editingTaskID);
	});

	
	window.taskTable = $("#taskTable").DataTable({ // uppercase D
	    aaSorting: [],
	    bPagination: false,
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

		
function populateTable(data){
		
       let table = window.taskTable;
	   table.clear();
 
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
                 `<button class="btn btn-success editBtn" id="editTask_${task.id}">Edit </button>
                 <button class="btn btn-danger" id="deleteTask_${task.id}">Delete </button>`,
				 task.name,
				 task.description,
				 task.status,
				 formattedDate	
			];
			
			table.row.add(row);
		});
		table.draw(); 
		
	}
	
	
    let editingTaskID=null;
	function editTask(taskID){
		
		console.log("Edit task ID: ", taskID);
		
		$.ajax({
			url:`http://localhost:8080/tasks/${taskId}`,
			type: "GET",
			contentType: "application/json",
			headers:{
				"Authorization": "Bearer " + localStorage.getItem("token")
			},
		
			Success: function(task){
				$("#taskName").val(task.name);
				$("#description").val(task.description);
				$("#taskStatus").val(task.status);
			    $("#dueDate").val(task.dueDate);
		        $("#addTaskForm").fadeIn();
			}
		});
	}
	

	function deleteTask(taskID){
		
		if(confirm("Delete this task?")){
			$.ajax({
				url: "http://localhost:8080/tasks/${taskId}",
				type: "DELETE",
				headers: {
					"Authorization": "Bearer " + localStorage.getItem("token")
				},
				success: function(){
					alert("Task deleted sucessfully !!!");
					viewTask();
				},
				error: function(xhr){
					alert("Wrong");
					console.log("Delete failed", xhr.responseText);
				}
			})
		}
	}