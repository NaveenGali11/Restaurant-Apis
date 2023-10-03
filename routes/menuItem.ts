import express, { Request, Response, Router } from "express";

import {
  checkFileType,
  uploadMiddleware,
  verifyTokenOwnerOrAdmin,
} from "../middlewares";
import { MenuItem, Restaurant } from "../models";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  const restaurantId = req.params.id;

  try {
    const menuItems = await MenuItem.find({
      restaurant: restaurantId,
    });

    res.status(200).json(menuItems);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post(
  "/:id/add",
  verifyTokenOwnerOrAdmin,
  checkFileType("images"),
  uploadMiddleware("images", "uploads/menu/"),
  async (req: Request, res: Response) => {
    const restaurantId = req.params.id;

    const menuItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      restaurant: restaurantId,
      images: req.body.images,
    });

    try {
      const newMenuItem = await menuItem.save();

      const updatedRestaurantMenu = await Restaurant.findByIdAndUpdate(
        restaurantId,
        { $push: { menu: newMenuItem._id } },
        { $new: true }
      ).populate({
        path: "menu",
      });

      res.status(201).json(updatedRestaurantMenu);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

router.put(
  "/:menuId",
  verifyTokenOwnerOrAdmin,
  checkFileType("images"),
  uploadMiddleware("images", "uploads/menu/"),
  async (req: Request, res: Response) => {
    const menuId = req.params.menuId;

    try {
      const updatedMenuItem = await MenuItem.findByIdAndUpdate(
        menuId,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedMenuItem);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

router.delete(
  "/:menuId",
  verifyTokenOwnerOrAdmin,
  async (req: Request, res: Response) => {
    const menuId = req.params.menuId;

    try {
      const deletedMenuItem = await MenuItem.findByIdAndDelete(menuId);
      if (!deletedMenuItem) {
        res.status(404).json("Menu Item Not Found");
      } else {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
          deletedMenuItem.restaurant,
          {
            $pull: deletedMenuItem._id,
          },
          {
            new: true,
          }
        );

        res.status(200).json(updatedRestaurant);
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { router as MenuItemRouter };
