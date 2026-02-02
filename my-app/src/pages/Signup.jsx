import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../Services/Api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    last_name: "", // match backend
    email: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      await signup(form);
      alert("Signup successful!");
      navigate("/login"); // success → go to login
    } catch (err) {
      setError(err.message);
    }
  };

  // Define labels and placeholders for each field
  const fields = [
    { name: "username", label: "Username", type: "text", placeholder: "Enter your username" },
    { name: "password", label: "Password", type: "password", placeholder: "Enter your password" },
    { name: "name", label: "First Name", type: "text", placeholder: "Enter your first name" },
    { name: "last_name", label: "Last Name", type: "text", placeholder: "Enter your last name" },
    { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">

        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {fields.map((field) => (
          <div key={field.name} className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">
              {field.label}
            </label>
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder} // added placeholder
              value={form[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>
        ))}

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold mb-3 hover:bg-green-700 transition"
        >
          Sign Up
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold mb-4 hover:bg-gray-400 transition"
        >
          Back
        </button>

        {/* Paragraph with link to login */}
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>

      </div>
    </div>
  );
}
