import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const imageBytes = await imageFile.arrayBuffer();
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const imagePart = {
      inlineData: {
        data: Buffer.from(imageBytes).toString("base64"),
        mimeType: imageFile.type,
      },
    };
    const result = await model.generateContent([
      `extract essential information in this transaction picture and format into following json format: 
      response only json format, remember the format json that they send to make api request,
      {
        "amount": example (100) put only number and if use see KHR currency please convert to USD format, by multiply by 4000 ,
        "type": EXPENSE OR INCOME,
        "description": example : "I bought cake",  mostly in remark option,
        "date": example format like this "2025-12-31",
      }`,
      imagePart,
    ]);

    const response = result.response;
    const text = response.text();

    return new Response(JSON.stringify({ description: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
