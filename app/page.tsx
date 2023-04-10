"use client";

import { Loading } from "components/Loading";
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
      <main className="flex min-h-screen justify-center px-16 py-16 text-slate-200">
        <div className="container flex max-w-4xl flex-col gap-12">
          <h1 className=" bg-gradient-to-l from-yellow-400 to-yellow-600 bg-clip-text text-center text-5xl font-extrabold tracking-tight text-transparent sm:text-[5rem]">
            Speech to Text
          </h1>
          <h2 className="text-center text-2xl font-bold">
            Upload <span className="text-yellow-400"> MP3</span> and get it in
            text format with <span className="text-yellow-400"> GPT</span>
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center gap-12"
          >
            <div className="w-full">
              <label
                className="text-m block py-2 font-medium text-slate-200"
                htmlFor="file_input"
              >
                Upload file
              </label>
              <input
                className="w-full cursor-pointer border-2 border-slate-300 bg-slate-700 text-sm focus:outline-none"
                id="file_input"
                type="file"
                accept="audio/mp3"
                onChange={handleFileChange}
              />
              <p className="py-2 text-sm text-slate-500" id="file_input_help">
                MP3 (MAX.)
              </p>
            </div>
            <button
              className="text-l inline-flex items-center justify-center border-2 border-yellow-400 px-8 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800"
              type="submit"
            >
              Transcribe
            </button>
            {loading ? (
              <Loading />
            ) : (
              <>
                {transcribedText.length > 5 && (
                  <div className="animate-fade-in w-full text-slate-300">
                    {transcribedText}
                  </div>
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
