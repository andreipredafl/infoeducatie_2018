//Initialize projects
var projects;
var base_domain="http://localhost:8000";
if (localStorage.getItem("projects") === null) {
    projects = [];
} else {
    projects = JSON.parse(localStorage.getItem("projects"));
}


$(document).ready(function () {
    //Autologin by token stored local
    var ok=0;
    $.ajax({
        url:base_domain+"/api/login/token/"+localStorage.getItem("token")+"/"+localStorage.getItem("email"),
        success: function (result) {
            var result=JSON.parse(result);
            if(result.ok==1) {
                localStorage.setItem("projects",result.projects)
                ok=1
            }else{
                alert(data.reason);
            }
        },
        async: false
    });

    if(ok==0){
        return 0;
    }


    displayProjects();
    $("#add-new-project").click(function () {
        addProject($("#project_name").val());
        $("#project_name").val("");
    });

    $(document).on('click', '.remove-project', function () {
        removeProject(this.dataset.id)
    });

    $(document).on('click', '.remove-task', function () {
        removeTask(this.dataset.id, this.dataset.project_id);
    });

    $(document).on('click', '.add-task', function () {
        var project_id = $(".add-task").index(this);
        var name = $(".task-name").eq(project_id).val();
        var priority = $(".task-priority").eq(project_id).val()
        addTask(project_id, name, priority);
    });

    $(".search-stack-overflow").click(function () {
        var win = window.open('https://stackoverflow.com/search?q=' + projects[this.dataset.project_id].tasks[this.dataset.id].name, "_blank");
        win.focus();
    });

    $(".search-google").click(function () {
        var win = window.open('https://www.google.ro/search?q=' + projects[this.dataset.project_id].tasks[this.dataset.id].name, "_blank");
        win.focus();
    });

    $("#search-button-text").click(function () {
        var text = $("#search-text").val();
        if ($('#stack-checkbox-search-text').is(':checked')) {
            var win = window.open('https://stackoverflow.com/search?q=' + text, "_blank");
            win.focus();
        } else if ($('#google-checkbox-search-text').is(':checked')) {
            var win = window.open('https://www.google.ro/search?q=' + text, "_blank");
            win.focus();
        }
    });
});


//Function Add project
function addProject(name) {
    if(name.trim()==""){
        alert("Please enter a valid name!");
        return 0;
    }
    projects.push({"name": name, "tasks": []});
    //Save persistent data for projects
    syncWithServerLocalStorage();
    displayProjects();
}

function syncWithServerLocalStorage(){
    localStorage.setItem("projects", JSON.stringify(projects));
    $.post(base_domain+"/api/user/update-projects/"+localStorage.getItem("email")+"/"+localStorage.getItem("token"),{projects:JSON.stringify(projects)},function(data){
       var data=JSON.parse(data);
       alert(data.reason);
    });
}

//Function for remove project
function removeProject(id) {


    if (id > -1) {
        projects.splice(id, 1);
    }
    syncWithServerLocalStorage()
    displayProjects();
}

function removeTask(id, project_id) {
    console.log(project_id);
    console.log(id);
    if (id > -1) {
        projects[project_id].tasks.splice(id, 1);
    }
    syncWithServerLocalStorage()
    displayProjects();
}

function addTask(project_id, name, priority) {
    if(name.trim()==""){
        alert("Please enter a valid name!");
        return 0;
    }

    if(priority.trim()==""){
        alert("Please choose a priority!");
        return 0;
    }
    projects[project_id].tasks.push({"name": name, "priority": priority});
    syncWithServerLocalStorage()
    displayProjects();
}


//Function for displaying projects
function displayProjects() {

    $("#projects").html("");
    for (var i = 0; i < projects.length; i++) {
        //Add projects
        $("#projects").append("<div class=\"card\" style=\"width: 100%; padding: 20px; border-radius: 5px;\">\n" +
            "  <div class=\"card-body\">" +
            "<a style=\"text-decoration: none;margin-top: 10px;margin-bottom: 10px;\" href=\"#project" + i + "\"\n" +
            "               class=\"form-control\" data-toggle=\"collapse\"> <span\n" +
            "                    style=\"font-weight: 600; font-size: 30px\">+</span>&nbsp;&nbsp; " + projects[i].name + "</a>\n" +
            "            <div id=\"project" + i + "\" class=\"collapse\"\n" +
            "                 style=\"text-indent: 20px; margin-top: 10px;margin-bottom: 10px; \">\n" +
            "<div class=\"row task-add\">\n" +
            "        <div class=\"col-md-12\">\n" +
            "<hr style='border: solid white 1px'>" +
            "            <div class=\"form-group\">\n" +
            "                <input type=\"text\"  class=\"form-control task-name\" placeholder=\"Name of task...\">\n" +
            "            </div>\n" +
            "<div class='form-group priority'>" +
            "<select class='form-control task-priority'>" +
            "<option value=''>--Select a priority--</option>" +
            "<option value='danger' style='color: darkred'>High priority</option>" +
            "<option value='warning' value='danger'>Medium priority</option>" +
            "<option value='info'>Low priority</option>" +
            "</select>" +
            "<hr style='border: solid white 1px'>" +
            "</div>" +
            "            <div class=\"form-group\" style=\"text-align: center;\">\n" +
            "                <button class=\"btn btn-info add-task\" >+ Add Task</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>" +
            "           <p style='text-align: center'> <span style='color: red; font-weight: 600; text-align: center; font-size: 30px' data-id='" + i + "' class='remove-project'>x</span></p></div></div></div>");

        //Add tasks to projects
        for (var j = 0; j < projects[i].tasks.length; j++) {
            $("#project" + i).prepend("<a style=\"text-decoration: none; text-align: left;\" class=\"form-control btn btn-" + projects[i].tasks[j].priority + "\"> " +
                "<span style='color: red; font-weight: 600; text-align: center; font-size: 20px' data-project_id='" + i + "' data-id='" + j + "' class='remove-task'>x</span> " + projects[i].tasks[j].name + " " +
                "<span class='search-stack-overflow' data-project_id='" + i + "' data-id='" + j + "'>" +
                "<i style='color: white; font-size: 20px' class='fab fa-stack-overflow'></i>" +
                "</span>" +
                "<span class='search-google' data-project_id='" + i + "' data-id='" + j + "'>" +
                "<i style='color: white; font-size: 20px' class='fab fa-google'></i>" +
                "</span>" +
                "</a>");
        }


    }
}
