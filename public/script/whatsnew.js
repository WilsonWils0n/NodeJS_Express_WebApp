
/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

/*               What's new? page content            */

/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

const scrollSpace = new ScrollSpace(null, 0);

//textual and image content of the page 
const pageContentText = [
                "Even though 2023 is only four months old, there is already a lot to look forward to, especially here at MovieZone. A number of eagerly awaited movies, as well as some you may not have known about up until now, will be released this year. We've put together the following article to help you set up your visit to MovieZone and decide which movies of March and April you'd like to see.",
                "Condemned by the tyrannical High Table to be on the run for the rest of his life, deadly assassin maestro John Wick (2014) embarks on a Sisyphean mission of suicidal fury to decide his fate after the merciless carnage in John Wick 3: Parabellum (2019). At last, John's violent journey, fuelled by vengeance and grief, ultimately leads him to a fateful confrontation with his former employers, the crime masters that forced him into exile. And as the blood-stained vendetta to destroy those who pull the strings continues, old companions face the brutal consequences of friendship, and all-powerful, well-connected adversaries emerge to bring Wick's head on a platter. But talk is cheap--now guns have the final say. Can Baba Yaga, make every bullet count in this bloody, once-and-for-all struggle for freedom? Find out at MovieZone!",
                "For the first time, the iconic global entertainment brands Illumination and Nintendo join forces to create The Super Mario Bros. Movie, a new, big-screen adventure starring one of pop culture’s most prominent plumbers of the past four decades. Based on the world of Nintendo’s Mario games, the film invites audiences into a vibrant, thrilling new universe unlike any created before in an action-packed, exuberant cinematic comedy event. While working underground to fix a water main, Brooklyn plumbers Mario (Chris Pratt; Jurassic World and The LEGO Movie franchises) and brother Luigi (Charlie Day; It’s Always Sunny in Philadelphia) are transported down a mysterious pipe and wander into a magical new world. But when the brothers are separated, Mario embarks on an epic quest to find Luigi.",
                "In 2002 Los Angeles, a young Adonis Creed sneaks out with his best friend, Golden Gloves champion Damian \"Diamond Dame\" Anderson, to watch Dame compete in an underground boxing match. After Dame's victory, Dame tells Donnie about his aspirations to turn professional and become a world champion. Some years later and Adonis (Michael B. Jordan) has been dominating the boxing world, and he has been thriving in both his career and family life. But when his childhood friend and as mentioned former boxing prodigy Damian (Jonathan Majors) resurfaces after serving a long sentence in prison, he is eager to prove that he deserves his shot in the ring. The face off between former friends becomes more than just a fight.",
                "In 1984, the Oregon-based company Nike is on the verge of bankruptcy due to low footwear sales. In response to this, chairman Rob Strasser, along with co-founder Phil Knight, hires fellow salesman Sonny Vaccaro to come up with a new pitch for a shoeline based on current American sports. Air is a 2023 American biographical sports drama film directed by Ben Affleck from a screenplay written by Alex Convery. It is based on true events about the origin of Air Jordan, a basketball shoeline, of which a Nike employee seeks to strike a business deal with rookie player Michael Jordan.",
                "After a catastrophic crash on an unknown planet, pilot Mills quickly discovers he's actually stranded on Earth. 65 million years ago. Now, with only one chance at rescue, Mills and the only other survivor, Koa, must make their way across an unknown terrain riddled with dangerous prehistoric creatures in an epic fight to survive."
            ]

const pageContentImagery = ["./media/whatsnew/john_wick_chapter_4.jpg","./media/whatsnew/the_super_mario_bros_movie.jpg", "./media/whatsnew/creed_iii.jpg", "./media/whatsnew/air.jpg", "./media/whatsnew/65.jpg"]

/* main */

const main = new mainBuilder();
    main.appendTo(document.querySelector("nav.header"));

const abstract = new abstractArtBuilder(scrollSpace);
    abstract.setAnimation("fade-in_scale", 1.25, 1);
    abstract.startAnimation();
    abstract.appendTo(main);

/* space 1: content */

const whatsNewSextion = new sectionBuilder(scrollSpace, "What's new?", "section");
    whatsNewSextion.setAnimation("fade-in_slide", 1.25);
    whatsNewSextion.appendTo(main);

const whatsNewContent = new contentBuilder(scrollSpace);
    whatsNewContent.setAnimation("fade-in_scale", 0.5);
    whatsNewContent.appendTo(whatsNewSextion);

const whatsNewHeading = new headingBuilder(scrollSpace, "New releases", 2);
    whatsNewHeading.appendTo(whatsNewContent);

const introductionText = new parBuilder(scrollSpace, pageContentText[0]);
    introductionText.setAnimation("fade-in", 0.5);
    introductionText.appendTo(whatsNewContent);

const criticsHeading = new headingBuilder(scrollSpace, "Newly released movies in March & April of 2023", 2);
    criticsHeading.appendTo(whatsNewContent);

//John Wick Chapter 4
const posterJohnWick = new figBuilder(
        scrollSpace, 
        pageContentImagery[0],
        "image of movie whatsNewer JohnWick Garlington.",
        null,
        "figure-float-left",
);
posterJohnWick.setAnimation("fade-in_scale", 0.6, 0.25);
posterJohnWick.root.classList.add("figure--responsive-round");
posterJohnWick.appendTo(whatsNewContent);

const whatsNewJohnWickHeading = new headingBuilder(scrollSpace, "1: John Wick: Chapter 4#(#source-1){[1]}", 3);
    whatsNewJohnWickHeading.appendTo(whatsNewContent);
    whatsNewJohnWickHeading.setAnimation("fade-in", 0.5);
    whatsNewJohnWickHeading.setLinkClasses("hyperlink", "sup");

const whatsNewJohnWick = new parBuilder(scrollSpace, pageContentText[1]);
    whatsNewJohnWick.setAnimation("fade-in", 0.5);
    whatsNewJohnWick.appendTo(whatsNewContent);

//The Super Mario Bros. movie
const posterSuperMario = new figBuilder(
        scrollSpace, 
        pageContentImagery[1],
        "image of movie whatsNewer Don Shanahan.",
        null,
        "figure-float-right",
);
posterSuperMario.setAnimation("fade-in_scale", 0.6, 0.25);
posterSuperMario.root.classList.add("figure--responsive-round");
posterSuperMario.appendTo(whatsNewContent);

const whatsNewSuperMarioHeading = new headingBuilder(scrollSpace, "2: The Super Mario Bros. Movie#(#source-2){[2]}", 3);
    whatsNewSuperMarioHeading.appendTo(whatsNewContent);
    whatsNewSuperMarioHeading.setAnimation("fade-in", 0.5);
    whatsNewSuperMarioHeading.setLinkClasses("hyperlink", "sup");

const whatsNewSuperMario = new parBuilder(scrollSpace, pageContentText[2]);
    whatsNewSuperMario.setAnimation("fade-in", 0.5);
    whatsNewSuperMario.appendTo(whatsNewContent);

//Creed III
const posterCreed = new figBuilder(
        scrollSpace, 
        pageContentImagery[2],
        "image of movie whatsNewer Creed Lyles.",
        null,
        "figure-float-left",
);
posterCreed.setAnimation("fade-in_scale", 0.6, 0.25);
posterCreed.root.classList.add("figure--responsive-round");
posterCreed.appendTo(whatsNewContent);

const whatsNewCreedHeading = new headingBuilder(scrollSpace, "3: Creed III#(#source-3){[3]}", 3);
    whatsNewCreedHeading.appendTo(whatsNewContent);
    whatsNewCreedHeading.setAnimation("fade-in", 0.5);
    whatsNewCreedHeading.setLinkClasses("hyperlink", "sup");

const whatsNewCreed = new parBuilder(scrollSpace, pageContentText[3]);
    whatsNewCreed.setAnimation("fade-in", 0.5);
    whatsNewCreed.appendTo(whatsNewContent);

//Air
const posterAir = new figBuilder(
        scrollSpace, 
        pageContentImagery[3],
        "image of movie whatsNewer Air Berardinelli.",
        null,
        "figure-float-right",
);
posterAir.setAnimation("fade-in_scale", 0.6, 0.25);
posterAir.root.classList.add("figure--responsive-round");
posterAir.appendTo(whatsNewContent);

const whatsNewAirHeading = new headingBuilder(scrollSpace, "4: Air#(#source-4){[4]}", 3);
    whatsNewAirHeading.appendTo(whatsNewContent);
    whatsNewAirHeading.setAnimation("fade-in", 0.5);
    whatsNewAirHeading.setLinkClasses("hyperlink", "sup");

const whatsNewAir = new parBuilder(scrollSpace, pageContentText[4]);
    whatsNewAir.setAnimation("fade-in", 0.5);
    whatsNewAir.appendTo(whatsNewContent);


//65
const poster65 = new figBuilder(
    scrollSpace, 
    pageContentImagery[4],
    "image of movie whatsNewer Air Berardinelli.",
    null,
    "figure-float-left",
);
poster65.setAnimation("fade-in_scale", 0.6, 0.25);
poster65.root.classList.add("figure--responsive-round");
poster65.appendTo(whatsNewContent);

const whatsNew65Heading = new headingBuilder(scrollSpace, "5: 65#(#source-4){[4]}", 3);
    whatsNew65Heading.appendTo(whatsNewContent);
    whatsNew65Heading.setAnimation("fade-in", 0.5);
    whatsNew65Heading.setLinkClasses("hyperlink", "sup");

const whatsNew65 = new parBuilder(scrollSpace, pageContentText[5]);
whatsNew65.setAnimation("fade-in", 0.5);
whatsNew65.appendTo(whatsNewContent);

//Sources 
const sourcesHeading = new headingBuilder(scrollSpace, "Sources");
    sourcesHeading.root.classList.add("sources__header--left");
    sourcesHeading.setAnimation("fade-in", 0.5);
    sourcesHeading.appendTo(whatsNewContent);

const sourcesList = new listBuilder(
    scrollSpace, 
    "ordered",
    "#(https://www.imdb.com/title/tt10366206/plotsummary/){IMDb John Wick: Chapter 4}##source-1",
    "#(https://www.thesupermariobros.movie/synopsis/){Super Mario Bros. Movie synopsis}##source-2",
    "#(https://www.imdb.com/title/tt11145118/plotsummary/){IMDb Creed III}##source-3",
    "#(https://www.imdb.com/title/tt16419074/){IMDb Air}##source-4",
    "#(https://www.imdb.com/title/tt12261776/plotsummary/){IMDb 65}##source-4",
);
    sourcesList.setListAnimation(0.6, 0.25);
    sourcesList.addLinkAttribute("target", "_blank", "all");
    sourcesList.appendTo(whatsNewContent);

// display all elements on the page
scrollSpace.processAppendQueue();