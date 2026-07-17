const Listing = require("../models/listing");
const User = require("../models/user");

module.exports.dashboard = async (req, res) => {

    const myListings = await Listing.find({
        owner: req.user._id,
    });

    const user = await User.findById(req.user._id)
        .populate("wishlist");

    res.render("dashboard/index.ejs", {
        totalListings: myListings.length,
        wishlistCount: user.wishlist.length,
        recentListings: myListings.slice(-3).reverse(),
    });

};


module.exports.myListings = async (req, res) => {

    const listings = await Listing.find({
        owner: req.user._id,
    });

    res.render("dashboard/myListings.ejs", {
        listings,
    });

};