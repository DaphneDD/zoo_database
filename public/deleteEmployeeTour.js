function deleteEmployeeTour(eid, tid){
  $.ajax({
      url: '/employee_tour/'+ 'eid/'+eid +'/tid/'+ tid,
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
