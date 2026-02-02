import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  getUsersNotInMeeting,
  addParticipant,
  addMeeting,
  getUserById,
  getAllUsers
} from "../../Services/Api";

export default function NewMeetingPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [time, setTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [place, setPlace] = useState("");
  const [notes, setNotes] = useState("");

  const [availableUsers, setAvailableUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  // Load all users (except current) for adding as participants
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        // Here we assume getUsersNotInMeeting can take meetingId=null to fetch all users
        const data = await getAllUsers(token);
        const filteredData = data.filter(u => u.user_id.toString() !== currentUserId);
        setAvailableUsers(filteredData);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleAddParticipant = (e) => {
    const userId = e.target.value;
    if (!userId) return;
    const user = availableUsers.find(u => u.user_id.toString() === userId);
    if (user) {
      setParticipants(prev => [...prev, { ...user, status: "pending" }]);
      setAvailableUsers(prev => prev.filter(u => u.user_id.toString() !== userId));
      e.target.value = "";
    }
  };

  const handleRemoveParticipant = (userId) => {
    const removed = participants.find(p => p.user_id === userId);
    if (removed) {
      setParticipants(prev => prev.filter(p => p.user_id !== userId));
      setAvailableUsers(prev => [...prev, removed]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date || !time || !endTime) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Add meeting
      const meetingData = {
        title,
        date,
        time,
        end_time: endTime,
        owner_user: Number(currentUserId),
        place,
        notes,
        participants: participants.map(p => p.user_id),
      };
      const newMeeting = await addMeeting(meetingData, token);

      // Add participants
      for (let p of participants) {
        await addParticipant(newMeeting.meeting_id, p.user_id, token);
      }

      alert("Meeting added successfully!");
      // Optionally redirect or reset form
      setTitle("");
      setDate(dayjs().format("YYYY-MM-DD"));
      setTime("09:00");
      setEndTime("10:00");
      setPlace("");
      setNotes("");
      setParticipants([]);
    } catch (err) {
      console.error(err);
      alert("Failed to add meeting: " + err.message);
    }
  };

  return (
    <div className="flex justify-center pt-8 pb-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Add New Meeting</h2>

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 rounded"
          required
        />

        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border p-2 rounded flex-1"
            required
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="border p-2 rounded flex-1"
            required
          />
          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="border p-2 rounded flex-1"
            required
          />
        </div>

        <input
          type="text"
          value={place}
          onChange={e => setPlace(e.target.value)}
          placeholder="Location"
          className="border p-2 rounded"
        />

        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes"
          className="border p-2 rounded"
        />

        {/* Participants */}
        <div className="mt-2">
          <label className="font-semibold">Add Participants:</label>
          {loadingUsers ? (
            <p className="text-gray-500 mt-1">Loading users...</p>
          ) : (
            <select
              onChange={handleAddParticipant}
              defaultValue=""
              className="block w-full mt-1 border rounded px-2 py-1"
            >
              <option value="" disabled>Select user</option>
              {availableUsers.map(u => (
                <option key={u.user_id} value={u.user_id}>
                  {u.name} {u.last_name}
                </option>
              ))}
            </select>
          )}

          {participants.length > 0 && (
            <ul className="mt-2 space-y-1">
              {participants.map(p => (
                <li
                  key={p.user_id}
                  className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded"
                >
                  <span>{p.name} {p.last_name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(p.user_id)}
                    className="text-red-600 font-bold"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Add Meeting
        </button>
      </form>
    </div>
  );
}
