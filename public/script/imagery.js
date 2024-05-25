
/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

/*               Imagagery generator                 */

/* $---$---$---$---$---$---$---$---$---$---$---$---$ */

const header  = document.querySelector("nav.header");

const fullScreenBlackout = document.createElement("div");
    fullScreenBlackout.classList.add("fullscreen-blackout");
    
let fullScreen = new figBuilder(
    null, 
    null,
    "full-screen-image",
    null,
    "figure-highlight"
);

fullScreenBlackout.appendChild(fullScreen.root);

header.insertAdjacentElement("afterend", fullScreenBlackout);

window.addEventListener("click", (e) => {
    const isActive =  fullScreen.root.classList.contains("figure-highlight--active")
    fullScreen.root.classList.remove("figure-highlight--active");
    fullScreenBlackout.classList.remove("fullscreen-blackout--active");
    fullScreenBlackout.style.pointerEvents = "none";
    if (e.target.nodeName === "IMG" && !isActive) {
        fullScreen.root.querySelector("img").src = e.target.src;
        fullScreen.root.querySelector("img").alt = e.target.alt;

        fullScreenBlackout.classList.toggle("fullscreen-blackout--active");
        fullScreen.root.classList.toggle("figure-highlight--active");
        fullScreenBlackout.style.pointerEvents = "all";
    }
});

window.addEventListener("scroll", (e) => {
    fullScreenBlackout.classList.remove("fullscreen-blackout--active");
    fullScreen.root.classList.remove("figure-highlight--active");
});