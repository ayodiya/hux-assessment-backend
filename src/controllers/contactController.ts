import slugify from "slugify";
import { Request, Response } from "express";

import Contact from "../models/Contact";

export const addContact = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNo } = req.body;

  try {
    //check if contact already exist
    const contactExists = await Contact.findOne({
      firstName,
      lastName,
      phoneNo,
    });

    // if contact exists return error else store contact
    if (contactExists) {
      return res.status(400).json({ msg: "The contact already exists" });
    } else {
      await Contact.create({
        firstName,
        lastName,
        email,
        phoneNo,
        slug: slugify(`${firstName} ${lastName}`),
      });

      res.status(201).json({
        status: "success",
        message: `Contact created successfully`,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error, please try again",
    });
  }
};

export const allContacts = async (req: Request, res: Response) => {
  try {
    const allContacts = await Contact.find({});

    res.status(200).json({
      status: "success",
      allContacts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error, please try again",
    });
  }
};
