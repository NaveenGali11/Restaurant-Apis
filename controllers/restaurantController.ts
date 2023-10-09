import { Request as ExpressRequest, Response } from "express";
import { validationResult } from "express-validator";
import { jwtUser } from "../middlewares";
import { Location, Restaurant, Review } from "../models";
import { formatErrorMessages, sendError, sendResponse } from "../utils";

interface Request extends ExpressRequest {
  user?: jwtUser;
}

export class RestaurantController {
  static async getAllRestaurant(req: Request, res: Response) {
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
          select: "name price",
        },
      ]);

      const restaurantsCount = await Restaurant.countDocuments();

      sendResponse(res, 200, restaurants, "Success", restaurantsCount);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  }
  static async getRestaurantDetails(req: Request, res: Response) {
    const restaurantId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, formatErrorMessages(errors.mapped()));
    }

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
          select: "-__v",
        },
      ]);
      if (!restaurant) {
        sendError(res, 404, "Restaurant Not found");
      }
      sendResponse(res, 200, restaurant, "Success");
    } catch (err: any) {
      sendError(res, 500, err.message);
    }
  }

  static async addRestaurant(req: Request, res: Response) {
    const {
      name,
      description,
      cusine,
      menu,
      reviews,
      images,
      address,
      latitude,
      longitude,
    } = req.body;
    if (req.user) {
      const owner = req.user.id;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return sendError(res, 400, formatErrorMessages(errors.mapped()));
      }

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
          reviews,
          images,
          owner,
          location: savedLocation._id,
        });

        const savedRestaurant = await restaurant.save();
        const populatedRestaurant = await Restaurant.populate(savedRestaurant, [
          {
            path: "owner",
            select: "-password -__v",
          },
          { path: "location", select: "-__v" },
        ]);

        sendResponse(
          res,
          201,
          populatedRestaurant,
          "Restaurant Created Successfully"
        );
      } catch (err: any) {
        sendError(res, 500, err.message);
      }
    }
  }

  static async updateRestaurant(req: Request, res: Response) {
    const restaurantId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, formatErrorMessages(errors.mapped()));
    }

    const { address, longitude, latitude, ...others } = req.body;

    try {
      let restaurant = await Restaurant.findById(restaurantId);

      if (latitude || longitude || address) {
        const location = await Location.findById(restaurant?.location);

        if (location) {
          if (latitude) location.latitude = latitude;
          if (longitude) location.longitude = longitude;
          if (address) location.address = address;

          await location.save();
        }
      }

      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        restaurantId,
        {
          $set: others,
        },
        {
          new: true,
        }
      );
      sendResponse(
        res,
        200,
        updatedRestaurant,
        "Restaurant Updated Successfully"
      );
    } catch (err: any) {
      sendError(res, 400, err.message);
    }
  }
  static async getAllReviewsOfRestaurant(req: Request, res: Response) {
    const restaurantId = req.params.id;

    try {
      const reviews = await Review.find({
        restaurant: restaurantId,
      });

      const reviewsCount = await Review.countDocuments({
        restaurant: restaurantId,
      });

      sendResponse(res, 200, reviews, "Reviews Fetched", reviewsCount);
    } catch (err: any) {
      sendError(res, 500, err.message);
    }
  }
  static async addReviewToRestaurant(req: Request, res: Response) {
    const restaurantId = req.params.id;
    const { rating, comment } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendError(res, 400, formatErrorMessages(errors.mapped()));
    }

    if (req.user) {
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
          { $push: { reviews: savedReview._id } },
          { new: true }
        ).populate({
          path: "reviews",
        });

        sendResponse(res, 200, updatedRestaurant, "Restaurant Updated");
      } catch (err: any) {
        sendError(res, 500, err.message);
      }
    } else {
      sendError(res, 404, "User Not Found");
    }
  }
}
