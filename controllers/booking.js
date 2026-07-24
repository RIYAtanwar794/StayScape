const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");



function calculateTotalNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const oneDay = 1000 * 60 * 60 * 24;

    return Math.ceil((end - start) / oneDay);
}



async function isListingAvailable(listingId, checkIn, checkOut) {

    const existingBooking = await Booking.findOne({
        listing: listingId,
        status: { $ne: "Cancelled" },

        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
    });

    return !existingBooking;
}



// Render Booking Form
module.exports.renderBookingForm = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    const bookedDates = await Booking.find({
        listing: listing._id,
        status: { $ne: "Cancelled" },
    }).select("checkIn checkOut");

    res.render("booking/bookingForm.ejs", { listing, bookedDates });
};



// Create Booking
module.exports.createBooking = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id).populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Owner cannot book own listing
    if (listing.owner.equals(req.user._id)) {
        req.flash("error", "You cannot book your own listing!");
        return res.redirect(`/listings/${id}`);
    }

    let { checkIn, checkOut, guests } = req.body.booking;

    if (guests > listing.maxGuests) {
        req.flash(
            "error",
            `Maximum ${listing.maxGuests} guests are allowed for this property.`
        );
        return res.redirect(`/listings/${id}/book`);
    }

    checkIn = new Date(checkIn);
    checkOut = new Date(checkOut);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
        req.flash("error", "Check-in date cannot be in the past.");
        return res.redirect(`/listings/${id}/book`);
    }

    if (checkOut <= checkIn) {
        req.flash("error", "Check-out must be after check-in.");
        return res.redirect(`/listings/${id}/book`);
    }

    const totalNights = calculateTotalNights(checkIn, checkOut);

    const available = await isListingAvailable(
        listing._id,
        checkIn,
        checkOut
    );

    if (!available) {
        req.flash("error", "Selected dates are unavailable.");
        return res.redirect(`/listings/${id}/book`);
    }

    const GST_RATE = 0.18;

    const subTotal = listing.price * totalNights;
    const gst = Math.round(subTotal * GST_RATE);
    const totalPrice = subTotal + gst;

    const newBooking = new Booking({
        listing: listing._id,
        user: req.user._id,
        owner: listing.owner,

        checkIn,
        checkOut,
        guests,

        pricePerNight: listing.price,
        totalNights,
        subTotal,
        gst,
        totalPrice,
    });

    await newBooking.save();

    req.flash("success", "Booking created successfully!");

    res.redirect("/bookings");
};




// Booking History
module.exports.bookingHistory = async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id,
    })
        .populate("listing")
        .sort({ createdAt: -1 });

    res.render("booking/bookingHistory.ejs", { bookings });
};



// Owner Dashboard
module.exports.ownerBookings = async (req, res) => {

    const bookings = await Booking.find({
        owner: req.user._id,
    })
        .populate("listing")
        .populate("user")
        .sort({ createdAt: -1 });

    res.render("booking/ownerBookings.ejs", { bookings });
};



// Update Booking Status
module.exports.updateBookingStatus = async (req, res) => {

    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings/owner");
    }

    const { status } = req.body;

    booking.status = status;
    await booking.save();

    req.flash("success", "Booking status updated.");

    res.redirect("/bookings/owner");
};



// Cancel Booking
module.exports.cancelBooking = async (req, res) => {

    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings");
    }

    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You are not authorized to cancel this booking.");
        return res.redirect("/bookings");
    }

    if (booking.status === "Cancelled") {
        req.flash("error", "Booking is already cancelled.");
        return res.redirect("/bookings");
    }

    if (booking.status !== "Pending") {
        req.flash("error", "Only pending bookings can be cancelled.");
        return res.redirect("/bookings");
    }

    booking.status = "Cancelled";

    await booking.save();

    req.flash("success", "Booking cancelled successfully.");

    res.redirect("/bookings");
};