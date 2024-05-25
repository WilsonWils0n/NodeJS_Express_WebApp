
/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

/*               Header generator                    */

/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

const headerCanvas = document.createElement("canvas");
      headerCanvas.id = "headerCanvas";

const ctx = headerCanvas.getContext("2d");

// function for drawing header gradient effect (on mousemove)
const mouseMoveOverlayEffect = (e) => {
    ctx.clearRect(0, 0, headerCanvas.width, headerCanvas.height); // clear headerCanvas each drawing cycle

    let opacity = 0.2; // default opacity for gradient

    // slowly fade the gradient the further the mouse moves from the header
    if (e.clientY > headerCanvas.height) {
        opacity = opacity - (e.clientY - headerCanvas.height) / (headerCanvas.height * 2 - headerCanvas.height) * opacity;
    }

    // create gradient
    let radialGradient = ctx.createRadialGradient(e.clientX, e.clientY, 0, e.clientX, e.clientY, 1.5 * headerCanvas.height);
        radialGradient.addColorStop(0, `rgba(255, 255, 255,${opacity})`);
        radialGradient.addColorStop(1, "rgba(0,0,0,0)");

    // draw gradient
    ctx.fillStyle = radialGradient;
    ctx.fillRect(0, 0, headerCanvas.width, headerCanvas.height);
}

// (re-)calculate dimensions of headerCanvas when the window is resized
const establishHeaderCanvasDimensions = () => {
    headerCanvas.width = window.innerWidth;

    const nav = document.querySelector("nav.header");
    headerCanvas.height = nav.getBoundingClientRect().height;
}

// if mouse leaves document (documentElement basically means <html>), hide headerCanvas
document.documentElement.addEventListener("mouseleave", (e) => {
    headerCanvas.style.display = "none";
});

// if mouse (re-)enters document, show headerCanvas
document.documentElement.addEventListener("mouseenter", (e) => {
    headerCanvas.style.display = "initial";
});

// whenever the mouse moves, update the header gradient effect according to the position of mouse
window.addEventListener("mousemove", mouseMoveOverlayEffect);

// self-explanitory
window.addEventListener("resize", establishHeaderCanvasDimensions);



/* $---$---$---$---$---$---$---$---$---$---$ */

/*              Mobile Navigation            */

/* $---$---$---$---$---$---$---$---$---$---$ */



const mobileHeaderButton = document.querySelector("div.header__mobile-navigation");
const mobileHeader = document.querySelector(".mobile-header");

mobileHeaderButton.addEventListener("click", (e) => {
    mobileHeaderButton.classList.toggle("header__mobile-navigation--active");
    mobileHeader.classList.toggle("mobile-header--active");
});

window.addEventListener("resize", (e) => {
    if (mobileHeaderButton.classList.contains("header__mobile-navigation--active")) {
        mobileHeaderButton.classList.remove("header__mobile-navigation--active");
    }
});


/* $---$---$---$---$---$---$---$---$---$---$ */

/*              On Window load               */

/* $---$---$---$---$---$---$---$---$---$---$ */

// When window is loaded, add <canvas id="headerCanvas"> after the <nav> element
window.addEventListener("load", (e) => {
    const nav = document.querySelector("nav.header");
    nav.insertAdjacentElement("afterend", headerCanvas);

    establishHeaderCanvasDimensions(e);
});

/* $---$---$---$---$---$---$---$---$---$---$ */

/*                  Log in                   */

/* $---$---$---$---$---$---$---$---$---$---$ */

const [loginButton, cartButton] = document.querySelectorAll(".header__login");

loginButton.addEventListener("click", (e) => {
    if (User.isLoggedIn) {
        window.location.href = `${$dir}/profile`;
    } else {
        window.location.href = `${$dir}/login`;
    }
});

window.addEventListener("login", (e) => {
    setTimeout(() => {
        sessionStorage.loginImage = `${$dir}/media/profile-logged-in.png`;
        loginButton.style.backgroundImage = `url('${$dir}/media/profile-logged-in.png')`;

        sessionStorage.cartButtonDisplay = "block";
        cartButton.style.display = "block";
        loginButton.style.padding = "0";
    }, 1000);
});

window.addEventListener("logout", (e) => {
    sessionStorage.cartButtonDisplay = "none";
    cartButton.style.display = "none";
});

cartButton.style.display = sessionStorage.cartButtonDisplay;
if (User.isLoggedIn) {
    loginButton.style.backgroundImage = `url('${sessionStorage.loginImage}')`;
    loginButton.style.padding = "0";
}

cartButton.addEventListener("click", (e) => {
    if (User.isLoggedIn) {
        sessionStorage.booking = "true";
        window.location.href = `${$dir}/profile`;
    } else {
        window.location.href = `${$dir}/login`;
    }
});

/* $---$---$---$---$---$---$---$---$---$---$ */

/*               Global popup                */

/* $---$---$---$---$---$---$---$---$---$---$ */


const glob = new globalBuilder();

