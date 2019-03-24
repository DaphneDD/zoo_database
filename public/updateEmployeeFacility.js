function updateEmployeeFacility(eid, fid){
    $.ajax({
        url: '/employee_facility/'+ 'eid/'+eid +'/fid/'+ fid,
        type: 'PUT',
        data: $('#update_employee_facility').serialize(),
        success: function(result){
            window.location = '/employee_facility'; //.replace("./");
        }
    })
};
