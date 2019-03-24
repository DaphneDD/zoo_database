function deleteAnimal(id){
    $.ajax({
        url: '/animals/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};