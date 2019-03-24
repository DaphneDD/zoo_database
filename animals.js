module.exports = function(){
    var express = require('express');
    var router = express.Router();
    
   function getFacility(res, mysql, context, complete){
	mysql.pool.query("SELECT id, name, category FROM zoo_facility", function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.facility  = results;
		complete();
	});
	} 
    
	function getAnimal(res, mysql, context, complete){
		mysql.pool.query("SELECT a.id as id, a.name as name, a.class as class, a.habitat as habitat, f.name as facility_name from zoo_animal a left join zoo_facility f on a.facility=f.id", function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.animal = results;
			complete();
		});
	}
	
	function getAnimalbyClass(req, res, mysql, context, complete){
      var query = "SELECT a.id as id, a.name as name, a.class as class, a.habitat as habitat, f.name as facility_name from zoo_animal a left join zoo_facility f on a.facility=f.id WHERE a.class = ?";
      console.log("in getAnimalByClass() ", req.params);
      var inserts = [req.params.class_name];
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animal = results;
            complete();
        });
    }
	
    	
	// get the entry of an animal with the parameter id
	function getAnAnimal(res, mysql, context, id, complete){
        var sql = "SELECT id, name, class, habitat, facility FROM zoo_animal WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animal = results[0];
            complete();
        });
    }

	/*Display all animals. Requires web based javascript to delete users with AJAX*/
	router.get('/', function(req, res){
		var callbackCount=0;
		var context = {};
		context.jsscripts = ["deleteAnimal.js", "filterAnimal.js"];
		var mysql = req.app.get('mysql');
		getAnimal(res, mysql, context, complete);
		getFacility(res, mysql, context, complete);
		context.animal_class = "All";
		function complete(){
			callbackCount++;
			if(callbackCount >= 2){
				res.render('animals', context);
			}

		}
	});
    
	  /*Display all animals within a same class.*/
    router.get('/filter/:class_name', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.animal_class = req.params.class_name;
        context.jsscripts = ["deleteAnimal.js","filterAnimal.js"];
        var mysql = req.app.get('mysql');
        getAnimalbyClass(req,res, mysql, context, complete);
        getFacility(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('animals', context);
            }
        }
    });
	
    /* Adds an animal, redirects to the animals page after adding */
    router.post('/', function(req, res){
        console.log("add an animal", req.body.facility)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO zoo_animal (name, class, habitat, facility) VALUES (?,?,?,?)";
        var inserts = [req.body.name, req.body.class, req.body.habitat, req.body.facility];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/animals');
            }
        });
    });

	
    /* Display one animal for the specific purpose of updating an animal */
	router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selected.js", "updateAnimal.js"];
        var mysql = req.app.get('mysql');
        getAnAnimal(res, mysql, context, req.params.id, complete);
        getFacility(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update_animal', context);
            }

        }
    });

	/* The URL that update data is sent to in order to update an animal */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("update an animal", req.body)
        console.log(req.params.id)
        var sql = "UPDATE zoo_animal SET name=?, class=?, habitat=?, facility=? WHERE id=?";
        var inserts = [req.body.name, req.body.class, req.body.habitat, req.body.facility, req.params.id];
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
        var sql = "DELETE FROM zoo_animal WHERE id = ?";
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
