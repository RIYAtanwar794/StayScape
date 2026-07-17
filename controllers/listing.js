const Listing = require("../models/listing.js");
const axios = require("axios");
const User = require("../models/user.js");


module.exports.index = async (req, res) => {

    const { category, search, sort } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    let filter = {};

    let sortOption = {};

    switch (sort) {
        case "lowToHigh":
            sortOption = { price: 1 };
            break;
        case "highToLow":
            sortOption = { price: -1 };
            break;
        case "aToZ":
            sortOption = { title: 1 };
            break;
        case "zToA":
            sortOption = { title: -1 };
            break;
        default:
            sortOption = {};
    }

    if (category && category !== "All") {
        filter.category = category;
    }

    if (search && search.trim() !== "") {

        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                location: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                country: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];

    }

    const totalListings = await Listing.countDocuments(filter);

    const allListings = await Listing.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(totalListings / limit);

    if (search && search.trim() !== "" && allListings.length === 0) {
        req.flash("error", `No listings found for "${search}"`);
    }

    res.render("./listings/index.ejs", {
        allListings,
        search: search || "",
        selectedCategory: category || "All",
        currentPage: page,
        totalPages,
        selectedSort: sort || "",
    });

};



module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};



module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author", }, })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let isWishlisted = false;

    if (req.user) {
        const user = await User.findById(req.user._id);

        isWishlisted = user.wishlist.includes(listing._id);
    }

    res.render("./listings/show.ejs", {
        listing,
        isWishlisted,
    });
};



module.exports.createListing = async (req, res) => {

    const apiKey = process.env.GEOAPIFY_API_KEY;

    const response = await axios.get(
        "https://api.geoapify.com/v1/geocode/search",
        {
            params: {
                text: req.body.listing.location,
                apiKey: apiKey,
                limit: 1,
            },
        }
    );

    if (response.data.features.length === 0) {
        req.flash("error", "Location not found!");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.data.features[0].geometry;
    await newListing.save();

    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
};



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");

    res.render("./listings/edit.ejs", { listing, orignalImageUrl });
};



module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};



module.exports.destroyListing = async (req, res) => {

    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};



