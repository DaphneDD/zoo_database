
function updateAnimal(id){
    $.ajax({
        url: '/animals/' + id,
        type: 'PUT',
        data: $('#update_animal').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};