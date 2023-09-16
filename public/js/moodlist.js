document.addEventListener("DOMContentLoaded", checkIfLogged);

function checkIfLogged() {
    fetch(`${userApi}/token`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
       if (!data.loggedin) {
        window.location.href = "index.html";
       } else {
        document.body.style.display = 'block';
        drawTable();
       }
     })
    .catch(error => console.log(error));
}

function drawTable() {
    var table = $('#moodlistTable').DataTable({
        "language": {
            "emptyTable": "No moods currently logged! Check back after recording a mood log."
          },
        "autoWidth": false,
        "ajax": {
            url: `${moodApi}`,
            type: "GET",
            dataType: 'json',
            credentials: 'include',
            contentType: 'application/json',
            dataSrc: function (json) {
                if (!json.data) {
                    return [];
                } else {
                    return json.data;
                }
            }
        },  
        columnDefs: [
            { width: "15%", target: 0 },
            { width: "10%", target: 1 },
            { width: "10%", target: 2 },
            { width: "5%", target: 4 },
            { width: "5%", target: 5 },
        ],
        order: [[ 0, 'desc' ]], 
        "columns": [
            {
                "data": "datetime",  
            },
            {
                "data": "mood", render: $.fn.dataTable.render.text() ,
            },
            {
                "data": "rating", render : function (data) { 
                    switch (data) {
                        case 1:
                            return "<input type='image' value='1' height='40px' src='/img/1.png'>"
                        case 2:
                            return "<input type='image' value='2' height='40px' src='/img/2.png'>"
                        case 3:
                            return "<input type='image' value='3' height='40px' src='/img/3.png'>"
                        case 4:
                            return "<input type='image' value='4' height='40px' src='/img/4.png'>"
                        case 5:
                            return "<input type='image' value='5' height='40px' src='/img/5.png'>"
                    }
                },
            },
            {
                "data": "context", render: $.fn.dataTable.render.text(),
            },
            {
                "render": function () { 
                    return "<a class='btn' title='Edit Context' id='edit'><i class='bi bi-pencil-square'></i></a>";
                },
            },
            {
                "render": function () { 
                    return "<a class='btn' title='Delete Entry' id='delete'><i class='bi bi-x-circle'></i></a>";
                },
            },
        ],
        
        "error": function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
        }
    }); 
                  
    $('#contextEdit').on('hidden.bs.modal', function() {
        $("#dateLogged").html("");
        $("#moodEditLog").html("");
        $("#contextEditId").html("");
        $("#updateId").val();
        $("#moodList").toggle();
    });
                
    $('#moodlistTable').on('click', '#edit', function () {
        var data = table.row($(this).parents('tr')).data();
        var mood = data.mood;
        var context = data.context;
        var id = data.moodlog_id;
        var date = data.datetime;
                
        $('#moodList').hide();
        $("#dateLogged").val(date);
        $("#moodEditLog").val(mood);
        $("#contextEditId").val(context);
        $("#updateId").val(id);
        $('#contextEdit').modal('show');
    });
                
    $('#editContextSubmit').on('click', function(e) {
        e.preventDefault();
        let newContext = $("#contextEdit").find('#contextEditId').val();
        let updateId = $("#contextEdit").find('#updateId').val();
         
        if (newContext === "" || newContext === null) {
            newContext = " ";
        }
        
        $.ajax({ 
            url: `${moodApi}/${updateId}`,  
            method: 'PUT',
            contentType: "application/json",
            data: JSON.stringify({
                "context": newContext
            }),
            success: function() 
            {    
                $("#contextEdit").modal('hide');
                $("#moodlogEdit").modal('toggle');
            },
            error: function (xhr, status, error) {
                alert(error);
            },
            complete: function () {
                table.ajax.reload();
            }
        });
    });
                
    $('#moodlistTable').on('click', '#delete', function () {
        var data = table.row($(this).parents('tr')).data();
        var id = data.moodlog_id;
                
        $.ajax({ 
            url: `${moodApi}/${id}`,  
            method: 'DELETE',
            success: function() 
            {   
                $('#moodlogDelete').modal('toggle');
            },
            error: function (xhr, status, error) {
                alert(error);
            },
            complete: function () {
                table.ajax.reload();
            }
        }); 
    });

    $('#editClose').on('click', function() {
        $("#moodlogEdit").modal('hide');
    });

    $('#deleteClose').on('click', function() {
        $('#moodlogDelete').modal('hide');
    });
};


