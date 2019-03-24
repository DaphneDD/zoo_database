function updateTour(id){
    $.ajax({
        url: '/tours/' + id,
        type: 'PUT',
        data: $('#update_tour').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};