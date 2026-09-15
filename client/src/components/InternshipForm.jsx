import { useState } from "react";

function InternshipForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    companyName: initialData.companyName || "",
    description: initialData.description || "",
    location: initialData.location || "Remote",
    workMode: initialData.workMode || "Remote",
    type: initialData.type || "Part-time",
    stipend: initialData.stipend || "Unpaid",
    skills: initialData.skills
      ? initialData.skills.join(", ")
      : "",
    duration: initialData.duration || "",
    deadline: initialData.deadline
      ? initialData.deadline.slice(0, 10)
      : "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    onSubmit(data);
  };

  return (
    <form className="internship-form" onSubmit={handleSubmit}>
      <h2>Post Internship</h2>

      <input
        type="text"
        name="title"
        placeholder="Internship Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="companyName"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Internship Description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
      />

      <select
        name="workMode"
        value={formData.workMode}
        onChange={handleChange}
      >
        <option value="Remote">Remote</option>
        <option value="On-site">On-site</option>
        <option value="Hybrid">Hybrid</option>
      </select>

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
      >
        <option value="Part-time">Part-time</option>
        <option value="Full-time">Full-time</option>
      </select>

      <input
        type="text"
        name="stipend"
        placeholder="Stipend"
        value={formData.stipend}
        onChange={handleChange}
      />

      <input
        type="text"
        name="skills"
        placeholder="Skills (React, JavaScript, MongoDB)"
        value={formData.skills}
        onChange={handleChange}
      />

      <input
        type="text"
        name="duration"
        placeholder="Duration (e.g. 3 months)"
        value={formData.duration}
        onChange={handleChange}
      />

      <label>Application Deadline</label>

      <input
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        required
      />

      <button type="submit">
        Save Internship
      </button>
    </form>
  );
}

export default InternshipForm;