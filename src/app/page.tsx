"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
// 1. Import the Prisma v7 Server Action
import { Poppins } from "next/font/google";
import { joinWaitlist } from "./actions";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"], // Add the weights you need here
});

export default function Home() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    setEmailVerified(isValid && value.length > 0);
    return isValid;
  };

  const validatePhone = (value: string) => {
    // 2026 Standard: India (+91) validation
    const digits = value.replace(/\D/g, "");
    const phoneRegex = /^91[6-9]\d{9}$/;
    const isValid = phoneRegex.test(digits);
    setPhoneVerified(isValid);
    return isValid;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length === 0) {
      setPhone("");
      setPhoneVerified(false);
      return;
    }

    let numbersOnly = input.replace(/^\+91/, "").replace(/\D/g, "");
    if (numbersOnly.startsWith("0")) numbersOnly = numbersOnly.substring(1);
    const truncated = numbersOnly.slice(0, 10);
    const finalValue = "+91 " + truncated;

    setPhone(finalValue);
    validatePhone(finalValue);
  };

  // 2. Updated handleSubmit to use the Server Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerified || !phoneVerified) return;

    setMessage("");
    setIsSubmitting(true);

    try {
      // Direct call to Prisma backend logic via Server Action
      const result = await joinWaitlist({
        email,
        phone,
      });

      if (result.success) {
        setMessage("Successfully joined the waitlist!");
        setEmail("");
        setPhone("");
        setEmailVerified(false);
        setPhoneVerified(false);
      } else {
        // Prisma v7 error messages from actions.ts
        setMessage(result.message || "Something went wrong.");
      }
    } catch (err) {
      setMessage("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8 md:mb-12 flex flex-col items-center">
          {/* 1. Added a relative container with a set height/width */}

          <div className="flex justify-center mb-2 w-full">
            <div className="w-3/4 md:w-4/5 lg:w-full">
              <img
                src="/logo.png"
                alt="ICEPots Logo"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* 2. Slogan stays below the logo container */}
          <p className="text-sm font-semibold md:text-4xl tracking-wider">
            NOT FOR EVERYONE
          </p>
        </div>

        <h2 className="text-4xl md:text-7xl font-extrabold text-center mb-8 md:my-28">
          COMING SOON
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="w-full h-12 md:h-17 bg-[#e8e8e8] border-0 rounded-lg px-9 md:text-lg placeholder:text-gray-600 placeholder:text-lg  pr-32"
              required
            />
            {emailVerified && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#00A63E] px-5">
                <HugeiconsIcon
                  height={32}
                  width={32}
                  icon={CheckmarkCircle02Icon}
                />
                <span className="text-sm md:text-xl font-medium">
                  Email Verified
                </span>
              </div>
            )}
          </div>

          <div className="relative mb-14">
            <Input
              type="tel"
              inputMode="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full h-12 md:h-17 bg-[#e8e8e8] border-0 rounded-lg px-9 md:text-lg placeholder:text-gray-600 placeholder:text-lg  pr-32"
            />
            {phoneVerified && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#00A63E] px-5">
                <HugeiconsIcon
                  height={32}
                  width={32}
                  icon={CheckmarkCircle02Icon}
                />
                <span className="text-sm md:text-xl font-medium">
                  Phone Verified
                </span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !emailVerified || !phoneVerified}
            className={` ${poppins.className} w-full h-12 md:h-14 bg-[#D7373C] hover:bg-[#c23838] disabled:opacity-70 disabled:cursor-not-allowed text-white font-normal text-base  rounded-lg transition-colors`}
          >
            {isSubmitting ? "Joining..." : "Join The Wait List"}
          </Button>
        </form>

        {message && (
          <div
            className={`text-center text-sm mb-4 ${
              message.includes("Successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <p className="text-center text-[#666668] text-sm md:text-2xl font-medium">
          We&apos;ll never share or sell your information.
        </p>
      </div>
    </div>
  );
}
