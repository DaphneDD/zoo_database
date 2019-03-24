-- ------------------- Animal Page ------------------------------------------------
/* query to populate the animal table */
SELECT a.id, a.name, a.class, a.habitat, f.name FROM zoo_animal AS a
	LEFT JOIN zoo_facility AS f ON a.facility = f.id; 
	
/* query to populate the facility dropdown input */
SELECT id, name from zoo_facility;

/* query to add an animal based on user input 
	: denotes values of the user input */
INSERT INTO zoo_animal (name, class, habitat, facility) VALUES
	(:name, :class, :habitat, :facility-id-from-dropdown-input);
	
/* update an animal based on user input */
UPDATE zoo_animal SET name = :name, class = :class, habitat = :habitat, facility = :facility-id-from-dropdown-input WHERE id = :id;

/* delete an animal */
DELETE from zoo_animal WHERE id = :id;


-- --------------------- Employees Page -----------------------------------------------
/* query to populate the employee table */
SELECT * from zoo_employee;

/* query to add an employee based on user input */
INSERT INTO zoo_employee (name, department) VALUES (:name, :department);

/* query to update an employee based on user input */
UPDATE zoo_employee SET name = :name, department = :department WHERE id = :id;

/* delete an employee */
DELETE FROM zoo_employee WHERE id = :id;


-- ----------------------- Facility Page --------------------------------------------------
/* query to populate the facility table */
SELECT * from zoo_facility;

/* add a facility based on user input */
INSERT INTO zoo_facility (name, category) VALUES (:name, :category);

/* update a facility based on user input */
UPDATE zoo_facility SET name = :name, category = :category WHERE id = :id;

/* delete a facility */
DELETE FROM zoo_facility WHERE id = :id;


-- --------------------- Tour Page ---------------------------------------------------------
/* query to populate the tour table */
SELECT * from zoo_tour;

/* add a tour based on user input */
INSERT INTO zoo_tour (name, day, time, length, capacity) VALUES 
	(:name, :day, :time, :length, :capacity);

/* update a tour based on user input */
UPDATE zoo_tour SET name = :name, day = :day, time = :time, length = :length, capacity = :capacity WHERE id = :id;

/* delete a tour */
DELETE FROM zoo_tour WHERE id = :id;

-- ------------------------ Animal-Employee Page -------------------------------------------
/* query to populate the animal-employee table */
SELECT ae.aid, ae.eid, a.name, e.name FROM zoo_animal_employee AS ae
	INNER JOIN zoo_animal AS a ON ae.aid = a.id
	INNER JOIN zoo_employee AS e ON ae.eid = e.id;

/* query to populate the animal dropdown input */
SELECT id, name from zoo_animal;
	
/* query to populate the employee dropdown input */
SELECT id, name from zoo_employee;

/* query to add an animal-employee relationship */
INSERT INTO zoo_animal_employee (aid, eid) VALUES (:aid-from-dropdown-input, :eid-from-dropdown-input);

/* delete a relationship */
DELETE FROM zoo_animal_employee WHERE aid = :aid AND eid = : eid;


-- --------------------------- Animal-Tour Page ----------------------------------------------
/* query to populate the animal-tour table */
SELECT anto.aid, anto.tid, a.name, t.name FROM zoo_animal_tour AS anto
	INNER JOIN zoo_animal AS a ON anto.aid = a.id
	INNER JOIN zoo_tour AS t ON anto.tid = t.id;

/* query to populate the tour dropdown input */
SELECT id, name from zoo_tour;
	
/* add an animal-tour relationship */
INSERT INTO zoo_animal_tour (aid, tid) VALUES (:aid-from-dropdown-input, :tid-from-dropdown-input);

/* delete an animal-tour relationship */
DELETE FROM zoo_animal_tour WHERE aid = :aid AND tid = :tid;


-- --------------------------- Employee-Facility Page ----------------------------------------------
/* query to populate the Employee-facility table */
SELECT ef.eid, ef.fid, e.name, f.name FROM zoo_employee_facility AS ef
	INNER JOIN zoo_employee AS e ON ef.eid = e.id
	INNER JOIN zoo_facility AS f ON ef.fid = f.id;
	
/* add an employee-facility relationship */
INSERT INTO zoo_employee_facility (eid, fid) VALUES (:eid-from-dropdown-input, :fid-from-dropdown-input);

/* delete an animal-tour relationship */
DELETE FROM zoo_employee_facility WHERE eid = :eid AND fid = :fid;


-- --------------------------- Employee-Tour Page ----------------------------------------------
/* query to populate the Employee-tour table */
SELECT et.eid, et.tid, e.name, t.name FROM zoo_employee_tour AS et
	INNER JOIN zoo_employee AS e ON et.eid = e.id
	INNER JOIN zoo_tour AS t ON et.tid = t.id;
	
/* add an employee-facility relationship */
INSERT INTO zoo_employee_tour (eid, tid) VALUES (:eid-from-dropdown-input, :tid-from-dropdown-input);

/* delete an animal-tour relationship */
DELETE FROM zoo_employee_tour WHERE eid = :eid AND tid = :tid;
