const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Photo = require("../model/Image");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const lowercaseEmail = email.toLowerCase(); 

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  const user = new User({
    name: name,
    email: lowercaseEmail, 
    password: hashPassword,
  });

  try {
    const existingUser = await User.findOne({ email: lowercaseEmail });

    if (existingUser) {
      return res.status(409).json({ success: false, error: "User already exists" });
    } else {
      await user.save();
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "An error occurred" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred" });
  }
  
  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Signup please" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid email/password" });
  }

  const reps = {
    id: existingUser._id,
    email: existingUser.email,
    accountType: "user",
  };

  const token = jwt.sign(reps, process.env.JWT_SECRET_KEY);

  return res.status(200).json({
    message: "Successfully logged in",
    name: existingUser.name,
    token,
  });
};

const postPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No photo file uploaded" });
    }

    const { Location, name, userId } = req.body;
    
    if (!Location || !name || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const photo = new Photo({
      name: name,
      image: {
        url: req.file.path,
        filename: req.file.filename,
      },
      location: Location,
      user: userId,
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
