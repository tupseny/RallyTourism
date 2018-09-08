//Prevent launching function faster than once in 500ms
let debounced_update = debounce(updateTable, 1000, true);

//On page load
$(document).ready(function () {
    $('#input-new-form').submit(function (e) {
        e.preventDefault();
        fire_ajax_add();
        debounced_update()
    });

    updateTable();
});

//Functions
function fire_ajax_add() {
    let name = $('#new-insertion-name').val();
    let surname = $('#new-insertion-surname').val();

    $.ajax({
        url: "player/add",
        method: "POST",
        data: {name, surname}
    });
}

function updateTable() {
    $(document).ready(function () {
        $.ajax({
            url: "player/get-all",
            method: "GET",
            dataType: "json"
        })
            .done(function (data) {
                refreshTable(data);
            });
    });
}

function refreshTable (data) {
    let id = "table-get-all-players";

    let temp = "<table id='"+id+"'><tr id='table-all-tr'><td>ID</td> <td>NAME</td> <td>SURNAME</td></tr>";
    data.forEach(function (e) {
        temp += "<tr><td id='entity-id'>";
        temp += e.id;
        temp += "</td><td>";
        temp += e.name;
        temp += "</td><td>";
        temp += e.surname;
        temp += "</td><td>";
        temp += "<button type='button' onclick='removeRow(this)'>X</button></td></tr>"
    });
    temp += "</table>";

    $('#'+id).replaceWith(temp);

    console.log("Table is updated");
}

function removeRow(elem) {
    let id = $(elem).parent().parent().find('#entity-id').text();

    $.ajax({
        url: "player/remove",
        method: "POST",
        data: {id}
    }).done(debounced_update());
}

function stressTest(count){
    for (var i = 0; i < count; i++) {
        let string = "test Nr[" + i + "]";

        $.ajax({
            url: "player/test",
            method: "POST",
            data: {string}
        }).done(function (data2) {
            console.log(data2);
            debounced_update();
        });

        console.log("After Ajax: " + string);
    }
}