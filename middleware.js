
// middleware stack

import { sessions } from "./app.js";
import db from "./db.js";
import xss from "xss";

// middleware that sets req.sessionkey to the session key
// and req.session to the session object
function sessionGetter(req, res, next) {
    // get the value of the 'cookieKey' cookie from the cookieString
    const getCookieValue = (cookie, attribute) => {
        if (!cookie) return -1;

        const splitEntries = cookie.split(";");

        const values = splitEntries.map(a => a.split("=")[1].trim());
        const keys = splitEntries.map(a => a.split("=")[0].trim());

        const attributeIndex = keys.indexOf(attribute);

        if (attributeIndex !== -1) {
            return values[attributeIndex];
        } else {
            return -1;
        }
    }

    const session = getCookieValue(req.headers.cookie, "session");
    if (session && session in sessions) {
        req.sessionkey = session;
        req.session = sessions[session];
        next();
    } else {
        res.status(401).json({ msg: "no active session" }); // is not seen by logger
    }
}

// middleware to be used when createing / updaing user
async function userRegexCheck(req, res, next) {
    const emailRegex = /^\S+@\S+\.\S+$/
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{7,}$/
    const creditRegex = /\d{8,19}/

    const reasons = [];

    // check if username doesn't exist already
    if ("username" in req.body) {
        const exists = await db.checkUsernameExists(req.body["username"]);
        const usr = req.session ? req.session.username : null;
        if (usr !== req.body.username) {
            if (exists['user_exists']) {
                reasons.push(`Username "${req.body.username}" is already taken`);
            }
        }
    }

    // verify regex if 'password' in request
    if ("password" in req.body) {
        if (!passwordRegex.test(req.body["password"])) {
            reasons.push("Password must consist of at least 7 characters, 1 upper-case letter, 1 lower-case letter and 1 number");
        }
    }

    // verify regex if 'user' in request
    if ("email" in req.body) {
        if (!emailRegex.test(req.body["email"])) {
            reasons.push("Email should be of format example@domain.com");
        }
    }

    // verify regex if 'creditCard' in request
    if ("creditCard" in req.body) {
        if (!creditRegex.test(req.body["creditCard"])) {
            reasons.push("Credit card must be between 8 and 19 numbers long");
        }
    }

    if (reasons.length > 0) {
        res.status(400).json(
            {
                success: false,
                reason: "Invalid input",
                reasons: reasons
            }
        );
        return;
    }

    next()
}

// sanitize input
function inputSanitize(req, res, next) {
    // recursive function to sanitize everything
    function sanitize(input) {
        if (typeof input === "string") {
            return xss(input);
        } else if (typeof input === "object") {
            for (const key in input) {
                input[key] = sanitize(input[key]);
            }
        }
        return input;
    }

    // clean the body and the header
    req.body = sanitize(req.body);
    req.headers = sanitize(req.headers);
    next();
}

// starts logging
function loggerStart(req, res, next) {
    req.log = {};
    req.log.startTime = Date.now();
    req.log.ip = req.ip;
    req.log.url = req.url;
    req.log.method = req.method;
    req.log.error = "";
    req.log.headers = JSON.stringify(req.headers);
    req.log.body = JSON.stringify(req.body);
    next();
}

// stops finalise the loggin for the request.
// saves log to database
function loggerEnd(req, res, next) {
    const endTime = Date.now();
    req.log.responseTime = endTime - req.log.startTime;
    req.log.statusCode = res.statusCode;
    delete req.log.startTime;
    db.saveLog(req.log);
    console.log(req.log);
    next(); // in case there is any middleware after loggerEnd
}

// handles server errors
function errorHandle(err, req, res, next) {
    console.log(err);
    req.log.error = err.message;
    res.status(500).send("Internal Server Error");
    next(); // next() to loggerEnd
}

export { inputSanitize, sessionGetter, loggerStart, loggerEnd, errorHandle, userRegexCheck };
