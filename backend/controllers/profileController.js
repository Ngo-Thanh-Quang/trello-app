const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const { getUser, updateUser } = require("../models/userModel");



//Hàm lấy thông tin người dùng
exports.getProfile = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await getUser(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Hàm cập nhật thông tin người dùng
exports.updateProfile = async (req, res) => {
  const { email } = req.user;
  const { name } = req.body;

  try {
    const data = {};
    if (name) data.name = name;

    await updateUser(email, data);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.updateAvatar = async (req, res) => {
  const { email } = req.user;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars", resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(file.buffer);

    await updateUser(email, { picture: result.secure_url });

    return res.status(200).json({
      message: "Avatar updated successfully",
      picture: result.secure_url,
    });
  } catch (error) {
    console.error("Update avatar error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};