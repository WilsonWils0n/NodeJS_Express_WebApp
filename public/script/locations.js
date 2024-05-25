
/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

/*                Locations page content             */

/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

const scrollSpace1 = new ScrollSpace(null, 0);

/* main */

const main = new mainBuilder();
    main.appendTo(document.querySelector("nav.header"));

const abstract = new abstractArtBuilder(scrollSpace1);
    abstract.setAnimation("fade-in_scale", 1.25, 1);
    abstract.startAnimation();
    abstract.appendTo(main);


/* content space */

const locationsSection = new sectionBuilder(scrollSpace1, "Locations", "section");
    locationsSection.setAnimation("fade-in_slide", 1.25);
    locationsSection.appendTo(main);

const locationContent = new contentBuilder(scrollSpace1);
    locationContent.setAnimation("fade-in_scale", 0.5);
    locationContent.appendTo(locationsSection);

const locationHeading = new headingBuilder(scrollSpace1, "Where to watch your movie?", 2);
    locationHeading.appendTo(locationContent);

//embedded location map to show locations of MovieZone cinemas

const map = new embedBuilder(scrollSpace1, src="//umap.openstreetmap.fr/nl/map/kaart-zonder-naam_893727?scaleControl=true&miniMap=false&scrollWheelZoom=true&zoomControl=true&allowEdit=false&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=false&datalayersControl=true&onLoadPanel=undefined&captionBar=false&locateControl=false&measureControl=false&editinosmControl=false#9/52.2892/4.8230");
    map.setAnimation("fade-in_scale", 0.4, 0.25);
    map.appendTo(locationContent);

//locations, textual indication of our MovieZone locations

const amsterdamHeading = new headingBuilder(scrollSpace1, "Amsterdam", 3);
    amsterdamHeading.root.classList.add("location__header--left");
    amsterdamHeading.appendTo(locationContent);

const amsterdamLocations = new listBuilder(
    scrollSpace1, "unordered", 
    "MovieZone Amsterdam, Kleine-Gartmanplantsoen 15, 1017RP Amsterdam"
);
    amsterdamLocations.root.classList.add("locations--left");
    amsterdamLocations.appendTo(amsterdamHeading);

const haarlemHeading = new headingBuilder(scrollSpace1, "Haarlem", 3);
    haarlemHeading.root.classList.add("location__header--left");
    haarlemHeading.appendTo(locationContent);

const haarlemLocations = new listBuilder(
    scrollSpace1, "unordered", 
    "MovieZone Haarlem, Zijlvest 43, 2011VB Haarlem"
);
    haarlemLocations.root.classList.add("locations--left");
    haarlemLocations.appendTo(haarlemHeading);

const hilversumHeading = new headingBuilder(scrollSpace1, "Hilversum", 3);
    hilversumHeading.root.classList.add("location__header--left");
    hilversumHeading.appendTo(locationContent);

const hilversumLocations = new listBuilder(
    scrollSpace1, "unordered", 
    "MovieZone Hilversum, Langgewenst 55, 1211 BB Hilversum"
);
    hilversumLocations.root.classList.add("locations--left");
    hilversumLocations.appendTo(hilversumHeading);

const utrechtHeading = new headingBuilder(scrollSpace1, "Utrecht", 3);
    utrechtHeading.root.classList.add("location__header--left");
    utrechtHeading.appendTo(locationContent);

const utrechtLocations = new listBuilder(
    scrollSpace1, "unordered", 
    "MovieZone Jaarbeurs, Jaarbeursplein 6, 3521 AL Utrecht",
    "MovieZone Utrecht Oost, Leuvenlaan 19, 3584 CE Utrecht"
);
    utrechtLocations.root.classList.add("locations--left");
    utrechtLocations.appendTo(utrechtHeading);

const zaandamHeading = new headingBuilder(scrollSpace1, "Zaandam", 3);
    zaandamHeading.root.classList.add("location__header--left");
    zaandamHeading.appendTo(locationContent);

const zaandamLocations = new listBuilder(
    scrollSpace1, "unordered",
    "MovieZone Zoetermeer, Oostwaarts 74, 2711 BB Zoetermeer" 
);
    zaandamLocations.root.classList.add("locations--left");
    zaandamLocations.appendTo(zaandamHeading);

// display all elements on page 1
scrollSpace1.processAppendQueue();