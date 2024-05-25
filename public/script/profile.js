
/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

/*               Profile page content                */

/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

const scrollSpaceProfile = new ScrollSpace(null, 0);

const scrollSpaceCart = new ScrollSpace(null, 0);

const scrollSpaceHistory = new ScrollSpace(null, 0);

const main = new mainBuilder();
    main.appendTo(document.querySelector("nav.header"));

const abstract = new abstractArtBuilder(scrollSpaceProfile);
    abstract.setAnimation("fade-in_scale", 1.25, 0.75);
    abstract.startAnimation();
    abstract.darken(0.7);
    abstract.appendTo(main);

const profileSection = new sectionBuilder(scrollSpaceProfile);
    profileSection.appendTo(main);

const profile = new profileBuilder(scrollSpaceProfile);
    profile.setAnimation("fade-in_scale", 1);
    profile.appendTo(profileSection);





const cartSection = new sectionBuilder(scrollSpaceCart, "cart");
    cartSection.setAnimation("fade-in_scale", 1);
    cartSection.appendTo(main);

const cart = new cartBuilder(scrollSpaceCart, scrollSpaceHistory);
    cart.appendTo(cartSection);
    scrollSpaceCart.onLoad = () => cart.loadItems();

const containerCart = new divBuilder(scrollSpaceCart, "button-group");
    containerCart.appendTo(cartSection);

const toProfileButtonCart = new buttonBuilder(scrollSpaceCart, "Profile").$C("button--standard", "button--margin");
    toProfileButtonCart.appendTo(containerCart);

const toOrdersButtonCart = new buttonBuilder(scrollSpaceCart, "Orders").$C("button--standard", "button--margin");
    toOrdersButtonCart.appendTo(containerCart);

toProfileButtonCart.authorizesNextSpace(scrollSpaceProfile, 0.4);
toOrdersButtonCart.authorizesNextSpace(scrollSpaceHistory, 0.4);




const historySection = new sectionBuilder(scrollSpaceHistory, "Orders");
    historySection.setAnimation("fade-in_slide", 1);
    historySection.appendTo(main);

const orderHistory = new orderBuilder(scrollSpaceHistory);
    orderHistory.appendTo(historySection);

const containerHistory = new divBuilder(scrollSpaceHistory, "button-group");
    containerHistory.appendTo(historySection);

const toProfileButtonHistory = new buttonBuilder(scrollSpaceHistory, "Profile").$C("button--standard", "button--margin");
    toProfileButtonHistory.appendTo(containerHistory);

const toCartButtonHistory = new buttonBuilder(scrollSpaceHistory, "Cart").$C("button--standard", "button--margin");
    toCartButtonHistory.appendTo(containerHistory);

toCartButtonHistory.authorizesNextSpace(scrollSpaceCart, 0.4);
toProfileButtonHistory.authorizesNextSpace(scrollSpaceProfile, 0.4);

scrollSpaceProfile.coupleSpaceTransition(profile.cart, scrollSpaceCart, 0.5);
scrollSpaceProfile.coupleSpaceTransition(profile.history, scrollSpaceHistory, 0.5);

if (!User.isLoggedIn) {
    window.location.href = "/login";
} else {
    const booking = sessionStorage.booking;
    if (booking === "true") {
        sessionStorage.setItem("booking", false);
        scrollSpaceCart.processAppendQueue();
    } else {
        scrollSpaceProfile.processAppendQueue();
    }
}

