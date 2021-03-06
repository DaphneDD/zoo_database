DROP TABLE IF EXISTS `zoo_facility`;
CREATE TABLE `zoo_facility`(
    `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `category` VARCHAR(50)
    )ENGINE = INNODB; 
    
    
LOCK TABLES `zoo_facility` WRITE;
INSERT INTO `zoo_facility` VALUES 
(1, 'gift shop', 'store'),
(2, 'conveniance store', 'store'),
(3,  'offices', 'building'),
(4, 'ticket station', 'building'),
(5, 'panda palace', 'animal enclosure'),
(6, 'bird nest', 'animal enclosure');
UNLOCK TABLES;
    

DROP TABLE IF EXISTS `zoo_animal`;
CREATE TABLE `zoo_animal`(
    `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `class` VARCHAR(50) NOT NULL,
    `habitat` VARCHAR(50),
	`facility` INT(11) NOT NULL,
	FOREIGN KEY enclosure (facility) REFERENCES zoo_facility (id) 
		ON DELETE CASCADE ON UPDATE CASCADE 
    )ENGINE = INNODB;

LOCK TABLES `zoo_animal` WRITE;
INSERT INTO `zoo_animal` VALUES 
(1, 'dromedary', 'mammals', 'desert', NULL),
(2, 'African elephant', 'mammals', 'grassland', NULL),
(3, 'white-tailed deer', 'mammals', 'forest', NULL),
(4, 'lizard', 'reptiles', NULL, NULL),
(5, 'panda','mammals', 'forest', 5),
(6, 'parrot','birds', 'forest', 6);
UNLOCK TABLES;
    
Drop TABLE IF EXISTS `zoo_employee`;
CREATE TABLE `zoo_employee`(
    `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `department` VARCHAR(50) NOT NULL
    )ENGINE = INNODB;
    
LOCK TABLES `zoo_employee` WRITE;
INSERT INTO `zoo_employee` VALUES 
(1, 'TOM', 'tour'),
(2, 'Frank', 'tour'),
(3,  'Eric ', 'facility'),
(4, 'Richar', 'facility'),
(5, 'Jessica', 'animal'),
(6, 'Lily', 'animal');
UNLOCK TABLES;


DROP TABLE IF EXISTS `zoo_tour`;
CREATE TABLE `zoo_tour`(
    `id` INT(11) PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `day` VARCHAR(20) NOT NULL,
    `time` VARCHAR(10) NOT NULL,
    `length` int(11) NOT NULL,
    `capacity` int(11) NOT NULL
    )ENGINE = INNODB;
    
LOCK TABLES `zoo_tour` WRITE;
INSERT INTO `zoo_tour` VALUES 
(1, 'mammal animal tour', 'Monday', '2:30pm', '50', '20'),
(2, 'panda tour', 'Sundy', '2:00pm', '60', '20'),
(3,  'lizard tour', 'Saturday', '10:00am', '45', '20');
UNLOCK TABLES;
    
DROP TABLE IF EXISTS `zoo_animal_employee`;
CREATE TABLE `zoo_animal_employee`(
    `aid` INT(11),
    `eid` INT (11),
    FOREIGN KEY (aid) REFERENCES zoo_animal(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (eid) REFERENCES zoo_employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (aid, eid)
    )ENGINE = INNODB;      
     
LOCK TABLES `zoo_animal_employee` WRITE;
INSERT INTO `zoo_animal_employee` VALUES 
(1, 5),
(1, 6),
(2, 5),
(2, 6),
(3, 5),
(3, 6),
(4, 6),
(5, 6);
UNLOCK TABLES;     
        

DROP TABLE IF EXISTS `zoo_employee_facility`;
CREATE TABLE `zoo_employee_facility`(
    `eid` INT(11),
    `fid` INT(11),
    FOREIGN KEY (eid) REFERENCES zoo_employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fid) REFERENCES zoo_facility(id) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (eid, fid)
    )ENGINE = INNODB;
    
LOCK TABLES `zoo_employee_facility` WRITE;
INSERT INTO `zoo_employee_facility` VALUES 
(1, 1),
(1, 3),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(5, 3),
(6, 6);
UNLOCK TABLES; 
    
DROP TABLE IF EXISTS `zoo_employee_tour`;
CREATE TABLE `zoo_employee_tour`(
    `eid` INT(11),
    `tid` INT(11),
    FOREIGN KEY (eid) REFERENCES zoo_employee(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tid) REFERENCES zoo_tour(id) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (eid, tid)
    )ENGINE = INNODB;
    
LOCK TABLES `zoo_employee_tour` WRITE;
INSERT INTO `zoo_employee_tour` VALUES 
(1, 1),
(2, 1),
(2, 2),
(1, 3);
UNLOCK TABLES; 

DROP TABLE IF EXISTS `zoo_animal_tour`;
CREATE TABLE `zoo_animal_tour`(
    `aid` INT(11),
    `tid` INT(11),
    FOREIGN KEY (aid) REFERENCES zoo_animal(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tid) REFERENCES zoo_tour(id) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (aid, tid)
    )ENGINE = INNODB;
       
LOCK TABLES `zoo_animal_tour` WRITE;
INSERT INTO `zoo_animal_tour` VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 3),
(5, 2);
UNLOCK TABLES;     