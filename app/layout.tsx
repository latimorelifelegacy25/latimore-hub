import "./globals.css";

export const metadata = {
  title: "Latimore Life & Legacy",
  description: "Education-first insurance protection and legacy planning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
