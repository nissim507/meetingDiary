import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md text-center">

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Manage Your Meetings
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-10">
          Organize, track, and manage your meetings in one simple place.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-blue-600 text-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-50 transition"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}
