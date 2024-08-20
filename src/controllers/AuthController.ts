import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import User from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNo, password } = req.body;

  try {
    //check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // //hash password
    // const salt = await bcrypt.genSalt(10);
    // const encryptedPassword = await bcrypt.hash(password, salt);

    //create new user
    await User.create({
      firstName,
      lastName,
      email,
      phoneNo,
      password,
    });

    res.status(201).json({
      status: "success",
      message: `User registered successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error, please try again",
    });
  }
};
