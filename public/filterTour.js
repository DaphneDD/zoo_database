function filterTourByDay() {
    //get selected day
    var day = document.getElementById('tour_filter').value
    //construct the URL and redirect to it
    window.location = '/tours/filter/' + encodeURI(day)
}