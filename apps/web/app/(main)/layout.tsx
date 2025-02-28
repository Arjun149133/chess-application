import Sidebar from "../../components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" flex ">
      <Sidebar />
      <div className="w-8/9 h-screen">{children}</div>
    </div>
  );
}
