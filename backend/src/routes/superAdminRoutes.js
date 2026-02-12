import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { Lead } from "../modules/Lead.js";
import { User } from "../modules/User.js";
import { Company } from "../modules/Company.js";

export const router = Router();

router.get("/overview", auth, async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json("Not authorized");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalCompanies, totalUsers, totalLeads, todayLeads] =
      await Promise.all([
        Company.countDocuments(),
        User.countDocuments(),
        Lead.countDocuments(),
        Lead.countDocuments({ createdAt: { $gte: today } }),
      ]);

    // 🔥 Single aggregation for company stats
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
