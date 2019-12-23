const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

const User = require("../models/User");

/**
 * @route       POST api/users
 * @description Register a user
 * @access      Piblic
 */
router.get(
  "/",
  [
    check("name", "name is required")
      .not()
      .isEmpty(),

    check('email', 'Please input a valid mail').isEmail()
  ],
  (req, res) => {
    res.send(req.body);
  }
);

module.exports = router;
