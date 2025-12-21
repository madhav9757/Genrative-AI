import UploadPDF from "@/components/upload/UploadPDF";
import Chat from "@/components/chat/Chat";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-700 to-blue-600 text-white p-6 flex flex-col md:flex-row gap-6">
      {/* Left: PDF Upload */}
      <div className="md:w-1/3 bg-white/10 backdrop-blur-md rounded-xl p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Upload PDF</h2>
        <UploadPDF />
      </div>

      {/* Right: Chat */}
      <div className="md:w-2/3 bg-white/10 backdrop-blur-md rounded-xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Chat with your PDF</h2>
        <Chat />
      </div>
    </div>
  );
}
