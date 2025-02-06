import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const App = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setLoading(true);

    try {
      const result = await getResult(userMessage);
      const response = result.data.candidates[0].content.parts[0].text;
      setMessages((prev) => [...prev, { type: "bot", content: response }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { type: "error", content: "An error occurred. Please try again." },
      ]);
    }
    setLoading(false);
  }

  async function getResult(input) {
    try {
      return await axios({
        method: "post",
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent",
        params: { key: API_KEY },
        headers: { "Content-Type": "application/json" },
        data: {
          contents: [{ parts: [{ text: input }] }],
        },
      });
    } catch (error) {
      return error;
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">
                {message.content}
              </pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="animate-spin h-5 w-5" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 resize-none rounded-lg border p-3 min-h-[50px] max-h-32"
          rows={1}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default App;
