"use client";
import Link from "next/link";
import Button from "./Button";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import LoadingSpinner from "./LoadingSpinner";

const Sidebar = () => {
  const [token, setToken] = useState<string | null>("");
  const [username, setUsername] = useState<string | null>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setToken(localStorage.getItem("chessToken"));
  }, []);

  useEffect(() => {
    setLoading(true);
    if (token) {
      const decodedToken = jwt.decode(token) as {
        username: string;
        userId: string;
      };
      setUsername(decodedToken?.username ? decodedToken.username : null);
    }
    setLoading(false);
  }, [token]);

  return (
    <div className="flex lg:flex-col lg:w-1/9 lg:h-screen bg-secondary justify-between px-2 lg:mr-4">
      <div className=" flex justify-center items-center lg:pt-7">
        <h1 className=" font-bold xl:text-xl sm:text-sm md:text-md">
          Play Chess
        </h1>
      </div>
      <div className=" flex lg:flex-col items-center justify-end h-1/2 p-3 lg:pb-7 space-y-4">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {token ? (
              <div className=" flex lg:flex-col justify-center items-center space-x-2 lg:space-y-2">
                <div className=" xl:text-xl sm:text-sm md:text-md flex capitalize ">
                  {username}
                </div>
                <div>
                  <Button
                    onClick={() => {
                      localStorage.removeItem("chessToken");
                      setToken(null);
                    }}
                    className=" xl:h-12 lg:h-10 w-full"
                  >
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <div className=" flex lg:flex-col lg:space-y-2 lg:p-2 space-x-2">
                <Link className=" w-full " href={"/login"}>
                  <Button className="  xl:h-12 lg:h-8 w-full">Login</Button>
                </Link>
                <Link className=" w-full" href={"/register"}>
                  <Button
                    variant="secondary"
                    className=" xl:h-12 lg:h-8 w-full"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
