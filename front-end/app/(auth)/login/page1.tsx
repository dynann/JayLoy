"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PasswordInput, TextInput } from "@/components/customeInput";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay";
import Image from "next/image";
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // TODO: Replace with your actual login API call
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ username, password }),
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // if (response.ok) {
      //   const data = await response.json();
      //   localStorage.setItem("accessToken", data.accessToken);
      //   localStorage.setItem("refreshToken", data.refreshToken);
      //   localStorage.setItem("tokenTimestamp", Date.now().toString());
      //   router.push("/");
      // } else {
      //   setError("Invalid username or password");
      // }
      
      // For demo purposes
      router.push("/");
      
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <LoadingOverlay isLoading={loading} message="Logging in..." />
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="header">JayLoy</h1>
          <p className="description-medium mt-2">Spend wisely, waste less, save more</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <TextInput 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <PasswordInput 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="text-center">
            <Link href="#" className="hover:underline description-small flex justify-end">Forget password</Link>
          </div>

          <Button 
            type="submit" 
            className="green-button !text-white"
            disabled={loading}
          >
            Log In
          </Button>

          <div className="relative description-small">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full rounded-full"
            onClick={() => {
              setLoading(true);
              // Handle Google login
              setTimeout(() => setLoading(false), 1500);
            }}
            disabled={loading}
          >
            <Image 
  src="https://www.google.com/favicon.ico" 
  alt="Google" 
  width={24} 
  height={24} 
  className="mr-2 h-4 w-4" 
/>
            Continue with Google
          </Button>

          <div className="text-center ">
            <Link href="/signup" className="description-small hover:underline">
              Don&apos;t have an account?{" "}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
