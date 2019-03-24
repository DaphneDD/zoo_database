function deleteEmployeeFacility(eid, fid){
  $.ajax({
      url: '/employee_facility/'+ 'eid/'+eid +'/fid/'+ fid,
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
