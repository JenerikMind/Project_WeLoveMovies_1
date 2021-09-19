const router = require("express").Router({mergeParams: true});
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./theaters.controller");
const cors = require("cors");

router.use(cors());

router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;