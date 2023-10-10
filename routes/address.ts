import { Router } from "express";
import { verifyToken, verifyTokenAndUser } from "../middlewares";
import { AddressController } from "../controllers";
import { addAddressValidation, updateAddressValidation } from "../validations";

const router = Router();

router.get("/", verifyToken, AddressController.getAllAddresses);

router.post(
  "/",
  verifyToken,
  addAddressValidation,
  AddressController.addAddress
);

router.put(
  "/:id",
  verifyTokenAndUser,
  updateAddressValidation,
  AddressController.updateAddress
);

router.delete("/:id", verifyTokenAndUser, AddressController.deleteAddress);

export { router as AddressRouter };
