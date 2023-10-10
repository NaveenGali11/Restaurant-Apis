import { Request as ExpressRequest, Response } from "express";
import { jwtUser } from "../middlewares";
import { formatErrorMessages, sendError, sendResponse } from "../utils";
import { Address } from "../models";
import { validationResult } from "express-validator";

interface Request extends ExpressRequest {
  user?: jwtUser;
}

export class AddressController {
  static async getAllAddresses(req: Request, res: Response) {
    if (req.user) {
      const userId = req.user.id;

      try {
        const addresses = await Address.find({
          user: userId,
        });

        sendResponse(res, 200, addresses, "Address fetch successful");
      } catch (error: any) {
        sendError(res, 500, error.message);
      }
    } else {
      sendError(res, 404, "User Not Found or In Valid");
    }
  }
  static async addAddress(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendError(res, 400, formatErrorMessages(errors.mapped()));
    }

    if (req.user) {
      const userId = req.user.id;

      const {
        line1,
        line2,
        latitude,
        longitude,
        city,
        state,
        zipCode,
        country,
        type,
      } = req.body;

      const address = new Address({
        line1,
        line2,
        latitude,
        longitude,
        city,
        state,
        zipCode,
        country,
        type,
        user: userId,
      });

      try {
        const savedAddress = await address.save();
        sendResponse(res, 201, savedAddress, "Address Saved Successfully");
      } catch (error: any) {
        sendError(res, 500, error.message);
      }
    } else {
      sendError(res, 404, "User Not Found or In Valid");
    }
  }

  static async updateAddress(req: Request, res: Response) {
    const addressId = req.params.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendError(res, 400, formatErrorMessages(errors.mapped()));
    }

    if (req.user) {
      try {
        const address = await Address.findOne({ _id: addressId });

        if (address) {
          if (address.user.toString() === req.user.id) {
            const updatedAddress = await Address.findByIdAndUpdate(
              addressId,
              { $set: req.body },
              {
                new: true,
              }
            );

            sendResponse(
              res,
              200,
              updatedAddress,
              "Address Updated Successfully"
            );
          } else {
            sendError(res, 403, "Can not update Address");
          }
        } else {
          sendError(res, 404, "Address Not Found!");
        }
      } catch (error: any) {
        sendError(res, 500, error.message);
      }
    }
  }

  static async deleteAddress(req: Request, res: Response) {
    const addressId = req.params.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendError(res, 400, formatErrorMessages(errors.mapped()));
    }

    if (req.user) {
      try {
        const address = await Address.findOne({ _id: addressId });

        if (address) {
          if (address.user.toString() === req.user.id) {
            const deletedAddress = await Address.findOneAndDelete({
              _id: addressId,
            });

            sendResponse(
              res,
              200,
              deletedAddress,
              "Address Deleted Successfully"
            );
          } else {
            sendError(res, 403, "Can not delete Address");
          }
        } else {
          sendError(res, 404, "Address Not Found!");
        }
      } catch (error: any) {
        sendError(res, 500, error.message);
      }
    }
  }
}
