"use client";

import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import UploadFiles from "./_component/UploadFiles";
import QandASection from "./_component/QandASection";

const Page = () => {
  return (
    <div className="h-screen w-full p-4">
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border bg-muted"
      >
        {/* Left Panel - Upload */}
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="flex h-full items-center justify-center bg-white p-4">
            <UploadFiles />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Q&A */}
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="flex h-full items-center justify-center bg-gray-50 p-4">
            <QandASection />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;
