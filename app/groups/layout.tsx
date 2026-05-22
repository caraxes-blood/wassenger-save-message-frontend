import { JetBrains_Mono, Syne } from "next/font/google";

const messagesDisplay = Syne({
  subsets: ["latin"],
  variable: "--font-messages-display",
});

const messagesMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-messages-mono",
});

export default function GroupsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`messages-desk flex flex-1 min-h-0 flex-col bg-background ${messagesDisplay.variable} ${messagesMono.variable}`}
    >
      {children}
    </div>
  );
}
