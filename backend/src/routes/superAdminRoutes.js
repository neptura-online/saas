import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { Lead } from "../modules/Lead.js";
import { User } from "../modules/User.js";
import { Company } from "../modules/Company.js";

export const router = Router();

/**
 * SUPER ADMIN OVERVIEW
 */
router.get("/overview", auth, async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json("Not authorized");
    }

    // TOTAL COUNTS
    const totalCompanies = await Company.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalLeads = await Lead.countDocuments();

    // TODAY LEADS
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLeads = await Lead.countDocuments({
      createdAt: { $gte: today },
    });

    // COMPANY-WISE LEADS
    const companyStats = await Lead.aggregate([
      {
        $group: {
          _id: "$companyId",
          totalLeads: { $sum: 1 },
          todayLeads: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", today] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "_id",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $project: {
          _id: 1,
          name: "$company.name",
          totalLeads: 1,
          todayLeads: 1,
        },
      },
    ]);

    res.status(200).json({
      totalCompanies,
      totalUsers,
      totalLeads,
      todayLeads,
      companies: companyStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to fetch overview");
  }
});
