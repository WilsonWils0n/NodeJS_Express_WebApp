// serves static filess

import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/favicon.ico", (req, res, next) => {
  console.log(__dirname);
  res.sendFile(path.resolve(__dirname, "views/media/favicon.png"));
});

router.get("/404", (req, res, next) => {
  res.render("404", { url: req.query.url });
});

router.get("/:page", (req, res, next) => {
  const page = req.params.page;
  res.render(page, {}, (err, html) => {
    if (err) {
      res.redirect(`/404?url=${encodeURIComponent(req.url)}`);
    } else {
      res.send(html);
    }
  });
});

export { router };
