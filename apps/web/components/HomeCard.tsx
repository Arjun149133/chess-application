import Link from "next/link";
import Button from "./Button";

const HomeCard = () => {
  return (
    <div className=" flex flex-col justify-center items-center lg:h-screen my-4 lg:my-0">
      <h1 className=" text-4xl/relaxed font-bold tracking-wide">
        Play Chess Online
        {/* <br /> or With Bot */}
      </h1>
      <div className=" flex flex-col w-72 space-y-4 lg:mt-8">
        <Link href="/play/online">
          <Button className=" w-full h-12">Play Online</Button>
        </Link>
        {/* <Link href="/play/bot">
          <Button className=" w-full" variant="secondary">
            Play Bot
          </Button>
        </Link> */}
      </div>
    </div>
  );
};

export default HomeCard;
