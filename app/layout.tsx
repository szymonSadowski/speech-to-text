import "./globals.css";

export const metadata = {
  title: "Speech To Text",
  description: "Upload mp3 and get it in text format with GPT",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
