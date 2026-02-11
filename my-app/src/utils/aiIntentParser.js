export function parseIntent(text) {
  const t = text.toLowerCase();

  if (
    t.includes("new meeting") ||
    t.includes("add meeting") ||
    t.includes("create meeting")
  ) {
    return {
      action: "meetingChoice",
      reply:
        "Do you want:\n1️⃣ Go to New Meeting page\n2️⃣ Create meeting together with AI",
    };
  }

  if (t.includes("calendar")) {
    return { action: "calendar", reply: "Opening your calendar 📆" };
  }

  if (t.includes("history")) {
    return { action: "history", reply: "Here’s your meeting history 📜" };
  }

  if (
    t.includes("edit profile") ||
    t.includes("change my") ||
    t.includes("update my")
  ) {
    return {
      action: "editProfile",
      reply: "Let’s update your profile ⚙️",
    };
  }

  return {
    action: null,
    reply: "I didn’t understand. Try 'create meeting'.",
  };
}
