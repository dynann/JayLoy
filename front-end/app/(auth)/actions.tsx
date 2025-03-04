
"use server";

import { cookies } from "next/headers";   

export async function logout() {
  (await cookies()).delete("auth-token");  
  (await cookies()).delete("refresh-token");   

 
  return { redirect: "/login" };   
}
