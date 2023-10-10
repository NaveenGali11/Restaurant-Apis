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

import { Router } from "express";
import { RestaurantController } from "../controllers";
import {
  checkFileType,
  uploadMiddleware,
  verifyToken,
  verifyTokenOwnerOrAdmin,
} from "../middlewares";
import {
  addRestaurantValidation,
  addReviewValidation,
  updatedRestaurantValidation,
} from "../validations";

const router = Router();

// Get All Restaurants => All
router.get("/", RestaurantController.getAllRestaurant);

// Get Restaurant Details => All
router.get("/:id", RestaurantController.getRestaurantDetails);

// Add Restaurant => Owner or Admin
router.post(
  "/",
  verifyTokenOwnerOrAdmin,
  checkFileType("images"),
  addRestaurantValidation,
  uploadMiddleware("images"),
  RestaurantController.addRestaurant
);

// UPDATE Restaurant => Owner or Admin
router.put(
  "/:id",
  verifyTokenOwnerOrAdmin,
  checkFileType("images"),
  updatedRestaurantValidation,
  uploadMiddleware("images"),
  RestaurantController.updateRestaurant
);

// Get All Reviews For Restaurant
router.get("/:id/review", RestaurantController.getAllReviewsOfRestaurant);

// Add Review for Restaurant => Logged In User
router.post(
  "/:id/review",
  verifyToken,
  addReviewValidation,
  RestaurantController.addReviewToRestaurant
);

export { router as RestaurantRouter };
