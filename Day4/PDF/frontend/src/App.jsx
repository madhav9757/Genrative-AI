import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Loader2, UploadCloud, CheckCircle2, User, Bot, Trash2, Info } from 'lucide-react';
import { toast } from "sonner";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Note: Backend default is 5000 in your server.js
const API_BASE = "http://localhost:3000/api";

export default function RagApp() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploading(true);
    toast.promise(async () => {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`${API_BASE}/upload/pdf`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFile(selectedFile.name);
      return data;
    }, {
      loading: 'Parsing PDF and indexing knowledge...',
      success: (data) => `Success! ${data.chunks} segments indexed.`,
      error: 'Failed to process PDF. Check backend console.',
    });
    setUploading(false);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    const currentQuestion = question;
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.answer,
        sources: data.sources 
      }]);
    } catch (err) {
      toast.error(err.message || "Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full bg-slate-50/50 text-slate-900">
        <Toaster richColors position="top-right" />

        {/* Sidebar for Document Status */}
        <aside className="w-80 border-r bg-white p-6 hidden md:flex flex-col gap-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Bot size={24} />
            </div>
            <span>DocuMind AI</span>
          </div>

          <Card className="border-dashed shadow-none bg-slate-50/50">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-semibold">Active Document</CardTitle>
              <CardDescription className="text-xs">Upload a PDF to build the context.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" id="file-upload" disabled={uploading} />
              <label htmlFor="file-upload" className={`flex flex-col items-center justify-center gap-2 w-full py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${file ? 'bg-white border-green-400' : 'hover:bg-white hover:border-blue-400'}`}>
                {uploading ? <Loader2 className="animate-spin text-blue-600" /> : <UploadCloud className={file ? "text-green-500" : "text-slate-400"} />}
                <span className="text-xs font-medium text-center px-2 truncate w-full">
                  {file || "Click to upload PDF"}
                </span>
              </label>
              {file && (
                <Button variant="ghost" size="sm" className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setFile(null)}>
                  <Trash2 size={14} className="mr-2" /> Clear Document
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full relative">
          <header className="h-16 border-b bg-white flex items-center px-6 justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={file ? "success" : "secondary"} className={file ? "bg-green-100 text-green-700" : ""}>
                {file ? "Knowledge Base Loaded" : "Waiting for Document"}
              </Badge>
            </div>
          </header>

          <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                  <div className="bg-white p-6 rounded-full shadow-sm border">
                    <FileText size={48} className="text-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-700">No messages yet</h3>
                    <p className="text-sm text-slate-500 max-w-xs">Upload a PDF document on the left and start asking questions.</p>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`mt-1 flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-blue-600'}`}>
                      {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    
                    <div className={`space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border rounded-tl-none text-slate-800'}`}>
                        {m.content}
                      </div>

                      {m.sources && (
                        <div className="flex flex-wrap gap-2">
                          {m.sources.map(s => (
                            <Tooltip key={s.id}>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="cursor-help bg-slate-50 text-[10px] font-normal hover:bg-slate-100 py-0 px-2 transition-colors">
                                  <Info size={10} className="mr-1 opacity-50" /> Source {s.id}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="max-w-xs p-3 text-xs leading-normal">
                                <p className="font-semibold mb-1">Snippet:</p>
                                "{s.preview}"
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-white border flex items-center justify-center shadow-sm">
                    <Loader2 className="animate-spin text-blue-600" size={18} />
                  </div>
                  <div className="bg-white border p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2 items-center">
                    <span className="flex space-x-1">
                      <span className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">DocuMind is reading...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sticky Input Bar */}
          <div className="p-4 border-t bg-white/80 backdrop-blur-md">
            <form onSubmit={handleAsk} className="max-w-3xl mx-auto relative flex items-center gap-2">
              <Input
                placeholder={file ? "Ask anything about the document..." : "Upload a PDF to ask questions"}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={!file || loading}
                className="pr-12 h-12 rounded-2xl border-slate-200 focus-visible:ring-blue-600 shadow-sm"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!file || loading || !question.trim()} 
                className="absolute right-1.5 h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Send size={18} />
              </Button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-2 italic">
              AI can make mistakes. Verify important info.
            </p>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}