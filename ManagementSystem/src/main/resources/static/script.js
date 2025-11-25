function showLogin(){

        document.getElementById("btn").style.left="0px";
        document.getElementById("login").style.display="block";
        document.getElementById("registration").style.display="none";
       }

function showRegister(){
        document.getElementById("btn").style.left="110px";
        document.getElementById("login").style.display="none";
        document.getElementById("registration").style.display="block";
       }


function loginbtn(){

      var loginData={
        username: $("#loginEmail").val(),
        password: $("#loginPassoword").val()
      };

        if(loginData.username === "" || loginData.password === ""){
            alert("Please enter your email and password")
            return;
        }

        $.ajax({
          url:"/auth/login",
          type:"POST",
          contentType: "application/json",
          data: JSON.stringify(loginData),
          success: function(response){
              alert("Login Successful !!!");

              localStorage.setItem("token",response);

              window.location.href ="home.html";
            },
            error: function(){
              alert("Login Failed !!!");
            }
        });

        //window.location.href ="home123.html";

}


function registerbtn(){

  var registerData = {
    username: $("#regEmail").val(),
    password: $("#regPassoword").val()
  }

  if(registerData.username === "" || registerData.password ===""){
    alert("please enter the username and password");
    return;
  }

  $.ajax({
    url:"/auth/register",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(registerData),
    success: function(response){
      alert("Registered suceesfully !!!");
      
      window.location.href="index.html";
    },
    error: function(){
      alert("Try Again!!!")
    }
  })
}




