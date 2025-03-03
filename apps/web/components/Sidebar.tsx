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
    <div className="w-1/9 h-screen bg-secondary">
      <div className=" flex justify-center h-1/2 pt-7">
        <h1 className=" font-bold text-xl">Play Chess</h1>
      </div>
      <div className=" flex flex-col items-center justify-end h-1/2 p-3 pb-7 space-y-4">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {token ? (
              <div className=" space-y-2">
                <div className=" text-lg flex capitalize justify-center">
                  {username}
                </div>
                <Button
                  onClick={() => {
                    localStorage.removeItem("chessToken");
                    setToken(null);
                  }}
                  className=" h-12 w-full"
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className=" flex flex-col space-y-2 p-2">
                <Link className=" w-full " href={"/login"}>
                  <Button className=" h-12 w-full">Login</Button>
                </Link>
                <Link className=" w-full" href={"/register"}>
                  <Button variant="secondary" className=" h-12 w-full">
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
