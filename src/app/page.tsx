"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function Home() {
  const [email, setEmail] = useState("");
  // Default to +91
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
    // 1. Strip everything except digits
    const digits = value.replace(/\D/g, "");

    // 2. For India (+91), the digits should be 12 (91 + 10 digits)
    // 3. The 3rd digit (first digit of the actual number) must be 6-9
    // Note: We also allow '1' if you want to support the new 1600 business series
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

    // If user clears the input, let it be empty so placeholder shows
    if (input.length === 0) {
      setPhone("");
      setPhoneVerified(false);
      return;
    }

    // Clean the input (remove existing +91 and non-digits)
    let numbersOnly = input.replace(/^\+91/, "").replace(/\D/g, "");

    // Strip leading zero if they try to type 098...
    if (numbersOnly.startsWith("0")) {
      numbersOnly = numbersOnly.substring(1);
    }

    // Limit to 10 digits
    const truncated = numbersOnly.slice(0, 10);

    // Always prepend +91 for the actual state
    const finalValue = "+91 " + truncated;

    setPhone(finalValue);
    validatePhone(finalValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerified || !phoneVerified) return;

    setMessage("");
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("waitlist")
        .insert([
          {
            email,
            phone,
            email_verified: emailVerified,
            phone_verified: phoneVerified,
          },
        ])
        .select()
        .maybeSingle();

      if (error) {
        if (error.code === "23505") {
          setMessage("This email is already on the waitlist!");
        } else {
          setMessage("Something went wrong. Please try again.");
        }
      } else {
        setMessage("Successfully joined the waitlist!");
        setEmail("");
        setPhone("+91");
        setEmailVerified(false);
        setPhoneVerified(false);
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3f0] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            ICEpots<span className="text-xl">®</span>
          </h1>
          <p className="text-sm md:text-base tracking-wider">
            NOT FOR EVERYONE
          </p>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8 md:mb-12">
          COMING SOON
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="w-full h-12 md:h-14 bg-[#e5e3df] border-0 rounded-lg px-4 text-base placeholder:text-gray-600 pr-32"
              required
            />
            {emailVerified && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Email Verified</span>
              </div>
            )}
          </div>

          <div className="relative">
            <Input
              type="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full h-12 md:h-14 bg-[#e5e3df] border-0 rounded-lg px-4 text-base placeholder:text-gray-600 pr-32"
            />
            {phoneVerified && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Phone Verified</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            // Button disabled until both are verified
            disabled={isSubmitting || !emailVerified || !phoneVerified}
            className="w-full h-12 md:h-14 bg-[#d94444] hover:bg-[#c23838] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium text-base rounded-lg transition-colors"
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

        <p className="text-center text-gray-600 text-sm md:text-base">
          We&apos;ll never share or sell your information.
        </p>
      </div>
    </div>
  );
}
