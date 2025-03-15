"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordInput, TextInput } from "@/components/customeInput";
import { getSession, signIn, useSession } from "next-auth/react";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const {data: session, status} = useSession() 
  useEffect(() => {
    if (session?.accessToken) {
      // Store tokens in localStorage
      localStorage.setItem("accessToken", session.accessToken);
      localStorage.setItem("refreshToken", session.refreshToken);
      localStorage.setItem("tokenTimestamp", Date.now().toString());
      router.push("/");
    }
  }, [session, router]);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle password mismatch
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      console.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Sign Up successful", data);
        router.push("/login");
      } else {
        // Handle error
        const errorData = await res.json();
        setError(errorData.message || "Sign Up failed");
        // We can comment this line, because its purpose was for us to see the error message in the console
        console.error("Sign Up failed", errorData);
      }
    } catch (err) {
      setError("Failed to fetch");
      console.error("Failed to fetch", err);
    }
  };
  const handleGoogleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      const result = await signIn("google", { redirect: false });
      
      if (result?.error) {
        setError(result.error);
      } else {
        // Get the session after successful login
        const session = await getSession();
        
        if (session?.user) {
          // Send user info to your backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
            }),
          });
  
          if (response.ok) {
            const { accessToken, refreshToken } = await response.json();
            
            // Store tokens
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("tokenTimestamp", Date.now().toString());
            
            router.push("/");
          } else {
            setError("Failed to get tokens from backend");
          }
        }
      }
    };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="header">JayLoy</h1>
          <p className="description-medium mt-2">Spend wisely, waste less, save more</p>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <TextInput type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextInput type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />

          <PasswordInput placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <PasswordInput placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          {error && <p className="text-center description-medium !text-red">{error}!!!!</p>}

          <div className="relative description-small">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full px-2 border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground"></span>
            </div>
          </div>

          <div className="text-center description-small">
            By creating your account, you&apos;re agreeing to our{" "}
            <Link href="#" className="underline hover:text-primary">Terms and Conditions</Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
          </div>

          <Button type="submit" className="green-button !text-white">Sign Up</Button>

          <div className="relative description-small">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full rounded-full" onClick={handleGoogleLogin} >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="text-center ">
            <Link href="/login" className="description-small hover:underline">
              I already have an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}