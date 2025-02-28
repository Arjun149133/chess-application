import Link from "next/link";
import Button from "./Button";

const Sidebar = () => {
  return (
    <div className="w-1/9 h-screen bg-secondary">
      <div className=" flex justify-center h-1/2 pt-7">
        <h1 className=" font-bold text-xl">Play Chess</h1>
      </div>
      <div className=" flex flex-col items-center justify-end h-1/2 p-3 pb-7 space-y-4">
        <Link className=" w-full" href={"/login"}>
          <Button className=" h-12 w-full">Login</Button>
        </Link>
        <Link className=" w-full" href={"/register"}>
          <Button variant="secondary" className=" h-12 w-full">
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
