import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { scope } from "../middleware/scope.js";
import { User } from "../modules/User.js";
import { Company } from "../modules/Company.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const router = Router();

/* =====================================================
   CREATE USER
===================================================== */
router.post("/signup", auth, async (req, res) => {
  try {
    if (!["SUPER_ADMIN", "owner", "admin"].includes(req.user.role)) {
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

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json("All fields are required");
    }

    // 🔥 Determine companyId first
    const companyId =
      req.user.role === "SUPER_ADMIN" ? bodyCompanyId : req.user.companyId;

    if (!companyId) {
      return res.status(400).json("Company required");
    }

    // 🔥 Validate company exists
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return res.status(400).json("Invalid company");
    }

    // 🔥 Role hierarchy control
    let newRole;

    if (req.user.role === "SUPER_ADMIN") {
      if (!["owner", "admin", "user"].includes(role)) {
        return res.status(400).json("Invalid role");
      }
      newRole = role;
    } else if (req.user.role === "owner") {
      if (!["admin", "user"].includes(role)) {
        return res.status(400).json("Owner can only create admin or user");
      }
      newRole = role;
    } else if (req.user.role === "admin") {
      if (role !== "user") {
        return res.status(400).json("Admin can only create user");
      }
      newRole = "user";
    }

    // 🔥 Check duplicate user inside same company
    const existingUser = await User.findOne({
      email,
      companyId,
    });

    if (existingUser) {
      return res.status(400).json("User already exists in this company");
    }

    const hashPassword = await bcrypt.hash(password, 10);

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

/* =====================================================
   LOGIN
===================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("companyId");
    if (!user) return res.status(404).json("User not found");

    if (user.role !== "SUPER_ADMIN") {
      if (!user.companyId) {
        return res.status(400).json("Company not assigned");
      }

      if (user.companyId.isActive === false) {
        return res.status(403).json("Company is disabled");
      }
    }

    const status = await bcrypt.compare(password, user.password);
    if (!status) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        companyId: user.companyId?._id || null,
      },
      process.env.KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        companyId: user.companyId?._id || null,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Login failed");
  }
});

/* =====================================================
   GET USERS
===================================================== */
router.get("/", auth, scope, async (req, res) => {
  try {
    let query = req.scope;

    // 🔥 SUPER_ADMIN sees all users
    if (req.user.role === "SUPER_ADMIN") {
      query = {};
    }

    const users = await User.find(query).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to fetch users");
  }
});

/* =====================================================
   GET SINGLE USER
===================================================== */
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

/* =====================================================
   UPDATE ROLE
===================================================== */
router.patch("/:id/role", auth, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["SUPER_ADMIN", "owner"].includes(req.user.role)) {
      return res.status(403).json("Not authorized");
    }

    if (!["owner", "admin", "user"].includes(role)) {
      return res.status(400).json("Invalid role");
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not found");

    // 🔥 Owner cannot promote to owner
    if (req.user.role === "owner" && role === "owner") {
      return res.status(403).json("Owner cannot assign owner role");
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "Role updated",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to update role");
  }
});

/* =====================================================
   DELETE USER
===================================================== */
router.delete("/:id", auth, scope, async (req, res) => {
  try {
    if (!["SUPER_ADMIN", "owner"].includes(req.user.role)) {
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

/* =====================================================
   VERIFY TOKEN
===================================================== */
router.post("/verify", auth, (req, res) => {
  res.status(200).json({
    authorized: true,
    user: req.user,
  });
});
