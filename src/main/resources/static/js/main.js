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

//    Debugging
    JSONArray = sessionStorage.getItem("players");
    console.log(getJSONKeys(JSONArray));
});

//On... events
$('#filterField').change(function () {
//TODO: filter table when input field is edited
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
                savePlayersIntoSession(JSON.stringify(data));
                refreshTable(data);
            });
    });
}

function getJSONKeys(JSONarray) {
    const data = JSON.parse(JSONarray);
    let keys = [];

    for(let key in data[0]){
        if (keys.indexOf(key) === -1) {
            keys.push(key);
        }
    }

    return keys;
}

function refreshTable (data) {
    const gen = new HtmlGenerator();
    const tableId = "table-get-all-players";
    const titleRowId = "id='title-row'";

    const removeBut = gen.button_start("removeRow(this)") + "X" + gen.BUTTON_END;
    const keys = getJSONKeys(JSON.stringify(data));

    //Table
    let newTable = gen.table_start("id='"+tableId+"'");

    //Title row
    //TODO: Generate filter input fields above each column
    let titleRow = gen.row_start("id='"+titleRowId+"'");
    keys.forEach(function (key) {
        key = key.trim();
        titleRow += gen.col_start("id='title-" + key.toLowerCase() + "'");
        titleRow += key.toUpperCase();
        titleRow += gen.COL_END;
    });
    titleRow += gen.ROW_END;

    let dataRows = "";
    //foreach element of JSON data
    data.forEach(function (e) {
        //start row
        dataRows += gen.row_start();

        //foreach element by key
        keys.forEach(function (key) {
            dataRows += gen.col_start("id='entity-"+key+"'");
            dataRows += e[key];
            dataRows += gen.COL_END;
        });

        //add remove button
        dataRows += gen.col_start();
        dataRows += removeBut;
        dataRows += gen.COL_END;

        //end row
        dataRows += gen.ROW_END;
    });

    newTable += titleRow;
    newTable += dataRows;
    newTable += gen.TABLE_END;

    $('#'+tableId).replaceWith(newTable);

    console.log("Table is updated");
}

function removeRow(elem) {
    let id = $(elem).parent().parent().find('#entity-id').text();
    console.log("Sent request for deleting (ID: " + id + ")");

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

function savePlayersIntoSession(JSONArray) {
    console.log("Loaded players to cache");
    sessionStorage.setItem("players", JSONArray);
}

//classes
class HtmlGenerator{
    constructor() {
        this._HTML_START = "<";
        this._HTML_END = ">";
        this._HTML_TAG_END = "/";
        this._HTML_TABLE = "table";
        this._HTML_ROW = "tr";
        this._HTML_COL = "td";
        this._HTML_BUTTON = "button";

        this._TABLE_END = this._HTML_START + this._HTML_TAG_END + this._HTML_TABLE + this._HTML_END;
        this._ROW_END = this._HTML_START + this._HTML_TAG_END + this._HTML_ROW + this._HTML_END;
        this._COL_END = this._HTML_START + this._HTML_TAG_END + this._HTML_COL + this._HTML_END;
        this._BUTTON_END = this._HTML_START + this._HTML_TAG_END + this._HTML_BUTTON + this._HTML_END;
    }

    get TABLE_END() {
        return this._TABLE_END;
    }

    get ROW_END() {
        return this._ROW_END;
    }

    get COL_END() {
        return this._COL_END;
    }

    get BUTTON_END() {
        return this._BUTTON_END;
    }

    table_start(properties){
        if (properties == null) {
            properties = "";
        }
        return this._HTML_START + this._HTML_TABLE + " " + properties + this._HTML_END;
    }

    row_start(properties) {
        if (properties == null) {
            properties = "";
        }
        return this._HTML_START + this._HTML_ROW + " " + properties + this._HTML_END;
    }

    col_start(properties){
        if (properties == null) {
            properties = "";
        }
        return this._HTML_START + this._HTML_COL + " " + properties + this._HTML_END;
    }

    button_start(properties, onclick){
        if (onclick == null) {
            onclick = properties;
            properties = "";
        }
        return this._HTML_START + this._HTML_BUTTON + " " + properties + " type='button' onclick='" + onclick + "'" + this._HTML_END;
    }
  }