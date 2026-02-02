import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { getMeetingsByDate, deleteMeeting } from "../../Services/Api";
import MeetingDetails from "./MeetingDetails";
import EditMeetingModal from "./EditMeetingModal"; // ✅ import edit modal
import { MdDelete, MdEdit } from "react-icons/md";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [editMeeting, setEditMeeting] = useState(null); // ✅ edit modal state

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) return;
    fetchMeetings();
  }, [selectedDate]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError("");
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      const data = await getMeetingsByDate(userId, formattedDate, token);
      const sortedMeetings = data.sort((a, b) => {
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);
        return timeA[0] - timeB[0] || timeA[1] - timeB[1];
      });
      setMeetings(sortedMeetings);
    } catch (err) {
      setError("Failed to load meetings");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (e, meetingId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await deleteMeeting(meetingId, token);
      setMeetings((prev) => prev.filter((m) => m.meeting_id !== meetingId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center pt-6 min-h-full">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={selectedDate} onChange={(newDate) => setSelectedDate(newDate)} />
        </LocalizationProvider>
      </div>

      <div className="mt-6 w-full max-w-3xl bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
          Meetings for {selectedDate.format("DD.MM.YYYY")}
        </h2>

        {loading && <p className="text-center text-gray-500">Loading meetings...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && meetings.length === 0 && (
          <p className="text-center text-gray-500">No meetings for this day.</p>
        )}

        {!loading && meetings.length > 0 && (
          <ul className="space-y-2">
            {meetings.map((m) => (
              <li
                key={m.meeting_id}
                className="border p-3 rounded-lg shadow-sm flex justify-between items-center cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedMeeting(m)}
              >
                <span className="font-semibold w-1/3">{m.title}</span>
                <span className="text-gray-600 w-1/3">
                  {m.time} - {m.end_time}
                </span>
                <span className="text-gray-600 w-1/3 flex justify-end items-center gap-2">
                  {m.place}

                  {/* Edit button – owner only */}
                  {userId?.toString() === m.owner_user.toString() && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditMeeting(m); }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit meeting"
                    >
                      <MdEdit size={20} />
                    </button>
                  )}

                  {/* Delete button – owner only */}
                  {userId?.toString() === m.owner_user.toString() && (
                    <button
                      onClick={(e) => handleDeleteMeeting(e, m.meeting_id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete meeting"
                    >
                      <MdDelete size={20} />
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modals */}
      {selectedMeeting && (
        <MeetingDetails meeting={selectedMeeting} onClose={() => setSelectedMeeting(null)} />
      )}

      {editMeeting && (
        <EditMeetingModal
          meeting={editMeeting}
          onClose={() => setEditMeeting(null)}
          onUpdated={() => {
            setEditMeeting(null);
            fetchMeetings(); // refresh after editing
          }}
        />
      )}
    </div>
  );
}
