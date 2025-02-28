import Button from "./Button";

const HomeCard = () => {
  return (
    <div className=" flex flex-col justify-center items-center h-screen">
      <h1 className=" text-4xl/relaxed font-bold tracking-wide">
        Play Chess Online <br /> or With Bot
      </h1>
      <div className=" flex flex-col w-72 space-y-4 mt-8">
        <Button className="">Play Online</Button>
        <Button variant="secondary">Play Bot</Button>
      </div>
    </div>
  );
};

export default HomeCard;
