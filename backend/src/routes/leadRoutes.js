import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { scope } from "../middleware/scope.js";
import { Lead } from "../modules/Lead.js";
import { parseTrackingUrl } from "../utils/parseTrackingUrl.js";

export const router = Router();

/**
 * GET LEADS (company-safe)
 */
router.get("/", auth, scope, async (req, res) => {
  try {
    const { type } = req.query;

    const filter = {
      ...req.scope,
      ...(type ? { leadType: type } : {}),
    };

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to fetch leads");
  }
});

/**
 * DELETE SINGLE LEAD (company-safe)
 */
router.delete("/:id", auth, scope, async (req, res) => {
  try {
    const deleted = await Lead.findOneAndDelete({
      _id: req.params.id,
      ...req.scope,
    });

    if (!deleted) {
      return res.status(404).json("Lead not found");
    }

    res.status(200).json("Lead deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to delete lead");
  }
});

/**
 * BULK DELETE (company-safe)
 */
router.post("/bulk-delete", auth, scope, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json("No leads selected");
    }

    await Lead.deleteMany({
      _id: { $in: ids },
      ...req.scope,
    });

    res.status(200).json("Leads deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to delete leads");
  }
});
