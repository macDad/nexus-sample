"use client";
import Image from "next/image";
import logo from "@/public/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className=" w-full h-screen flex items-center justify-center bg-primary">
      <div className=" flex flex-col items-center justify-center">
        <Image src={logo} alt="logo" className=" size-20 object-contain" />
        <p className=" uppercase text-background/80 font-bold text-4xl mb-10 font-mono">
          404 not found
        </p>
        <Button
          onClick={() => router.back()}
          variant={"outline"}
          className=" mt-2"
        >
          <ArrowLeft className="size-4 mr-2" />
          Go back
        </Button>
      </div>
    </main>
  );
}
