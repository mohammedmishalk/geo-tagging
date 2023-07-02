const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Photo = require("../model/Image");
const exif = require("exif");

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
    res.status(500).send({ success: false, error: "User already exists" });
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

const postPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No photo file uploaded" });
    }

    const { Location, name } = req.body;
    console.log(req.body);

    const photo = new Photo({
      name: name,
      image: {
        url: req.file.path,
        filename: req.file.filename,
      },
      location: Location,
    });

    await photo.save();

    return res.status(200).json({ message: "Photo uploaded successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getImage = async (req, res) => {
  try {
    const images = await Photo.find(); // Fetch all images from the database

    res.status(200).send({ success: true, images });
  } catch (error) {
    res.status(500).send({ success: false, error: "Failed to fetch images" });
  }
};
exports.getImage = getImage;
exports.postPhoto = postPhoto;
exports.signup = signup;
exports.login = login;
