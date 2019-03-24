function updateAnimalTour(aid, tid){
    $.ajax({
        url: '/animal_tour/'+ 'aid/'+aid +'/tid/'+ tid,
        type: 'PUT',
        data: $('#update_animal_tour').serialize(),
        success: function(result){
//            window.location.replace("./");
			window.location = '/animal_tour/';
        }
    })
};
