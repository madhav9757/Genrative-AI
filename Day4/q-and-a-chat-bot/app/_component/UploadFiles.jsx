"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";

const UploadFiles = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md px-2 py-6">
      <div
        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragOver
            ? "border-blue-400 bg-blue-950/20"
            : "border-blue-600 bg-blue-900/10"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()} // click anywhere to open file dialog
      >
        <CloudUpload size={48} className=" mb-2" />
        <p >Drag & drop PDF here</p>
        <p className="text-sm">or</p>

        <Button
          type="button"
          className="mt-3"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Browse Computer
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {pdfFile && (
        <p className="mt-3 text-sm">
          Selected:{" "}
          <span className="font-medium">{pdfFile.name}</span>
        </p>
      )}
    </div>
  );
};

export default UploadFiles;
