import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import User from "../models/User";
import Token from "../models/Token";

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNo, password } = req.body;

  try {
    //check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

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

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    //check if user exists
    const userExists = await User.findOne({ email });

    // if user does not exist return 400
    if (!userExists) {
      return res
        .status(400)
        .json({ msg: "User with the email does not exists" });
    }

    //compare password  and log in if true else return error
    if (await userExists.comparePassword(password)) {
      const token = await userExists.generateAuthToken();

      //save token to database
      await Token.create({
        userId: userExists._id,
        token,
      });

      res.status(200).json({
        status: "success",
        message: `User logged in  successfully`,
        token,
      });
    } else {
      return res.status(400).json({ msg: "Password not correct" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error, please try again",
    });
  }
};
