import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { Company } from "../modules/Company.js";
import { User } from "../modules/User.js";

export const router = Router();

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json("Not authorized");
    }

    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json("Name and slug required");
    }

    const existing = await Company.findOne({ slug });
    if (existing) {
      return res.status(400).json("Slug already exists");
    }

    const company = await Company.create({
      name,
      slug,
    });

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to create company");
  }
});

/**
 * GET ALL COMPANIES (SUPER_ADMIN only)
 */
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json("Not authorized");
    }

    const companies = await Company.find().sort({ createdAt: -1 });

    res.status(200).json(companies);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to fetch companies");
  }
});

/**
 * GET SINGLE COMPANY
 */
router.get("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json("Not authorized");
    }

    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json("Company not found");

    res.status(200).json(company);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to fetch company");
  }
});

/**
 * TOGGLE COMPANY STATUS
 */
router.patch("/:id/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json("Not authorized");
    }

    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json("Company not found");

    company.isActive = !company.isActive;
    await company.save();

    res.status(200).json({
      message: "Company status updated",
      company,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to update status");
  }
});

/**
 * DELETE COMPANY (SUPER_ADMIN only)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json("Not authorized");
    }

    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json("Company not found");

    // delete users of this company
    await User.deleteMany({ companyId: company._id });

    await company.deleteOne();

    res.status(200).json("Company deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to delete company");
  }
});
