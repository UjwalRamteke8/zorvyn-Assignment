import User from "../models/User.js";

// @desc    Get all users (Admin only)
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password"); // Don't return hashes
  res.status(200).json({ success: true, count: users.length, data: users });
};

// @desc    Admin creates a new user [Requirement: Creating users]
export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
};

// @desc    Admin updates role or status [Requirement: Assigning roles/Managing status]
export const updateUser = async (req, res) => {
  const { role, status } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role, status },
    { new: true, runValidators: true },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ success: true, data: user });
};

// 3. DELETE A USER (Admin Only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
