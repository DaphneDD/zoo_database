function updateEmployee(id){
    $.ajax({
        url: '/employees/' + id,
        type: 'PUT',
        data: $('#update_employee').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};