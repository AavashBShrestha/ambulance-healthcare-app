export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const PASSWORD_CHECKS = [
  { label: "At least 8 characters long", test: (p) => p.length >= 8 },
  { label: "At least one lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
  { label: "At least one uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "At least one digit (0-9)", test: (p) => /\d/.test(p) },
  { label: "At least one special character (!@#$%^&*)", test: (p) => /[^A-Za-z\d]/.test(p) },
];

export const HOME_BY_ROLE = {
  admin: "/Admin",
  patient: "/home",
  ambulance: "/Ambulance",
  hospital: "/Hospital",
  bloodbank: "/BloodBank",
};
