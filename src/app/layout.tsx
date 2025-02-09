import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head><title>Jargon Translator</title></head>
      <body className={"bg-white"}>
        {children}
      </body>
    </html>
  );
}
