$(document).ready(function(){

    $('#addTaskBtn').click(function(){
       $('#addTaskForm').fadeIn();
    });


    $('#closeForm').click(function(){

        $("#addTaskForm").fadeOut();
        
    })

    $('#addTaskForm').submit(function(e){

        //alert("Task Saved !!!");
        //$("#addTaskForm").fadeOut();
		e.preventDefault();
		addTask();
    })

    $("#viewTaskBtn").click(function(){
        $("#ViewTask").fadeIn();
    })




});


    function addTask(){

        var addData = {
            name: $("#taskName").val(),
            description: $("#description").val(),
            status: $("#taskStatus").val(),
            date: $("#dueDate").val()
        }

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
			url:"http://localhost:8080/tasks",
			type: "GET",
			contentType: "application/json",
			success: function(data){
				
				populateTable(data);
			},
			error: function(xhr){
				console.log("Error fetching tasks:", xhr.responseText);
			}
		});
	}
	
/*	function populateTable(data){
		
		if($.fn.DataTable.isDataTable("#taskTable")){
			$('#taskTable').DataTable().destroy();
		}
		
		$("#taskTable").empty();
		
		data.forEach(function(task){
			let row = `<tr>
			<td>
			<button>Delete</button>
			<button>Delete</button>
			</td>
			<td>${task.name}</td>
			            <td>${task.description}</td>
			            <td>${task.status}</td>
			            <td>${task.date || ''}</td>
						</tr>`;
						$("#taskTable tbody").append(row);
		});
		
	}*/