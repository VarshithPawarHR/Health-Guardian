import formidable from "formidable";
import { PassThrough } from "stream";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  // Parse the incoming formData using formidable
  const form = formidable({ multiples: false });

  form.parse(request, async (err, fields, files) => {
    if (err) {
      return new Response(null, {
        status: 500,
        statusText: "Error parsing form data",
      });
    }

    const file = files.audio;

    if (!file) {
      return new Response(null, {
        status: 400,
        statusText: "No audio file uploaded.",
      });
    }

    // Create a readable stream from the file
    const bufferStream = new PassThrough();
    bufferStream.end(file._writeStream._buffer);

    // Create the push stream for Microsoft's Speech SDK
    var pushStream = sdk.AudioInputStream.createPushStream();

    // Pipe the buffer stream into the push stream
    bufferStream
      .on("data", (chunk) => {
        pushStream.write(chunk);
      })
      .on("end", () => {
        pushStream.close();
      });

    // Create the audio-config and speech-config
    var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    var speechConfig = sdk.SpeechConfig.fromSubscription(
      import.meta.env.SPEECH_KEY,
      import.meta.env.SPEECH_REGION
    );

    // Set language and recognizer
    speechConfig.speechRecognitionLanguage = "en-US";
    var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // Recognize once
    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();
        console.log(result);
        return new Response(
          JSON.stringify({
            result,
          })
        );
      },
      (err) => {
        recognizer.close();
        return new Response(null, {
          status: 500,
          statusText: "recognisation error",
        });
      }
    );
  });

  return new Response(null, {
    status: 500,
    statusText: "recognisation error",
  });
};
