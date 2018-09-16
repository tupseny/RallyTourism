function filterStartWith(filters, array) {
    console.log("Filtering: " + filters);
    return array.filter(function (item) {
        filters.forEach(function (key) {
            return item[key] !== undefined || item[key].startsWith(filters[key]);
        })
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
    filters = JSON.parse(filters);

    //get array of players from cache
    //todo: get array from table, not from session storage
    let array = sessionStorage.getItem("players");
    if (array == null) {
        console.warn("Array is empty (taken from session");
        return;
    }
    array = JSON.parse(array);

    array = filterStartWith(filters, array);


    refreshTable(array);
}