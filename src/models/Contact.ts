import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNo: string;
}

const contactSchema: Schema<IContact> = new Schema<IContact>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Contact: Model<IContact> = mongoose.model<IContact>(
  "Contact",
  contactSchema,
);
export default Contact;
