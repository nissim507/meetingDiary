import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  getUserById,
  getParticipantsByMeeting,
  updateParticipantStatus,
  deleteParticipant,
  getUsersNotInMeeting,
  addParticipant,
} from "../../Services/Api";

export default function MeetingDetails({ meeting, onClose, readOnly = false }) {
  const [owner, setOwner] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);

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
        setLoadingParticipants(true);
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
        setLoadingParticipants(false);
      }
    };
    fetchParticipants();
  }, [meeting, token]);

  /* ================= USERS NOT IN MEETING ================= */
  useEffect(() => {
    if (readOnly) return;
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
  }, [meeting, token, currentUserId, readOnly]);

  /* ================= STATUS CHANGE ================= */
  const handleStatusChange = async (userId, newStatus) => {
    if (readOnly) return;

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
    if (readOnly) return;

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
    if (readOnly) return;

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

  if (!meeting) return null;

  const statusColor = (status) =>
    status === "arrived"
      ? "text-green-600"
      : status === "absent"
      ? "text-red-600"
      : "text-yellow-600";

  const Row = ({ label, children }) => (
    <div className="flex justify-between mb-2">
      <span className="font-semibold w-32">{label}:</span>
      <span className="flex-1">{children}</span>
    </div>
  );

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
          <h2 className="text-2xl font-bold">{meeting.title}</h2>
          <button onClick={onClose} className="font-bold text-gray-600">X</button>
        </div>

        {/* DETAILS */}
        <Row label="Owner">{owner ? `${owner.name} ${owner.last_name}` : "Loading..."}</Row>
        <Row label="Date">{dayjs(meeting.date).format("DD.MM.YYYY")} : {meeting.time} - {meeting.end_time}</Row>
        <Row label="Location">{meeting.place || "No location"}</Row>
        <Row label="Notes">{meeting.notes || "No notes"}</Row>

        {/* PARTICIPANTS */}
        <div className="mt-4">
          <span className="font-semibold">Participants:</span>

          {loadingParticipants ? (
            <p className="text-gray-500 mt-2">Loading participants...</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {participants.map((p) => (
                <li key={p.user_id} className="flex justify-between bg-gray-100 px-3 py-1 rounded items-center">
                  <span>{p.name} {p.last_name}</span>

                  <div className="flex items-center gap-2">
                    {p.user_id.toString() === currentUserId && !readOnly ? (
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
                      <span className={`font-semibold ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
                    )}

                    {currentUserId?.toString() === meeting.owner_user.toString() &&
                     p.user_id.toString() !== meeting.owner_user.toString() &&
                     !readOnly && (
                      <button
                        onClick={() => handleDeleteParticipant(p.user_id)}
                        className="text-red-600 font-bold"
                      >
                        X
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!readOnly && currentUserId?.toString() === meeting.owner_user.toString() && availableUsers.length > 0 && (
            <div className="mt-4">
              <label className="font-semibold">Add participant:</label>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
