import { useEffect, useState } from "react";
import { parseIntent } from "../../utils/aiIntentParser";

function FloatingAIAssistant({ onAction }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("ai_messages");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("ai_messages", JSON.stringify(messages));
    }, [messages]);


  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    const result = parseIntent(input);
    const aiMsg = { from: "ai", text: result.reply };

    setMessages((prev) => [...prev, userMsg, aiMsg]);

    if (result.action) {
      onAction(result.action);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-200 text-white text-2xl shadow-lg hover:scale-105 transition"
      >
        🤖
      </button>

      {/* Chat box */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[50vh] bg-white rounded-xl shadow-xl flex flex-col">
          <div className="bg-black text-white px-4 py-2 rounded-t-xl font-semibold">
            AI Assistant
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
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
          </div>

          <div className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type what you want to do..."
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={handleSend}
              className="px-4 text-sm bg-black text-white"
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
