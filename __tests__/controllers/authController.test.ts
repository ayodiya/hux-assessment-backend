import { Request, Response } from "express";

import User from "../../src/models/User";
import Token from "../../src/models/Token";
import { createUser, loginUser } from "../../src/controllers/authController";

jest.mock("../../src/models/User");
jest.mock("../../src/models/Token");

describe("createUser", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNo: "1234567890",
        password: "password123",
      },
    };
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = {
      status: statusMock,
    };
    jest.clearAllMocks();
  });

  it("should create a new user successfully", async () => {
    // Mock the User.findOne and User.create methods
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue({});

    await createUser(req as Request, res as Response);

    expect(User.findOne).toHaveBeenCalledWith({
      email: "john.doe@example.com",
    });
    expect(User.create).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNo: "1234567890",
      password: "password123",
    });
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "success",
      message: "User registered successfully",
    });
  });

  it("should return an error if the user already exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(true);

    await createUser(req as Request, res as Response);

    expect(User.findOne).toHaveBeenCalledWith({
      email: "john.doe@example.com",
    });
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ msg: "User already exists" });
  });

  it("should return a server error if an exception occurs", async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));

    await createUser(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Server error, please try again",
    });
  });
});

describe("loginUser", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: mockStatus,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if user does not exist", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await loginUser(req as Request, res as Response);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      msg: "User with the email does not exists",
    });
  });

  it("should return 400 if password is incorrect", async () => {
    const mockUser = {
      comparePassword: jest.fn().mockResolvedValue(false),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    await loginUser(req as Request, res as Response);

    expect(mockUser.comparePassword).toHaveBeenCalledWith("password123");
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ msg: "Password not correct" });
  });

  it("should return 200 and a token if login is successful", async () => {
    const mockUser = {
      _id: "userId123",
      comparePassword: jest.fn().mockResolvedValue(true),
      generateAuthToken: jest.fn().mockResolvedValue("mockToken"),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (Token.create as jest.Mock).mockResolvedValue(true);

    await loginUser(req as Request, res as Response);

    expect(mockUser.comparePassword).toHaveBeenCalledWith("password123");
    expect(mockUser.generateAuthToken).toHaveBeenCalled();
    expect(Token.create).toHaveBeenCalledWith({
      userId: "userId123",
      token: "mockToken",
    });
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      status: "success",
      message: "User logged in  successfully",
      token: "mockToken",
    });
  });

  it("should return 500 if an error occurs", async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error("Test error"));

    await loginUser(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      status: "error",
      message: "Server error, please try again",
    });
  });
});
