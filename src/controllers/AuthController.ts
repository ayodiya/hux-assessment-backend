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
      return res
        .status(400)
        .json({ msg: "User with the email does not exists" });
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

describe("logoutUser", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    req = {
      user: {
        email: "test@example.com",
        token: "mockToken",
      },
    };
    res = {
      status: mockStatus,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if user is not authenticated", async () => {
    req.user = undefined;

    await logoutUser(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ msg: "User is not authenticated" });
  });

  it("should return 400 if user does not exist", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await logoutUser(req as Request, res as Response);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      msg: "User with the email does not exists",
    });
  });

  it("should return 400 if token does not exist", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      email: "test@example.com",
    });
    (Token.findOne as jest.Mock).mockResolvedValue(null);

    await logoutUser(req as Request, res as Response);

    expect(Token.findOne).toHaveBeenCalledWith({ token: "mockToken" });
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      msg: "No login session available",
    });
  });

  it("should return 200 and success message if logout is successful", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      email: "test@example.com",
    });
    (Token.findOne as jest.Mock).mockResolvedValue({ token: "mockToken" });
    (Token.findOneAndDelete as jest.Mock).mockResolvedValue(true);

    await logoutUser(req as Request, res as Response);

    expect(Token.findOneAndDelete).toHaveBeenCalledWith({ token: "mockToken" });
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      status: "success",
      message: "Logout successfully",
    });
  });

  it("should return 500 if an error occurs", async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error("Test error"));

    await logoutUser(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      status: "error",
      message: "Server error, please try again",
    });
  });
});
