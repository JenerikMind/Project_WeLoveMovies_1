const router = require("express").Router();
const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.use(cors());

router.use("/:movie_id/reviews", reviewsRouter);
router.use("/:movie_id/theaters", theatersRouter);

router.route("/:movie_id/critics")
    .get(controller.return404)


router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);

router.route("/:movie_id")
    .get(controller.read)
    .all(methodNotAllowed);

module.exports = router;