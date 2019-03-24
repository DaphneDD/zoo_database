module.exports = function(){
    var express = require('express');
    var router = express.Router();
    

    function getAnimal_tour(res, mysql, context, complete){
        mysql.pool.query("SELECT a.id as aid, a.name as animal_name, t.id as tid, t.name as tour_name FROM zoo_animal a inner join zoo_animal_tour at on a.id=at.aid inner join zoo_tour t on t.id=at.tid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animal_tour  = results;
            complete();
        });
    }    

	function getAnimalByTour(req, res, mysql, context, complete){
      var query = "SELECT a.id as aid, a.name as animal_name, t.id as tid, t.name as tour_name FROM zoo_animal a inner join zoo_animal_tour at on a.id=at.aid inner join zoo_tour t on t.id=at.tid WHERE t.id = ?";
      var inserts = [req.params.tid];
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animal_tour = results;
        });
		
	  query = "SELECT name FROM zoo_tour WHERE id = ?"; 
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
			context.tour_of_interest = results[0].name + " (ID: " + inserts[0] + ")";
            complete();
        });
	
    }
 
    function getAnimal(res, mysql, context, complete){
        mysql.pool.query("SELECT id AS aid, name AS animal_name FROM zoo_animal", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.animal = results;
            complete();
        });
    }

    function getTour(res, mysql, context, complete){
        sql = "SELECT id AS tid, name AS tour_name FROM zoo_tour";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.tour = results
            complete();
        });
     }
     
	 
	 
	
	 // get the entry of an animal-employee relationship with the key (aid, eid)
	function getAnAnimalTour(res, mysql, context, aid, tid, complete){
        var sql = "SELECT a.id as aid, a.name as animal_name, t.id as tid, t.name as tour_name FROM zoo_animal a inner join zoo_animal_tour at on a.id=at.aid inner join zoo_tour t on t.id=at.tid WHERE aid=? AND tid=?";
        var inserts = [aid, tid];
		
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
			console.log("After query of getting one animal_tour:");
			console.log(results[0]);
			if (typeof results[0] === 'undefined')
			{
				//console.log("type is undefined");
				res.end();
			} else {
            context.aid = results[0].aid;
			context.animal_name = results[0].animal_name;
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
		context.jsscripts = ["deleteAnimalTour.js", "filterAnimalByTour.js"];
        var mysql = req.app.get('mysql');
        getAnimal_tour(res, mysql, context, complete);
        getAnimal(res, mysql, context, complete);
        getTour(res, mysql, context, complete);
         function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('animal_tour', context);
            }

        }
    });
     
	/*Display all animals on the same tour.*/
    router.get('/filter/:tid', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteAnimalTour.js", "filterAnimalByTour.js"];
        var mysql = req.app.get('mysql');
        getAnimalByTour(req,res, mysql, context, complete);
		getAnimal(res, mysql, context, complete);
        getTour(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('animal_tour', context);
            }
        }
    });
     
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO zoo_animal_tour (aid, tid) VALUES(?,?)";
        var inserts = [req.body.aid, req.body.tid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/animal_tour');
            }
        });
    });

	/* Display one animal_tour for the specific purpose of updating that relationship */
	router.get('/aid/:aid/tid/:tid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selected.js", "updateAnimalTour.js"];
        var mysql = req.app.get('mysql');
        getAnAnimalTour(res, mysql, context, req.params.aid, req.params.tid, complete);
        getAnimal(res, mysql, context, complete);
		getTour(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update_animal_tour', context);
            }

        }
    });
	
	/* The URL that update data is sent to in order to update an animal_tour relationship */
    router.put('/aid/:aid/tid/:tid', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("update an animal_tour, from",req.params.aid, req.params.tid,"to",req.body.aid, req.body.tid);
        var sql = "UPDATE zoo_animal_tour SET aid=?, tid=? WHERE aid=? AND tid=?";
        var inserts = [req.body.aid, req.body.tid, req.params.aid, req.params.tid];
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
	
	/* Route to delete an an animal-tour relationship, simply returns a 202 upon success. Ajax will handle this. */
    router.delete('/aid/:aid/tid/:tid', function(req, res){
		console.log("delete animal_tour", req.params);
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM zoo_animal_tour WHERE aid = ? AND tid = ?";
        var inserts = [req.params.aid, req.params.tid];
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
