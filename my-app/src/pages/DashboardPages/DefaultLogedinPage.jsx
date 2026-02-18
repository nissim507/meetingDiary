import AIAssistantBox from "./AIAssistantBox";

function DefaultLogedinPage({ name, lastName, onNavigate }) {
  const hour = new Date().getHours();

  const getGreeting = () => {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    
    <div className="min-h-full flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-10">
        
        
        {/* Greeting */}
        <h1 className="text-4xl font-bold mb-2">
          {getGreeting()}, {name} {lastName} 👋
        </h1>

        <p className="text-gray-600 mb-10">
          Welcome back to your personal meeting dashboard.
        </p>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-lg bg-gray-100">
            <h3 className="text-lg font-semibold mb-2">📅 Calendar</h3>
            <p className="text-gray-600 text-sm">
              View and manage your scheduled meetings.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-gray-100">
            <h3 className="text-lg font-semibold mb-2">➕ New Meeting</h3>
            <p className="text-gray-600 text-sm">
              Create a new meeting in seconds.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-gray-100">
            <h3 className="text-lg font-semibold mb-2">⚙️ Profile</h3>
            <p className="text-gray-600 text-sm">
              Update your personal information.
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-4">
          <div className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium">
            Tip: Use the sidebar to navigate between sections
          </div>
        </div>

      </div>
      
    </div>
  );
}

export default DefaultLogedinPage;
