
/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

/*               Login page content                  */

/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

const scrollSpaceLogin = new ScrollSpace(100, 0);

const main = new mainBuilder();
    main.appendTo(document.querySelector("nav.header"));

const abstract = new abstractArtBuilder(scrollSpaceLogin);
    abstract.setAnimation("fade-in_scale", 1.25, 0.75);
    abstract.startAnimation();
    abstract.appendTo(main);

const registerSec = new sectionBuilder(scrollSpaceLogin);
    registerSec.setAnimation("fade-in_slide", 1);
    registerSec.appendTo(main);

const loginForm = new formBuilder(scrollSpaceLogin, "login");
    loginForm.fields = ["text", "password", "submit"];
    loginForm.body = ["username", "password"];
    loginForm.labels = ["username", "password"]
    loginForm.action = "login";
    loginForm.setFormAnimation(0.4, 0);
    loginForm.appendTo(registerSec);

const registerForm = new formBuilder(scrollSpaceLogin, "Register");
    registerForm.fields = ["text", "password", "email", "text", "number", "submit"];
    registerForm.body = ["username", "password", "email", "address", "creditCard"];
    registerForm.labels = ["username", "password", "e-mail", "address", "credit card"];
    registerForm.action = "register";
    registerForm.setFormAnimation(0.4, 0.25);
    registerForm.appendTo(registerSec);

scrollSpaceLogin.processAppendQueue();