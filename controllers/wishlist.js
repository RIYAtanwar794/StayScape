const User = require("../models/user.js");
const Listing = require("../models/listing.js");


module.exports.toggleWishlist = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const index = user.wishlist.indexOf(id);

    if (index === -1) {
        user.wishlist.push(id);
        req.flash("success", "Added to Wishlist ❤️");
    } else {
        user.wishlist.splice(index, 1);
        req.flash("success", "Removed from Wishlist");
    }

    await user.save();

    console.log(req.body);



    const redirectUrl = req.body.redirectUrl || `/listings/${id}`;

    res.redirect(redirectUrl);
};



module.exports.showWishlist = async (req, res) => {

    const user = await User.findById(req.user._id)
        .populate("wishlist");

    res.render("listings/wishlist.ejs", {
        allListings: user.wishlist,
    });
};