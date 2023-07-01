const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  const user = new User({
    name: name,
    email: email,
    password: hashPassword,
  });

  try {
    await user.save();
    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Failed to save user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return new Error(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Signup please" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "invalid Email/Password" });
  }
  const reps = {
    // eslint-disable-next-line no-underscore-dangle
    id: existingUser._id,
    email: existingUser.email,
    accountType: "user",
  };
  // after password is correct we want to generate a token
  const token = jwt.sign(reps, process.env.JWT_SECRET_KEY);

  return res.status(200).json({
    message: "successfully Logged In",
    name: existingUser.name,
    token,
  });
};

exports.signup = signup;
exports.login = login;
