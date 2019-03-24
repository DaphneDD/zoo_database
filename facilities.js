module.exports = function(){
    var express = require('express');
    var router = express.Router();
    

    function getFacilities(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, category FROM zoo_facility", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.facility  = results;
            complete();
        });
    }    
	
	function getFacilityByCategory(req, res, mysql, context, complete){
      var query = "SELECT id, name, category FROM zoo_facility WHERE category = ?";
      console.log("in getFacilityByCategory() ", req.params);
      var inserts = [req.params.category];
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.facility = results;
            complete();
        });
    }
	
	// get the entry of a facility with the parameter id
	function getAFacility(res, mysql, context, id, complete){
        var sql = "SELECT id, name, category FROM zoo_facility WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.facility = results[0];
            complete();
        });
    }


    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.facility_category = "All";
		context.jsscripts = ["deleteFacility.js", "filterFacility.js"];
        var mysql = req.app.get('mysql');
        getFacilities(res, mysql, context, complete);
         function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('facilities', context);
            }

        }
    });

	/*Display all facilities within the same category.*/
    router.get('/filter/:category', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.facility_category = req.params.category;
        context.jsscripts = ["deleteFacility.js","filterFacility.js"];
        var mysql = req.app.get('mysql');
        getFacilityByCategory(req,res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('facilities', context);
            }
        }
    });
    
    /* Adds a facility, redirects to the facilities page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO zoo_facility (name, category) VALUES (?,?)";
        var inserts = [req.body.name, req.body.category];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
               res.redirect('/facilities');
            }
        });
    });

	 /* Display one facility for the specific purpose of updating an facility */
	router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateFacility.js"];
        var mysql = req.app.get('mysql');
        getAFacility(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update_facility', context);
            }

        }
    });

	/* The URL that update data is sent to in order to update a facility */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("update a facility", req.body)
        console.log(req.params.id)
        var sql = "UPDATE zoo_facility SET name=?, category=? WHERE id=?";
        var inserts = [req.body.name, req.body.category, req.params.id];
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
	
	
	/* Route to delete a facility, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM zoo_facility WHERE id = ?";
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
