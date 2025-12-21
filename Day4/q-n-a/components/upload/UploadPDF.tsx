"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function UploadPDF() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);

    const form = new FormData();
    form.append("file", file);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 100);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    clearInterval(interval);
    setProgress(100);
    setLoading(false);

    if (res.ok) alert("PDF uploaded successfully!");
    else alert("Upload failed!");
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={upload}
        className="hidden"
      />
      <Button
        variant="outline"
        className="w-full py-4 text-lg font-medium"
        onClick={() => inputRef.current?.click()} // <-- trigger file picker
      >
        {loading ? "Uploading..." : "Choose PDF"}
      </Button>

      {loading && <Progress value={progress} className="w-full rounded-full" />}

      <p className="text-sm text-white/70 text-center mt-2">
        Only PDF files allowed (max 5MB)
      </p>
    </div>
  );
}
