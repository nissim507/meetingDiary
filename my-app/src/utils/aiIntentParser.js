export function parseIntent(text) {
  const t = text.toLowerCase();

  if (t.includes("new meeting") || t.includes("add meeting") || t.includes("create meeting")) {
    return { action: "newMeeting", reply: "Sure! Let’s create a new meeting 📅" };
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
    return { action: "editProfile", reply: "No problem, let’s update your profile ⚙️" };
  }

  return {
    action: null,
    reply: "Hmm… I didn’t understand that yet 🤔 Try something like 'add new meeting'.",
  };
}
