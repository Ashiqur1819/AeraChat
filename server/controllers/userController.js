import bcrypt from "bcryptjs";
import User from "../models/user-model.js";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

//Controller To Sign Up User
export const signupUser = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing details." });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.json({ success: false, message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully.",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Controller To Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "You don't have an account. Please sign up.",
      });
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      user,
      token,
      message: "Login successfull.",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Controller to authenticated user
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Controller to update user profile details
export const updateProfile = async () => {
  const { profilePic, fullName, bio } = req.body;

  try {
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio },
        { new: true },
      );
    } else {
      const uploadImage = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadImage.secure_url, fullName, bio },
        { new: true },
      );
      return res.json({ success: true, user: updatedUser });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
