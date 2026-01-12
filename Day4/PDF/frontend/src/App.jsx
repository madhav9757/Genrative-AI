import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Loader2, UploadCloud, User, Bot, Trash2, Info, CheckCircle2, AlertCircle, FileCheck, Sparkles, Brain, Search } from 'lucide-react';
import { toast } from "sonner";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE = "http://localhost:3000/api";

export default function RagApp() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState("");
  const [chunksCount, setChunksCount] = useState(0);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchingStage, setSearchingStage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const simulateProgress = (callback) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      setUploadProgress(progress);
    }, 200);
    
    return () => {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(0);
        callback();
      }, 500);
    };
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.includes('pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setShowWelcome(false);
    setProcessingStage("Uploading PDF...");
    
    const stopProgress = simulateProgress(() => {
      setUploading(false);
      setProcessingStage("");
    });

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setProcessingStage("Extracting text from PDF...");
      
      const res = await fetch(`${API_BASE}/upload/pdf`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      setProcessingStage("Creating text chunks...");
      const data = await res.json();
      
      setProcessingStage("Generating embeddings...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProcessingStage("Storing in vector database...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      stopProgress();
      setFile(selectedFile.name);
      setChunksCount(data.chunks);
      
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-semibold">Document processed successfully!</div>
          <div className="text-xs text-muted-foreground">
            {data.chunks} text segments indexed and ready for questions
          </div>
        </div>,
        { duration: 4000 }
      );
      
    } catch (err) {
      stopProgress();
      toast.error(
        <div className="flex flex-col gap-1">
          <div className="font-semibold">Failed to process PDF</div>
          <div className="text-xs text-muted-foreground">
            {err.message || "Please check if the backend server is running"}
          </div>
        </div>
      );
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    const currentQuestion = question;
    setQuestion("");
    setLoading(true);
    setSearchingStage("Understanding your question...");

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSearchingStage("Searching through document...");
      
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });
      
      setSearchingStage("Finding relevant information...");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");
      
      setSearchingStage("Generating answer...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.answer,
        sources: data.sources 
      }]);
      
      if (data.sources && data.sources.length > 0) {
        toast.success(`Found ${data.sources.length} relevant sources`, {
          duration: 2000
        });
      }
      
    } catch (err) {
      toast.error(
        <div className="flex flex-col gap-1">
          <div className="font-semibold">Failed to get answer</div>
          <div className="text-xs text-muted-foreground">
            {err.message || "Connection error. Please try again."}
          </div>
        </div>
      );
      setMessages(prev => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setLoading(false);
      setSearchingStage("");
    }
  };

  const handleClearDocument = () => {
    setFile(null);
    setChunksCount(0);
    setMessages([]);
    setShowWelcome(true);
    toast.info("Document cleared. Upload a new PDF to start again.");
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
        <Toaster richColors position="top-right" />

        {/* Enhanced Sidebar */}
        <aside className="w-80 border-r bg-white/80 backdrop-blur-sm p-6 hidden md:flex flex-col gap-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl text-white shadow-lg">
              <Brain size={28} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">DocuMind AI</h1>
              <p className="text-xs text-slate-500">Intelligent Document Assistant</p>
            </div>
          </div>

          {/* Status Card */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText size={16} />
                Document Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {!file ? (
                <>
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-800">
                      Upload a PDF document to start asking questions
                    </AlertDescription>
                  </Alert>
                  
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    id="file-upload" 
                    disabled={uploading} 
                  />
                  <label 
                    htmlFor="file-upload" 
                    className={`flex flex-col items-center justify-center gap-3 w-full py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      uploading 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'hover:bg-slate-50 hover:border-blue-400 border-slate-300'
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="animate-spin text-blue-600" size={32} />
                    ) : (
                      <UploadCloud className="text-slate-400" size={32} />
                    )}
                    <span className="text-sm font-medium text-center px-3">
                      {uploading ? processingStage : "Click to upload PDF"}
                    </span>
                  </label>
                  
                  {uploading && uploadProgress > 0 && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-center text-slate-600">
                        Processing... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-green-900 truncate">{file}</p>
                      <p className="text-[10px] text-green-700 mt-0.5">
                        {chunksCount} segments indexed
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" 
                    onClick={handleClearDocument}
                  >
                    <Trash2 size={14} className="mr-2" /> 
                    Clear & Upload New
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card className="border shadow-md bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles size={16} />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ol className="space-y-3 text-xs text-slate-600">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[10px]">1</span>
                  <span>Upload your PDF document</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[10px]">2</span>
                  <span>AI processes and indexes the content</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[10px]">3</span>
                  <span>Ask questions in natural language</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[10px]">4</span>
                  <span>Get accurate answers with sources</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Stats */}
          {messages.length > 0 && (
            <div className="mt-auto pt-4 border-t space-y-2">
              <div className="text-xs text-slate-500 font-medium">Session Stats</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-100 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-slate-900">{Math.floor(messages.length / 2)}</div>
                  <div className="text-[10px] text-slate-600">Questions</div>
                </div>
                <div className="bg-slate-100 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-slate-900">{chunksCount}</div>
                  <div className="text-[10px] text-slate-600">Segments</div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full relative">
          {/* Enhanced Header */}
          <header className="h-16 border-b bg-white/90 backdrop-blur-sm flex items-center px-6 justify-between shadow-sm">
            <div className="flex items-center gap-3">
              {file ? (
                <>
                  <FileCheck className="text-green-600" size={20} />
                  <div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Ready to Answer
                    </Badge>
                    <p className="text-xs text-slate-500 mt-0.5">AI has indexed your document</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="text-amber-600" size={20} />
                  <div>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                      No Document Loaded
                    </Badge>
                    <p className="text-xs text-slate-500 mt-0.5">Upload a PDF to begin</p>
                  </div>
                </>
              )}
            </div>
            
            {loading && (
              <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse">
                <Search className="animate-spin" size={16} />
                <span className="font-medium">{searchingStage}</span>
              </div>
            )}
          </header>

          <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Welcome Screen */}
              {showWelcome && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
                    <div className="relative bg-white p-8 rounded-full shadow-lg border-2 border-blue-100">
                      <FileText size={64} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-3 max-w-md">
                    <h3 className="text-2xl font-bold text-slate-800">Welcome to DocuMind AI</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Your intelligent document assistant. Upload a PDF and ask questions to get instant, accurate answers backed by AI-powered search.
                    </p>
                    {!file && (
                      <Button 
                        onClick={() => document.getElementById('file-upload').click()}
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                      >
                        <UploadCloud className="mr-2" size={18} />
                        Upload Your First Document
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-300`}>
                  <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`mt-1 flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-md border-2 ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-400' 
                        : 'bg-white border-slate-200 text-blue-600'
                    }`}>
                      {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    
                    <div className={`space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-600">
                          {m.role === 'user' ? 'You' : 'DocuMind AI'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className={`p-4 rounded-2xl shadow-md text-sm leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm' 
                          : 'bg-white border-2 border-slate-100 rounded-tl-sm text-slate-800'
                      }`}>
                        {m.content}
                      </div>

                      {m.sources && m.sources.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Info size={12} />
                            Sources used ({m.sources.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {m.sources.map(s => (
                              <Tooltip key={s.id}>
                                <TooltipTrigger asChild>
                                  <Badge 
                                    variant="outline" 
                                    className="cursor-help bg-slate-50 hover:bg-slate-100 text-xs font-normal transition-all hover:scale-105"
                                  >
                                    <FileText size={12} className="mr-1.5 opacity-60" /> 
                                    Source {s.id}
                                    <span className="ml-1.5 text-[10px] opacity-60">
                                      ({(s.relevance * 100).toFixed(0)}%)
                                    </span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-sm p-3 text-xs leading-relaxed">
                                  <div className="space-y-1">
                                    <p className="font-semibold text-blue-600">Source Preview:</p>
                                    <p className="text-slate-700">"{s.preview}"</p>
                                    <p className="text-[10px] text-slate-500 italic mt-2">
                                      Relevance: {(s.relevance * 100).toFixed(1)}%
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex justify-start gap-4 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="h-10 w-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-md">
                    <Loader2 className="animate-spin text-blue-600" size={20} />
                  </div>
                  <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="flex space-x-1">
                        <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></span>
                      </span>
                      <span className="text-sm text-slate-600 font-medium">{searchingStage}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Enhanced Input Bar */}
          <div className="p-4 border-t bg-white/90 backdrop-blur-md shadow-lg">
            <div className="max-w-3xl mx-auto space-y-3">
              {!file && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-xs text-amber-800">
                    Please upload a PDF document before asking questions
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleAsk} className="relative flex items-center gap-2">
                <Input
                  placeholder={
                    file 
                      ? "Ask anything about your document..." 
                      : "Upload a PDF first to start asking questions"
                  }
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={!file || loading}
                  className="pr-14 h-12 rounded-2xl border-2 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-sm disabled:bg-slate-50"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!file || loading || !question.trim()} 
                  className="absolute right-1.5 h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </form>
              
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <p className="italic flex items-center gap-1">
                  <Info size={10} />
                  AI responses may contain errors. Verify important information.
                </p>
                {file && (
                  <p className="font-medium text-green-600">
                    ✓ {chunksCount} segments ready
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}