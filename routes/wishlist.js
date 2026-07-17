const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware.js");

const wishlistController = require("../controllers/wishlist.js");

router.post("/:id", isLoggedIn, wishlistController.toggleWishlist);

router.get("/", isLoggedIn, wishlistController.showWishlist);

module.exports = router;