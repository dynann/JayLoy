"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDescription("");
      setError(null);
    }
  };

  const generateDescription = async (): Promise<void> => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      
      const response = await fetch("/api/LLM", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to process image");
      }
      
      setDescription(data.description);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Image to Text with Gemini AI</h1>
        
        <div className="mb-6">
          <label 
            htmlFor="imageUpload" 
            className="block w-full p-4 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            Click to upload an image
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        
        {previewUrl && (
          <div className="mb-6 relative w-full h-64">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg"
            />
          </div>
        )}
        
        <button
          onClick={generateDescription}
          disabled={loading || !selectedImage}
          className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Generate Description"}
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {description && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Image Description:</h2>
            <div className="p-4 bg-gray-100 rounded-lg">
              {description}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}