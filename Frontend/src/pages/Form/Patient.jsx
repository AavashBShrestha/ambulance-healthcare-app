import { useState } from "react";
import api, { getErrorMessage } from "../../api/client";

function PatientHistoryForm() {
  const [patientData, setPatientData] = useState({
    name: "",
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
    emergencyContact: "",
    emergencyContacts: [], 
    bloodGroup: ""
  });

  const handleChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const handleAddEmergencyContact = () => {
    if (patientData.emergencyContact.trim() !== "") {
      setPatientData({
        ...patientData,
        emergencyContacts: [...patientData.emergencyContacts, patientData.emergencyContact],
        emergencyContact: "",
      });
    }
  };

  const handleRemoveEmergencyContact = (index) => {
    const updatedContacts = patientData.emergencyContacts.filter((_, i) => i !== index);
    setPatientData({ ...patientData, emergencyContacts: updatedContacts });
  };

  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    const payload = { ...patientData };
    delete payload.emergencyContact;
    try {
      await api.post("/patient/history", payload);
      setStatus({ type: "success", message: "Your medical history has been saved." });
    } catch (error) {
      setStatus({ type: "error", message: getErrorMessage(error, "Failed to save patient history.") });
    }
  };

  return (
    <div className="Patient-Form">
      <form className="PatientForm" onSubmit={handleSubmit}>
        <h1>Enter Your Medical History</h1>

        <div className="Patient__Field">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
            onChange={handleChange}
          />
        </div>

        <div className="Patient__Field">
          <label htmlFor="medicalHistory">Medical History:</label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            placeholder="Enter your Medical History"
            required
            onChange={handleChange}
          />
        </div>

        <div className="Patient__Field">
          <label htmlFor="allergies">Allergies:</label>
          <textarea
            id="allergies"
            name="allergies"
            placeholder="Enter Allergies"
            required
            onChange={handleChange}
          />
        </div>

        <div className="Patient__Field">
          <label htmlFor="currentMedications">Current Medications:</label>
          <textarea
            id="currentMedications"
            name="currentMedications"
            placeholder="Enter Current Medications"
            required
            onChange={handleChange}
          />
        </div>

        <div className="Patient__Field">
          <label htmlFor="emergencyContact">Emergency Contact:</label>
          <input
            type="tel"
            id="emergencyContact"
            name="emergencyContact"
            value={patientData.emergencyContact}
            placeholder="Enter Phone Number"
            onChange={handleChange}
          />
          <button type="button" onClick={handleAddEmergencyContact}>
            Add Emergency Contact
          </button>
          <div>
            {patientData.emergencyContacts.length > 0 && (
              <ul>
                {patientData.emergencyContacts.map((contact, index) => (
                  <li key={index}>
                    {contact}{" "}
                    <button type="button" onClick={() => handleRemoveEmergencyContact(index)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="Patient__Field">
          <label htmlFor="bloodGroup">Blood Group:</label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={patientData.bloodGroup}
            required
            onChange={handleChange}
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        {status.message && (
          <p className={status.type === "error" ? "form-error" : "form-success"} role="status">
            {status.message}
          </p>
        )}

        <div className="Patient__Field">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default PatientHistoryForm;
