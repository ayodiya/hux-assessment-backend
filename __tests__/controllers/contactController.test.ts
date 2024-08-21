import { Request, Response } from "express";
import { addContact } from "../../src/controllers/contactController";
import Contact from "../../src/models/Contact";

jest.mock("../../src/models/Contact");

describe("addContact Controller", () => {
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
      },
    };

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new contact when it does not already exist", async () => {
    (Contact.findOne as jest.Mock).mockResolvedValue(null);
    (Contact.create as jest.Mock).mockResolvedValue({});

    await addContact(req as Request, res as Response);

    expect(Contact.findOne).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      phoneNo: "1234567890",
    });
    expect(Contact.create).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNo: "1234567890",
    });
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "success",
      message: "Contact created successfully",
    });
  });

  it("should return a 400 error if the contact already exists", async () => {
    (Contact.findOne as jest.Mock).mockResolvedValue({});

    await addContact(req as Request, res as Response);

    expect(Contact.findOne).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      phoneNo: "1234567890",
    });
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      msg: "The contact already exists",
    });
    expect(Contact.create).not.toHaveBeenCalled();
  });

  it("should return a 500 error if there is a server error", async () => {
    (Contact.findOne as jest.Mock).mockRejectedValue(new Error("Server error"));

    await addContact(req as Request, res as Response);

    expect(Contact.findOne).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      phoneNo: "1234567890",
    });
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Server error, please try again",
    });
  });
});
