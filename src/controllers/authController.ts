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
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNo,
      password,
    });

    const token = await newUser.generateAuthToken();

    //save token to database
    await Token.create({
      userId: newUser._id,
      token,
    });

    res.status(201).json({
      status: "success",
      message: `User registered successfully`,
      token,
      userDetails: newUser,
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
        message: `User logged in successfully`,
        token,
        userDetails: userExists,
      });
    } else {
      return res.status(400).json({ message: "Password not correct" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error, please try again",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  if (!req.user || !req.user.email) {
    return res.status(400).json({ msg: "User is not authenticated" });
  }

  const { email, token } = req.user;

  try {
    //check if user exists
    const userExists = await User.findOne({ email });

    // if user does not exist return 400
    if (!userExists) {
      return res.status(400).json({ msg: "User is not logged in" });
    }

    //check if token exists
    const tokenExists = await Token.findOne({ token });

    // if token does not exist return 400
    if (!tokenExists) {
      return res.status(400).json({ msg: "No login session available" });
    } else {
      await Token.findOneAndDelete({ token });
      res.status(200).json({
        status: "success",
        message: "Logout successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error, please try again",
    });
  }
};
