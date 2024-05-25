                            _                          _            _   
                           | |                        | |          | |  
  _ __    ___    __ _    __| |  _ __ ___     ___      | |_  __  __ | |_ 
 | '__|  / _ \  / _` |  / _` | | '_ ` _ \   / _ \     | __| \ \/ / | __|
 | |    |  __/ | (_| | | (_| | | | | | | | |  __/  _  | |_   >  <  | |_ 
 |_|     \___|  \__,_|  \__,_| |_| |_| |_|  \___| (_)  \__| /_/\_\  \__|


 | This is our readme.txt file. Full-screen for right formatting.

                                                                        

   _____ _____   ____  _    _ _____    _____ _____  
  / ____|  __ \ / __ \| |  | |  __ \  |_   _|  __ \ 
 | |  __| |__) | |  | | |  | | |__) |   | | | |  | |
 | | |_ |  _  /| |  | | |  | |  ___/    | | | |  | |
 | |__| | | \ \| |__| | |__| | |       _| |_| |__| |
  \_____|_|  \_\\____/ \____/|_|      |_____|_____/ 
                                                    
                
 | Our group id is 19.  



  _   _          __  __ ______  _____ 
 | \ | |   /\   |  \/  |  ____|/ ____|
 |  \| |  /  \  | \  / | |__  | (___  
 | . ` | / /\ \ | |\/| |  __|  \___ \ 
 | |\  |/ ____ \| |  | | |____ ____) |
 |_| \_/_/    \_\_|  |_|______|_____/ 
   
                                   
 | Our names are:
 | Safouan Bolbaroud (4311752)
 | Bink Braspenning (2515016)
 | Jelmer Andre de la Porte (6578772)



  _      _____ _   _ _  __
 | |    |_   _| \ | | |/ /
 | |      | | |  \| | ' / 
 | |      | | | . ` |  <  
 | |____ _| |_| |\  | . \ 
 |______|_____|_| \_|_|\_\


 | You can find our website at the following link: http://webtech.science.uu.nl/group19/


                                                
  ________   _______  _               _   _       _______ _____ ____  _   _ 
 |  ____\ \ / /  __ \| |        /\   | \ | |   /\|__   __|_   _/ __ \| \ | |
 | |__   \ V /| |__) | |       /  \  |  \| |  /  \  | |    | || |  | |  \| |
 |  __|   > < |  ___/| |      / /\ \ | . ` | / /\ \ | |    | || |  | | . ` |
 | |____ / . \| |    | |____ / ____ \| |\  |/ ____ \| |   _| || |__| | |\  |
 |______/_/ \_\_|    |______/_/    \_\_| \_/_/    \_\_|  |_____\____/|_| \_|


 | Below follows an explanation of our website, to learn more about the structure of our application/codebase head to APPLICATION.
 | (scroll down)

 |<BRIEF EXPLANATION>| 
 | Our website speaks for itself, it is a very intuitive and easy to navigate website with pages that are entirely generated
 | through JavaScript. Pages include the index page where the user can book a movie as well as learn more about the movies 
 | currently playing. We also have a Reviews page, a What's New? page and a Locations page (pages to respectively inform the
 | user about reviews of movies that are currently playing, which new movies are available to order and the locations of our
 | imaginary cinema called MovieZone).
 | We also have a schedule page where the user can also order a movie by viewing the dates and times of all playing movies.
 | On the index page as well as the schedule page we have added functionalities like search functions using the Levenshtein
 | function. We also added the ability to filter by date and name on the schedule page. 


 |<SITE PROCESS>|
 |
 | Index page|
 | When you open our website you are greeted with a beautiful interface where
 | you can view a selection of some of the top movies playing at MovieZone. A user can click on a movie to read a short  
 | description. The user also has the ability to learn more about the director and actors of the movie on the about page.
 |
 | Ordering a movie ticket|
 | When the user has decided to watch a movie, the should either log in or register at the top right corner of our website. 
 | When the user is logged in, he/she can also view their account information when clicking on the user picture in the top right corner 
 | of our website. Here the user can view their order history, edit their information and log out.
 | After registering/logging in the user can now start to order a movie using the Book button that you he/she can find after clicking 
 | on a movie on the Index page.
 | Upon clicking on the Book button the user gets to select a time and date to watch their movie using our timeline interface.
 | After selecting the time and date from our timeline, the user gets prompted to indicate the amount of tickets wanted (maximum of 15).
 | All the user has to do now is confirming their order. After the user has confirmed their order they can visit one of our 
 | MovieZone cinemas at the locations listed on the Locations page. There is no difference between cinema except the location 
 | so a movie ticket is available at any one of the cinema's listed on the Locations page. Seating? Although we do guarantee the
 | user that he/she can watch their ordered movie at any of the listed locations on the ordered time and date. We do not guarantee 
 | that the user has a seat to sit at, so they might have to sit on the ground. MovieZone tickets are extremely cheap so you can't expect 
 | too much luxury for the price. 
 | The ordering of a movie ticket can also find place the other way around on our schedule page, where the user can select a movie of 
 | all movies on our timeline (so select a date and time first and then choose the movie you want to watch).



           _____  _____  _      _____ _____       _______ _____ ____  _   _ 
     /\   |  __ \|  __ \| |    |_   _/ ____|   /\|__   __|_   _/ __ \| \ | |
    /  \  | |__) | |__) | |      | || |       /  \  | |    | || |  | |  \| |
   / /\ \ |  ___/|  ___/| |      | || |      / /\ \ | |    | || |  | | . ` |
  / ____ \| |    | |    | |____ _| || |____ / ____ \| |   _| || |__| | |\  |
 /_/    \_\_|    |_|    |______|_____\_____/_/    \_\_|  |_____\____/|_| \_|

 |Below follows the structure of our application and code base with a small comment next to each relevant file (i.e no packages/images are explained) 
 
  > node_modules 		//folder containing all node modules used in our application.
  v public 			//folder containing scripts, media (pictures) and css files, essentially everthing used to provide our pages with content.
    v css 			//css folder containig css files.
      # footer.css 		//css styling of footer.
      # form-content.css        //css styling regarding user login form.                                                          
      # global.css		//css styling rules for all pages.                                                                     
      # header.css		//css styling of header.
      # imagery.css		//css styling for all imagery on our pages.
      # niche-content.css	//css styling for content like our movie slider, schedule timeline and so on.
      # table-content.css	//css styling for tables.
      # text-content.css	//css styling for all text based content.
      # tooltip.css		//css styling for tooltips used on informational pages.
    > media 			//folder contaning folders with images used on pages and images for our database to display to the user like movie posters.
    v script 			//folder containig javascript files used for our website, all content is generated through JS (except the 404 page).
      JS ajax.js		//JS file for common api requests.
      JS dynamic.js		//JS file containing a self written library of functions and classes to generate pages through JS.                                                
      JS header.js		//JS file to generate header.
      JS imagery.css		//JS file to generate imagery for page.
      JS locations.js		//JS file generating Locations page.
      JS login.js		//JS file generating Login page.
      JS profile.js		//JS file generating Profile page.
      JS reviews.js		//JS file generating Reviews page.
      JS schedule.js		//JS file generating Schedule page.
      JS theater.js		//JS file generating Index page and anything related to our homepage/index page.
      JS whatsnew.js		//JS file generating What's New? page.
  v routes 			//folder containing api and static file routes.
    JS api.js			//JS to route api calls.
    JS static.js		//JS to route calls to static files.
  > views 			//folder all pug files that are used to show our pages that are generated through JS to the visitor of our website.*
  JS app.js			//JS file which serves as the entry point of our application (not part of views, has no seperate folder).
  JS db.js			//JS file contains all fucntions that interact with our database (not part of views, has no seperate folder).
  JS middleware.js		//JS file contains all functions pertaining middleware (not part of views, has no seperate folder).
  DB movie.db			//DB file containing the sqlite database of our website (not part of views, has no seperate folder).
  {} package-lock.json		//JSON file that describes our dependencies and their versions. (not part of views, has no seperate folder).
  {} package.json		//JSON file that describes our project and dependencies. (not part of views, has no seperate folder).
  TX readme.txt			//TXT file, this readme file (not part of views, has no seperate folder).
  JS wrappers.js		//JS file (not part of views, has no seperate folder).

  //* Every pug file corresponds to a page. Almost every pug file consists of other pug files to include (header and so on) and their
  //own script to construct the content of the page. The file 404.pug is the only file that has no dedicated script to generate
  //it's content.



  _    _  _____ ______ _____   _____ 
 | |  | |/ ____|  ____|  __ \ / ____|
 | |  | | (___ | |__  | |__) | (___  
 | |  | |\___ \|  __| |  _  / \___ \ 
 | |__| |____) | |____| | \ \ ____) |
  \____/|_____/|______|_|  \_\_____/ 


 | Below follows table of all current registered users' names and passwords (you login with the name/username and password, both are case sensitive).
 
 ╔═══════════════╦═══════════════╗
 ║ name/username ║ password      ║
 ╠═══════════════╬═══════════════╣
 ║ johndoe       ║ John1234      ║
 ║ johnnotdoe    ║ John1234      ║
 ║ imjohndoe     ║ John1234      ║
 ║ user1         ║ PasswordUser1 ║
 ║ user2         ║ PasswordUser2 ║
 ║ user3         ║ PasswordUser3 ║
 ║ Hello         ║ HelloWorld1   ║
 ╚═══════════════╩═══════════════╝




   _____  ____  _        _____  ______ ______ _____ _   _ _______ _____ ____  _   _ 
  / ____|/ __ \| |      |  __ \|  ____|  ____|_   _| \ | |__   __|_   _/ __ \| \ | |
 | (___ | |  | | |      | |  | | |__  | |__    | | |  \| |  | |    | || |  | |  \| |
  \___ \| |  | | |      | |  | |  __| |  __|   | | | . ` |  | |    | || |  | | . ` |
  ____) | |__| | |____  | |__| | |____| |     _| |_| |\  |  | |   _| || |__| | |\  |
 |_____/ \___\_\______| |_____/|______|_|    |_____|_| \_|  |_|  |_____\____/|_| \_|
                                                                                    

 | Below follow the SQL defintions of our database.


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




                                                                  