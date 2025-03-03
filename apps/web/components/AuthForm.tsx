"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@lib/config";

const AuthForm = ({ buttonText }: { buttonText?: string }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let response;
      if (buttonText === "Register") {
        response = await axios.post(
          `${BACKEND_URL}/api/auth/register`,
          formData
        );
      } else {
        response = await axios.post(`${BACKEND_URL}/api/auth/login`, formData);
      }

      if (!response.data.error) {
        localStorage.setItem("chessToken", response.data.token);
        router.push("/play/online");
        setError("");
      }
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      } else {
        setError("An error occurred. Please try again.");
        console.error(error);
      }
      setLoading(false);
    }
  };

  return (
    <div className=" flex flex-col items-center h-screen pt-7 ">
      <div className=" grid grid-cols-12 w-full my-4">
        <div className="col-span-3"></div>
        <div className=" flex items-center col-span-2 hover:cursor-pointer">
          <Link href={"/"}>
            <Image
              src={"/arrow-left.svg"}
              alt="arrow-left"
              width={24}
              height={24}
            />
          </Link>
        </div>
        <span className=" col-span-7 text-4xl pl-20">chess</span>
      </div>
      <div className=" flex flex-col justify-center items-center">
        <h1 className=" text-2xl my-2">Enter your credentials.</h1>
        <Input
          type="username"
          placeholder="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <Input
          type="password"
          placeholder="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />

        {error && <div className=" text-red-500 text-sm my-2">{error}</div>}

        <Button onClick={handleSubmit} className=" md:w-72 my-2 py-4">
          {loading ? <LoadingSpinner /> : buttonText}
        </Button>
        <div className=" space-x-2">
          <span>
            {buttonText === "Register"
              ? "Already have an account?"
              : "Dont have an account?"}
          </span>
          <Link href={buttonText === "Register" ? "/login" : "/register"}>
            <span className=" text-blue-500 hover:underline hover:cursor-pointer">
              {buttonText === "Register" ? "Login" : "Register"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
