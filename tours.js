module.exports = function(){
    var express = require('express');
    var router = express.Router();
    

    function getTours(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, day, time, length, capacity FROM zoo_tour", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.tour  = results;
            complete();
        });
    }    

	function getTourByDay(req, res, mysql, context, complete){
      var query = "SELECT id, name, day, time, length, capacity FROM zoo_tour WHERE day = ?";
      console.log("in getTourByDay() ", req.params);
      var inserts = [req.params.day];
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.tour = results;
            complete();
        });
    }
	
	// get the entry of a facility with the parameter id
	function getATour(res, mysql, context, id, complete){
        var sql = "SELECT id, name, day, time, length, capacity FROM zoo_tour WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.tour = results[0];
            complete();
        });
    }
	
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.tour_day = "All";
		context.jsscripts = ["deleteTour.js","filterTour.js"];
        var mysql = req.app.get('mysql');
        getTours(res, mysql, context, complete);
         function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('tours', context);
            }

        }
    });

	/*Display all tours within the same day.*/
    router.get('/filter/:day', function(req, res){
        var callbackCount = 0;
        var context = {};
		context.tour_day = req.params.day;
        context.jsscripts = ["deleteTour.js","filterTour.js"];
        var mysql = req.app.get('mysql');
        getTourByDay(req,res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('tours', context);
            }
        }
    });
    
    /* Adds a tour, redirects to the tours page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO zoo_tour (name, day, time, length, capacity) VALUES (?,?,?,?,?)";
        var inserts = [req.body.name, req.body.day, req.body.time, req.body.length, req.body.capacity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/tours');
            }
        });
    });
	
	 /* Display one tour for the specific purpose of updating an tour */
	router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateTour.js"];
		console.log("displaying a tour", req.params.id);
        var mysql = req.app.get('mysql');
        getATour(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update_tour', context);
            }
        }
    });

	/* The URL that updates data is sent to in order to update a tour */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("update a tour", req.body)
        console.log(req.params.id)
        var sql = "UPDATE zoo_tour SET name=?, day=?, time=?, length=?, capacity=? WHERE id=?";
        var inserts = [req.body.name, req.body.day, req.body.time, req.body.length, req.body.capacity, req.params.id];
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
	
	
	/* Route to delete a tour, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM zoo_tour WHERE id = ?";
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
