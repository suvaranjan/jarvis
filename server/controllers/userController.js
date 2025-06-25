import User from "../models/User.js";

export const insertUser = async (req, res) => {
  const { clerkUserId, email, username, imageUrl } = req.body;

  if (!clerkUserId || !email || !username) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const existingUser = await User.findOne({ clerkUserId });

    if (existingUser) {
      existingUser.email = email;
      existingUser.username = username;
      existingUser.imageUrl = imageUrl;

      await existingUser.save();
      return res.status(200).json(existingUser);
    } else {
      const newUser = await User.create({
        clerkUserId,
        email,
        username,
        imageUrl,
      });

      return res.status(201).json(newUser);
    }
  } catch (error) {
    console.error("Error inserting/updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get User by User ID
export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { clerkUserId, email, username, imageUrl } = req.body;

  if (!clerkUserId) {
    return res.status(400).json({ message: "Missing clerkUserId." });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { clerkUserId },
      { email, username, imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { clerkUserId } = req.params;

  if (!clerkUserId) {
    return res.status(400).json({ message: "Missing clerkUserId in params." });
  }

  try {
    const deletedUser = await User.findOneAndDelete({ clerkUserId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
