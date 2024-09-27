import { useEffect, useRef, useState, type FormEvent } from "react";
import { Html } from "@react-three/drei";
import { Avatar2 } from "./Avatar2";
import type { Session } from "@auth/core/types";

function base64ToBlob(base64: string, contentType: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: contentType });
}

function Wrapper({ session }: { session: Session }) {
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

  let messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  };

  useEffect(() => {
    if (currentMessage) {
      currentMessage.audioPlayer.play();
      currentMessage.audioPlayer.onended = () => {
        setCurrentMessage(null);
      };
    }
    scrollToBottom();
  }, [currentMessage]);

  scrollToBottom();

  const recordRef = useRef<HTMLButtonElement>(null);

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })

      // Success callback
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        let chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        recordRef.current?.addEventListener("click", () => {
          mediaRecorder.start();
        });

        mediaRecorder.onstop = (e) => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

          const formData = new FormData();
          formData.append("audio", blob, "recording.ogg");

          // // Send the Blob to the backend
          // fetch("/testaudio", {
          //   method: "POST",
          //   body: formData,
          // })
          //   .then((response) => response.json()) // assuming the backend returns a JSON response
          //   .then((data) => {
          //     console.log("Upload successful:", data);
          //   })
          //   .catch((error) => {
          //     console.error("Error uploading audio:", error);
          //   });
        };
      })
      // Error callback
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }

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
          <div className="w-full flex-grow overflow-y-auto">
            <div className="w-full min-h-full h-fit flex flex-col gap-2 justify-end">
              {messages.map((message) => (
                <div
                  className={`${
                    message.user ? "ml-auto text-right" : "mr-auto"
                  } bg-cyan-400/10 px-2 py-4 rounded`}
                >
                  <h4 className="text-gray-700 text-sm">
                    {message.user ? "user" : "bot"}
                  </h4>
                  <p>{message.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} className="hidden"></div>
            </div>
          </div>
          <form className="flex flex-row gap-2" onSubmit={handleSubmit}>
            <textarea
              name="query"
              className="flex-grow p-2 "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            ></textarea>
            <div className="flex flex-col gap-1 w-16">
              <button ref={recordRef}></button>
              <button
                disabled={isBusy}
                className={`${
                  isBusy ? "bg-muted-600" : "bg-primary-500"
                } text-white rounded p-2`}
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
