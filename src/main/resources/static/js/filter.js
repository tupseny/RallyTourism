function filterStartWith(key, array) {
    return array.filter(function (e) {
        let string = e.name.trim().toLowerCase();
        key = key.trim().toLowerCase();

        return string.startsWith(key);
    });
}

function doFilterPlayersTable(fieldId) {
    //get key from filter field. It's value
    let key = $('#' + fieldId).val();
    //get array of players from cache
    let array = sessionStorage.getItem("players");
    if (array == null) {
        console.warn("Array is empty (taken from session");
        return;
    }

    array = JSON.parse(array);
    array = filterStartWith(key, array);

    refreshTable(array);
}