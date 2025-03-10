import Sidebar from "../../components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" flex flex-col lg:flex-row">
      <Sidebar />
      <div className="lg:w-8/9 lg:h-screen">{children}</div>
    </div>
  );
}
