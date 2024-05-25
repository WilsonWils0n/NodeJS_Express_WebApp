
/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

/*               Schedule page content               */

/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

const movieID = parseInt(sessionStorage.movieID) || null;

const scrollSpaceSchedule = new ScrollSpace(10, 0);

const main = new mainBuilder();
    main.appendTo(document.querySelector("nav.header"));

const abstract = new abstractArtBuilder(scrollSpaceSchedule);
    abstract.setAnimation("fade-in_scale", 1.25, 0.75);
    abstract.startAnimation();
    abstract.appendTo(main);

const scheduleSec = new sectionBuilder(scrollSpaceSchedule, "Schedule");
    scheduleSec.setAnimation("fade-in", 1);
    scheduleSec.appendTo(main);

const movieSchedule = new movieTimeLineBuilder(scrollSpaceSchedule);
    movieSchedule.configure(movieID);
    movieSchedule.setAnimation("fade-in", 1);   
    movieSchedule.appendTo(scheduleSec);

scrollSpaceSchedule.processAppendQueue();

sessionStorage.movieID = "";