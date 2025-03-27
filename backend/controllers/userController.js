const User = require("../models/User");
const upload = require("../config/multer");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("enrolledCourses");

    if (!user) return res.status(404).json({ error: "User not found" });

    // Prepend backend URL to profilePicture path
    const profilePicUrl = user.profilePicture
      ? `${req.protocol}://${req.get("host")}${user.profilePicture}`
      : null; // Set null if no profile picture is found

    res.json({
      ...user.toObject(),
      profilePicture: profilePicUrl, // Send full URL in response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, profilePicture },
      { new: true }
    );

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update Profile Picture
exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const userId = req.params.id;
    const profilePicPath = `/uploads/${req.file.filename}`;

    //Update the user's profile picture in the db
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePicPath },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json({
      message: "Profile picture updated successfully",
      profilePicture: profilePicPath,
    });
  } catch (error) {
    console.error("Error updating profile picture: ", error);
    res.json(500).json({ message: "Server error" });
  }
};
