function deleteAnimalTour(aid, tid){
  $.ajax({
      url: '/animal_tour/'+ 'aid/'+aid +'/tid/'+ tid,
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
