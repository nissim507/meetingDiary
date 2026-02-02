import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { getMeetingsByUser } from "../../Services/Api";
import MeetingDetails from "./MeetingDetails";

export default function HistoryPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [meetingsPerPage, setMeetingsPerPage] = useState(10);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || !token) return;
    fetchMeetings();
  }, [userId, token]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMeetingsByUser(userId, token);

      // Sort by date + time
      const sorted = data.sort((a, b) => {
        const dateA = dayjs(`${a.date} ${a.time}`);
        const dateB = dayjs(`${b.date} ${b.time}`);
        return dateA - dateB;
      });

      setMeetings(sorted);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("Failed to load meetings history");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * meetingsPerPage;
  const indexOfFirst = indexOfLast - meetingsPerPage;
  const currentMeetings = meetings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(meetings.length / meetingsPerPage);

  const handlePrevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleMeetingsPerPageChange = (e) => {
    setMeetingsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const formatDateTime = (dateStr, timeStr) => {
    const date = dayjs(dateStr).format("DD.MM.YYYY");
    const startTime = timeStr.includes("T")
      ? dayjs(timeStr).format("HH:mm")
      : timeStr;
    return `${date} : ${startTime}`;
  };

  const formatEndTime = (timeStr) => {
    return timeStr.includes("T")
      ? dayjs(timeStr).format("HH:mm")
      : timeStr;
  };

  return (
    <div className="flex flex-col items-center pt-6 min-h-full">
      <h2 className="text-2xl font-bold mb-4">My Meeting History</h2>

      {loading && <p className="text-gray-500">Loading meetings...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && meetings.length === 0 && (
        <p className="text-gray-500">No meetings found.</p>
      )}

      {!loading && meetings.length > 0 && (
        <>
          <ul className="w-full max-w-3xl space-y-2">
            {currentMeetings.map((m) => (
              <li
                key={m.meeting_id}
                className="border px-3 py-2 rounded-lg shadow-sm flex justify-between items-center cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedMeeting(m)}
              >
                {/* Title */}
                <span className="font-semibold flex-1">
                  {m.title}
                </span>

                {/* Date + Time */}
                <span className="text-gray-600 flex-1 text-center">
                  {formatDateTime(m.date, m.time)} -{" "}
                  {formatEndTime(m.end_time)}
                </span>

                {/* Location */}
                <span className="text-gray-600 flex-1 text-right">
                  {m.place}
                </span>
              </li>
            ))}
          </ul>
            
          {/* Pagination controls */}
          <div className="flex items-center gap-4 mt-4">
            {/* Meetings per page selector */}
            <select
              value={meetingsPerPage}
              onChange={handleMeetingsPerPageChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Meeting details modal */}
      {selectedMeeting && (
        <MeetingDetails
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          readOnly={true}
        />
      )}
    </div>
  );
}
