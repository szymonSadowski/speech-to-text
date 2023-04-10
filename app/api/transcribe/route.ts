import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 50 MB in bytes
const key = process.env.OPENAI_API_KEY;

type DataFormat = {
  data: {
    text: string;
  };
};
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }
  if (file.length > MAX_FILE_SIZE) {
    return new Response("File Too big", {
      status: 413,
    });
  }
  if (!key) {
    return new Response("OpenAI API key not found", {
      status: 500,
    });
  }
  const formBody = new FormData();
  formBody.append("file", file, "audio.mp3");
  formBody.append("model", "whisper-1");
  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
      },
      body: formBody,
    }
  );
  const data = (await response.json()) as DataFormat;
  return NextResponse.json({ data });
}
