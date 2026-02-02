import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/Api"; // your login API function

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
  try {
    const data = await login(form);

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.user_id);

    navigate("/dashboard");
  } catch (err) {
    setError("Invalid username or password");
  }
};

  // Fields with labels
  const fields = [
    { name: "username", label: "Username", type: "text", placeholder: "Enter your username" },
    { name: "password", label: "Password", type: "password", placeholder: "Enter your password" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">

        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {fields.map((field) => (
          <div key={field.name} className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">
              {field.label}
            </label>
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl"
            />
          </div>
        ))}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold mb-3 hover:bg-blue-700 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold mb-4 hover:bg-gray-400 transition"
        >
          Back
        </button>

        {/* Paragraph with link to signup */}
        <p className="text-center text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}
