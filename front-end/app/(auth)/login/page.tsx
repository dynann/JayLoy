"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordInput, TextInput } from "@/components/customeInput";
import { getSession, signIn } from "next-auth/react";
import LoadingOverlay from "@/components/LoadingOverlay";
import Image from "next/image";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Logging in...");
  const router = useRouter();
  const { data: session } = useSession()
  
  useEffect(() => {
    if (session?.accessToken) {
      // Store tokens in localStorage
      localStorage.setItem("accessToken", session.accessToken);
      localStorage.setItem("refreshToken", session.refreshToken);
      localStorage.setItem("tokenTimestamp", Date.now().toString());
      router.push("/");
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("Logging in...");
    setError("");
    
    try {
      console.log(process.env.NEXT_PUBLIC_API_URL)
      // console.log({email, password});
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store both tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
    
        // Add a timestamp for when the tokens were stored
        localStorage.setItem("tokenTimestamp", Date.now().toString());
        
        router.push("/");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Login failed");
      }
    } catch (err) {
      setError("Failed to fetch");
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("Connecting to Google...");
    setError("");
    
    try {
      const result = await signIn("google", { redirect: false });
      
      if (result?.error) {
        setError(result.error);
      } else {
        // Get the session after successful login
        setLoadingMessage("Finalizing login...");
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
    } catch (err) {
      setError("An error occurred during Google login");
      console.error("Google login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <LoadingOverlay isLoading={loading} message={loadingMessage} />
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="header">JayLoy</h1>
          <p className="description-medium mt-2">Spend wisely, waste less, save more</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <TextInput 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={loading}
          />
          <PasswordInput 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={loading}
          />

          {/* {error && <p className="text-center smalltext !text-red">{error}!!!!</p> } */}
          {error && <p className="text-center smalltext !text-red">Incredential Email or Password</p> }

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
            onClick={handleGoogleLogin}
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
              Don&#39;t have an account?{" "}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}