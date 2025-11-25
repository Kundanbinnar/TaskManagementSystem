$(document).ready(function(){

    $('#addTaskBtn').click(function(){
       $('#addTaskForm').fadeIn();
    });


    $('#closeForm').click(function(){

        $("#addTaskForm").fadeOut();
        
    })

    $('#addTaskForm').submit(function(e){

        alert("Task Saved !!!");
        $("#addTaskForm").fadeOut();
    })

    $("#viewTaskBtn").click(function(){
        $("#ViewTask").fadeIn();
    })






});