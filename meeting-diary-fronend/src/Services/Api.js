const API_URL = "http://localhost:3000"; // change if backend runs on another port

export async function signup(data) {
  const res = await fetch(`${API_URL}/users/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: data }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Signup failed");
  }

  return result;
}

export async function login(data) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
}

export async function getMeetingsByDate(userId, date, token) {
  const res = await fetch(`${API_URL}/meetings/user/${userId}?date=${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch meetings");
  }
  return await res.json();
}

export async function getUserById(userId, token) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const res = await fetch(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user details");
  }
  return await res.json();
}

export async function getParticipantsByMeeting(meetingId, token) {
  const res = await fetch(`${API_URL}/participants/meeting/${meetingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch participants");
  return await res.json();
}

export async function updateParticipantStatus(meetingId, userId, status, token) {
  const res = await fetch(`${API_URL}/participants/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ meetingId, userId, status }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update participant status");
  }

  return await res.json();
}

export async function deleteParticipant(meetingId, userId, token) {
  const res = await fetch(`${API_URL}/participants`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ meetingId, userId }),
  });

  if (!res.ok) {
    const errorText = await res.text(); // read text for debugging
    throw new Error(errorText || "Failed to delete participant");
  }

  return await res.json();
}

// Get users NOT in the meeting (owner only)
export async function getUsersNotInMeeting(meetingId, token) {
  const res = await fetch(
    `${API_URL}/participants/not-in-meeting/${meetingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch users not in meeting");
  }

  return await res.json();
}

// Add participant to meeting (owner only)
export async function addParticipant(meetingId, userId, token) {
  const res = await fetch(`${API_URL}/participants/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ meetingId, userId }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add participant");
  }

  return await res.json();
}

export async function deleteMeeting(meetingId, token) {
  const res = await fetch(`${API_URL}/meetings/${meetingId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete meeting");
  }

  return await res.json();
}

export async function updateMeeting(meetingId, data, token) {
  const res = await fetch(`${API_URL}/meetings/${meetingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update meeting");
  }

  return await res.json();
}

// Fetch all meetings where the user is a participant
export async function getMeetingsByUser(userId, token) {
  const res = await fetch(`${API_URL}/meetings/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to load meetings history");
  }

  return res.json();
}

export async function addMeeting(meetingData, token) {
  const res = await fetch(`${API_URL}/meetings/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(meetingData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add meeting");
  }

  return await res.json();
}

export async function getAllUsers(token) {
  const res = await fetch(
    `${API_URL}/allusers`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch users not in meeting");
  }

  return await res.json();
}

export async function updateUser(userData, token) {
  console.log("API - updateUser called with:", userData);
  const res = await fetch(`${API_URL}/users/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user: userData,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update profile");
  }

  return await res.json();
}
