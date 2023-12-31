/**
 * ✅ 1. GET - /api/restaurants -> Retrieve a list of restaurants.
 * ✅ 2. GET - /api/restaurants/:restaurantId -> Specific Details about restaurant.
 * ⏳ 3. GET - /api/restaurants/search -> Search for restaurant.
 * ✅ 4. GET - /api/restaurants/:restaurantId/menu: Retrieve the menu of a specific restaurant.
 * ✅ 5. POST- /api/restaurants/create: Allow restaurant owners to create a new restaurant listing.
 * ✅ 6. PUT -/api/restaurants/:restaurantId/edit: Allow restaurant owners to edit their restaurant details.
 * ✅ 7. GET -/api/owner/restaurants: Retrieve a list of restaurants owned by the authenticated user.
 * ✅ 8. GET -/api/restaurants/:restaurantId/reviews: Retrieve reviews for a specific restaurant.
 */

const router = require("express").Router();

const {
    verifyTokenOwnerOrAdmin,
    verifyToken,
} = require("../middlewares/verifytoken");
const Restaurant = require("../models/Restaurant");
const Location = require("../models/LocationModel");
const Review = require("../models/Review");

// Get All Restaurants => All
router.get("/", async (req, res) => {
    try {
        const restaurants = await Restaurant.find({}).populate([
            {
                path: "owner",
                select: "username profilePicture",
            },
            {
                path: "location",
                select: "address",
            },
            {
                path: "menu",
                select: "name price"
            }
        ]);

        res.status(200).json(restaurants);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Get Restaurant Details => All
router.get("/:id", async (req, res) => {
    const restaurantId = req.params.id;

    try {
        const restaurant = await Restaurant.findById(restaurantId).populate([
            {
                path: "owner",
                select: "-password -__v",
            },
            {
                path: "location",
                select: "-__v",
            },
            {
                path: "reviews",
                populate: {
                    path: "user",
                    select: "username profilePicture",
                },
                select: "-__v",
            },
            {
                path: "menu",
                select: "-__v"
            }
        ]);
        if (!restaurant) {
            res.status(404).json("Restaurant Not Found!");
        }
        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add Restaurant => Owner or Admin
router.post("/", verifyTokenOwnerOrAdmin, async (req, res) => {
    const {
        name,
        description,
        cusine,
        menu,
        ratings,
        images,
        address,
        latitude,
        longitude,
    } = req.body;
    const owner = req.user.id;

    const location = new Location({
        address,
        latitude,
        longitude,
    });

    try {
        const savedLocation = await location.save();

        const restaurant = new Restaurant({
            name,
            description,
            cusine,
            menu,
            ratings,
            images,
            owner,
            location: savedLocation._id,
        });

        const savedRestaurant = await (
            await restaurant.save()
        ).populate([
            {
                path: "owner",
                select: "-password -__v",
            },
            {path: "location", select: "-__v"},
        ]);
        res.status(201).json(savedRestaurant);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE Restaurant => Owner or Admin
router.put("/:id", verifyTokenOwnerOrAdmin, async (req, res) => {
    const restaurantId = req.params.id;

    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            restaurantId,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        ).populate([
            {
                path: "owner",
                select: "username profilePicture",
            },
            {
                path: "location",
                select: "address",
            },
        ]);

        res.status(200).json(updatedRestaurant);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Reviews For Restaurant
router.get("/:id/review", async (req, res) => {
    const restaurantId = req.params.id;

    try {
        const reviews = await Review.find({
            restaurant: restaurantId,
        });

        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add Review for Restaurant => Logged In User
router.post("/:id/review", verifyToken, async (req, res) => {
    const restaurantId = req.params.id;
    const {rating, comment} = req.body;

    const review = new Review({
        user: req.user.id,
        restaurant: restaurantId,
        rating,
        comment,
    });

    try {
        const savedReview = await review.save();

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            restaurantId,
            {$push: {reviews: savedReview._id}},
            {new: true}
        ).populate({
            path: "reviews",
        });

        res.status(200).json(updatedRestaurant);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
