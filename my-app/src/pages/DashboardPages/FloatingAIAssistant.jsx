import { useEffect, useState, useRef } from "react";
import { parseIntent } from "../../utils/aiIntentParser";
import { getAllUsers, getUserById, updateUser } from "../../Services/Api";

function FloatingAIAssistant({ onAction, onCreateMeeting }) {

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("ai_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [step, setStep] = useState(null);

  const [meetingDraft, setMeetingDraft] = useState({
    title: "",
    owner_user: "",
    date: "",
    time: "",
    end_time: "",
    place: "",
    notes: "",
    participants: [],
  });

  // 🆕 Profile draft that AI edits
  const [profileDraft, setProfileDraft] = useState(null);

  // 🆕 Store original profile to allow discard
  const [originalProfile, setOriginalProfile] = useState(null);


  // =========================
  // AUTO SCROLL CHAT
  // =========================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // =========================
  // 🆕 LOAD USER PROFILE
  // =========================
  const loadProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) return null;

      const user = await getUserById(userId, token);

      setOriginalProfile(user);

      setProfileDraft({
        username: user.username,
        password: "", // never load password
        name: user.name,
        last_name: user.last_name,
        email: user.email,
      });

      return user;

    } catch (err) {
      console.error("Failed loading profile", err);
      return null;
    }
  };

  // 🆕 Load profile when assistant mounts
  useEffect(() => {
    loadProfile();
  }, []);


  // =========================
  // 🆕 DISCARD PROFILE FLOW
  // =========================
  const discardProfileFlow = () => {
    addMessage("ai", "Changes discarded ❌ Back to main chat.");

    setProfileDraft({
      username: originalProfile.username,
      password: "",
      name: originalProfile.name,
      last_name: originalProfile.last_name,
      email: originalProfile.email,
    });

    setStep(null);
  };


  // =========================
  // LOAD USERS FOR PARTICIPANTS
  // =========================
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const currentUserId = localStorage.getItem("userId");

        const data = await getAllUsers(token);

        const filtered = data.filter(
          (u) => u.user_id.toString() !== currentUserId
        );

        setAllUsers(filtered);

      } catch (err) {
        console.error("Failed loading users", err);
      }
    };

    loadUsers();
  }, []);


  // =========================
  // SAVE CHAT HISTORY
  // =========================
  useEffect(() => {
    localStorage.setItem("ai_messages", JSON.stringify(messages));
  }, [messages]);


  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };


  // =========================
  // 🆕 SEND PROFILE TO BACKEND
  // =========================
  const submitProfileUpdate = async () => {
    try {

      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      // Same logic as EditProfilePage.jsx
      const updatedUser = {
        user_id: userId,
        username: profileDraft.username || originalProfile.username,
        name: profileDraft.name || originalProfile.name,
        last_name: profileDraft.last_name || originalProfile.last_name,
        email: profileDraft.email || originalProfile.email,
      };

      // Password only if user typed
      if (profileDraft.password) {
        updatedUser.password = profileDraft.password;
      }

      console.log("Updating user with data:", updatedUser);

      const updated = await updateUser(updatedUser, token);

      // Keep frontend in sync EXACTLY like edit page
      localStorage.setItem("user", JSON.stringify(updated));

      setOriginalProfile(updated);

      addMessage("ai", "Profile updated successfully ✅");

      setStep(null);

    } catch (err) {

      console.error(err);
      addMessage("ai", "Failed updating profile ❌");

    }
  };



  // =========================
  // MAIN SEND HANDLER
  // =========================
  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;

    addMessage("user", userText);

    if (userText.toLowerCase() === "cancel") {
      setStep(null);
      addMessage("ai", "Flow cancelled 👍");
      setInput("");
      return;
    }

    const navIntent = parseIntent(userText);

    if (
      navIntent.action === "calendar" ||
      navIntent.action === "history"
    ) {
      onAction(navIntent.action);
      addMessage("ai", navIntent.reply);
      setStep(null);
      setInput("");
      return;
    }

    // 🆕 Profile wizard routing
    if (step && step.startsWith("profile_")) {
      handleProfileFlow(userText);
      setInput("");
      return;
    }

    if (step) {
      handleMeetingFlow(userText);
      setInput("");
      return;
    }

    const result = parseIntent(userText);

    addMessage("ai", result.reply);

    if (result.action === "editProfile") {
      addMessage(
        "ai",
        "Do you want:\n1️⃣ Open edit page\n2️⃣ Edit together with AI"
      );

      setStep("profile_choice");
      setInput("");
      return;
    }

    if (result.action === "meetingChoice") {
      setStep("meetingChoice");
    } else if (result.action) {
      onAction(result.action);
    }

    setInput("");
  };


  // =========================
  // MEETING FLOW (unchanged)
  // =========================
  const handleMeetingFlow = (text) => {

    switch (step) {

      case "meetingChoice":
        if (text === "1") {
          onAction("newMeeting");
          setStep(null);
        } else if (text === "2") {
          addMessage("ai", "Great! What is the meeting title?");
          setStep("title");
        }
        break;

      case "title":
        setMeetingDraft((prev) => ({
          ...prev,
          title: text,
          owner_user: localStorage.getItem("userId")
        }));
        addMessage("ai", "Enter meeting date (YYYY-MM-DD)");
        setStep("date");
        break;

      case "date":
        setMeetingDraft((prev) => ({ ...prev, date: text }));
        addMessage("ai", "Enter start time (HH:MM)");
        setStep("time");
        break;

      case "time":
        setMeetingDraft((prev) => ({ ...prev, time: text }));
        addMessage("ai", "Enter end time (HH:MM)");
        setStep("end_time");
        break;

      case "end_time":
        setMeetingDraft((prev) => ({ ...prev, end_time: text }));
        addMessage("ai", "Enter meeting location");
        setStep("place");
        break;

      case "place":
        setMeetingDraft((prev) => ({ ...prev, place: text }));
        addMessage("ai", "Any notes? (type none if no)");
        setStep("notes");
        break;

      case "notes":
        setMeetingDraft((prev) => ({ ...prev, notes: text }));

        const numberedUsers = allUsers
          .map((u, i) => `${i + 1}. ${u.name} ${u.last_name}`)
          .join("\n");

        addMessage(
          "ai",
          "Choose participants by numbers separated by commas:\n\n" +
            numberedUsers
        );

        setStep("participants");
        break;

      case "participants":

        const numbers = text.split(",").map(n => Number(n.trim()) - 1);

        const selectedUsers = numbers
          .map(i => allUsers[i])
          .filter(Boolean);

        const userIds = selectedUsers.map(u => u.user_id);

        const finalMeeting = {
          ...meetingDraft,
          participants: userIds
        };

        if (onCreateMeeting) {
          onCreateMeeting(finalMeeting);
        }

        addMessage("ai", "Meeting created successfully ✅");

        setMeetingDraft({
          title: "",
          owner_user: "",
          date: "",
          time: "",
          end_time: "",
          place: "",
          notes: "",
          participants: [],
        });

        setStep(null);
        break;

      default:
        setStep(null);
    }
  };


  // =========================
  // 🆕 PROFILE FLOW
  // =========================
  const handleProfileFlow = async (text) => {

  if (text === "9") {
    discardProfileFlow();
    return;
  }

  switch (step) {

    // =====================
    // CHOOSE OPEN OR AI EDIT
    // =====================
    case "profile_choice":

      if (text === "1") {
        onAction("editProfile");
        setStep(null);
      }

      if (text === "2") {
        addMessage(
          "ai",
          `What would you like to edit?

1 Username
2 Password
3 Name
4 Last Name
5 Email
0 Save
9 Discard`
        );

        setStep("profile_field_choice");
      }

      break;


    // =====================
    // FIELD MENU
    // =====================
    case "profile_field_choice":

      if (text === "1") {
        addMessage("ai", "Enter new username:");
        setStep("profile_username");
      }

      else if (text === "2") {
        addMessage("ai", "Enter new password:");
        setStep("profile_password");
      }

      else if (text === "3") {
        addMessage("ai", "Enter new name:");
        setStep("profile_name");
      }

      else if (text === "4") {
        addMessage("ai", "Enter new last name:");
        setStep("profile_last_name");
      }

      else if (text === "5") {
        addMessage("ai", "Enter new email:");
        setStep("profile_email");
      }

      // ⭐ NEW → preview before saving
      else if (text === "0") {

        const preview = `
Here is your updated profile:

Username: ${profileDraft.username}
Name: ${profileDraft.name}
Last Name: ${profileDraft.last_name}
Email: ${profileDraft.email}
Password: ${profileDraft.password ? "****** (changed)" : "Not changed"}

Are you sure you want to save?
Type YES or NO
`;

        addMessage("ai", preview);

        setStep("profile_confirm_save");
      }

      break;


    // =====================
    // CONFIRM SAVE
    // =====================
    case "profile_confirm_save":

      if (text.toLowerCase() === "yes") {
        await submitProfileUpdate();
      }

      else if (text.toLowerCase() === "no") {

        addMessage(
          "ai",
          `Okay 👍

Choose next field:

1 Username
2 Password
3 Name
4 Last Name
5 Email
0 Save
9 Discard`
        );

        setStep("profile_field_choice");
      }

      break;


    // =====================
    // FIELD INPUTS
    // =====================
    case "profile_username":

      setProfileDraft(p => ({ ...p, username: text }));

      addMessage(
        "ai",
        `Saved ✔

Choose next field:

1 Username
2 Password
3 Name
4 Last Name
5 Email
0 Save
9 Discard`
      );

      setStep("profile_field_choice");
      break;


    case "profile_password":

      setProfileDraft(p => ({ ...p, password: text }));

      addMessage(
        "ai",
        `Saved ✔

Choose next field:

1 Username
2 Password
3 Name
4 Last Name
5 Email
0 Save
9 Discard`
      );

      setStep("profile_field_choice");
      break;


    case "profile_name":

      setProfileDraft(p => ({ ...p, name: text }));

      addMessage(
        "ai",
        `Saved ✔

Choose next field:

1 Username
2 Password
3 Name
4 Last Name
5 Email
0 Save
9 Discard`
      );

      setStep("profile_field_choice");
      break;


    case "profile_last_name":

      setProfileDraft(p => ({ ...p, last_name: text }));

      addMessage(
        "ai",
        `Saved ✔

Choose next field:

1 Username
2 Password
3 Name
4 Last Name
5 Email
0 Save
9 Discard`
      );

      setStep("profile_field_choice");
      break;


    case "profile_email":

      setProfileDraft(p => ({ ...p, email: text }));

      addMessage(
        "ai",
        `Saved ✔

Choose next field:

1 Username
2 Password
3 Name
4 Last Name
5 Email
0 Save
9 Discard`
      );

      setStep("profile_field_choice");
      break;


    default:
      setStep(null);
  }
};



  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-200 text-white text-2xl shadow-lg"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[50vh] bg-white rounded-xl shadow-xl flex flex-col">

          <div className="bg-black text-white px-4 py-2 rounded-t-xl">
            AI Assistant
          </div>

          <div className="flex-1 p-3 overflow-y-auto text-sm">

            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  m.from === "user"
                    ? "bg-gray-200 text-right"
                    : "bg-blue-100 text-left"
                }`}
              >
                {m.text}
              </div>
            ))}

            <div ref={messagesEndRef} />

          </div>

          <div className="flex border-t">

            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1 px-3 py-2 text-sm"
            />

            <button
              onClick={handleSend}
              className="px-4 bg-black text-white"
            >
              Send
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export default FloatingAIAssistant;
