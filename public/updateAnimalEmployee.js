function updateAnimalEmployee(aid, eid){
    $.ajax({
        url: '/animal_employee/'+ 'aid/'+aid +'/eid/'+ eid,
        type: 'PUT',
        data: $('#update_animal_employee').serialize(),
        success: function(result){
			window.location = '/animal_employee/';
        //    window.location.replace("./");
        }
    })
};
