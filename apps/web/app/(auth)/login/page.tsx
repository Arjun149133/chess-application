"use client";
import AuthForm from "@components/AuthForm";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  return <AuthForm buttonText="Login" />;
};

export default LoginPage;
