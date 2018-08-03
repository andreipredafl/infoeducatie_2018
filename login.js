var base_domain="http://localhost:8000";
$(document).ready(function(){




    $("#login-btn").click(function(){
        $.post(base_domain+"/api/login",{
            email:$("#email-login").val(),
            password:$("#pwd-login").val()
        }, function(data){
            var user_data=JSON.parse(data);
            if(user_data.ok==1) {
                localStorage.setItem("email", user_data.email);
                localStorage.setItem("token", user_data.token);
                localStorage.setItem("projects", user_data.projects);
                window.location = "index.html";
            }else{
                alert(user_data.reason);
            }
        });
    });

    $("#register-btn").click(function(){
        $.post(base_domain+"/api/register",{
            email:$("#email-register").val(),
            password:$("#pwd-register").val(),
            password_confirm:$("#pwd-confirm-register").val()
        }, function(data){
            var data=JSON.parse(data);
            if(data.ok==1){
                alert("Account created successfully! Please login using previous credentials!");
            }else{
                alert(data.reason);
            }
        });
    });


    if(localStorage.getItem("token")===null){
        return 0;
    }

    if(localStorage.getItem("email")===null){
        return 0;
    }
    var ok=0;
    $.ajax({
        url:base_domain+"/api/login/token/"+localStorage.getItem("token")+"/"+localStorage.getItem("email"),
        success: function (result) {
            var result=JSON.parse(result);
            if(result.ok==1) {
                localStorage.setItem("projects",result.projects)
                ok=1
                window.location="index.html";
            }else{
                alert(data.reason);
            }
        },
        async: false
    });

    if(ok==0){
        return 0;
    }
})