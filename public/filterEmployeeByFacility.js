function filterEmployeeByFacility() {
    //get selected facility
    var facility = document.getElementById('employee_facility_filter').value
    //construct the URL and redirect to it
    window.location = '/employee_facility/filter/' + parseInt(facility)
}