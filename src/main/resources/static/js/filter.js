function filterStartWith(filters, array) {
    // console.log("Comparator: " + JSON.stringify(filters));
    return array.filter(item => {
        let result = true;
        $.each(filters, function (key) {
            const comparable = item[key].toString().toLowerCase();
            const comparator = filters[key].toString().toLowerCase();
            result &= comparable.startsWith(comparator);
        });
        return result;
    });
}

function doFilterPlayersTable() {
    let array = filterStartWith(filters, players);

    refreshTable(array);
}