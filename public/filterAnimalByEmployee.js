function filterAnimalByEmployee() {
    //get selected employee 
    var employee = document.getElementById('animal_employee_filter').value
    //construct the URL and redirect to it
    window.location = '/animal_employee/filter/' + parseInt(employee)
}