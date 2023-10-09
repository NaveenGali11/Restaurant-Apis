import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { MenuItem, Restaurant } from "../models";
import { formatErrorMessages, sendError, sendResponse } from "../utils";

export class MenuItemController {
  static async addMenuItem(req: Request, res: Response) {
    const restaurantId = req.params.id;

    const menuItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      restaurant: restaurantId,
      images: req.body.images,
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendError(res, 400, formatErrorMessages(errors.mapped()));
    }

    try {
      const newMenuItem = await menuItem.save();

      const updatedRestaurantMenu = await Restaurant.findByIdAndUpdate(
        restaurantId,
        { $push: { menu: newMenuItem._id } },
        { $new: true }
      ).populate({
        path: "menu",
      });

      sendResponse(res, 201, updatedRestaurantMenu, "Menu Added Successfully");
    } catch (e: any) {
      sendError(res, 500, e.message);
    }
  }

  static async updateMenuItem(req: Request, res: Response) {
    const menuId = req.params.menuId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, formatErrorMessages(errors.mapped()));
    }

    try {
      const updatedMenuItem = await MenuItem.findByIdAndUpdate(
        menuId,
        {
          $set: req.body,
        },
        { new: true }
      );

      sendResponse(res, 200, updatedMenuItem, "Menu Updated Successfully");
    } catch (e: any) {
      sendError(res, 500, e.message);
    }
  }

  static async deleteMenuItem(req: Request, res: Response) {
    const menuId = req.params.menuId;

    try {
      const deletedMenuItem = await MenuItem.findByIdAndDelete(menuId);
      if (!deletedMenuItem) {
        sendError(res, 404, "Menu Item Not Found");
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

        sendResponse(res, 200, updatedRestaurant, "Menu Deleted Successfully");
      }
    } catch (e: any) {
      sendError(res, 500, e.message);
    }
  }

  static async getRestaurantMenu(req: Request, res: Response) {
    const restaurantId = req.params.id;

    try {
      const menuItems = await MenuItem.find({
        restaurant: restaurantId,
      });

      const menuItemsCount = await MenuItem.countDocuments({
        restaurant: restaurantId,
      });

      sendResponse(res, 200, menuItems, "Success", menuItemsCount);
    } catch (e: any) {
      sendError(res, 500, e.message);
    }
  }
}
