import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarPage from "./DashboardPages/CalendarPage";
import NewMeetingPage from "./DashboardPages/NewMeetingPage";
import HistoryPage from "./DashboardPages/HistoryPage";
import EditProfilePage from "./DashboardPages/EditProfilePage";
import DefaultLogedinPage from "./DashboardPages/DefaultLogedinPage";
import { getUserById } from "../Services/Api";
import FloatingAIAssistant from "./DashboardPages/FloatingAIAssistant";



export default function Dashboard() {
  const [details, setDetails] = useState({name: "", last_name: "", email: ""});

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  useEffect(() => {
      if (!userId || !token) return;
  
    const fetchUser = async () => {
        try {
          console.log("Fetching user data for userId:", userId);
          const data = await getUserById(userId, token);
          setDetails({name: data.name, last_name: data.last_name, email: data.email});

        } catch (err) {
          console.error("Failed to load user", err);
          setError("Failed to load profile");
        }
      };
      fetchUser();
  }, [userId, token]);


  const initials = `${details.name?.charAt(0) || ""}${
    details.last_name?.charAt(0) || ""
  }`.toUpperCase();


  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(""); // default page
  


  const handleLogout = () => {
    // optionally clear any tokens or session storage here
    navigate("/"); // go back to welcome page
    localStorage.clear();
  };

  const renderRightPage = () => {
  switch (activePage) {
    case "calendar":
      return <CalendarPage />;
    case "newMeeting":
      return <NewMeetingPage />;
    case "history":
      return <HistoryPage />;
    case "editProfile":
      return <EditProfilePage />;
    default:
      return (
        <DefaultLogedinPage
          name={details.name}
          lastName={details.last_name}
          onNavigate={setActivePage}
        />
      );
  }
};

  return (
    
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col p-6">
        <div className="flex flex-col items-center mb-8">
          {/* Circle initials */}
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-2">
            {initials || "?"}
          </div>

          {/* Full name */}
          <div className="text-sm font-semibold text-gray-800 text-center">
            {details.name} {details.last_name}
          </div>

          {/* Email */}
          <div className="text-xs text-gray-500 text-center break-all">
            {details.email}
          </div>
        </div>

        <div className="border-t mb-4" />
        <nav className="flex flex-col gap-3 mt-4"></nav>
        
        <nav className="flex flex-col gap-3">
          
          <button
            className={`py-2 px-4 rounded hover:bg-gray-200 text-left ${activePage === "calendar" ? "bg-gray-200" : ""}`}
            onClick={() => setActivePage("calendar")}
          >
            Calendar
          </button>
          <button
            className={`py-2 px-4 rounded hover:bg-gray-200 text-left ${activePage === "newMeeting" ? "bg-gray-200" : ""}`}
            onClick={() => setActivePage("newMeeting")}
          >
            New Meeting
          </button>
          <button
            className={`py-2 px-4 rounded hover:bg-gray-200 text-left ${activePage === "history" ? "bg-gray-200" : ""}`}
            onClick={() => setActivePage("history")}
          >
            History
          </button>
          <button
            className={`py-2 px-4 rounded hover:bg-gray-200 text-left ${activePage === "editProfile" ? "bg-gray-200" : ""}`}
            onClick={() => setActivePage("editProfile")}
          >
            Edit Profile
          </button>
          <button
            className="py-2 px-4 mt-auto rounded hover:bg-red-500 text-left text-red-600 hover:text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Right content */}
      <div className="flex-1 p-6">
        {renderRightPage()}
      </div>

        <FloatingAIAssistant onAction={setActivePage} />
    </div>
  );
}

