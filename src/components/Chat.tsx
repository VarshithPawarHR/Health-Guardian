import { useEffect, useState, type FormEvent } from "react";
import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai";

function Chat() {
  const [chat, setChat] = useState<ChatSession>();
  console.log(import.meta.env.PUBLIC_GEMINI_API_KEY);
  // useEffect(() => {
  //   const genAI = new GoogleGenerativeAI("AIzaSyB4iC4jnVC-P_VG7C_yO1F5ffsNO79tJ1E");
  //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  //   const chat = model.startChat({
  //     history: [
  //       {
  //         role: "user",
  //         parts: [{ text: "Hello" }],
  //       },
  //       {
  //         role: "model",
  //         parts: [{ text: "Great to meet you. What would you like to know?" }],
  //       },
  //     ],
  //   });
  //   setChat(chat);
  // }, []);

  const [messages, setMessages] = useState<
    {
      content: string;
      user: boolean;
    }[]
  >([]);

  const [query, setQuery] = useState<string>("");

  const [isBusy, setIsBusy] = useState(false);

  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (query) {
      setIsBusy(true);
      setMessages((messages) => [...messages, { content: query, user: true }]);
      setQuery("");

      // try {
      //   const response = await fetch("/api/chat", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       query,
      //     }),
      //   });

      //   if (!response.ok) {
      //     throw new Error("Network response was not ok");
      //   }

      //   const data: { message: string } = await response.json();
      //   setMessages((messages) => [
      //     ...messages,
      //     { content: data.message, user: false },
      //   ]);
      // } catch (error: any) {
      //   setResponseMessage(`Error submitting form`);
      // }

      // let result = await chat.sendMessage(query);

      // setMessages((messages) => [
      //   ...messages,
      //   { content: result.response.text(), user: false },
      // ]);
      console.log("here")

      try {
        const response = await fetch("/api/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            gender: "f",
            history: messages,
          }),
        });

        

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // const data: { message: string } = await response.json();
        // setMessages((messages) => [
        //   ...messages,
        //   { content: data.message, user: false },
        // ]);

        console.log(await response.json())
      } catch (error: any) {
        setResponseMessage(`Error submitting form`);
      }

      setIsBusy(false);
    }
  };

  return (
    <div className="w-80 h-screen fixed top-0 right-0 z-10 bg-white/70 text-black flex flex-col gap-4 p-4">
      <div className="w-full flex-grow">
        {messages.map((message) => (
          <div>
            <div>{message.user ? "" : ""}</div>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <form className="flex flex-row " onSubmit={handleSubmit}>
        <textarea
          name="query"
          className="flex-grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        ></textarea>
        <div className="flex flex-col gap-1 w-16">
          <img src="" alt="mic" />
          <button
            disabled={isBusy}
            className={`${isBusy}?"bg-green-500":"bg-green-100"`}
          >
            ask
          </button>
        </div>
        <p className="bg-yellow-600">{responseMessage}</p>
      </form>
    </div>
  );
}

export default Chat;
