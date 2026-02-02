import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  getUserById,
  getParticipantsByMeeting,
  updateParticipantStatus,
  deleteParticipant,
  getUsersNotInMeeting,
  addParticipant,
  updateMeeting,
} from "../../Services/Api";

export default function EditMeetingModal({ meeting, onClose, onUpdated }) {
  const [title, setTitle] = useState(meeting.title);
  const [date, setDate] = useState(meeting.date);
  const [time, setTime] = useState(meeting.time);
  const [endTime, setEndTime] = useState(meeting.end_time);
  const [place, setPlace] = useState(meeting.place || "");
  const [notes, setNotes] = useState(meeting.notes || "");

  const [owner, setOwner] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true); // ✅ ADDED

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  /* ================= OWNER ================= */
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const data = await getUserById(meeting.owner_user, token);
        setOwner(data);
      } catch (err) {
        console.error("Failed to load owner", err);
      }
    };
    fetchOwner();
  }, [meeting, token]);

  /* ================= PARTICIPANTS ================= */
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoadingParticipants(true); // ✅ ADDED
        const data = await getParticipantsByMeeting(meeting.meeting_id, token);
        data.sort((a, b) => {
          const first = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
          if (first !== 0) return first;
          return a.last_name.localeCompare(b.last_name, undefined, { sensitivity: "base" });
        });
        setParticipants(data);
      } catch (err) {
        console.error("Failed to load participants", err);
      } finally {
        setLoadingParticipants(false); // ✅ ADDED
      }
    };
    fetchParticipants();
  }, [meeting, token]);

  /* ================= USERS NOT IN MEETING (OWNER ONLY) ================= */
  useEffect(() => {
    if (currentUserId?.toString() !== meeting.owner_user.toString()) return;

    const fetchAvailableUsers = async () => {
      try {
        const data = await getUsersNotInMeeting(meeting.meeting_id, token);
        setAvailableUsers(data);
      } catch (err) {
        console.error("Failed to load available users", err);
      }
    };
    fetchAvailableUsers();
  }, [meeting, token, currentUserId]);

  /* ================= STATUS CHANGE ================= */
  const handleStatusChange = async (userId, newStatus) => {
    const prevStatus = participants.find(p => p.user_id === userId)?.status;

    setParticipants(prev =>
      prev.map(p => (p.user_id === userId ? { ...p, status: newStatus } : p))
    );

    try {
      await updateParticipantStatus(meeting.meeting_id, userId, newStatus, token);
    } catch (err) {
      console.error("Failed to update status", err);
      setParticipants(prev =>
        prev.map(p => (p.user_id === userId ? { ...p, status: prevStatus } : p))
      );
    }
  };

  /* ================= DELETE PARTICIPANT ================= */
  const handleDeleteParticipant = async (userId) => {
    try {
      await deleteParticipant(meeting.meeting_id, userId, token);
      setParticipants(prev => prev.filter(p => p.user_id !== userId));

      const removedUser = participants.find(p => p.user_id === userId);
      if (removedUser) setAvailableUsers(prev => [...prev, removedUser]);
    } catch (err) {
      console.error("Failed to delete participant", err);
    }
  };

  /* ================= ADD PARTICIPANT ================= */
  const handleAddParticipant = async (e) => {
    const userId = e.target.value;
    if (!userId) return;

    try {
      const res = await addParticipant(meeting.meeting_id, userId, token);
      if (res) {
        const user = availableUsers.find(u => u.user_id.toString() === userId);
        setParticipants(prev => [...prev, { ...user, status: "pending" }]);
        setAvailableUsers(prev => prev.filter(u => u.user_id.toString() !== userId));
        e.target.value = "";
      }
    } catch (err) {
      console.error("Failed to add participant", err);
    }
  };

  /* ================= SAVE MEETING ================= */
  const handleSaveMeeting = async () => {
    try {
      await updateMeeting(
        meeting.meeting_id,
        { title, date, time, end_time: endTime, place, notes },
        token
      );
      onUpdated?.();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!meeting) return null;

  const statusColor = (status) =>
    status === "arrived"
      ? "text-green-600"
      : status === "absent"
      ? "text-red-600"
      : "text-yellow-600";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Meeting</h2>
          <button onClick={onClose} className="font-bold text-gray-600">X</button>
        </div>

        {/* MEETING FIELDS */}
        <div className="flex flex-col gap-3 mb-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={dayjs(date).format("YYYY-MM-DD")} onChange={(e) => setDate(e.target.value)} className="border p-2 rounded" />
          <div className="flex gap-2">
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="border p-2 rounded flex-1" />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded flex-1" />
          </div>
          <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Location" className="border p-2 rounded" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className="border p-2 rounded" />
        </div>

        {/* PARTICIPANTS */}
        <div className="mb-4">
          <span className="font-semibold">Participants:</span>

          {loadingParticipants && (
            <p className="text-gray-500 mt-2">Loading participants...</p>
          )}

          {!loadingParticipants && (
            <ul className="mt-2 space-y-1">
              {participants.map((p) => (
                <li key={p.user_id} className="flex justify-between bg-gray-100 px-3 py-1 rounded items-center">
                  <span>{p.name} {p.last_name}</span>
                  <div className="flex items-center gap-2">
                    {p.user_id.toString() === currentUserId ? (
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.user_id, e.target.value)}
                        className={`font-semibold ${statusColor(p.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="arrived">Arrived</option>
                        <option value="absent">Absent</option>
                      </select>
                    ) : (
                      <span className={`font-semibold ${statusColor(p.status)}`}>{p.status}</span>
                    )}

                    {currentUserId?.toString() === meeting.owner_user.toString() &&
                      p.user_id.toString() !== meeting.owner_user.toString() && (
                        <button onClick={() => handleDeleteParticipant(p.user_id)} className="text-red-600 font-bold">
                          X
                        </button>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* ADD PARTICIPANT */}
          {currentUserId?.toString() === meeting.owner_user.toString() && availableUsers.length > 0 && (
            <div className="mt-2">
              <label className="font-semibold">Add participant:</label>
              <select onChange={handleAddParticipant} defaultValue="" className="block w-full mt-1 border rounded px-2 py-1">
                <option value="" disabled>Select user</option>
                {availableUsers.map(u => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.name} {u.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button onClick={handleSaveMeeting} className="bg-green-600 text-white p-2 rounded hover:bg-green-700 w-full">
          Save Meeting
        </button>
      </div>
    </div>
  );
}
