function deleteAnimalEmployee(aid, eid){
  $.ajax({
      url: '/animal_employee/'+ 'aid/'+aid +'/eid/'+ eid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          }
      }
  })
};
