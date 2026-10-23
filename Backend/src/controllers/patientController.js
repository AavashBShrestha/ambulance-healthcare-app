const PatientHistory = require("../models/PatientHistory");

const createHistory = async (req, res, next) => {
  try {
    const { name, medicalHistory, allergies, currentMedications, emergencyContacts, bloodGroup } =
      req.body;

    const record = await PatientHistory.create({
      user: req.user.id,
      name,
      medicalHistory,
      allergies,
      currentMedications,
      emergencyContacts,
      bloodGroup,
    });

    return res.status(201).json({ record });
  } catch (error) {
    return next(error);
  }
};

const listMyHistory = async (req, res, next) => {
  try {
    const records = await PatientHistory.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ records });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createHistory, listMyHistory };
