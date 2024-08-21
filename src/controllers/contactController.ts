import { Request, Response } from "express";

import Contact from "../models/Contact";
import getSlug from "../utils/getSlug";

export const addContact = async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    return res.status(400).json({ msg: "User is not authenticated" });
  }

  const { firstName, lastName, email, phoneNo } = req.body;
  const { _id } = req.user;

  try {
    //check if contact already exist
    const contactExists = await Contact.findOne({
      userId: _id,
      firstName,
      lastName,
      phoneNo,
    });

    // if contact exists return error else store contact
    if (contactExists) {
      return res.status(400).json({ msg: "The contact already exists" });
    } else {
      await Contact.create({
        userId: _id,
        firstName,
        lastName,
        email,
        phoneNo,
        slug: getSlug(firstName),
      });

      res.status(201).json({
        status: "success",
        message: `Contact created successfully`,
      });
    }
  } catch (error) {
    console.log("this isfhf", error);
    res.status(500).json({
      status: "error",
      message: "Server error, please try again",
    });
  }
};

export const allContacts = async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    return res.status(400).json({ msg: "User is not authenticated" });
  }

  const { _id } = req.user;

  try {
    const allContacts = await Contact.find({ userId: _id });

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

export const singleContact = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!req.user || !req.user._id) {
    return res.status(400).json({ msg: "User is not authenticated" });
  }

  const { _id } = req.user;

  try {
    //check if contact exists
    const contactExists = await Contact.findOne({ slug, userId: _id });

    //if contact does not exist return 400
    if (!contactExists) {
      return res.status(400).json({ msg: "The contact does not exists" });
    } else {
      return res.status(200).json({
        status: "success",
        contactExists,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error, please try again",
    });
  }
};

export const editContact = async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    return res.status(400).json({ msg: "User is not authenticated" });
  }

  const { slug } = req.params;
  const { firstName, lastName, email, phoneNo } = req.body;
  const { _id } = req.user;

  try {
    //check if contact exists
    const contactExists = await Contact.findOne({ slug, userId: _id });

    //if contact does not exist return 400
    if (!contactExists) {
      return res.status(400).json({ msg: "The contact does not exists" });
    } else {
      //change contact in database and return edited data
      const editedContact = await Contact.findOneAndUpdate(
        { slug },
        { firstName, lastName, email, phoneNo, slug: getSlug(firstName) },
        {
          new: true,
        },
      );

      return res.status(200).json({
        status: "success",
        editedContact,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error, please try again",
    });
  }
};
