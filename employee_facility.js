module.exports = function(){
    var express = require('express');
    var router = express.Router();
    

    function getEmployee_facility(res, mysql, context, complete){
        mysql.pool.query("SELECT e.id as eid, e.name as employee_name, f.id as fid, f.name as facility_name FROM zoo_employee e inner join zoo_employee_facility ef on e.id=ef.eid inner join zoo_facility f on f.id=ef.fid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee_facility  = results;
            complete();
        });
    }    
 
	function getEmployeeByFacility(req, res, mysql, context, complete){
      var query = "SELECT e.id as eid, e.name as employee_name, f.id as fid, f.name as facility_name FROM zoo_employee e inner join zoo_employee_facility ef on e.id=ef.eid inner join zoo_facility f on f.id=ef.fid WHERE f.id = ?";
 //     console.log("in getEmployeeByFacility() ", req.params);
      var inserts = [req.params.fid];
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee_facility = results;
        });
		
	  query = "SELECT name FROM zoo_facility WHERE id = ?"; 
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
  //          console.log(results);
			context.facility_of_interest = results[0].name + " (ID: " + inserts[0] + ")";
            complete();
        });
    }
 
 
    function getEmployee(res, mysql, context, complete){
        sql = "SELECT id AS eid, name AS employee_name FROM zoo_employee";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.employee = results
            complete();
        });
     }
     
    function getFacility(res, mysql, context, complete){
        mysql.pool.query("SELECT id AS fid, name AS facility_name FROM zoo_facility", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.facility = results;
            complete();
        });
     }
     
	// get the entry of an employee-facility relationship with the key (eid, fid)
	function getAnEmployeeFacility(res, mysql, context, eid, fid, complete){
        var sql = "SELECT e.id as eid, e.name as employee_name, f.id as fid, f.name as facility_name FROM zoo_employee e inner join zoo_employee_facility ef on e.id=ef.eid inner join zoo_facility f on f.id=ef.fid WHERE eid=? AND fid=?";
        var inserts = [eid, fid];
		
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
			console.log("After query of getting one employee_facility:");
			console.log(results[0]);
			if (typeof results[0] === 'undefined')
			{
				//console.log("type is undefined");
				res.end();
			} else {
            context.eid = results[0].eid;
			context.employee_name = results[0].employee_name;
			context.fid = results[0].fid;
			context.facility_name = results[0].facility_name;
            complete();
			}
        });
    }
	
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.facility_of_interest = "All";
		context.jsscripts = ["deleteEmployeeFacility.js", "filterEmployeeByFacility.js"];
        var mysql = req.app.get('mysql');
        getEmployee_facility(res, mysql, context, complete);
        getEmployee(res, mysql, context, complete);
        getFacility(res, mysql, context, complete);
         function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('employee_facility', context);
            }

        }
    });
	
	/*Display all employees in the same facility.*/
	router.get('/filter/:fid', function(req, res){
        var callbackCount = 0;
        var context = {};

		//	console.log("In '/filter/:fid' ", req.params);
		context.jsscripts = ["deleteEmployeeFacility.js", "filterEmployeeByFacility.js"];
        var mysql = req.app.get('mysql');
        getEmployeeByFacility(req, res, mysql, context, complete);
        getEmployee(res, mysql, context, complete);
        getFacility(res, mysql, context, complete);
         function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('employee_facility', context);
            }

        }
    });
     
     
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO zoo_employee_facility (eid, fid) VALUES(?,?)";
        var inserts = [req.body.eid, req.body.fid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/employee_facility');
            }
        });
    });

	/* Display one employee_facility for the specific purpose of updating that relationship */
	router.get('/eid/:eid/fid/:fid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selected.js", "updateEmployeeFacility.js"];
        var mysql = req.app.get('mysql');
        getAnEmployeeFacility(res, mysql, context, req.params.eid, req.params.fid, complete);
        getFacility(res, mysql, context, complete);
		getEmployee(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
				console.log("This is in complete()");
                res.render('update_employee_facility', context);
            }
        }
    });	
	
	/* The URL that update data is sent to in order to update an animal_employee relationship */
    router.put('/eid/:eid/fid/:fid', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("update an employee_facility", req.body);
		console.log(req.body.eid, req.body.fid);
        console.log(req.params.eid, req.params.fid);
        var sql = "UPDATE zoo_employee_facility SET eid=?, fid=? WHERE eid=? AND fid=?";
        var inserts = [req.body.eid, req.body.fid, req.params.eid, req.params.fid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });
	
	/* Route to delete an an employee-facility relationship, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/eid/:eid/fid/:fid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM zoo_employee_facility WHERE eid = ? AND fid = ?";
        var inserts = [req.params.eid, req.params.fid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })
       return router;
}();
