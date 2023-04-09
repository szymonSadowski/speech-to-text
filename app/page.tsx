"use client";

import { type NextPage } from "next";
import { useState } from "react";

type DataResponse = {
  data: {
    text: string;
  };
};
const Home: NextPage = () => {
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const fileSizeInBytes = selectedFile.size;
      const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

      if (fileSizeInMegabytes > 25) {
        setError("File size cannot exceed 25 MB");
        setMp3File(null);
      } else {
        setError(null);
        setMp3File(selectedFile);
      }
    } else {
      setError(null);
      setMp3File(null);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!mp3File) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", mp3File);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as DataResponse;
      setTranscribedText(data.data.text);
    } catch (error) {
      console.error(error);
      setError("Sorry, something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <form onSubmit={handleSubmit}>
            <input type="file" accept="audio/mp3" onChange={handleFileChange} />
            <button type="submit">Transcribe</button>
            {loading ? (
              <div>Loading ...</div>
            ) : (
              <>
                {transcribedText.length > 5 && (
                  <div className="w-full text-white">{transcribedText}</div>
                )}
              </>
            )}
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
