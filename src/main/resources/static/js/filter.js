function filterStartWith(key, array) {
    return array.filter(function (e) {
        let string = e.name.trim().toLowerCase();
        key = key.trim().toLowerCase();

        return string.startsWith(key);
    });
}

function doFilterPlayers(fieldId, key, array) {
    console.log("Filter{fieldId: " + fieldId + "; key: " + key + "; array: " + array + "}");

    array = JSON.parse(array);
    array = filter(key, array);

    refreshTable(array);
}

function parsePlayersJSON(JSONArray) {
    console.log(JSONArray);
}