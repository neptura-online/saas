import { Router } from "express";
import { Lead } from "../modules/Lead.js";
import { Company } from "../modules/Company.js";
import { parseTrackingUrl } from "../utils/parseTrackingUrl.js";

export const router = Router();

/**
 * PUBLIC LEAD SUBMISSION
 * Used by client websites (NO AUTH)
 * Supports MAIN + PARTIAL
 */
router.post("/public/lead/:slug", async (req, res) => {
  try {
    // 1️⃣ Resolve company by slug
    const company = await Company.findOne({ slug: req.params.slug });
    if (!company) {
      return res.status(404).json("Company not found");
    }

    // 2️⃣ Extract payload
    const {
      name,
      phone,
      email,
      customFields = {},
      formID,
      lpurl,
      leadType = "MAIN",
    } = req.body;

    // 3️⃣ Basic validation
    if (!name || !phone) {
      return res.status(400).json("Name and phone are required");
    }

    // 4️⃣ Lead type validation (important)
    const allowedTypes = ["MAIN", "PARTIAL"];
    if (!allowedTypes.includes(leadType)) {
      return res.status(400).json("Invalid lead type");
    }

    // 5️⃣ Parse tracking safely
    const trackingData = lpurl ? parseTrackingUrl(lpurl) : {};

    // 6️⃣ Create lead
    await Lead.create({
      name,
      phone: String(phone),
      email: email || "-", // fallback safe
      customFields,
      formID,
      lpurl,
      leadType,
      ...trackingData,

      // 🔒 Multi-company isolation
      companyId: company._id,
    });

    // 7️⃣ Success response
    res.status(200).json({
      success: true,
      message: "Lead submitted successfully",
    });
  } catch (error) {
    console.error("Public lead error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
