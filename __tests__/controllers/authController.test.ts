import { createUser } from "../../src/controllers/authController";
import User from "../../src/models/User";
import { Request, Response } from "express";

jest.mock("../../src/models/User");

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
