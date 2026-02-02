import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../../Services/Api";

function EditProfilePage() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [originalUser, setOriginalUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    last_name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId || !token) return;

    const fetchUser = async () => {
      try {
        console.log("Fetching user data for userId:", userId);
        const data = await getUserById(userId, token);

        setOriginalUser(data);
        setForm({
          username: "",
          password: "",
          name: "",
          last_name: "",
          email: "",
        });
      } catch (err) {
        console.error("Failed to load user", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

function handleChange(e) {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
}


  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    // If field not changed → use original value
    const updatedUser = {
      user_id: userId,
      username: form.username || originalUser.username,
      name: form.name || originalUser.name,
      last_name: form.last_name || originalUser.last_name,
      email: form.email || originalUser.email,
    };

    // Only send password if user typed one
    if (form.password) {
      updatedUser.password = form.password;
    }

    try {
      console.log("Updating user with data:", updatedUser);
      const updated = await updateUser(updatedUser, token);

      // Keep frontend in sync
      localStorage.setItem("user", JSON.stringify(updated));

      setMessage("Profile updated successfully");
      setForm({
        username: "",
        password: "",
        name: "",
        last_name: "",
        email: "",
      });
      setOriginalUser(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
  <div className="flex justify-center pt-10">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Edit Profile
      </h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {message && <p className="text-green-600 mb-3">{message}</p>}

      {/* USERNAME */}
      <label className="block font-semibold mb-1">Username</label>
      <input
        name="username"
        placeholder={originalUser.username}
        value={form.username}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 mb-3"
      />

      {/* NAME */}
      <label className="block font-semibold mb-1">Name</label>
      <input
        name="name"
        placeholder={originalUser.name}
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 mb-3"
      />

      {/* LAST NAME */}
      <label className="block font-semibold mb-1">Last Name</label>
      <input
        name="last_name"
        placeholder={originalUser.last_name}
        value={form.last_name}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 mb-3"
      />

      {/* EMAIL */}
      <label className="block font-semibold mb-1">Email</label>
      <input
        type="email"
        name="email"
        placeholder={originalUser.email}
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 mb-3"
      />

      {/* PASSWORD */}
      <label className="block font-semibold mb-1">Password</label>
      <input
        type="password"
        name="password"
        placeholder="New password (optional)"
        value={form.password}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 mb-5"
      />

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  </div>
);

}

export default EditProfilePage;
