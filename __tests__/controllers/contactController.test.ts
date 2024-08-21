import { Request, Response } from "express";

import Contact from "../../src/models/Contact";
import getSlug from "../../src/utils/getSlug";
import {
  addContact,
  editContact,
} from "../../src/controllers/contactController";

jest.mock("../../src/models/Contact");
jest.mock("../../src/utils/getSlug");

describe("addContact Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {
      user: {
        _id: "user-id",
        token: "mock-token",
        email: "john.doe@example.com",
      },
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

  it("should return 400 if the user is not authenticated", async () => {
    req.user = null as any; // Cast to any to bypass type check

    await addContact(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ msg: "User is not authenticated" });
  });

  it("should return 400 if the contact already exists", async () => {
    (Contact.findOne as jest.Mock).mockResolvedValue({});

    await addContact(req as Request, res as Response);

    expect(Contact.findOne).toHaveBeenCalledWith({
      userId: "user-id",
      firstName: "John",
      lastName: "Doe",
      phoneNo: "1234567890",
    });
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      msg: "The contact already exists",
    });
  });

  it("should create a new contact and return success message", async () => {
    (Contact.findOne as jest.Mock).mockResolvedValue(null);
    (getSlug as jest.Mock).mockReturnValue("john-123abc");
    (Contact.create as jest.Mock).mockResolvedValue({});

    await addContact(req as Request, res as Response);

    expect(Contact.findOne).toHaveBeenCalledWith({
      userId: "user-id",
      firstName: "John",
      lastName: "Doe",
      phoneNo: "1234567890",
    });
    expect(Contact.create).toHaveBeenCalledWith({
      userId: "user-id",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNo: "1234567890",
      slug: "john-123abc",
    });
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "success",
      message: "Contact created successfully",
    });
  });

  it("should return 500 if there is a server error", async () => {
    (Contact.findOne as jest.Mock).mockRejectedValue(new Error("Server error"));

    await addContact(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Server error, please try again",
    });
  });
});

describe("editContact Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {
      user: {
        _id: "user-id",
        token: "mock-token",
        email: "john.doe@example.com",
      },
      params: {
        slug: "contact-slug",
      },
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

  it("should return 400 if the user is not authenticated", async () => {
    req.user = null as any; // Cast to any to bypass type check

    await editContact(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ msg: "User is not authenticated" });
  });

  it("should return 400 if the contact does not exist", async () => {
    (Contact.findOne as jest.Mock).mockResolvedValue(null);

    await editContact(req as Request, res as Response);

    expect(Contact.findOne).toHaveBeenCalledWith({
      slug: "contact-slug",
      userId: "user-id",
    });
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      msg: "The contact does not exists",
    });
  });

  it("should update the contact and return the edited data", async () => {
    const mockEditedContact = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNo: "1234567890",
      slug: "john-123abc",
    };

    (Contact.findOne as jest.Mock).mockResolvedValue(mockEditedContact);
    (getSlug as jest.Mock).mockReturnValue("john-123abc");
    (Contact.findOneAndUpdate as jest.Mock).mockResolvedValue(
      mockEditedContact,
    );

    await editContact(req as Request, res as Response);

    expect(Contact.findOne).toHaveBeenCalledWith({
      slug: "contact-slug",
      userId: "user-id",
    });
    expect(Contact.findOneAndUpdate).toHaveBeenCalledWith(
      { slug: "contact-slug" },
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNo: "1234567890",
        slug: "john-123abc",
      },
      { new: true },
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "success",
      editedContact: mockEditedContact,
    });
  });

  it("should return 500 if there is a server error", async () => {
    (Contact.findOne as jest.Mock).mockRejectedValue(new Error("Server error"));

    await editContact(req as Request, res as Response);

    expect(Contact.findOne).toHaveBeenCalledWith({
      slug: "contact-slug",
      userId: "user-id",
    });
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Server error, please try again",
    });
  });
});
