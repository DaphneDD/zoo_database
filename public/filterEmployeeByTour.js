function filterEmployeeByTour() {
    //get selected tour
    var tour = document.getElementById('employee_tour_filter').value
    //construct the URL and redirect to it
    window.location = '/employee_tour/filter/' + parseInt(tour)
}