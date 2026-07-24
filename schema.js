const Joi = require("joi");


module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        maxGuests: Joi.number()
            .integer()
            .min(1)
            .max(20)
            .required(),
        image: Joi.string().allow("", null),
        category: Joi.string()
            .valid(
                "Trending",
                "Beaches",
                "Cities",
                "Mountains",
                "Villas",
                "Camping",
                "Heritage",
                "Wildlife",
                "Luxury"
            )
            .required(),
    }).required(),
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});



module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        checkIn: Joi.date().required(),
        checkOut: Joi.date().required(),
        guests: Joi.number()
            .integer()
            .min(1)
            .required(),
    }).required(),
});