function filterEmployeeByDepartment() {
    //get selected department
    var department = document.getElementById('employee_filter').value;
	console.log("department ", department);
    //construct the URL and redirect to it
    window.location = '/employees/filter/' + encodeURI(department);
}