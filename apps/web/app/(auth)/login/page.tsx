"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
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
      router.push("/");
    } catch (error) {
      console.log(error);
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
        <Button onClick={handleSubmit} className=" md:w-72 my-2 py-4">
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
