import express from "express";
import path from "path";
import { router as static_routes } from "./routes/static.js";
import { router as routes } from "./routes/api.js";
import {
  loggerStart,
  inputSanitize,
  loggerEnd,
  errorHandle,
} from "./middleware.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

// all active sessions eg: { exampleSession: { username: "ditismijnusername" } }
const sessions = {};

// jade
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "pug");

// decode json bodies of the post requests
app.use(express.json()); // #TODO order of middleware, decoding middleware can also throw errors (that will cause the loggin_start to get skipped)

// sanitize before logging (but after body decoding)
app.use(inputSanitize);

// starts logging, make sure to next() every time so that the loggerEnd can run
app.use(loggerStart);

// decode html form bodies
app.use(express.urlencoded({ extended: true }));

// static css/javascript/image files
app.use("/", express.static(path.resolve(__dirname, "public")));

// 404, favicon etc
app.use("/", static_routes);

// api
app.use("/api", routes);

// for 500 errors
app.use(errorHandle);

// saves the input and result status code to the log
app.use(loggerEnd);

app.listen(port, () => {
  console.log("\x1b[4m\x1b[32m%s\x1b[0m", `Server Running at port ${port}\n`);
});

export { sessions };
