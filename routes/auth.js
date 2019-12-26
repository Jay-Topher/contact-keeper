const express = require("express");
const router = express.Router();

/**
 * @route       GET api/auth
 * @description Get logged in user
 * @access      Private
 */
router.get("/", (req, res) => {
  res.send("Get logged in user");
});

/**
 * @route       POST api/auth
 * @description Auth user and get token
 * @access      Public
 */
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });

      return;
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        res.status(400).json({ msg: "Invalid Credentials" });

        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).json({ msg: "Invaid Credentials" });

        return;
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 36000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

module.exports = router;