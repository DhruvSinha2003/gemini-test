import axios from "axios";
import "dotenv/config";
function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;
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
      <h1 className=" bg-red-500">Hello</h1>
      <form action="submit">
        <input type="text" />
      </form>
    </>
  );
}

export default App;
