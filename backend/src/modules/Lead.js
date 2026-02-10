import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,

    leadType: {
      type: String,
      enum: ["MAIN", "PARTIAL"],
      default: "PARTIAL",
    },

    message: String,

    // marketing fields
    utm_source: String,
    utm_medium: String,
    utm_term: String,
    utm_campaign: String,
    utm_content: String,
    adgroupid: String,
    gclid: String,
    lpurl: String,
    formID: String,

    // dynamic client fields
    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

export const Lead = mongoose.model("Lead", leadSchema);
