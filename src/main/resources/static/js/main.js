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

    //Listeners
    //Debugging
    $('#filter-test').on({
        'keyup': event => {
            console.log("filter applied: " + event.target.value);
            doFilterPlayersTable("filter-test");
        }
    });
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
                console.log("Table is updated");
            })
            .fail(function (error) {
                console.warn("Players request is failed: " + error);
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

function genNewTable(titles, id) {
    if (id == null) {
        id="";
    }
    if (titles == null) {
        console.warn("Titles is null! Table is not generated");
        return;
    }

    const gen = new HtmlGenerator();
    const titleRowId = "id='title-row'";
    const removeBut = gen.button_start("removeRow(this)") + "X" + gen.BUTTON_END;

    //Table
    let newTable = gen.table_start("id='"+id+"'");

    //Row of filters
    //TODO: Generate filter input fields above each column

    //Title row
    let titleRow = gen.row_start("id='"+titleRowId+"'");
    titles.forEach(function (key) {
        key = key.trim();
        titleRow += gen.col_start("id='title-" + key.toLowerCase() + "'");
        titleRow += key.toUpperCase();
        titleRow += gen.COL_END;
    });
    titleRow += gen.ROW_END;

    //data rows
    let dataRows = "";
    //foreach element of JSON data
    data.forEach(function (e) {
        //start row
        dataRows += gen.row_start();

        //foreach element by key
        titles.forEach(function (key) {
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

    return newTable;
}

function refreshTable (data) {
    const tableId = "table-get-all-players";
    const titles = getJSONKeys(JSON.stringify(data));

    const table = genNewTable(titles, tableId);

    $('#'+tableId).replaceWith(table);
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
        this._HTML_INPUT = "input";

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

    text_field(properties){
        if (properties == null) {
            properties = "";
        }
        return this._HTML_START + this._HTML_INPUT + ' type="text" ' + properties + this._HTML_END;
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