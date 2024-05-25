-- log definition
CREATE TABLE log (
	id INTEGER NOT NULL, 
	timestamp DATETIME, 
	method VARCHAR, 
	url VARCHAR, 
	headers VARCHAR, 
	body VARCHAR, 
	ip VARCHAR, 
	response_time INTEGER, 
	error_msg VARCHAR, 
	status_code INTEGER, 
	PRIMARY KEY (id)
);


-- movie definition
CREATE TABLE movie (
	id INTEGER NOT NULL, 
	name VARCHAR, 
	description VARCHAR, 
	duration INTEGER, 
	director VARCHAR, 
	cover_image VARCHAR, 
	genre VARCHAR, 
	"datePublished" DATETIME, 
	PRIMARY KEY (id)
);


-- "user" definition
CREATE TABLE user (
	name VARCHAR NOT NULL, 
	first_name VARCHAR, 
	last_name VARCHAR, 
	password VARCHAR, 
	email VARCHAR, 
	address VARCHAR, 
	credit_card VARCHAR, 
	PRIMARY KEY (name)
);


-- actor definition
CREATE TABLE actor (
	id INTEGER NOT NULL, 
	movie_id INTEGER, 
	actor_image VARCHAR, 
	name VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY(movie_id) REFERENCES movie (id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- schedule definition
CREATE TABLE schedule (
	id INTEGER NOT NULL, 
	playing_from DATETIME, 
	movie_id INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(movie_id) REFERENCES movie (id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- ticket_order definition
CREATE TABLE ticket_order (
	id INTEGER NOT NULL, 
	user VARCHAR, 
	order_date DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user) REFERENCES user (name) ON DELETE CASCADE ON UPDATE CASCADE
);


-- ticket definition
CREATE TABLE ticket (
	id INTEGER NOT NULL, 
	order_id INTEGER, 
	schedule_id INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(order_id) REFERENCES ticket_order (id) ON DELETE CASCADE ON UPDATE CASCADE, 
	FOREIGN KEY(schedule_id) REFERENCES schedule (id) ON DELETE CASCADE ON UPDATE CASCADE
);
