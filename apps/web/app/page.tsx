import Image from "next/image";
import HomeCard from "../components/HomeCard";
import Sidebar from "../components/Sidebar";

const DashBoard = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar />
      <div className=" flex lg:w-8/9 lg:h-screen flex-col lg:flex-row my-8 lg:my-0">
        <div className="flex lg:w-1/2 justify-center items-center lg:h-screen">
          <Image
            src="/chessboard.png"
            alt="chess"
            className=" lg:w-[500px] w-fit"
            width={500}
            height={500}
          />
        </div>
        <div className="lg:w-1/2">
          <HomeCard />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
