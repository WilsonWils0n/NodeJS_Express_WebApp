
// All api functions (accessible via /api/whatever_endpoint)

import express from "express";
const router = express.Router();
import db from "../db.js";
import { sessions } from "../app.js";
import { v4 as uuidv4 } from 'uuid';

import { sessionGetter, userRegexCheck } from "../middleware.js";
import { errorWrapper } from "../wrappers.js";

router.get(
  "/username_exists",
  errorWrapper(async (req, res, next) => {
    const exists = await db.checkUsernameExists(req.body.username)
    console.log(exists)
    res.status(200).json(exists);
  })
);

// get cart from session
router.get(
  "/get_cart",
  sessionGetter,
  errorWrapper(async (req, res, next) => {
    const cart = req.session.cart;
    res.status(200).json(cart);
  })
);

// sets the playload as the cart for the current session
router.post(
  "/set_cart",
  sessionGetter,
  errorWrapper(async (req, res, next) => {
    sessions[req.sessionkey].cart = req.body;
    res.status(200).json({ success: true });
  })
);

// returns the actors in a movie
router.post(
  "/actors_in_movie",
  errorWrapper(async (req, res, next) => {
    const actors = await db.getActorsInMovie(req.body.movieID);
    res.status(200).json(actors);
  })
);

router.get("/get_movie/:name",
  errorWrapper(async (req, res, next) => {
    const name = req.params.name;
    const movie = await db.getMovie(name);
    res.status(200).json(movie);
  })
);

// return profile data of user, gets username from session
router.get(
  "/getprofile",
  sessionGetter,
  errorWrapper(async (req, res, next) => {
    const userInfo = await db.getUserInfo(req.session.username);
    res.status(200).json(userInfo);
  })
);

// update user profile,
// expected input: {fieldToUpdate: newValue}
// will update that field
router.post(
  "/updateprofile",
  sessionGetter,
  userRegexCheck,
  errorWrapper(async (req, res, next) => {
    db.updateUser(req.session.username, req.body);

    // update the username in the session
    if ("username" in req.body) {
      req.session.username = req.body.username;
    }
    res.json({ success: true });
  })
);

// creates a user with the values from the body
router.post(
  "/create_user",
  userRegexCheck,
  errorWrapper(async (req, res, next) => {
    await db.createUser(req.body);
    res.status(200).json({ success: true });
  })
);

// checks the password from the body and creates a session and sets the session cookie
router.post(
  "/login",
  errorWrapper(async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (await db.checkPassword(username, password)) {
      const session = uuidv4();
      sessions[session] = { username: username, cart: "" };
      res.setHeader(
        "Set-Cookie",
        `session=${session}; Max-Age=86400; HttpOnly; path=/; SameSite=Lax;`
      );
      res.status(200).json({ success: true });
    } else {
      res
        .status(401)
        .json({ success: false, error: "invalid username and/or password" });
    }
  })
);

// deletes the httponly session cookie
router.get(
  "/logout",
  sessionGetter,
  errorWrapper(async (req, res, next) => {
    delete sessions[req.sessionkey];
    res.setHeader(
      "Set-Cookie",
      "session=; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly"
    );
    res.status(200).json({ success: true });
  })
);

router.get(
  "/levenshtein/:str",
  errorWrapper(async (req, res, next) => {
    const str = req.params.str;

    const movies = await db.levenshteinMovie(str);

    res.status(200).json(movies);
  })
);

/*
let the logged in user make an order.

expects a dict where the keys are schedule ids and numbers are the amount of tickets:
// { 5 : 4, 2: 5 }
*/
router.post(
  "/placeorder",
  sessionGetter,
  errorWrapper(async (req, res, next) => {
    await db.makeOrder(req.session.username, req.body);
    res.status(200).json({ success: true });
  })
);

// gets the orders that the user made (username is retrived from the session)
router.get(
  "/getorders",
  sessionGetter,
  errorWrapper(async (req, res, next) => {
    const orders = await db.getOrders(req.session.username);
    res.status(200).json(orders);
  })
);

// gets the full schedule of a movie (past and futre)
router.post(
  "/schedule",
  errorWrapper(async (req, res, next) => {
    const runnigMovies = await db.getMovieSchedule(req.body.movieID);
    res.status(200).json(runnigMovies);
  })
);

// gets the full schedule of a movie (past and futre) with options
router.post(
  "/schedule_with_options",
  errorWrapper(async (req, res, next) => {
    const runnigMovies = await db.getMovieScheduleWithOptions(
      req.body.movieID,
      req.body.limit,
      req.body.offset,
      req.body.sortBy,
      req.body.sortOrder
    );
    res.status(200).json(runnigMovies);
  })
);

// gets every schedule (past and futre) with options
router.post(
  "/all_schedules_with_options",
  errorWrapper(async (req, res, next) => {
    const runnigMovies = await db.getAllSchedulesWithOptions(
      req.body.limit,
      req.body.offset,
      req.body.sortBy,
      req.body.sortOrder
    );
    res.status(200).json(runnigMovies);
  })
);

// gets all the movies currently running
router.get(
  "/running",
  errorWrapper(async (req, res, next) => {
    const runnigMovies = await db.getAllRunningMovies();
    res.status(200).json(runnigMovies);
  })
);

// get all movies currently running with options
router.post(
  "/runnig_with_options",
  errorWrapper(async (req, res, next) => {
    const runnigMovies = await db.getAllRunningMoviesWithOptions(
      req.body.limit,
      req.body.offset,
      req.body.sortBy,
      req.body.sortOrder
    );
    res.status(200).json(runnigMovies);
  })
);

export { router };
