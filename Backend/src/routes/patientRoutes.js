const express = require("express");
const { createHistory, listMyHistory } = require("../controllers/patientController");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate, requireRole("patient"));

router.post("/history", createHistory);
router.get("/history", listMyHistory);

module.exports = router;
