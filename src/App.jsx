import axios from "axios";
// import "dotenv/config";
import { useState } from "react";

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await getResult(input);
      setResponse(result.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }
  async function getResult(input) {
    try {
      const response = await axios({
        method: "post",
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        params: {
          key: API_KEY,
        },
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          contents: [
            {
              parts: [
                {
                  text: `${input}`,
                },
              ],
            },
          ],
        },
      });

      return response;
    } catch (error) {
      return error;
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded"
          placeholder="Enter your prompt"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      {response && <div className="mt-4 p-4 border rounded">{response}</div>}
    </>
  );
}

export default App;
