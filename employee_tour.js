module.exports = function(){
    var express = require('express');
    var router = express.Router();
    

    function getEmployee_Tour(res, mysql, context, complete){
        mysql.pool.query("SELECT e.id as eid, e.name as employee_name, t.id as tid, t.name as tour_name FROM zoo_employee e inner join zoo_employee_tour et on e.id=et.eid inner join zoo_tour t on t.id=et.tid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee_tour  = results;
            complete();
        });
    }    

	function getEmployeeByTour(req, res, mysql, context, complete){
      var query = "SELECT e.id as eid, e.name as employee_name, t.id as tid, t.name as tour_name FROM zoo_employee e inner join zoo_employee_tour et on e.id=et.eid inner join zoo_tour t on t.id=et.tid WHERE t.id = ?";
      console.log("in getEmployeeByTour() ", req.params);
      var inserts = [req.params.tid];
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee_tour = results;
        });
	
	  query = "SELECT name FROM zoo_tour WHERE id = ?"; 
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
  //          console.log(results);
			context.tour_of_interest = results[0].name + " (ID: " + inserts[0] + ")";
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
     
    function getTour(res, mysql, context, complete){
        mysql.pool.query("SELECT id AS tid, name AS tour_name FROM zoo_tour", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.tour = results;
            complete();
        });
     }
     
	// get the entry of an employee-tour relationship with the key (eid, tid)
	function getAnEmployeeTour(res, mysql, context, eid, tid, complete){
        var sql = "SELECT e.id as eid, e.name as employee_name, t.id as tid, t.name as tour_name FROM zoo_employee e inner join zoo_employee_tour et on e.id=et.eid inner join zoo_tour t on t.id=et.tid WHERE eid=? AND tid=?";
        var inserts = [eid, tid];
		
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
			console.log("After query of getting one employee_tour:");
			console.log(results[0]);
			if (typeof results[0] === 'undefined')
			{
				//console.log("type is undefined");
				res.end();
			} else {
            context.eid = results[0].eid;
			context.employee_name = results[0].employee_name;
			context.tid = results[0].tid;
			context.tour_name = results[0].tour_name;
            complete();
			}
        });
    }
	
    
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.tour_of_interest = "All";
		context.jsscripts = ["deleteEmployeeTour.js", "filterEmployeeByTour.js"];
        var mysql = req.app.get('mysql');
        getEmployee_Tour(res, mysql, context, complete);
        getEmployee(res, mysql, context, complete);
        getTour(res, mysql, context, complete);
         function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('employee_tour', context);
            }

        }
    });
     
	/*Display all employees one the same tour.*/
	router.get('/filter/:tid', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.jsscripts = ["deleteEmployeeTour.js", "filterEmployeeByTour.js"];
        var mysql = req.app.get('mysql');
        getEmployeeByTour(req, res, mysql, context, complete);
        getEmployee(res, mysql, context, complete);
        getTour(res, mysql, context, complete);
         function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('employee_tour', context);
            }

        }
    }); 
	
	
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO zoo_employee_tour (eid, tid) VALUES(?,?)";
        var inserts = [req.body.eid, req.body.tid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/employee_tour');
            }
        });
    });

    /* Display one employee_tour for the specific purpose of updating that relationship */
	router.get('/eid/:eid/tid/:tid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selected.js", "updateEmployeeTour.js"];
        var mysql = req.app.get('mysql');
        getAnEmployeeTour(res, mysql, context, req.params.eid, req.params.tid, complete);
        getTour(res, mysql, context, complete);
		getEmployee(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
//				console.log("This is in complete()");
                res.render('update_employee_tour', context);
            }
        }
    });	
	
	/* The URL that update data is sent to in order to update an employee_tour relationship */
    router.put('/eid/:eid/tid/:tid', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("update an employee_tour", req.body);
		console.log(req.body.eid, req.body.tid);
        console.log(req.params.eid, req.params.tid);
        var sql = "UPDATE zoo_employee_tour SET eid=?, tid=? WHERE eid=? AND tid=?";
        var inserts = [req.body.eid, req.body.tid, req.params.eid, req.params.tid];
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
	
	/* Route to delete an an employee-tour relationship, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/eid/:eid/tid/:tid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM zoo_employee_tour WHERE eid = ? AND tid = ?";
        var inserts = [req.params.eid, req.params.tid];
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
