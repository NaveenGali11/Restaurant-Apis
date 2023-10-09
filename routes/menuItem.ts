import { Router } from "express";

import { MenuItemController } from "../controllers";
import {
  checkFileType,
  uploadMiddleware,
  verifyTokenOwnerOrAdmin,
} from "../middlewares";
import {
  addMenuItemValidation,
  updateMenuItemValidation,
} from "../validations";

const router = Router();

router.get("/:id", MenuItemController.getRestaurantMenu);

router.post(
  "/:id/add",
  verifyTokenOwnerOrAdmin,
  checkFileType("images"),
  addMenuItemValidation,
  uploadMiddleware("images", "uploads/menu/"),
  MenuItemController.addMenuItem
);

router.put(
  "/:menuId",
  verifyTokenOwnerOrAdmin,
  checkFileType("images"),
  updateMenuItemValidation,
  uploadMiddleware("images", "uploads/menu/"),
  MenuItemController.updateMenuItem
);

router.delete(
  "/:menuId",
  verifyTokenOwnerOrAdmin,
  MenuItemController.updateMenuItem
);

export { router as MenuItemRouter };
