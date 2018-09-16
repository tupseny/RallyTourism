function filterStartWith(filters, array) {
    filters = JSON.parse(filters);
    return array.filter(function (item) {
        console.log(filters);
        $.each(filters, function (key) {
            console.log("key: '" + key + "' item: " + item[key] + " value: " + filters[key] + " result: " + item[key].toString().startsWith(filters[key]));
            return item[key].toString().startsWith(filters[key]);
        });
    });
}

function doFilterPlayersTable(fieldId) {
    //get key from filter field. It's value
    let key = $('#' + fieldId).val();

    let filters = sessionStorage.getItem("filters");
    if (filters == null) {
        console.warn("Filters is empty (taken from session");
        return;
    }

    //get array of players from cache
    //todo: get array from table, not from session storage
    let array = sessionStorage.getItem("players");
    if (array == null) {
        console.warn("Array is empty (taken from session");
        return;
    }
    array = JSON.parse(array);

    array = filterStartWith(filters, array);

    //todo: getting empty array. Fix!
    console.log("Got array: " + array);

    refreshTable(array);
}