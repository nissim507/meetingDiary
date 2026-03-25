import { useState } from "react";
import { parseIntent } from "../../utils/aiIntentParser";

function AIAssistantBox({ onAction }) {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const result = parseIntent(input);
    setReply(result.reply);

    if (result.action) {
      onAction(result.action);
    }

    setInput("");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold mb-3">
        🤖 AI Assistant
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try: add a new meeting, edit my profile..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-black text-white px-5 py-2 rounded"
        >
          Ask
        </button>
      </form>

      {reply && (
        <p className="text-sm text-gray-600 mt-3">
          {reply}
        </p>
      )}
    </div>
  );
}

export default AIAssistantBox;
