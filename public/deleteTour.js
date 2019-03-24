function deleteTour(id){
    $.ajax({
        url: '/tours/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};