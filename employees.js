module.exports = function(){
    var express = require('express');
    var router = express.Router();
    

    function getEmployees(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, department FROM zoo_employee", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee  = results;
            complete();
        });
    }    
	
	function getEmployeeByDepartment(req, res, mysql, context, complete){
      var query = "SELECT id, name, department FROM zoo_employee WHERE department = ?";
      console.log("in getEmployeeByDepartment() ", req.params);
      var inserts = [req.params.department];
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee = results;
            complete();
        });
    }
	
	// get the entry of an employee with the parameter id
	function getAnEmployee(res, mysql, context, id, complete){
        var sql = "SELECT id, name, department FROM zoo_employee WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee = results[0];
            complete();
        });
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.employee_department = "All";
		context.jsscripts = ["deleteEmployee.js", "filterEmployee.js"];
        var mysql = req.app.get('mysql');
        getEmployees(res, mysql, context, complete);
         function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('employees', context);
            }

        }
    });
	
	/*Display all employees within the same department.*/
    router.get('/filter/:department', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.employee_department = req.params.department;
        context.jsscripts = ["deleteEmployee.js","filterEmployee.js"];
        var mysql = req.app.get('mysql');
        getEmployeeByDepartment(req,res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('employees', context);
            }
        }
    });

    
    /* Adds an employee, redirects to the employee page after adding */
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO zoo_employee (name, department) VALUES (?,?)";
        var inserts = [req.body.name, req.body.department];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/employees');
            }
        });
    });

	/* Display one employee for the specific purpose of updating an employee */
	router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateEmployee.js"];
        var mysql = req.app.get('mysql');
        getAnEmployee(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update_employee', context);
            }
        }
    });
	
	/* The URL that update data is sent to in order to update an employee */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("update an employee", req.body)
        console.log(req.params.id)
        var sql = "UPDATE zoo_employee SET name=?, department=? WHERE id=?";
        var inserts = [req.body.name, req.body.department, req.params.id];
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
	
	/* Route to delete an person, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM zoo_employee WHERE id = ?";
        var inserts = [req.params.id];
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
