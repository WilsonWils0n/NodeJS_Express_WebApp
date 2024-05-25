
/*

D Y N A M I C . J S

Huge file, used for dynamically loading every single page
Considering its size of over 2000 lines, it would be a good practice
to split it up, but I'm reluctant to do so because of time-constraints and
the fear of breaking something unforseen last-minute

*/

// Utils class, mainly (actually only) for array manipulations
class Utils {
    static arrayOverflow(array, increment) {
        const max       = Math.max(...array);
        const min       = Math.min(...array);
        const range     = max - min + 1;
        const shiftedN  = ((increment % range) + range) % range;

        return array.map((num) => {
            const newIndex = (num + shiftedN - min) % range + min;
            return newIndex < min ? max : newIndex;
        });
    }

    static arrayShift(array, shift) {
        const indices = Utils.arrayOverflow(
            [...new Array(array.length).keys()],
            shift
        );

        for (let i = 0; i < array.length; i++) {
            indices[i] = array[indices[i]];
        }

        return indices;
    }

    static arrayIndex(array, currentIndex, indexShift) {
        indexShift < 0 ? indexShift = indexShift + array.length : indexShift;
        return array[(currentIndex + indexShift) % array.length];
    }

    // de-duplicate an array based on a predicate
    static arrayDeduplicate(array, predicate) {
        return array.filter((entry, i) => {
            return !(array.findIndex(current => {
                return predicate(current, entry);
            }) !== i);
        });
    }

    // get the value between 2 substring. This used to be done with regex, but
    // safari was throwing a fit about that
    static altRegex(str, a, b) {
        const substrings = [];
        let startIndex = str.indexOf(a);
        while (startIndex !== -1) {
            const endIndex = str.indexOf(b, startIndex + a.length);
            if (endIndex !== -1) {
                substrings.push(str.slice(startIndex + a.length, endIndex));
            }
            startIndex = str.indexOf(a, endIndex + b.length);
        }
        return substrings;
    }
}

// 'struct' like object used to represent animations
class ScrollAnimation {
    constructor (element, className, speed, delay, parent) {
        this.element    = element;
        this.className  = className;
        this.speed      = speed;
        this.delay      = delay;
        this.parent     = parent;

        this.fired      = false;
        this.firing     = false;
        this.considered = false;
        this.oldDelay   = delay;
        this.existingClass = [...element.classList].slice(); // copy by value, not reference
    }
}

/* a 'ScrollSpace' is a stand-alone space which contains animations; all animations within this 'space' are
   tied to the scroll events of their respective 'space' */
class ScrollSpace {
    constructor(margin, threshold) {
        this.appendQueue    = [];
        this.animationQueue = [];

        this.problematic    = ["TR"];
        this.inTransition   = false;

        this.storage = {};

        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = this.animationQueue.find(e => entry.target === e.element);
                    if (animation.firing || animation.fired) return;
                    
                    this.#FIRE(animation);
                }
            });
        }, {
            threshold: threshold ? threshold : 0,
            rootMargin: `${margin || -50}px`
        });
    }

    set onLoad(value) {
        this.onLoadCallback = value;
    }

    #FIRE(animation) {
        animation.element.classList.remove("hidden");
                    
        setTimeout(() => {
            animation.fired  = true;
            animation.firing = false;
        }, (animation.speed + animation.delay) * 1000);

        // adjust delay accordingly when not loading all problematic elements at once
        if (this.problematic.includes(animation.element.nodeName)) {
            const isSameTable = (a,b) => this.problematic.includes(animation.element.nodeName) && a.parent === b.parent; 
            const fired = this.animationQueue.filter(a => a.fired && a.parent === animation.parent && !a.considered);

            const delays = fired.map(e => {
                e.considered = true;
                return e.delay;
            });

            const delaySubtraction = Math.max(...delays);

            const firing = this.animationQueue.find(a => a.firing && isSameTable(a,animation));

            this.animationQueue.forEach(a => {
                if (!a.fired && isSameTable(a,animation)) {
                    a.delay -= delaySubtraction < 0 || firing ? 0 : delaySubtraction;
                }
            });
        }

        animation.firing = true;

        animation.element.classList.add(animation.className);
        animation.element.style.setProperty("--anim_dur", `${animation.speed}s`);
        animation.element.style.setProperty("--anim_delay", `${animation.delay}s`);
    }

    setProblematic() {
        this.problematic.push(...arguments);
    }

    addElement(element) {
        this.observer.observe(element);
    }

    deleteElement(element) {
        this.observer.unobserve(element);
    }

    processAppendQueue() {
        for (let element of this.appendQueue) {
            if (element.attachment.root) {
                element.attachment.root.appendChild(element.root);
            } else {
                element.attachment.appendChild(element.root);
            }
        }
    }

    queue(elementBuild) {
        this.appendQueue.push(elementBuild);
    }

    closeSpace(speed) {
        const main = document.querySelector("main");
        main.classList.toggle("fade-out");
        main.style.setProperty("--anim_dur", `${speed}s`);
    }

    reopenSpace(callback, perserve) {
        if (this.onLoadCallback) this.onLoadCallback();
        if (callback && !perserve) {
            this.appendQueue.length = 0;
            this.animationQueue.length = 0;
            callback(this);
        } else if (callback && perserve) {
            callback(this);
        }
        const main = document.querySelector("main");
        main.classList.toggle("fade-out");

        this.animationQueue.forEach(animation => {
            this.resetAnimation(animation);
        });
    }

    resetElement(element) {
        const anim = this.animationQueue.find(animation => animation.element === element);
        this.resetAnimation(anim);
    }

    resetAnimation(anim) {
        anim.fired      = false;
        anim.considered = false;
        anim.delay      = anim.oldDelay;
        anim.element.classList.remove(...anim.element.classList);
        anim.element.classList.add(...anim.existingClass);
    }

    forceLoad(element, doReset) {
        const anim = this.animationQueue.find(animation => animation.element === element);
        anim.delay = 0;

        this.#FIRE(anim);
        if (doReset) setTimeout(() => this.resetAnimation(anim), anim.speed*1000);
    }

    coupleSpaceTransition(element, scrollSpace, speed, callback, perserve) {
        speed = speed || 0.7;

        element.addEventListener("click", (e) => {
            if (!this.inTransition) {
                this.inTransition = true;

                document.documentElement.scrollTop = 0;
                this.closeSpace(speed);
            
                setTimeout(() => {
                    const main = document.querySelector("main");
                    while (main.firstChild) {
                        main.removeChild(main.firstChild);
                    }

                    scrollSpace.reopenSpace(callback, perserve);
                    scrollSpace.processAppendQueue();

                    this.inTransition = false;
                }, speed*1000);
            }
        });
    }
}

// superclass of all ___Builder classes :)
class ElementBuilder {
    constructor(scrollSpace) {
        this.scrollSpace = scrollSpace;
        this.root        = null;
        this.attachment  = null;
    }

    get children() {
        return [...this.root.children];
    }

    appendTo(element) {
        this.attachment = element;
        this.scrollSpace.queue(this);
    }

    appendImmediately(element) {
        this.attachment = element;
        element.appendChild(this.root);
    }

    setAnimation(className, speed, delay) {
        speed = speed || 0.4; delay = delay === undefined || delay === null ? 0 : delay;

        this.scrollSpace.addElement(this.root);

        this.root.classList.add("hidden");

        this.scrollSpace.animationQueue.push(new ScrollAnimation(this.root, className, speed, delay, null));
    }

    $E(name, content, contentWrapper) {
        const classes = [...arguments].slice(3).filter(c => c);
        const element = document.createElement(name);
        element.classList.add(...classes);
        if (content) {
            content = this.parseContent(content, contentWrapper);
            element.append(...content);
        }

        return element;
    }

    $C() {
        this.root.classList.add(...arguments);
        if (arguments.length === 0) this.root.classList.remove(...this.root.classList);

        return this;
    }

    $A(attr, value) {
        if (attr && value) {
            this.root.setAttribute(attr, value);
        } else if (attr) {
            this.root.removeAttribute(attr);
        } else {
            while (this.root.attributes.length) {
                this.root.removeAttribute(elem.attributes[0].name);
            }
        }

        return this;
    }

    clearChildren(element, offset) {
        offset = offset === undefined || offset === null ? 0 : offset;
        if (element) {
            while (element.children[offset]) {
                element.removeChild(element.children[offset]);
            }
        } else {
            while (this.root.children[offset]) this.root.removeChild(this.root.children[offset]);
        }
    }

    callPopup(popup, onEvent, callback) { // broken, do not use
        this.root.addEventListener(onEvent, (e) => {
            popup.populate.call(this, e, callback);
        });
    }

    setTransitionTimeout(callback, margin) {
        margin = margin || 1;
        setTimeout(() => {
            callback();
        }, parseFloat(getComputedStyle(this.root).transitionDuration) * 1000 + margin);    
    }

    fadeIn() {
        this.root.classList.remove("opaque");
    }

    fadeOut() {
        this.root.classList.add("opaque");
    }

    /* Had to drop the regex because iOS was throwing a fit about it */
    parseContent(content, containerElement) {
        const hrefs = Utils.altRegex(content, "#(", ")"); // get all URIs
        const values = Utils.altRegex(content, "){", "}"); // get all text linked to the URIs

        // replace URIs & associated text with $a
        for (let match of [...hrefs, ...values]) {
            content = content.replaceAll(match, "$a");
        }

        // trim indicators
        content = content.replaceAll("#(", "");
        content = content.replaceAll("){$a}", "");

        // split on line breaks
        content = content.split("\n");

        let i = -1;
        content = content.map(entry => {
            let matches = entry.split("$a").join("||$a||").split("||") // split on $a, perserve $a
           
            matches = matches.map(m => {
                if (m.trim() === "$a") { // remove whitespace, check for match
                    i++;
                    return new hyperlinkBuilder(null, hrefs[i], values[i]).root; // if match, create link
                }
                return document.createTextNode(m); // else create text node
            });

            if (containerElement) { // if should be contained in containerElement, merge textNodes & link into containerElement
                const p = this.$E(containerElement);
                p.append(...matches); // append
                return p;
            }

            return matches; // return all containerElements; alternatively: textNodes/links
        });

        return content.flat(Infinity); // flatten the array in case no merging took place
    }

    setLinkClasses() {
        const links = this.root.querySelectorAll("a");

        links.forEach(link => {
            link.classList.remove(...link.classList);
            link.classList.add(...arguments);
        });
    }

    // add attributes to links, very specific use, only use on a heap of texts where you want to set an attribute
    // of a specific or multiple link/links. If you want to select specific link just use an integer starting from
    // 0, 0 denotes the first link. If you want to add it to multiple links you just use the value "all".
    addLinkAttribute(name, value, link) {
        const links = this.root.querySelectorAll("a");
        if (link === "all"){
            links.forEach(link => {
                link.setAttribute(name, value);
            });
        }
        else{
            links[link].setAttribute(name, value);
        }
    }

    static getScrollDistance(element) {
        let distance = element.offsetTop;
        let parent = element.offsetParent;

        while (parent) {
            distance += parent.offsetTop;
            parent = parent.offsetParent;
        }

        return distance;
    }
}


// builds counters which user can increment/decrement (like so:   -  4 +)
class counterBuilder extends ElementBuilder {
    constructor(scrollSpace) {
        super(scrollSpace);

        this.root = new divBuilder(scrollSpace, "counter").root;

        this.up = new buttonBuilder(scrollSpace, "+").$C("counter__up").root;
        this.down = new buttonBuilder(scrollSpace, "-").$C("counter__down").root;
        this.display = this.$E("div", "1x", null, "counter__display");

        this.root.append(this.down, this.display, this.up);

        this.up.addEventListener("click", (e) => {
            let counter = parseInt(this.display.textContent);
            if (counter + 1 > 15) counter = 15; else counter = counter += 1;
            this.display.textContent = `${counter}x`;
        });

        this.down.addEventListener("click", (e) => {
            let counter = parseInt(this.display.textContent);
            if (counter - 1 < 1) counter = 1; else counter = counter -= 1;
            this.display.textContent = `${counter}x`;
        });
    }

    get value() {
        return parseInt(this.display.textContent);
    }
}

// builds forms which can be send
class formBuilder extends ElementBuilder {
    constructor(scrollSpace, formTitle) {
        super(scrollSpace);

        this.root = this.$E("div", null, null, "form");
        
        if (formTitle) this.root.append(this.$E("h2", formTitle));

        this.reason = this.$E("span", null, null, "form__reason");
        this.formats = new listBuilder(scrollSpace, "unordered", "hello").$C("form__list");
        this.root.append(this.reason, this.formats.root);

        this.inputs = [];
        this.blank = [];

        this.focus = 0;
    }

    set fields(value) {
        for (let field of value) {
            let inputField;
            if (field !== "submit") {
                inputField = this.$E("input");
            } else {
                inputField = this.$E("button", "submit");
                this.submit = inputField;
            }
            inputField.setAttribute("type", field);
            this.inputs.push(inputField);
            this.root.append(inputField);
        }
    }

    set body(value) {
        this.inputs.forEach((input, i) => {
            input.setAttribute("name", value[i]);
        });
    }

    set labels(value) {
        this.placeHolders = value;
        this.inputs.forEach((input, i) => {
            input.setAttribute("placeholder", value[i]);
        });
    }

    set action(value) {
        this.formAction = value;

        this.#configureForSend();
    }

    setFormAnimation(speed, delay) {
        this.children.slice(2).forEach((child, i) => {
            this.scrollSpace.addElement(child);

            child.classList.add("hidden");

            this.scrollSpace.animationQueue.push(new ScrollAnimation(child, "fade-in_scale", speed, delay + 0.25 * i * speed, this.root));
        });
    }

    #highlight(input, message) {
        if (!input.classList.contains("input--blank")) {
            input.classList.add("input--blank");
            input.setAttribute("placeholder", `${message} ${this.placeHolders[this.inputs.indexOf(input)]}`);
        }
    }

    #dehighlight(input) {
        input.classList.remove("input--blank");
        input.setAttribute("placeholder", this.placeHolders[this.inputs.indexOf(input)]);
    }

    #configureForSend() {
        this.root.addEventListener("input", (e) => {
            if (!this.inputs.includes(e.target)) return;

            this.#dehighlight(e.target);
        });

        this.root.addEventListener("keydown", (e) => {
            if (e.key === "ArrowDown") {
                this.focus < this.inputs.length - 1 ? this.focus++ : this.focus = 0;
                this.inputs[this.focus].focus();
            } else if (e.key === "ArrowUp") {
                this.focus > 0 ? this.focus-- : this.focus = this.inputs.length - 1;
                this.inputs[this.focus].focus();
            } else if (e.key === "Enter") {
                this.root.querySelector("button").click();
            }
        });

        this.root.addEventListener("click", (e) => {
            if (!this.inputs.includes(e.target)) return;

            e.target.focus();
            this.focus = this.inputs.indexOf(e.target);
        });

        this.submit.addEventListener("click", async (e) => {
            if (this.pending) return;
            const data = {};
            this.blank = [];

            this.inputs.forEach((child, i) => {
                if (child.nodeName !== "INPUT") return;

                if (child.value.length === 0) {
                    this.#highlight(child, "empty");
                    this.blank.push({ input: child, reason: "blank" });
                 } else {
                    this.#dehighlight(child);
                 }

                data[child.name] = child.value;            
            });

            if (this.blank.length > 0) return;

            this.#send(data);
        });
    }

    async #send(data) {
        const title = this.root.querySelector("h2");

        this.reason.classList.remove("form__reason--active");
        this.formats.root.classList.remove("form__list--active");

        switch (this.formAction) {
            case "login":
                const loginRequest = await User.login(data.username, data.password);

                this.#onResponse(loginRequest, "Login Successful", () => {
                    title.textContent = "redirecting...";
                    window.location.href = $dir;
                });
                break;
            case "register":
                const registerRequest = await User.createUser(data);

                this.#onResponse(registerRequest, "New Account Created!", () => {
                    title.textContent = "redirecting...";
                    window.location.href = `${$dir}/profile`;
                });
                break;
            default:
                break;
        }
    }

    #onResponse(response, successTitle, successCallback, errorCallback) {
        const title = this.root.querySelector("h2");
        this.$C("form--pending");

        this.pending = true;

        setTimeout(() => {
            this.root.classList.remove("form--pending", "form--negative", "form--positive");
            this.reason.textContent = "";
            this.reason.classList.remove("form__reason--active");
            if (response.success) {
                title.textContent = successTitle;
                this.$C("form--positive");

                setTimeout(() => {
                    if (successCallback) successCallback(response);
                    this.pending = false;
                },600);
            } else {
                title.textContent = "Error...";
                this.$C("form--negative");

                if (response.reason) {
                    this.reason.textContent = response.reason;
                    this.reason.classList.add("form__reason--active");
                }

                if (response.reasons) {
                    this.formats.clearChildren();
                    this.formats.$C("form__list--active");
                    this.formats.addItems(...response.reasons);
                }

                setTimeout(() => {
                    if (errorCallback) errorCallback(response);
                    this.pending = false;
                },600);
            }
        },1000);
    }
}

// builds the profile widget
class profileBuilder extends ElementBuilder {
    constructor(scrollSpace) {
        super(scrollSpace);

        this.root = new divBuilder(scrollSpace, "profile").root;

        this.image = this.$E("div", null, null, "profile__backimage");

        this.profilePicture = new figBuilder(scrollSpace, "./media/profile-logged-in.png", "profile-pic", null, "profile__picture");

        this.cart = this.$E("button", "cart", null, "profile__cart");
        this.history = this.$E("button", "order history", null, "profile__history");
        this.logout = this.$E("button", "logout", null, "profile__logout");

        this.name = this.$E("span", "John Doe");

        this.formats = new listBuilder(scrollSpace, "unordered").$C("form__list");

        this.image.append(this.profilePicture.root);
        this.root.append(this.image, this.name, this.formats.root);

        this.inputs = [];
        this.labels = [];

        this.#loadProfile();
    }

    async #loadProfile() {
        if (!User.isLoggedIn) return;

        this.saveChanges = this.$E("button", "save changes", null, "profile__change");
        this.saveChanges.style.display = "none";
        this.root.append(this.saveChanges);

        const data = await User.userProfile();

        Object.entries(data).forEach(value => {
            const pair  = this.$E("div", null, null, "profile__pair");
            const input = this.$E("input");
            const label = this.$E("label", `${value[0].replaceAll("_", " ")}:`);
            input.value = value[1];
            input.setAttribute("placeholder", "Add one!");
            input.setAttribute("type", value[0]);
            input.setAttribute("readonly", "readonly");

            pair.append(label, input);
            this.inputs.push(input);
            this.labels.push(value[0]);
            this.root.append(pair);
        }); 

        // don't let Sergey see this
        if (data.first_name) {
            if (data.first_name.toLowerCase() === "sergey") {
                this.profilePicture.src = "./media/sergey.png";
                this.profilePicture.img.style.filter = "invert(0%)";
            }
        }

        const name = data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : data.name; 

        this.name.textContent = name;

        const buttons = this.$E("div");

        buttons.append(this.cart, this.history);

        this.root.append(buttons, this.logout);

        this.#setListeners();
    }

    #setListeners() {
        this.root.addEventListener("click", (e) => {
            this.inputs.forEach(input => {
                input.setAttribute("readonly", "readonly");
            });

            if (!this.inputs.includes(e.target)) return;

            e.target.removeAttribute("readonly");

            this.saveChanges.style.display = "block";
        });

        this.saveChanges.addEventListener("click", (e) => {
            const body = {};
            this.inputs.forEach((input, i) => {
                if (this.labels[i] === "name") {
                    body.username = input.value;
                } else {
                    body[this.labels[i]] = input.value;
                }
            });

            console.log(body);

            this.#updateProfile(body);
        });

        this.root.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.saveChanges.click();
            }
        });

        this.logout.addEventListener("click", (e) => {
            User.logout();

            window.location.href = `${$dir}/login`;
        });
    }

    async #updateProfile(body) {
        const req = await User.updateProfile(body);
        
        if (req.success === false) {
            this.formats.clearChildren();
            this.formats.addItems(...req.reasons);
            this.formats.$C("form__list--active");
        } else {
            this.formats.root.classList.remove("form__list--active");
            this.saveChanges.style.display = "none";
        }

        this.inputs.forEach(input => {
            input.setAttribute("readonly", "readonly");
        });
    }
}


// builds the cart widget with movies
class cartBuilder extends ElementBuilder {
    constructor(scrollSpace, orderScrollSpace) {
        super(scrollSpace);

        this.orderScrollSpace = orderScrollSpace;
        this.root = new divBuilder(scrollSpace, "cart").root;

        this.loadItems();
    }

    async loadItems() {
        this.clearChildren();

        const data = await User.getCart();

        if (Object.keys(data).length === 0 || data.items.length === 0) {
            this.loadEmpty();
            return;
        }

        data.items.forEach(item => {
            const container = new divBuilder(this.scrollSpace, "cart__item").root;
            const backImage = new figBuilder(
                this.scrollSpace, 
                `${$dir}/${item.movie.cover_image}`,
                "cart-back-image",
                null,
                "cart__backimage"
            );

            const title = this.$E("h2", item.movie.name);

            const time = this.$E("span", item.time);

            const counter = new counterBuilder(this.scrollSpace);

            const buttons = this.$E("div");
            const bookButton = this.$E("button", "Confirm Order", null, "button--standard");
            const removeButton = this.$E("button", "Delete", null, "button--standard", "button--red", "button--dimmed");

            buttons.append(bookButton, removeButton);

            this.scrollSpace.coupleSpaceTransition(bookButton, this.orderScrollSpace, 0.5, () => {
                orderHistory.loadItems();

                const cart = bookButton.parentElement.parentElement; // kinda ewww...
                User.removeFromCart(this.children.indexOf(cart));
                cart.remove();
            }, true);

            removeButton.addEventListener("click", async (e) => {
                const cart = removeButton.parentElement.parentElement; // kinda ewww...

                await User.removeFromCart(this.children.indexOf(cart));
                cart.remove();

                if (this.children.length === 0) {
                    this.loadEmpty();
                }

                glob.summon("red", `Removed ${item.movie.name} from cart`, 3, 0);
            })

            bookButton.addEventListener("click", async (e) => {
                const order = {};
                order[item.schedule_id] = counter.value;
                const res = await User.placeOrder(order);
                if (res.success) {
                    glob.summon("green", `Successfully Ordered: ${item.movie.name}`, 3, 1);
                }
            });

            container.append(backImage.root, title, time, counter.root, buttons);

            this.root.append(container);
        });
    }

    loadEmpty() {
        this.clearChildren();

        const container = new divBuilder(this.scrollSpace, "cart__item").root;
        const backImage = new figBuilder(
            this.scrollSpace, 
            null, null, null,
            "cart__backimage"
        );
        const title = this.$E("h2", "Nothing here...");
        const time = this.$E("span", "Your cart is empty");

        container.append(backImage.root, title, time);
        this.root.append(container);
    }
}


// builds the order widget with movies
class orderBuilder extends ElementBuilder {
    constructor(scrollSpace) {
        super(scrollSpace);

        this.root = new divBuilder(scrollSpace, "orders").root;

        this.loadItems();
    }

    async loadItems() {
        this.clearChildren();

        const data = await User.getOrder();

        if (data.length === 0) {
            this.#loadEmpty();
            return;
        }

        data.reverse().forEach(item => {
            if (!item.tickets.length) return;
            const container = new divBuilder(this.scrollSpace, "orders__item").root;
            const backImage = new figBuilder(
                this.scrollSpace, 
                `${$dir}/${item.tickets[0].cover_image}`,
                "order-back-image",
                null,
                "orders__backimage"
            );

            const title = this.$E("h2", item.tickets[0].name);

            const time = this.$E("span", new Date(item.tickets[0].playing_from).toLocaleString());

            const amount = this.$E("span", `${item.tickets.length}x`, null, "orders__amount");

            container.append(backImage.root, title, time, amount);

            this.root.append(container);            
        });
    }

    #loadEmpty() {
        this.clearChildren();

        const container = new divBuilder(this.scrollSpace, "orders__item").root;
        const backImage = new figBuilder(
            this.scrollSpace, 
            null, null, null,
            "orders__backimage"
        );

        const title = this.$E("h2", "oh no!...");
        const time = this.$E("span", "You don't have any orders yet!");

        container.append(backImage.root, title, time);
        this.root.append(container);       
    }
}

// builds tables
class tableBuilder extends ElementBuilder {
    constructor(scrollSpace, objectArray) {
        super(scrollSpace);
        this.objectArray = objectArray;
        this.rows        = objectArray.length;
        this.columns     = arguments.length - 2;

        this.properties = [...arguments].slice(2);

        this.root = document.createElement("table");
        this.root.classList.add("table--standard");

        const thead = document.createElement("thead");
        this.root.appendChild(thead);

        for (let i = 0; i < this.columns; i++) {
            const th = document.createElement("th");
            thead.appendChild(th);
            th.textContent = arguments[i + 2];
        }

        const tbody = document.createElement("tbody");
        this.root.appendChild(tbody);

        for (let i = 0; i < this.rows; i++) {
            const tr = document.createElement("tr");
            tbody.appendChild(tr);
            
            for (let j = 0; j < this.columns; j++) {
                const td = document.createElement("td");
                tr.appendChild(td);

                td.textContent = objectArray[i][arguments[j + 2]];
            }
        }
    }

    setSelectable() {
        const tds = this.root.querySelectorAll("td");

        for (let i = 0; i < tds.length; i+=this.columns) {
            [...arguments].forEach(a => {
                tds[i + a].classList.add("td--selectable");
            });
        }
    }

    setTableHeaders() {
        const ths = this.root.querySelectorAll("th");

        ths.forEach((th, i) => {
            th.textContent = arguments[i];
        });
    }

    setTableAnimation(speed, delay) {
        const trs = this.root.querySelectorAll("tr");
        
        trs.forEach((tr, i) => {
            this.scrollSpace.addElement(tr);

            tr.classList.add("hidden");

            this.scrollSpace.animationQueue.push(new ScrollAnimation(tr, "fade-in_scale", speed, delay + 0.25 * i * speed, this.root));
        });
    }

    setPopup(popup, callback) {
        this.root.addEventListener("click", (e) => {
            e.stopPropagation();

            const tds = [...this.root.querySelectorAll("td.td--selectable")];

            if (!tds.includes(e.target)) return;

            const obj = this.objectArray.find(o => Object.values(o).includes(e.target.textContent));

            if (popup.obj === obj) return;

            popup.show(obj);

            callback(obj);
        });
    }
}


// builds the <main> html Element, (needed in for scrollSpace, long story)
class mainBuilder extends ElementBuilder {
    constructor(scrollSpace, isContainer) {
        super(scrollSpace);

        if (!isContainer) {
            this.root =  document.createElement("main");
        } else {
            this.root = document.createElement("div");
        }
    }

    appendTo(element) { // override of appendTo in ElementBuilder
        element.insertAdjacentElement("afterend", this.root);
    }
}

// builds <sections>
class sectionBuilder extends ElementBuilder {
    constructor(scrollSpace, title, type) {
        super(scrollSpace);
        type = type || "section";

        this.root = this.$E("section", null, null, type);

        if (title) this.root.appendChild(new titleBuilder(scrollSpace, title).root);
    }
}

//  builds titles
class titleBuilder extends ElementBuilder {
    constructor(scrollSpace, content) {
        super(scrollSpace);

        this.root = this.$E("h2", content, null, "title--standard", "section__title");
    } 
}

// builds <content> like that seen on the reviews page
class contentBuilder extends ElementBuilder {
    constructor(scrollSpace) {
        super(scrollSpace);

        this.root = this.$E("section", null, null, "content");
    }
}

// builds headings (not titles, those are larger)
class headingBuilder extends ElementBuilder {
    constructor(scrollSpace, content, size) {
        super(scrollSpace);

        const s = size || 2;
        this.root = this.$E(`h${s}`, content, null, size ? `heading--h${size}` : null);
    }
}

// builds paragraphs (<p> inside <article>)
class parBuilder extends ElementBuilder {
    constructor(scrollSpace, content) {
        super(scrollSpace);

        this.root = this.$E("article", content, "p");
    }
}

// builds figures (fav :D)
class figBuilder extends ElementBuilder {
    constructor(scrollSpace, href, alt, caption, type) {
        super(scrollSpace);

        this.alt = alt;

        if (type) {
            this.root = this.$E("figure", null, null, type);
        } else {
            this.root = this.$E("figure", null, null, "figure-center");
        }
        
        const img = this.$E("img", null, null);
        img.setAttribute("src", href);
        img.setAttribute("alt", alt);

        this.root.appendChild(img);

        if (caption) {
            const figcaption = this.$E("figcaption", caption, null);
            this.root.appendChild(figcaption);
        }
    }

    get dimensions() {
        return this.root.getBoundingClientRect();
    }

    get caption() {
        return this.root.querySelector("figcaption").textContent;
    }

    set caption(value) {
        this.root.querySelector("figcaption").textContent = value;
    }

    get img() {
        return this.root.querySelector("img");
    }

    get src() {
        return this.img.src;
    }

    set src(value) {
        this.img.src = value;
    }
}


// builds a quote like those seen on the homepage (the one with typewriter-like effect)
class quoteBuilder extends ElementBuilder {
    constructor(scrollSpace, content = "") {
        super(scrollSpace);

        this.content = content.split(" ");
        this.wrote = 0;
        this.len = this.content.length;

        this.root = this.$E("div", "", null, "quote");
    }

    toggleHeight() {
        const h = parseFloat(getComputedStyle(this.root).getPropertyValue("--height"));
        const newHeight = h === 0 ? "100%" : "0%";
        
        this.root.style.setProperty("--height", newHeight);
    }

    typeWriter(speed) {
        const write = () => {
            const text = this.parseContent(this.content[this.wrote], "span")[0];

            this.scrollSpace.addElement(text);
            text.classList.add("hidden");
            this.scrollSpace.animationQueue.push(new ScrollAnimation(text, "fade-in", 0.4, 0.0625 * this.wrote * (speed/1000), this.root));
            
            this.root.append(text);
            this.wrote++;
            if (this.wrote >= this.len) clearInterval(inter);
        }

        const inter = setInterval(write, speed);
    }
}


// builds popup (currently unused, used to be relevant when info.html still existed)
class popupBuilder extends ElementBuilder {
    constructor(scrollSpace, type) {
        super(scrollSpace);
        this.obj = null;

        type = type || "popup";

        this.root = this.$E("div", null, null, type, "fade-slide");
    }

    appendTo(element) { // override
        element.insertAdjacentElement("afterend", this.root);

        window.addEventListener("click", (e) => {
            if (e.target !== this.root) {
                this.hide();
            }
        });
        window.addEventListener("scroll", (e) => {
            this.hide();
        });
    }

    show(withObject) {
        this.obj = withObject;
        this.root.classList.add("fade-slide--active");
        this.root.style.setProperty("pointer-events", "all");
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
    }

    hide() {
        this.root.classList.remove("fade-slide--active");
        this.root.style.setProperty("pointer-events", "none");
        this.obj = null;
    }

    populate(e, callback) {
        callback(e, this);
    }
}


// builds tickets (the popup upon selecting a movie from the movie-slider on the homepage)
class ticketBuilder extends ElementBuilder {
    constructor(scrollSpace) {
        super(scrollSpace);

        this.root = this.$E("div", null, null, "ticket");
    }

    set aboutScrollSpace(value) {
        this.aboutSpace = value.scrollSpace;
        this.scrollSpaceProxyAbout = value.scrollSpaceProxy;
    }

    set bookScrollSpace(value) {
        this.bookSpace = value.scrollSpace;
        this.scrollSpaceProxyBook = value.scrollSpaceProxy;
    }

    updateContent(ticketObj) {
        this.clearChildren();

        this.backButton = this.$E("button", "back", null, "button--standard", "button--dimmed", "button--red");

        const title = this.$E("h2", ticketObj.name, null);

        this.plot = new quoteBuilder(this.scrollSpace, ticketObj.description || "No description provided");
        this.setTransitionTimeout(() => {
            this.plot.typeWriter(60);
        });

        const buttons = this.$E("div");

        this.bookButton = this.$E("button", "book now", null, "button--standard");
        this.about = this.$E("button", "about", null, "button--standard", "button--standard");

        buttons.append(this.bookButton, this.about, this.backButton);

        this.aboutSpace.storage.ticketObj = ticketObj;

        this.scrollSpace.coupleSpaceTransition(this.about, this.aboutSpace, 0.2, this.scrollSpaceProxyAbout);

        this.bookButton.addEventListener("click", (e) => {
            sessionStorage.movieID = ticketObj.movie_id;
            window.location.href = `${$dir}/schedule#schedule`;
        });

        this.root.append(title, this.plot.root, buttons);
    }
}

// builds "actor-cards" like those seen on the "about" page of every movie
// (basically just a grouping of images)
class actorCardsBuilder extends ElementBuilder {
    constructor(scrollSpace) {
        super(scrollSpace);

        this.root = new divBuilder(scrollSpace, "actor-cards").root;
    }

    async load(movieID) {
        const data = await Ajax.actors(movieID);

        data.forEach(actor => {
            const card = new divBuilder(this.scrollSpace, "actor");

            const fig = new figBuilder(
                this.scrollSpace,
                `${$dir}/${actor.actor_image.replaceAll(" ", "_")}`,
                actor.name,
                null,
                "actor-cards__fig"
            );
    
            const capt = this.$E("span", actor.name);

            card.root.append(fig.root, capt);

            this.root.append(card.root);
        });

        this.animationCallback();
    }

    setCardAnimation(speed, delay) {
        this.animationCallback = () => {
            const cards = this.root.querySelectorAll("div.actor");
        
            cards.forEach((card, i) => { 
                this.scrollSpace.addElement(card);
    
                card.classList.add("hidden");
    
                this.scrollSpace.animationQueue.push(new ScrollAnimation(card, "fade-in_scale", speed, delay + 0.25 * i * speed, this.root));
            });
        }
    }
}

// builds listszzz
class listBuilder extends ElementBuilder {
    constructor(scrollSpace, type) {
        super(scrollSpace);

        switch (type) {
            case "ordered":
                this.root = this.$E("ol");
                break;
            case "unordered":
                this.root = this.$E("ul");
                break;
            default:
                this.root = this.$E("ul");
                break;
        }

        const listItems = [...arguments].slice(2);

        listItems.forEach(item => {
            const split = item.split("##");
            const li = this.$E("li", split[0]);
            if (split.length > 1) li.id = split[1];

            this.root.appendChild(li);
        });
    }

    addItems() {
        [...arguments].forEach(a => {
            this.root.appendChild(
                this.$E("li", a)
            );
        });
    }

    setListAnimation(speed, delay) {
        const lis = this.root.querySelectorAll("li");
        
        lis.forEach((li, i) => { 
            this.scrollSpace.addElement(li);

            li.classList.add("hidden");

            this.scrollSpace.animationQueue.push(new ScrollAnimation(li, "fade-in_scale", speed, delay + 0.25 * i * speed, this.root));
        });
    }
}

// builds embedded videos (<iframe>s)
class embedBuilder extends ElementBuilder {
    constructor (scrollSpace, src) {
        super(scrollSpace);

        this.root = this.$E("iframe", null, null, "embedded-content");
        this.root.setAttribute("src", src);
    }
}


// builds hyperlinks (<a>)
class hyperlinkBuilder extends ElementBuilder {
    constructor (scrollSpace, href, content) {
        super(scrollSpace);

        this.root = this.$E("a", content, null, "hyperlink");
        this.root.setAttribute("href", href);
    }
}


// builds the indicator used in the movie slider
class indicatorBuilder extends ElementBuilder {
    constructor (scrollSpace, count) {
        super(scrollSpace);

        this.root = this.$E("div", null, null, "movie-slider__indicator");
        this.count = 0;

        this.increment(count);
        this.highlight(0);
    }

    get highlighted() {
        return this.root.querySelector(".indicator--highlight");
    }

    get highlightedIndex() {
        return this.children.indexOf(this.root.querySelector(".indicator--highlight"));
    }

    highlightNext(increment) {
        let newIndex = this.highlightedIndex + increment;

        if (newIndex < 0) {
            newIndex = this.count - 1;
        } else if (newIndex > this.count - 1) {
            newIndex = 0;
        }

        this.highlight(newIndex);
    }

    highlight(index) {
        if (this.highlighted) this.highlighted.classList.remove("indicator--highlight");
        this.children[index].classList.add("indicator--highlight");
    }
    
    increment(amount) {
        if (amount <= 0) return;

        this.count += amount || 1;

        if (amount) {
            for (let i = 0; i < amount; i++) {
                this.root.append(this.$E("div"));
            }
        } else {
            this.root.append(this.$E("div"));
        }
    }

    onClick(callback) {
        this.root.addEventListener("click", (e) => {
            const clickedOn = e.target;
            if (!this.children.includes(e.target)) return;

            callback(e, 
                clickedOn, 
                this.highlightedIndex, 
                this.children.indexOf(clickedOn), 
                this.children.indexOf(this.highlighted)
            );
        });
    }
}

// "struct"-like object used for the background on almost every page
class Bubble {
    constructor(x, y, sx, sy, vx, vy) {
        this.x  = x;
        this.y  = y;
        this.sx = sx;
        this.sy = sy;
        this.vx = vx;
        this.vy = vy;

        this.ovx = vx;
        this.ovy = vy;
    }
}

// builds the bokeh background on almost every page
class abstractArtBuilder extends ElementBuilder {
    constructor(scrollSpace) {
        super(scrollSpace);

        this.canvas = this.$E("canvas");
        this.root = this.$E("div", null, null, "abstract");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.root.append(this.canvas);

        this.ctx = this.canvas.getContext("2d");

        this.bubbles = [];

        this.mousePosition = {
            x: 0,
            y: 0
        }

        this.tick = 0;
        this.moving = false;
        
        this.radiusUpperBound = Math.floor(0.06 * window.innerWidth) + 25;

        for (let i = 0; i < 18; i++) {

            const radius = Math.floor(Math.random() * this.radiusUpperBound + 25);
            let x = Math.floor(Math.random() * window.innerWidth - radius);
            let y = Math.floor(Math.random() * window.innerHeight - radius);

            x - 2 * radius <= 0 ? x += 2 * radius : x;
            y - 2 * radius <= 0 ? y += 2 * radius : y;

            const speeds = [0.25, 0.5, 0.125, 0.0625, 0.375, -0.25, -0.375]; // quick fix for floating point errors;
            
            this.bubbles[i] = new Bubble( 
                x,
                y,
                radius,
                radius,
                speeds[Math.floor(Math.random() * speeds.length)],
                speeds[Math.floor(Math.random() * speeds.length)]
            );
        }

        window.addEventListener("resize", (e) => {
            this.canvas.width  = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        window.addEventListener("mousemove", (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
    }

    startAnimation() {
        const loop = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let bubble of this.bubbles) {

                bubble.x += bubble.vx;
                bubble.y += bubble.vy;

                const blur = Math.floor(bubble.sx);
                const color = `rgba(255,255,${238-Math.floor(bubble.sx/2)}, ${1 - bubble.sx/(2 * this.radiusUpperBound)})`;

                if (bubble.x + bubble.sx >= window.innerWidth) bubble.vx = -bubble.vx;
                if (bubble.y + bubble.sy >= window.innerHeight) bubble.vy = -bubble.vy;
                if (bubble.x - bubble.sx < 0) bubble.vx = -bubble.vx;
                if (bubble.y - bubble.sy < 0) bubble.vy = -bubble.vy;

                this.ctx.beginPath();
                this.ctx.shadowColor = color;
                this.ctx.shadowBlur  = blur;
                this.ctx.fillStyle   = color;
                this.ctx.arc(bubble.x, bubble.y, bubble.sx, 0, 2 * Math.PI);
                this.ctx.fill();
            }

            this.tick = this.tick >= 60 ? this.tick = 0 : this.tick+=1;

            const amplifier = 15;
            const offCenter = this.mousePosition.x - window.innerWidth * 0.5;

            if (!this.moving) {
                this.canvas.style.transform = `translateX(${offCenter/amplifier}px)`;
                this.moving = true;
                setTimeout(() => this.moving = false, 3000);
            }

            window.requestAnimationFrame(loop);
        }

        loop();
    }

    darken(amount) {
        if (!this.dark) {
            this.root.style.filter = `brightness(${amount * 100}%)`;
            this.dark = true;
        } else {
            this.root.style.filter = `brightness(100%)`;
            this.dark = false;
        }
    }
}

// builds global popup
class globalBuilder extends ElementBuilder {
    constructor(scrollSpace) {
        super(scrollSpace);

        this.root = null;
    }

    construct(type) {
        const popup = new divBuilder(null, "global-popup").$C(`global-popup--${type}`).root;
        return popup;
    }

    summon(type, message, time, delay, button) {
        const popup = this.construct(type);
        
        const msg = this.$E("span", message);
        popup.append(msg);

        if (button) {
            const [ b1, b2 ] = button.split("#");
            const b = new buttonBuilder(null, b1).$C("button--standard");
            b.root.addEventListener("click", (e) => {
                window.location.href = `${$dir}/${b2}`;
            });
            popup.append(b.root);
        }

        setTimeout(() => {
            popup.classList.remove("global-popup--show");
            setTimeout(() => {
                popup.remove();
            }, parseFloat(getComputedStyle(popup).transitionDuration) * 1000);
        }, time * 1000 + delay * 1000 + 350);


        setTimeout(() => popup.classList.add("global-popup--show"), 350);

        const header = document.querySelector(".header");
        header.insertAdjacentElement("afterend", popup);
    }
}

// builds movie "list" uses progressives loading :DDD
class movieListBuilder extends ElementBuilder {
    constructor(scrollSpace, limit) {
        super(scrollSpace);

        this.sources = null;

        this.root = this.$E("div", null, null, "movie-list");

        this.searchBar = this.$E("input", null, null, "searchbar");
        this.searchBar.setAttribute("placeholder", "search movies");

        this.root.appendChild(this.searchBar);

        this.processedData  = [];
        this.movies         = [];
        this.limit          = limit;
        this.currentOffset  = 0;

        this.preventScrollLoad = false;

        this.loadImages(limit, this.currentOffset); // load at the very least the first few images

        this.#setListeners();
    }

    set aboutScrollSpace(value) {
        this.aboutSpace = value.scrollSpace;
        this.scrollSpaceProxyAbout = value.scrollSpaceProxy;
    }

    async loadImages(limit, offset) {
        const data = await Ajax.running(limit, offset);

        if (data.length < limit) return;

        this.populate(data, limit);        
    }

    populate(data, limit) {
        const sources = data.map(d => {
            return `${$dir}/${d.cover_image}`;
        });

        for (let i = 0; i < data.length; i++) {
            const movie = new figBuilder(this.scrollSpace, sources[i], data[i].name.split(":")[0], null, "movie-list__fig");

            const buttonContainer = new divBuilder(this.scrollSpace).root;
            const bookButton = new buttonBuilder(this.scrollSpace, "Book").$C("button--standard");
            const aboutButton = new buttonBuilder(this.scrollSpace, "About").$C("button--standard");

            buttonContainer.append(bookButton.root, aboutButton.root);
            movie.root.append(buttonContainer);

            this.scrollSpace.coupleSpaceTransition(aboutButton.root, this.aboutSpace, 0.5, () => {
                this.aboutSpace.storage.ticketObj = data[i];
                this.scrollSpaceProxyAbout(this.aboutSpace);
            });

            bookButton.root.addEventListener("click", (e) => {
                sessionStorage.movieID = data[i].movie_id;
                window.location.href = `${$dir}/schedule#schedule`;
            });

            this.root.appendChild(movie.root); 
            this.movies.push(movie);
        }

        this.processedData.push(...data);

        this.setMovieListAnimation(limit, 0.2);
    }

    #setListeners() {
        window.addEventListener("scroll", (e) => {  
            if (this.preventScrollLoad) return;
            const last = this.movies[this.movies.length - 1];
            if (!last) return;
            const thresHold = last.dimensions.y - window.innerHeight < 0;
            const newOffset = this.movies.length;
            if (!thresHold) return;
            if (this.currentOffset === newOffset) return;

            this.loadImages(this.limit, newOffset);

            this.currentOffset = newOffset;
        });

        this.searchBar.addEventListener("input", async (e) => {
            const input = e.target.value.toLowerCase();

            if (input.length === 0) {
                this.clearChildren(null, 1);
                this.movies = [];
                this.preventScrollLoad = false;
                this.populate(await Ajax.running(this.limit, 0), this.limit);
                return;
            }

            const data = await Ajax.levenshtein(input);

            if (!data) return;

            this.clearChildren(null, 1);
            this.movies = [];

            this.preventScrollLoad = true;
            this.currentOffset = 0;

            if (data.length) this.populate(data, data.length);

            this.movies.forEach(movie => {
                movie.scrollSpace.forceLoad(movie.root);
            });
        });
    }

    setMovieListAnimation(limit, speed) {
        let i = 0;
        this.movies.slice(-limit).forEach(movie => { 
            movie.setAnimation("fade-in_scale", speed, 0.25 * (i + this.movies.length - limit) * speed);
            i++;
        });
    }
}

// builds bland <div>s
class divBuilder extends ElementBuilder {
    constructor(scrollSpace) {
        super(scrollSpace);

        this.root = this.$E("div", null, null, ...[...arguments].slice(1));
    }
}

// pretty much builds the schedule page (the one where)
class movieTimeLineBuilder extends ElementBuilder {
    constructor(scrollSpace) {
        super(scrollSpace);

        this.root       = this.$E("div", null, null, "movie-schedule");
        this.root.id    = "schedule";
        this.schedules  = this.$E("div", null, null, "schedules");

        this.filter      = this.$E("div", null, null, "movie-schedule__filter");
        this.filterItems = 
        {
            fTitle:     this.$E("h2", "Scroll To Your Date/Time"),
            fAll:       this.$E("button", "All", null, "filter-item"),
            fInput:     this.$E("input", null, null, "filter-item", "filter-input"),
            fDate:      this.$E("input", null, null, "filter-item", "filter-input")
        }

        const all       = this.$E("div");
        const nonInput  = this.$E("div");
        const input     = this.$E("div");

        this.filterItems.fAll.classList.add("filter-item--active");
        this.filterItems.fInput.setAttribute("placeholder", "Search All Movies");
        this.filterItems.fDate.setAttribute("placeholder", "Search Date (DD:MM)");
        this.filterItems.fDate.setAttribute("type", "date");

        nonInput.append(this.filterItems.fAll);
        input.append(this.filterItems.fInput);

        all.append(nonInput, input);

        this.filter.append(this.filterItems.fTitle, all);

        this.items = new Map();

        this.backImage  = new divBuilder(scrollSpace, "movie-schedule__back-image");
        this.backSrc    = null;

        this.schedules.setAttribute("loading", "true");

        this.root.append(this.filter, this.schedules);

        this.limit = 0;

        this.schedules.addEventListener("scroll", (e) => {
            if (this.prohibitScroll) return;

            const items = [...this.items.keys()];
            const last = items[items.length - 1];
            const bounds = last.root.getBoundingClientRect();
            const assert = window.innerWidth > window.innerHeight;
            const offset = assert ? Math.floor(bounds.x + bounds.width) : Math.floor(bounds.y);
            const width = assert ? Math.floor(this.schedules.getBoundingClientRect().width) : Math.floor(this.schedules.getBoundingClientRect().height);

            if (offset <= width) {
                this.limit += 5;
                this.configure();
            }
        });

        this.#setListeners();
    }

    async configure(movieID) {

        const allMovies = await Ajax.running();

        let data;

        if (movieID) {
            data = await Ajax.schedule(movieID);

            data.forEach(d => {
                d.movie = allMovies.find(m => m.movie_id === movieID);
            });

            this.prohibitScroll = true;

            this.#scheduleCompress(data);
        } else {
            const scheduleAll = await Ajax.scheduleAll(
                {
                    limit: 5,
                    offset: this.limit,
                    sortBy: "playing_from", 
                    sortOrder: "asc"
                }
            );

            this.prohibitScroll = false;

            scheduleAll.forEach(schedule => { 
                schedule.movie = allMovies.find(movie => movie.movie_id === schedule.movie_id);
            });

            this.#scheduleCompress(scheduleAll.sort((a,b) => {
                return new Date(a.playing_from).getTime() - new Date(b.playing_from).getTime();
            }), 5);
        }
    }

    #scheduleCompress(data, limit) {
        data.forEach(d => {
            const matching = data.filter(m => {
                const dateCurrent = new Date(d.playing_from).toDateString();
                const dateOther = new Date(m.playing_from).toDateString();
                return dateCurrent === dateOther && d.movie.name === m.movie.name;
            });
            d.playing_from_arr = matching.map(m => m.playing_from);
        });

        data = Utils.arrayDeduplicate(data, (current, other) => {
            return new Date(current.playing_from).toDateString() === new Date(other.playing_from).toDateString()
                    && current.movie.name === other.movie.name;
        });

        this.processedData = data;

        this.populate(data, limit);
    }

    populate(schedule, limit) {
        //this.clearChildren(this.schedules); // clear all children within the this.schedules element
        //this.items.clear(); // clear dictionary

        schedule.forEach(obj => {
            const item = new divBuilder(this.scrollSpace).$C("movie-schedule__item");
            //const item = this.$E("div", null, null, "movie-schedule__item"); // create square like schedule HTML element
            
            this.items.set(item, obj); // save HTML element as key, scheduleObj as value in dictionary

            const heading = this.$E("h2", obj.movie.name); // title

            // Array of date objects
            // very rarely a movie is running more than once on the same day
            const dateString = obj.playing_from_arr.map(d => new Date(d));

            // extract date as for example: MON AUG 18
            const date = this.$E(
                "span", 
                dateString[0].toDateString().split(" ").slice(0, -1).join(" "),
                null, null,
                "movie-schedule__date"
            );

            // for each time the movie plays, get a HH:MM representation of the time,
            // split the HH:MM representation into an array of individual characters,
            // return this array
            const timeArray = dateString.map(dstr => {
                const splitted = dstr.toTimeString().split(":");
                return [splitted[0].split(""), ":", splitted[1].split("")].flat(1);
            });

            // for each time the movie plays, create an array of divs "movie-schedule__time"
            const time = timeArray.map(time => this.$E("div", null, null, null, "movie-schedule__time"));

            // for each time the movie plays -> for each of the characters in the HH:MM char representation
            // of that time, create a div element containing that character -> put all elements in an array,
            // timeBoxes: an array of arrays with div elements
            const timeBoxes = timeArray.map(letterArray => {
                return letterArray.map(letter => this.$E("div", letter));
            });

            // container for all the times a movie plays
            const timesContainer = this.$E("div");

            // for each "movie-schedule__time" div, append the corresponding timeBoxes
            time.forEach((time, i) => {
                time.append(...timeBoxes[i]);

                // listen for click-event -> means the user booked that time
                time.addEventListener("click", async (e) => {
                    const req = await User.setCart(
                        {
                            movie: obj.movie,
                            time: `${dateString[i].toLocaleDateString()} ${dateString[i].toLocaleTimeString()}`,
                            schedule_id: obj.schedule_id
                        }
                    );

                    console.log(req);

                    if (req.success === false) { // it has to explicitly be false, undefined/null is fine;
                        if (req.reason === "Login") {
                            glob.summon("red", `You aren't logged in`, 4, 0, "Login#login");
                        } else {
                            glob.summon("red", `Something unkown went wrong`, 4, 0);
                        }
                        return;
                    }

                    // assert that upon opening the profile page, the cart scrollSpace should be opened immediately
                    sessionStorage.setItem("booking", "true");
                    // summon a popup confirming the add-to-cart action
                    glob.summon("green", `Added ${obj.movie.name} to cart`, 4, 0, "view cart#profile");
                });
            });

            // append all the times to the single timeContainer
            timesContainer.append(...time);

            item.root.append(heading, date, timesContainer);

            this.schedules.append(item.root);
        });

        this.root.append(this.backImage.root);

        //this.switchBackImage(`${$dir}/${schedule[0].movie.cover_image}`);
        this.setTimeLineAnimation(limit, 0.2);

        this.schedules.removeAttribute("loading");
    }

    setTimeLineAnimation(limit, speed) {
        [...this.items.keys()].slice(-limit).forEach(movie => { 
            movie.setAnimation("fade-in_scale", speed, 0.1);
            movie.scrollSpace.forceLoad(movie.root);
        });
    }

    #setListeners() {
        this.schedules.addEventListener("mouseover", (e) => {
            const movie = [...this.items.keys()].find(m => m.root === e.target);
            const item = this.items.get(movie);
            if (!item) return;

            if (this.backSrc === `${$dir}/${item.movie.cover_image}`) return;

            this.switchBackImage(`${$dir}/${item.movie.cover_image}`);

            this.current === item;
        });

        const removeActive = () => Object.values(this.filterItems).forEach(item => item.classList.remove("filter-item--active"));

        this.filterItems.fInput.addEventListener("input", async (e) => {

            const movies = await Ajax.levenshtein(e.target.value);

            if (movies !== undefined && movies.length > 0) {
                this.clearChildren(this.schedules);
                this.configure(movies[0].movie_id);
            } else {
                this.clearChildren(this.schedules);
                this.configure();
            }
        });

        this.filterItems.fDate.addEventListener("change", (e) => {
            const date = new Date(e.target.value).toDateString();
            const matches = [...this.items.values()].filter(d => {
                return new Date(d.playing_from).toDateString() === date
            });

            console.log(matches);

            if (matches.length) {
                this.clearChildren(this.schedules);
                this.populate(matches);
            }
        });

        this.filter.addEventListener("click", (e) => {
            const button = e.target;

            if (!Object.values(this.filterItems).find(b => b === button)) return;

            removeActive();

            if (button === this.filterItems.fAll) {
                this.filterItems.fInput.value = "";
                this.filterItems.fDate.value = "";
            }

            switch (button) {
                case this.filterItems.fAll:
                    button.classList.add("filter-item--active");
                    this.clearChildren(this.schedules);
                    this.configure();
                break;
            }
        });
    }

    switchBackImage(src) {
        if (this.switching) return;
        this.switching = true;
        this.backImage.fadeOut(true);
        this.backImage.setTransitionTimeout(() => {
            this.backSrc = src;
            this.backImage.root.style.backgroundImage = `url('${src}')`;
            this.backImage.fadeIn(true);
            this.backImage.setTransitionTimeout(() => {
                this.switching = false;
            });
        });
    }
}

// builds movie-slider (the first thing you see on the home page :D)
class movieSliderBuilder extends ElementBuilder {
    constructor(scrollSpace, limit) {
        super(scrollSpace);

        this.sources = null; // all figure-sources

        this.n = 5;             // 5 figures
        this.indices = [];      // used to keep track of figures

        this.clicked = false;   // to prevent spam-clicking
        this.selected = false;  // to prevent spam-selecting
        this.scrolled = false;  // to prevent spam-scrolling

        /* actual 'building' */

        this.root = this.$E("div", null, null, "movie-slider");

        // all the figures
        this.figures = new ElementCollection();

        this.indicator = new indicatorBuilder(this.scrollSpace, limit);

        // add all 5 visible figures
        for (let i = 0; i < this.n; i++) {
            this.figures.addElement(
                new figBuilder(this.scrollSpace, null, "movie-highlight", "Movie Title", `movie-slider__${i}`)
            );
            this.indices.push(i);
        }

        // forward, backward button
        this.forw = this.$E("button", null, null, "movie-slider__forw"); // forward button
        this.backw = this.$E("button", null, null, "movie-slider__backw"); // backward button

        // 'ticket': description of selected movie & more
        this.ticket = new ticketBuilder(this.scrollSpace, {});

        // append elements to root
        this.root.append(...this.figures.allElements, this.forw, this.backw, this.indicator.root, this.ticket.root);

        this.loadImages(limit);
    }

    async loadImages(limit) {
        const data = await Ajax.running(limit, Math.floor(Math.random() * 20));

        this.sources = data.map(d => {
            return `${$dir}/${d.cover_image}`;
        });

        this.running = Utils.arrayShift(data, 1);

        for (let i = 0; i < this.n; i++) {
            this.figures.all[i].src = this.sources[(i - 1 + this.sources.length) % this.sources.length];
        }

        // set-up all the event listeners
        this.#setListeners();
    }

    $(n) { // find figure with class movie-slider__n
        return this.figures.find(f => f.root.classList.contains(`movie-slider__${n}`));
    }

    // slide the 'list' of figures forward/backward
    slide(direction) {
        this.clicked = true;

        this.indices = Utils.arrayOverflow(this.indices, direction);

        this.$(0).src = Utils.arrayIndex(this.sources, this.sources.indexOf(this.$(1).src), -1);
        this.$(4).src = Utils.arrayIndex(this.sources, this.sources.indexOf(this.$(3).src), 1);

        let i = 0;

        for (let figure of this.figures.allElements) {
            const currentClass = figure.classList[0];

            figure.classList.replace(currentClass, `movie-slider__${this.indices[i]}`);
            i++;
        }

        this.indicator.highlightNext(-direction);

        this.$(2).setTransitionTimeout(() => {
            this.clicked = false;
        });
    }

    // sets all relevant event listeners
    #setListeners() {

        /* window event listeners */

        window.addEventListener("mousemove", (e) => { // 'glow' effect on middle figure
            const x = e.clientX - this.$(2).root.getBoundingClientRect().left;
            const y = e.clientY - this.$(2).root.getBoundingClientRect().top;
            this.$(2).root.style.setProperty("--outline-position", `${x}px ${y}px`);
        });

        window.addEventListener("scroll", (e) => { // unselect if scrolling below the slides
            const scrolled = window.scrollY;
            const lowerBound = ElementBuilder.getScrollDistance(this.root) + window.innerHeight;

            if (scrolled > lowerBound && this.selected) {
                this.unselect();
            }
        });

        /* non-figure related event listeners */
        
        this.indicator.onClick((e, clickedOn, highlightedIndex, cIndex, hIndex) => {
            if (this.clicked || this.scrolled || this.selected) return;

            const difference = cIndex - hIndex;

            if (difference === 0) return;

            // if selected 1 index ahead/before
            if (Math.abs(difference) > 1) {
                this.scrolled = true;

                for (let i = 0; i < this.figures.all.length; i++) {
                    const f = this.$(i);
                    
                    f.root.classList.add("opaque");
                    f.setTransitionTimeout(() => {
                        f.src = this.sources[(cIndex + i - 1) % this.sources.length];
                        f.setTransitionTimeout(() => this.scrolled = false);
                    });
                }

                this.indicator.highlight(cIndex);
            } else {
                this.slide(-difference);
            }
        });

        this.figures.onAttributeMutation("src", "img", null, () => {
            this.figures.forAll(f => {
                f.root.classList.remove("opaque");
            });
        });

        /* figure related event listeners */

        this.$(2).root.addEventListener("transitionstart", (e) => {
            this.$(2).caption = this.running[this.indicator.highlightedIndex].name;
        });

        this.$(2).root.addEventListener("transitionend", (e) => {
            if (e.propertyName === "opacity") this.clicked = false;
        });

        this.root.addEventListener("wheel", (e) => {
            if (this.clicked || this.selected) return;

            const scrollThreshold = 150;

            if (e.deltaX > scrollThreshold) {
                this.slide(-1);
            } else if (e.deltaX < -scrollThreshold) {
                this.slide(1);
            }
        });

        this.root.addEventListener("click", (e) => {
            e.stopPropagation();
            if (this.clicked) return;

            const button = e.target;

            if (this.selected && button === this.ticket.backButton) this.unselect();

            if (button === this.$(2).img) {
                this.select();  
            }

            if (button === this.forw && !this.selected) this.slide(-1);
            if (button === this.backw && !this.selected) this.slide(1);
        });
    }

    // highlight the middle movie
    select() {
        this.selected = true;
        
        this.$(1).fadeOut(true);
        this.$(3).fadeOut(true);

        this.ticket.updateContent(this.running[this.indicator.highlightedIndex]);

        this.forw.classList.add("movie-slider--bottom");
        this.backw.classList.add("movie-slider--bottom");
        this.ticket.root.classList.add("ticket--active");
        this.$(2).root.classList.add("movie-slider--left", "movie-slider--border");

        this.ticket.plot.toggleHeight();

        if (this.selectCallback) this.selectCallback();
    }

    // de-highlight the middle movie
    unselect() {
        this.$(1).fadeIn(true);
        this.$(3).fadeIn(true);

        this.forw.classList.remove("movie-slider--bottom");
        this.backw.classList.remove("movie-slider--bottom");
        this.ticket.root.classList.remove("ticket--active");
        this.$(2).root.classList.remove("movie-slider--left", "movie-slider--border");

        this.ticket.plot.toggleHeight();

        this.selected = false;

        if (this.selectCallback) this.selectCallback();
    }

    set onSelect(value) {
        this.selectCallback = value;
    }

    // add new sources
    insertSource(source) {
        this.sources.push(source);
        this.indicator.increment();
    }
}

// builds bland buttons <button>
class buttonBuilder extends ElementBuilder {
    constructor(scrollSpace, content) {
        super(scrollSpace);
        this.clicked = false;

        this.root = this.$E("button", content);
    }

    // close current space; open next space onclick
    authorizesNextSpace(scrollSpace, speed) {      
        scrollSpace.coupleSpaceTransition(this.root, scrollSpace, speed);
    }
}

// for 'collections' of '___Builds'
class ElementCollection {
    constructor() {
        this.collection = [...arguments];
        if (arguments[0] instanceof Array) this.collection = arguments[0];

        this.observing = false;

        this.mutationListeners = new Map();
        this.callbacks = [];

        // mutationObserver, listens for mutations on elements (eg change(s) in attribute(s))
        this.observer = new MutationObserver((entries, observer) => {
            entries.forEach(mutation => {

                if (mutation.type === "attributes") { // if attribute was changed
                    const attr = this.mutationListeners.get(mutation.attributeName);

                    if (attr) { // if attribute is being listened for

                        // get all callback functions tied to this attribute
                        const applicableCallbacks = this.callbacks.filter(callback => {
                            return callback.attribute === mutation.attributeName;
                        });

                        // execute relevant callbacks
                        for (let callbackEntry of applicableCallbacks) {
                            if (callbackEntry.callback) callbackEntry.callback(attr.altered);
                            attr.altered+=1;
                            if (attr.altered === this.collection.length) {
                                if (callbackEntry.onFinish) callbackEntry.onFinish();
                                attr.altered = 0;
                            }
                        }
                    }
                }

            });
        });
    }

    // get all items as ElementBuilds
    get all() {
        return this.collection;
    }

    // get all items as DOM elements
    get allElements() {
        return this.collection.map(m => m.root);
    }

    // find element in collection
    find(callback) {
        return this.collection.find(callback);
    }

    onAttributeMutation(attribute, toBeObserved, callback, onFinish) {
        this.mutationListeners.set(attribute, { altered: 0 });

        this.callbacks.push(
            {
                callback: callback,
                onFinish: onFinish,
                attribute: attribute,
            }
        );

        for (let element of this.collection) {
            this.observer.observe(element[toBeObserved] || element.root, { attributes: true });
        }

        this.observing = true;
    }

    forAll(callback) {
        for (let element of this.collection) {
            callback(element);
        }
    }

    addElement(element, toBeObserved) {
        this.collection.push(element);

        if (this.observing) this.observer.observe(element[toBeObserved] || element.root, { attributes: true });
    }

    removeElement(element) {
        this.collection = this.collection.filter(e => e !== element);
    }
}
