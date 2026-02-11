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

    // 🔥 Get all companies
    const companies = await Company.find();

    // 🔥 Build stats per company (SAFE METHOD)
    const companyStats = await Promise.all(
      companies.map(async (company) => {
        const total = await Lead.countDocuments({
          companyId: company._id,
        });

        const todayCount = await Lead.countDocuments({
          companyId: company._id,
          createdAt: { $gte: today },
        });

        return {
          _id: company._id,
          name: company.name,
          totalLeads: total,
          todayLeads: todayCount,
        };
      })
    );

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
