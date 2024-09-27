import { GoogleGenerativeAI } from "@google/generative-ai";
import type { APIRoute } from "astro";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";
import ollama from "ollama";

export const POST: APIRoute = async ({ request }) => {
  const {
    query = "hello gemini",
    gender = "f",
    history,
  }: {
    gender: "m" | "f";
    query: string;
    history: { content: string; user: boolean }[];
  } = await request.json();

  console.log({ query, gender, history });

  const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        candidateCount: 1,
        // maxOutputTokens: 40,
        temperature: 0.5,
      },
    systemInstruction:
      "You are HealthGardian, a personal intelligent healthcare advisor. Your primary role is to provide accurate and reliable information in response to personal medical queries. You are knowledgeable about various medical topics and can offer advice based on trusted sources. When responding to queries, make sure to cite reliable sources that users can refer to for verification. dont user any special characters or emoji in the response. For example, if a user asks, 'What are some common symptoms of a cold?' you can respond with: 'Hello! Common symptoms of a cold include a runny or stuffy nose, sneezing, sore throat, and mild body aches. You can verify this information from reputable sources such as the Centers for Disease Control and Prevention (CDC) or the Mayo Clinic.' Feel free to use authoritative medical sources such as medical journals, official health organizations, and well-known medical websites to back up your responses. Remember to prioritize accuracy, empathy, and the well-being of the users seeking medical information.",
  });
  const chat = model.startChat({
    history: history.map((chat) => ({
      role: chat.user ? "user" : "model",
      parts: [{ text: chat.content }],
    })),
  });

  const result = await chat.sendMessage(query);
  const responseText = result.response.text();

  // const response = await ollama.chat({
  //   model: "echelonify/med-qwen2:latest",
  //   messages: [
  //     {
  //       role: "system",
  //       content:
  //         "You are 'manim', a personal intelligent healthcare advisor. Your primary role is to provide accurate and reliable information in response to personal medical queries. You are knowledgeable about various medical topics and can offer advice based on trusted sources. When responding to queries, make sure to cite reliable sources that users can refer to for verification. For example, if a user asks, 'What are some common symptoms of a cold?' you can respond with: 'Hello! Common symptoms of a cold include a runny or stuffy nose, sneezing, sore throat, and mild body aches. You can verify this information from reputable sources such as the Centers for Disease Control and Prevention (CDC) or the Mayo Clinic.' Feel free to use authoritative medical sources such as medical journals, official health organizations, and well-known medical websites to back up your responses. Remember to prioritize accuracy, empathy, and the well-being of the users seeking medical information.",
  //     },
  //     {
  //       role: "user",
  //       content: query,
  //     },
  //   ],
  // });

  // const responseText = response.message.content;

  // console.log("gemini response ", responseText);

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    import.meta.env.SPEECH_KEY,
    import.meta.env.SPEECH_REGION
  );

  const voiceName =
    gender == "f" ? "en-IN-NeerjaNeural" : "en-IN-PrabhatNeural";
  speechConfig.speechSynthesisVoiceName = voiceName;

  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
  const visemes: number[][] = [];
  speechSynthesizer.visemeReceived = function (s, e) {
    visemes.push([e.audioOffset / 10000, e.visemeId]);
  };

  const audioStream = await new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      responseText,
      (result) => {
        const { audioData } = result;

        speechSynthesizer.close();

        // convert arrayBuffer to stream
        const bufferStream = new PassThrough();
        bufferStream.end(Buffer.from(audioData));
        resolve(bufferStream);
      },
      (error) => {
        console.log(error);
        speechSynthesizer.close();
        reject(error);
      }
    );
  });

  //@ts-ignore
  const buffer = await streamToBuffer(audioStream);

  // Convert the buffer to base64
  const audioBase64 = buffer.toString("base64");

  //@ts-ignore
  //   return new Response(audioStream, {
  //     headers: {
  //       "Content-Type": "audio/mpeg",
  //       "Content-Disposition": `inline; filename=tts.mp3`,
  //       Visemes: JSON.stringify(visemes),
  //     },
  //   });

  return new Response(
    JSON.stringify({
      text: responseText,
      visemes: visemes,
      audio: audioBase64,
    })
  );
};

const streamToBuffer = async (stream: PassThrough): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on("error", (err) => {
      reject(err);
    });
  });
};
