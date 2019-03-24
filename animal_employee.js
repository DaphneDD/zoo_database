module.exports = function(){
    var express = require('express');
    var router = express.Router();
    
	function getEmployees(res, mysql, context, complete){
        mysql.pool.query("SELECT id as eid, name as employee_name FROM zoo_employee", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee  = results;
            complete();
        });
    }
    
    function getAnimal(res, mysql, context, complete){
        mysql.pool.query("SELECT id as aid, name as animal_name  from zoo_animal", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animal = results;
            complete();
        });
    }

	function getAnimal_Employee(res, mysql, context, complete){
        mysql.pool.query("SELECT a.id as aid, a.name as animal_name, e.id as eid, e.name as employee_name FROM zoo_animal a inner join zoo_animal_employee ae on a.id=ae.aid inner join zoo_employee e on e.id=ae.eid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animal_employee  = results;
            complete();
        });
    }    

	function getAnimalByEmployee(req, res, mysql, context, complete){
      var query = "SELECT a.id as aid, a.name as animal_name, e.id as eid, e.name as employee_name FROM zoo_animal a inner join zoo_animal_employee ae on a.id=ae.aid inner join zoo_employee e on e.id=ae.eid WHERE e.id = ?";
      console.log("in getAnimalByEmployee() ", req.params);
      var inserts = [req.params.eid];
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animal_employee = results;
			console.log(results);
      });
	
	  query = "SELECT name FROM zoo_employee WHERE id = ?"; 
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log(results);
			context.employee_of_interest = results[0].name + " (ID: " + inserts[0] + ")";
            complete();
        });
    }
	
	
	// get the entry of an animal-employee relationship with the key (aid, eid)
	function getAnAnimalEmployee(res, mysql, context, aid, eid, complete){
        var sql = "SELECT a.id as aid, a.name as animal_name, e.id as eid, e.name as employee_name FROM zoo_animal a inner join zoo_animal_employee ae on a.id=ae.aid inner join zoo_employee e on e.id=ae.eid WHERE aid=? AND eid=?";
        var inserts = [aid, eid];
		
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
			console.log("After query of getting one animal_employee:");
			console.log(results[0]);
			if (typeof results[0] === 'undefined')
			{
				//console.log("type is undefined");
				res.end();
			} else {
            context.aid = results[0].aid;
			context.animal_name = results[0].animal_name;
			context.eid = results[0].eid;
			context.employee_name = results[0].employee_name;
            complete();
			}
        });
    }
	
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.employee_of_interest = "All";
		context.jsscripts = ["deleteAnimalEmployee.js", "filterAnimalByEmployee.js"];
        var mysql = req.app.get('mysql');
        getAnimal_Employee(res, mysql, context, complete);
        getEmployees(res, mysql, context, complete);
        getAnimal(res, mysql, context, complete); 
         function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('animal_employee', context);
            }

        }
    });

	/*Display all animals taken care by the same employee.*/
    router.get('/filter/:eid', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteAnimalEmployee.js", "filterAnimalByEmployee.js"];
        var mysql = req.app.get('mysql');
        getAnimalByEmployee(req,res, mysql, context, complete);
		getEmployees(res, mysql, context, complete);
        getAnimal(res, mysql, context, complete); 
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('animal_employee', context);
            }
        }
    });


    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO zoo_animal_employee (aid, eid) VALUES (?,?)";
        var inserts = [req.body.aid, req.body.eid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/animal_employee');
            }
        });
    });
	
	/* Display one animal_employee for the specific purpose of updating that relationship */
	router.get('/aid/:aid/eid/:eid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selected.js", "updateAnimalEmployee.js"];
        var mysql = req.app.get('mysql');
        getAnAnimalEmployee(res, mysql, context, req.params.aid, req.params.eid, complete);
        getAnimal(res, mysql, context, complete);
		getEmployees(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update_animal_employee', context);
            }

        }
    });
	
	/* The URL that update data is sent to in order to update an animal_employee relationship */
    router.put('/aid/:aid/eid/:eid', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("update an animal_employee", req.body);
		console.log(req.body.aid, req.body.eid);
        console.log(req.params.aid, req.params.eid);
        var sql = "UPDATE zoo_animal_employee SET aid=?, eid=? WHERE aid=? AND eid=?";
        var inserts = [req.body.aid, req.body.eid, req.params.aid, req.params.eid];
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
	
	/* Route to delete an an animal-employee relationship, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/aid/:aid/eid/:eid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM zoo_animal_employee WHERE aid = ? AND eid = ?";
        var inserts = [req.params.aid, req.params.eid];
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

