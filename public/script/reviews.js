
/* $---$---$---$---$---$---$---$---$---$---$---$ */

/*               Review page content             */

/* $---$---$---$---$---$---$---$---$---$---$---$ */

const scrollSpace1 = new ScrollSpace(-50, 0);
    scrollSpace1.setProblematic("LI"); // automatically corrects animation delay of <li> elements if not all in view at once

// textual and image content of the page 
const pageContentText = [
    `As we approach a new movie month we again decided to highlight 4 new movie reviews by your favorite critics. Movies that have been reviewed this month are: "Dungeons & Dragons: Honor Among Thieves (2023)", "Creed III (2023)", "John Wick: Chapter 4 (2023)" and "Avatar: The Way of Water (2022)". Having trouble deciding which flicks to see this month? We can assure you that after reading these reviews from top critics featured on rottentomatoes.com, you are bound to know which movie you want to see because, small spoiler alert, this month's lineup is jam-packed with high ratings.`,
    `"The performances are all spot-on starting with Chris Pine whose charisma allows him to be brazenly silly but also believably warm-hearted. Page is a lot of fun, right up until he vanishes. And Rodriguez, who's no stranger to tough-girl roles, really shines. Then of course there's Hugh Grant, so perfectly cast as the film's roguish yet delightfully goofy antagonist. There's even one particularly great cameo that everyone should enjoy. Admittedly, while I liked “Honor Among Thieves”, I wasn't as into its overall story as I wanted to be. That said, much of the enjoyment comes from simply hanging out with this ragtag group as they bop along to fantastical locales, encounter creatures of all kinds, and learn to work together in the process. Along the way we're treated to some good laughs, some exciting action, and some fun camaraderie. It makes this a considerably more entertaining experience than I first expected. And it's one worth catching on the big screen" - Keith Garlington from Keith and the movies rated Dungeons & Dragons: Honor Among Thieves 3.5 stars out of 5 stars.`,
    `"In two sharply-composed hours willing to embrace that kind of empathy, Michael B. Jordan and his collaborators offer welcome and compelling depth to go along with the satiation for fisticuffs that fit the humble origins and comfort zones of this now two-pronged franchise that began nearly a half-century ago. The likes of Stallone and the Winkler family are still around as bankrolling producers, but Creed III is a huge, springboarding assertion that this series has evolved to become Michael B. Jordan's flagship and legacy now. With that aforementioned and assured timing, focus, and control in mind, this sports opus couldn't be in better taped-up, prepared, and hardened hands." - Don Shanahan from Filmobsessive rated Creed III 4 stars out of 5 stars.`,
    `"Sorry, every other action film coming in 2023. You're competing for second place at best after John Wick: Chapter 4. It doesn't even make sense that the fourth installment of this series is so entertaining and ridiculous in the best way possible. If nothing else, Chapter 4 cements John Wick as the preeminent action franchise of this generation with a legit claim to best shoot 'em up series ever. John Wick has been a perfect combination of insanely over the top action, breathtaking backdrops to all the carnage, colorfully memorable characters and an undeniable sense of cool. Chapter 4 plays out like the filmmakers took all the best elements of the previous three installments to make the ultimate, killer John Wick movie. From the first film's dazzling gun-fu, the mesmerizing cinematography of part 2 and the wild attack dog action from Chapter 3.`,
    `Jeffrey Lyles concluded his review with the following:`,
    `"After this installment, it's hard to see how another sequel would even be necessary beyond Reeves and Stahelski challenging themselves to make something close to one of the greatest action spectacles of all time." - Jeffrey Lyles from Lyles movie files rated John Wick: Chapter 4 10/10`,
    `"A quick comparison of The Way of Water with the most recent MCU release (which also has numerous underwater scenes), Wakanda Forever, illustrates how much bolder Cameron is when it comes to world-building, character arcs, and narrative trajectory. Compared to this film, even the best recent superhero entries feel stale and rote. The Way of Water excites both in terms of its visual presentation and the way in which it has been fashioned. There's an energy here that has been sadly absent from too many recent Hollywood blockbusters. For 2022, The Way of Water may not be the most intricately made or intellectually rigorous motion picture, but it exemplifies what “cinematic” means today." - James Berardinelli from Reelviews rated Avatar: The Way of Water 4/4 stars.`,
    `Still uncertain of which movie to see? Considering Jeffrey's review of "John Wick: Chapter 4 (2023)" and his rating of 10/10. This month, we chose to highlight the trailer of John Wick: Chapter 4, which you can currently book. You'll want to see John Wick: Chapter 4 after viewing the trailer, we're sure of it!`
]

// sources of imagery
const pageContentImagery = [
    "./media/reviews/keith-garlington.jpg",
    "./media/reviews/don-shanahan.jpg", 
    "./media/reviews/jeffrey-lyles.jpg", 
    "./media/reviews/james-berardinelli.jpg"
]


/* Main Element & Abstract */


const main = new mainBuilder();
    main.appendTo(document.querySelector("nav.header"));

const abstract = new abstractArtBuilder(scrollSpace1); // bubbles :)
    abstract.setAnimation("fade-in_scale", 1.25, 1);
    abstract.startAnimation();
    abstract.appendTo(main);


/* Review Content */


const reviewsSection = new sectionBuilder(scrollSpace1, "Reviews", "section");
    reviewsSection.setAnimation("fade-in_slide", 1.25);
    reviewsSection.appendTo(main);

const reviewContent = new contentBuilder(scrollSpace1);
    reviewContent.setAnimation("fade-in_scale", 1, 0.25);
    reviewContent.appendTo(reviewsSection);

const reviewHeading = new headingBuilder(scrollSpace1, "Movie reviews April", 2);
    reviewHeading.appendTo(reviewContent);

const introductionText = new parBuilder(scrollSpace1, pageContentText[0]);
    introductionText.setAnimation("fade-in", 0.5);
    introductionText.appendTo(reviewContent);

const criticsHeading = new headingBuilder(scrollSpace1, "The reviews", 2);
    criticsHeading.appendTo(reviewContent);


// KEITH's review
const imageKeith = new figBuilder(
        scrollSpace1, 
        pageContentImagery[0],
        "image of movie reviewer Keith Garlington.",
        null,
        "figure-float-left",
    );
    imageKeith.setAnimation("fade-in", 0.6);
    imageKeith.$C("figure--responsive-round");
    imageKeith.appendTo(reviewContent);

const reviewKeithHeading = new headingBuilder(scrollSpace1, "Keith Garlington on Dungeons & Dragons: Honor Among Thieves#(#source-1){[1]}", 3);
    reviewKeithHeading.setAnimation("fade-in", 0.5);
    reviewKeithHeading.appendTo(reviewContent);
    reviewKeithHeading.setLinkClasses("hyperlink", "sup");

const reviewKeith = new parBuilder(scrollSpace1, pageContentText[1]);
    reviewKeith.setAnimation("fade-in", 0.5);
    reviewKeith.appendTo(reviewContent);


// DON's review
const imageDon = new figBuilder(
        scrollSpace1, 
        pageContentImagery[1],
        "image of movie reviewer Don Shanahan.",
        null,
        "figure-float-right",
    );
    imageDon.setAnimation("fade-in", 0.6);
    imageDon.$C("figure--responsive-round");
    imageDon.appendTo(reviewContent);

const reviewDonHeading = new headingBuilder(scrollSpace1, "Don Shanahan on Creed III#(#source-2){[2]}", 3);
    reviewDonHeading.appendTo(reviewContent);
    reviewDonHeading.setLinkClasses("hyperlink", "sup");

const reviewDon = new parBuilder(scrollSpace1, pageContentText[2]);
    reviewDon.setAnimation("fade-in", 0.5);
    reviewDon.appendTo(reviewContent);


// JEFFREY's review
const imageJeffrey = new figBuilder(
        scrollSpace1, 
        pageContentImagery[2],
        "image of movie reviewer Jeffrey Lyles.",
        null,
        "figure-float-left",
    );
    imageJeffrey.setAnimation("fade-in", 0.6);
    imageJeffrey.$C("figure--responsive-round");
    imageJeffrey.appendTo(reviewContent);

const reviewJeffreyHeading = new headingBuilder(scrollSpace1, "Jeffrey Lyles on John Wick: Chapter 4#(#source-3){[3]}", 3);
    reviewJeffreyHeading.setAnimation("fade-in", 0.5);
    reviewJeffreyHeading.appendTo(reviewContent);
    reviewJeffreyHeading.setLinkClasses("hyperlink", "sup");

const reviewJeffreyPartOne = new parBuilder(scrollSpace1, pageContentText[3]);
    reviewJeffreyPartOne.setAnimation("fade-in", 0.5);
    reviewJeffreyPartOne.appendTo(reviewContent);

const reviewJeffreyPartTwo = new parBuilder(scrollSpace1, pageContentText[4]);
    reviewJeffreyPartTwo.setAnimation("fade-in", 0.5);
    reviewJeffreyPartTwo.appendTo(reviewJeffreyPartOne);

const reviewJeffreyPartThree = new parBuilder(scrollSpace1, pageContentText[5]);
    reviewJeffreyPartThree.setAnimation("fade-in", 0.5);
    reviewJeffreyPartThree.appendTo(reviewJeffreyPartTwo);


// JAMES's review
const imageJames = new figBuilder(
        scrollSpace1, 
        pageContentImagery[3],
        "image of movie reviewer James Berardinelli.",
        null,
        "figure-float-right",
    );
    imageJames.setAnimation("fade-in", 0.6);
    imageJames.$C("figure--responsive-round");
    imageJames.appendTo(reviewContent);

const reviewJamesHeading = new headingBuilder(scrollSpace1, "James Berardinelli on Avatar: The Way of Water#(#source-4){[4]}", 3);
    reviewJamesHeading.setAnimation("fade-in", 0.5);
    reviewJamesHeading.appendTo(reviewContent);
    reviewJamesHeading.setLinkClasses("hyperlink", "sup");

const reviewJames = new parBuilder(scrollSpace1, pageContentText[6]);
    reviewJames.setAnimation("fade-in", 0.5);
    reviewJames.appendTo(reviewContent);


// Featured trailer
const trailer = new embedBuilder(scrollSpace1, "https://www.youtube.com/embed/qEVUtrk8_B4");
     trailer.$C("float-right");
     trailer.setAnimation("fade-in_slide-right", 0.8);
     trailer.appendTo(reviewContent);

const trailerOfTheMonthHeading = new headingBuilder(scrollSpace1, "Trailer of the month", 3);
    trailerOfTheMonthHeading.setAnimation("fade-in", 0.6);
    trailerOfTheMonthHeading.appendTo(reviewContent);

const trailerOfTheMonth = new parBuilder(scrollSpace1, pageContentText[7]);
    trailerOfTheMonth.setAnimation("fade-in", 0.5);
    trailerOfTheMonth.appendTo(reviewContent);
   

// Sources 
const sourcesHeading = new headingBuilder(scrollSpace1, "Sources");
    sourcesHeading.setAnimation("fade-in", 0.5);
    sourcesHeading.$C("sources__header--left");
    sourcesHeading.appendTo(reviewContent);

const sourcesList = new listBuilder(
        scrollSpace1, 
        "ordered",
        "#(https://keithandthemovies.com/2023/04/03/review-dungeons-dragons-honor-among-thieves-2023/){Keith and the movies, REVIEW: “Dungeons & Dragons: Honor Among Thieves” (2023)}##source-1",
        "#(https://filmobsessive.com/film/new-releases/creed-iii-muscles-its-timing-focus-and-control-for-spectacle/){Filmobsessive, Creed III muscles its timing, focus, and control for spectacle}##source-2",
        "#(https://lylesmoviefiles.com/2023/03/31/john-wick-chapter-4-review/){Lyles movie files, John Wick: Chapter 4 review}##source-3",
        "#(https://www.reelviews.net/reelviews/avatar-the-way-of-water){Avatar: The Way of Water (United States, 2022)}##source-4",
    );
    sourcesList.setListAnimation(0.6, 0.25);
    sourcesList.addLinkAttribute("target", "_blank", "all");
    sourcesList.appendTo(reviewContent);


// display all elements on the page
scrollSpace1.processAppendQueue();