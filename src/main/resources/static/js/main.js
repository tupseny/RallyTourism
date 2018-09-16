//Prevent launching function faster than once in 'n' ms
let debounced_update = debounce(updateTable, 1000, true);

//On page load
//Listeners
$(document).ready(function () {
    $('#input-new-form').submit(function (e) {
        e.preventDefault();
        fire_ajax_add();
        debounced_update()
    });

    updateTable();

    applyFiltersTable();
    //Listeners
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

function genNewTable(data, titles, id) {
    if (data == null) {
        console.warn("No data for update! Table is not generated");
        return;
    }
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

    //Title row
    let titleRow = gen.row_start(titleRowId);
    titles.forEach(function (key) {
        key = key.trim();
        titleRow += gen.col_start("id='title-" + key.toLowerCase() + "'");
        titleRow += key.toUpperCase();
        titleRow += gen.COL_END;
    });
    titleRow += gen.ROW_END;

    //Data rows
    let dataRows = "";
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

    const table = genNewTable(data, titles, tableId);

    //check filters in session
    let filters = sessionStorage.getItem("filters");
    if (filters == null) {
        let newFilters = {};
        titles.forEach(e => {
            newFilters[e] = "";
        });
        sessionStorage.setItem("filters", JSON.stringify(newFilters));
    }

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

function applyFilterListeners() {
    $(document).ready(function () {
        const titles = getJSONKeys(sessionStorage.getItem("players"));
        titles.forEach(key => {
            console.log("filter-" + key);
            $('#filter-' + key).keyup(function (event) {
                console.log("Filter: " + key + "; Key: " + event.target.value);
                loadFilterIntoSession(key, event.target.value);
                doFilterPlayersTable("filter-" + key, key);
            });
        });
    })
}

function loadFilterIntoSession(key, value) {
    let filters = sessionStorage.getItem("filters");
    if (filters == null) {
        console.warn("Filters is null. Can't load filter into session");
        return;
    }
    filters = JSON.parse(filters);

    if (filters[key] !== null)
        console.log("update filters ("+key+"):{old: " + filters[key] + ", new: " + value);

    filters[key] = value;
    filters = JSON.stringify(filters);
    sessionStorage.setItem("filters", filters);
}

function genFiltersTable(tableId) {
    const filtersRowId = "id='filters-row'";
    const gen = new HtmlGenerator();
    let titles = sessionStorage.getItem("players");
    titles = getJSONKeys(titles);

    let table = gen.table_start("id='" + tableId + "'");

    let filtersRow = gen.row_start(filtersRowId);
    titles.forEach(key => {
        key.trim().toLowerCase();
        filtersRow += gen.col_start();
        filtersRow += gen.text_field("id='filter-" + key + "'");
        filtersRow += gen.COL_END;
    });
    filtersRow += gen.ROW_END;

    table += filtersRow;
    table += gen.TABLE_END;

    return table;
}

function applyFiltersTable() {

    //todo: get filters froms session and enter them to fields
    const filterTableId = "table-players-filters";

    const table = genFiltersTable(filterTableId);

    $('#'+filterTableId).replaceWith(table);

    applyFilterListeners();
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