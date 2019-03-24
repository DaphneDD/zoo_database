function deleteFacility(id){
    $.ajax({
        url: '/facilities/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};