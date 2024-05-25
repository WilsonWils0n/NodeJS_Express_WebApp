
/* $---$---$---$---$---$---$---$---$---$---$---$ */

/*                Home page content              */

/* $---$---$---$---$---$---$---$---$---$---$---$ */


/* ScrollSpaces */

const scrollSpaceTheater = new ScrollSpace(null, 0);
      scrollSpaceTheater.setProblematic("FIGURE");

const scrollSpaceActor = new ScrollSpace(100, 0);

/* Main Element */


const main = new mainBuilder();
    main.appendTo(document.querySelector("nav.header"));



const actorSpaceProxy = (scrollSpace) => {
    const abstract = new abstractArtBuilder(scrollSpace);
        abstract.setAnimation("fade-in_scale", 1.25, 0.75);
        abstract.startAnimation();
        abstract.appendTo(main);

    const actorSection = new sectionBuilder(scrollSpace, "About");
        actorSection.setAnimation("fade-in_scale", 1.25);
        actorSection.appendTo(main);

    const aboutDivision = new divBuilder(scrollSpace, "about");
        aboutDivision.appendTo(actorSection);

    const descHeading = new headingBuilder(scrollSpace, "Description");
        descHeading.setAnimation("fade-in_slide-right", 0.5, 0.2);
        descHeading.appendTo(aboutDivision);

    const desc = new parBuilder(scrollSpace, scrollSpace.storage.ticketObj.description || "No description provided");
        desc.setAnimation("fade-in_slide-right", 0.5, 0.3);
        desc.appendTo(aboutDivision);

    const dirHeading = new headingBuilder(scrollSpace, "Director");
        dirHeading.setAnimation("fade-in_slide-right", 0.5, 0.4);
        dirHeading.appendTo(aboutDivision);

    const dir = new parBuilder(scrollSpace, scrollSpace.storage.ticketObj.director || "No director provided");
        dir.setAnimation("fade-in_slide-right", 0.5, 0.5);
        dir.appendTo(aboutDivision);

    const actorHeading = new headingBuilder(scrollSpace, "Actors");
        actorHeading.setAnimation("fade-in_slide-right", 0.5, 0.6);
        actorHeading.appendTo(aboutDivision);

    const actorCards = new actorCardsBuilder(scrollSpace);
        actorCards.load(scrollSpace.storage.ticketObj.movie_id);
        actorCards.setCardAnimation(0.4);
        actorCards.appendTo(aboutDivision);

    const backButton = new buttonBuilder(scrollSpace, "Back").$C("button--standard", "button--red");
        backButton.setAnimation("fade-in", 0.5);
        backButton.appendTo(aboutDivision);
        backButton.authorizesNextSpace(scrollSpaceTheater, 0.4);
}


/* Abstract */


const abstract = new abstractArtBuilder(scrollSpaceTheater);
    abstract.setAnimation("fade-in_scale", 1.25, 0.75);
    abstract.startAnimation();
    abstract.appendTo(main);


/* Movie Section */


const moviesSection = new sectionBuilder(scrollSpaceTheater);
    moviesSection.appendTo(main);

const movieSlider = new movieSliderBuilder(scrollSpaceTheater, 9);
    movieSlider.setAnimation("fade-in_slide-right", 1.5, 0);
    movieSlider.ticket.aboutScrollSpace = {
        scrollSpace: scrollSpaceActor,
        scrollSpaceProxy: actorSpaceProxy,
    }
    movieSlider.onSelect = () => abstract.darken(0.3);
    movieSlider.appendTo(moviesSection);

const movieListTitle = new titleBuilder(scrollSpaceTheater, "Browse");
    movieListTitle.setAnimation("fade-in_scale", 1);
    movieListTitle.appendTo(moviesSection);

const movieList = new movieListBuilder(scrollSpaceTheater, 6);
    movieList.aboutScrollSpace = {
        scrollSpace: scrollSpaceActor,
        scrollSpaceProxy: actorSpaceProxy,
    }
    movieList.setAnimation("fade-in_slide", 1);
    movieList.appendTo(moviesSection);


// Show Elements within Theatre Space
scrollSpaceTheater.processAppendQueue();


/* Actor Section */
