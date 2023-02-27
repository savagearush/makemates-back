import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  // check if user exist
  const q = "SELECT * FROM users WHERE emailId = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exist.");

    // create new User
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users(`first_name`, `last_name`, `emailId`, `password`, `gender`, `contact_no`) VALUE (?)";

    const { first_name, last_name, emailId, gender, contact_no } = req.body;

    const value = [
      first_name,
      last_name,
      emailId,
      hashedPassword,
      gender,
      contact_no,
    ];

    db.query(q, [value], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Account created Successfully...");
    });
  });
};

export const login = (req, res) => {
  // check if user exist
  const q = "SELECT * FROM users WHERE emailId = ?";
  db.query(q, [req.body.emailId], (err, data) => {
    if (err) return res.status(409).json(err);
    if (data.length) {
      if (
        bcrypt.compare(req.body.password, data[0].password, (err, result) => {
          if (!result) return res.status(409).json("Incorrect password !!");
          // generate Access Token
          const token = jwt.sign({ _userId: data[0].userId }, "secret-key");
          res
            .cookie("access-token", token, {
              httpOnly: true,
            })
            .status(200)
            .json("Logged In !!");
        })
      );
    }
  });
};
