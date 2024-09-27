import { useEffect, useState, type FormEvent } from "react";
import { Avatar } from "./Avatar";
import { Html } from "@react-three/drei";
import { Avatar2 } from "./Avatar2";

function base64ToBlob(base64: string, contentType: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: contentType });
}

function Wrapper() {
  const [messages, setMessages] = useState<
    {
      content: string;
      user: boolean;
    }[]
  >([]);

  const [currentMessage, setCurrentMessage] = useState<{
    text: string;
    visemes: number[][];
    audioPlayer: HTMLAudioElement;
  } | null>(null);

  const [query, setQuery] = useState<string>("");

  const [isBusy, setIsBusy] = useState(false);

  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (query) {
      setIsBusy(true);
      setMessages((messages) => [...messages, { content: query, user: true }]);
      setQuery("");

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

        const {
          text,
          visemes,
          audio,
        }: { text: string; visemes: number[][]; audio: string } =
          await response.json();
        setMessages((messages) => [
          ...messages,
          { content: text, user: false },
        ]);

        // var snd = new Audio("data:audio/mpeg;base64," + audio);
        const audioBlob = base64ToBlob(audio, "audio/mpeg");
        const audioURL = URL.createObjectURL(audioBlob);
        const snd = new Audio(audioURL);

        setCurrentMessage({
          text,
          visemes,
          audioPlayer: snd,
        });
      } catch (error: any) {
        setResponseMessage(`Error submitting form`);
      }

      setIsBusy(false);
    }
  };

  useEffect(() => {
    if (currentMessage) {
      currentMessage.audioPlayer.play();
      currentMessage.audioPlayer.onended = () => {
        setCurrentMessage(null);
      };
    }
  }, [currentMessage]);

  return (
    <>
      {/* <Avatar position={[0, -3, 5]} scale={2} /> */}
      <Avatar2
        currentMessage={currentMessage}
        loading={isBusy}
        position={[-0.2, -2.5, 5]}
        scale={2}
      />

      <Html position-y={[-1, -1, 0]}>
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
      </Html>
    </>
  );
}

export default Wrapper;
