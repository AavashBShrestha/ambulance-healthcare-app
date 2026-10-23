const mongoose = require("mongoose");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const patientHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    medicalHistory: { type: String, required: true, trim: true },
    allergies: { type: String, trim: true, default: "" },
    currentMedications: { type: String, trim: true, default: "" },
    emergencyContacts: {
      type: [{ type: String, trim: true, match: [/^\+?\d{7,15}$/, "Invalid phone number"] }],
      default: [],
    },
    bloodGroup: { type: String, enum: BLOOD_GROUPS, required: true },
  },
  { timestamps: true }
);

patientHistorySchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("PatientHistory", patientHistorySchema, "patient_histories");
