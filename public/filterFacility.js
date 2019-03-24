function filterFacilityByCategory() {
    //get selected category
    var category = document.getElementById('facility_filter').value
    //construct the URL and redirect to it
    window.location = '/facilities/filter/' + encodeURI(category)
}