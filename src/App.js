import { useState, useEffect } from "react";
import Select from "react-select";
import "./styles.css";


export default function ReactFormWidget() {
  useEffect(() => {
    console.log("Loading Zoho SDK...");
    const script = document.createElement("script");
    script.src = "https://js.zohostatic.com/creator/widgets/version/2.0/widgetsdk-min.js";
    script.async = true;
    script.onload = () => console.log("Zoho SDK Loaded");
    script.onerror = () => console.error("Failed to load Zoho SDK");
    document.body.appendChild(script);
  }, []);

  const skillsOptions = [
    { value: "Java", label: "Java" },
    { value: "Python", label: "Python" },
    { value: "Deluge", label: "Deluge" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
  ];

  const availabilityOptions = ["Full Time", "Part Time", "Freelance", "Remote", "Contract"];

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    Age: "",
    Acadamic: "",
    Imported: false,
    DOB: "",
    Arrival_Time: "",
    Dob_Time: "",
    address_line_1: "",
    address_line_2: "",
    district_city: "",
    state_province: "",
    postal_Code: "",
    country: "",
    Email: "",
    Phone_Number: "",
    Resume_Link: { value: "", url: "" },
    Skills: [],
    Availability: [],
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSkillsChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      Skills: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  const handleAvailabilityChange = (event) => {
    const { value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      Availability: checked
        ? [...prev.Availability, value]
        : prev.Availability.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting Data:", formData);
    const custConfig = {
      app_name: "react-widgets",
      form_name: "React_Form",
      payload: { data: formData },
    };

    try {
      console.log("Sending data to Zoho Creator...");
      const response = await window.ZOHO.CREATOR.DATA.addRecords(custConfig);
      console.log("Zoho response:", response);
      if (response.code === 3000) {
        setMessage("Data added successfully!");
      } else {
        setMessage("Failed to add data.");
      }
    } catch (error) {
      console.error("Error adding data", error);
      setMessage("Error submitting data.");
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Create Record</h2>
      {Object.keys(formData).map((key) => (
        typeof formData[key] === "object" && !Array.isArray(formData[key]) ? (
          Object.keys(formData[key]).map((subKey) => (
            <input
              key={subKey}
              className="input-field"
              type="text"
              name={subKey}
              value={formData[key][subKey]}
              onChange={handleChange}
              placeholder={subKey.replace("_", " ")}
            />
          ))
        ) : (
          <input
            key={key}
            className="input-field"
            type={key.includes("Email") ? "email" : key.includes("Phone") ? "tel" : key.includes("DOB") || key.includes("Time") ? "datetime-local" : "text"}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            placeholder={key.replace("_", " ")}
          />
        )
      ))}

      <button onClick={handleSubmit} className="submit-button">Submit</button>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}
