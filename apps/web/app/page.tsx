import Image from "next/image";
import HomeCard from "../components/HomeCard";
import Sidebar from "../components/Sidebar";

const DashBoard = () => {
  return (
    <div className=" flex">
      <Sidebar />
      <div className=" flex w-8/9 h-screen">
        <div className="w-1/2 flex justify-center items-center h-screen">
          <Image src="/chessboard.png" alt="chess" width={500} height={500} />
        </div>
        <div className="w-1/2">
          <HomeCard />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
