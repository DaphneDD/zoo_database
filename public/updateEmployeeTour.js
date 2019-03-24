function updateEmployeeTour(eid, tid){
    $.ajax({
        url: '/employee_tour/'+ 'eid/'+eid +'/tid/'+ tid,
        type: 'PUT',
        data: $('#update_employee_tour').serialize(),
        success: function(result){
            window.location = '/employee_tour/'; //.replace("./");
        }
    })
};
