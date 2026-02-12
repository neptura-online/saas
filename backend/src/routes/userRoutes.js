import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { scope } from "../middleware/scope.js";
import { User } from "../modules/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const router = Router();

/**
 * CREATE USER (company-safe)
 * Only OWNER / ADMIN can create users in their company
 */
router.post("/signup", auth, async (req, res) => {
  try {
    if (!["owner", "admin", "SUPER_ADMIN"].includes(req.user.role)) {
      return res.status(403).json("Not authorized to create users");
    }

    const {
      name,
      email,
      phone,
      password,
      role,
      companyId: bodyCompanyId,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json("All fields are required");
    }

    const existingUser = await User.findOne({
      email,
      companyId,
    });
    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // 🔥 Determine companyId
    const companyId =
      req.user.role === "SUPER_ADMIN" ? bodyCompanyId : req.user.companyId;

    if (!companyId) {
      return res.status(400).json("Company required");
    }

    // 🔥 Determine safe role
    let newRole = "user";

    if (req.user.role === "SUPER_ADMIN") {
      newRole = role || "user";
    } else if (["admin", "user"].includes(role)) {
      newRole = role;
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: hashPassword,
      role: newRole,
      roleAssignedBy: req.user._id,
      companyId,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to create user");
  }
});

/**
 * LOGIN (unchanged)
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("companyId");
    if (!user) return res.status(404).json("User not found");

    if (user.role !== "SUPER_ADMIN") {
      if (!user.companyId) {
        return res.status(400).json("Company not assigned");
      }

      if (!user.companyId.isActive) {
        return res.status(403).json("Company is disabled");
      }
    }

    const status = await bcrypt.compare(password, user.password);
    if (!status) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      { id: user._id, role: user.role, companyId: user.companyId },
      process.env.KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Login failed");
  }
});

/**
 * GET USERS (company-safe)
 */
router.get("/", auth, scope, async (req, res) => {
  try {
    const users = await User.find(req.scope).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to fetch users");
  }
});

/**
 * GET SINGLE USER (company-safe)
 */
router.get("/:id", auth, scope, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      ...req.scope,
    }).select("-password");

    if (!user) return res.status(404).json("User not found");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to fetch user");
  }
});

/**
 * UPDATE ROLE (OWNER / SUPER_ADMIN only)
 */
router.patch("/:id/role", auth, scope, async (req, res) => {
  try {
    if (!["owner", "SUPER_ADMIN"].includes(req.user.role)) {
      return res.status(403).json("Not authorized");
    }

    const { role } = req.body;
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json("Invalid role");
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, ...req.scope },
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json("User not found");

    res.status(200).json({
      message: "Role updated",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to update role");
  }
});

/**
 * DELETE USER (company-safe)
 */
router.delete("/:id", auth, scope, async (req, res) => {
  try {
    if (!["owner", "SUPER_ADMIN"].includes(req.user.role)) {
      return res.status(403).json("Not authorized");
    }

    const user = await User.findOneAndDelete({
      _id: req.params.id,
      ...req.scope,
    });

    if (!user) return res.status(404).json("User not found");

    res.status(200).json("User deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to delete user");
  }
});

/**
 * VERIFY TOKEN
 */
router.post("/verify", auth, (req, res) => {
  res.status(200).json({
    authorized: true,
    user: req.user,
  });
});
