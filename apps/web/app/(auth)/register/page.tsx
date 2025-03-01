"use client";
import AuthForm from "@components/AuthForm";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return <AuthForm buttonText="Register" />;
};

export default RegisterPage;
