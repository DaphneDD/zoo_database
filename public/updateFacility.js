function updateFacility(id){
    $.ajax({
        url: '/facilities/' + id,
        type: 'PUT',
        data: $('#update_facility').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};