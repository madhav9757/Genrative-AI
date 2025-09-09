'use client';

import { useState } from "react";
import { Copy, Mail, Sparkles, Check, Send, User, MessageSquare } from "lucide-react";

export default function EmailGenerator() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [purpose, setPurpose] = useState("request");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateEmail = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setEmail("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone, purpose }),
      });

      const data = await res.json();

      if (data.email) {
        setEmail(data.email);
      } else {
        setEmail("⚠️ Failed to generate email. Try again.");
      }
    } catch (error) {
      console.error("Error generating email:", error);
      setEmail("⚠️ Error while generating email.");
    }

    setLoading(false);
  };

  const copyEmail = async () => {
    const emailText = typeof email === 'string' ? email :
      `Subject: ${email.subject}\n\n${email.greeting}\n\n${email.body}\n\n${email.closing}`;

    await navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Professional Email Generator
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
              Create polished, professional emails in seconds with AI assistance
            </p>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Input Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-medium text-gray-900">Compose Email</h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Email Content
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you need to communicate. For example: 'I need to request time off next Friday for a doctor's appointment and want to ensure my projects are covered.'"
                    className="w-full h-36 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  />
                  <div className="mt-2 text-right text-xs text-gray-400">
                    {prompt.length}/500 characters
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Email Purpose
                    </label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="request">Request</option>
                      <option value="followup">Follow-up</option>
                      <option value="meeting">Meeting</option>
                      <option value="update">Status Update</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Communication Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="casual">Casual</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateEmail}
                  disabled={!prompt.trim() || loading}
                  className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Generating Email...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Generate Professional Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="font-medium text-blue-900 mb-3">Writing Tips</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Be specific about what you need or want to communicate</li>
                <li>• Include relevant context and deadlines if applicable</li>
                <li>• Mention any actions you've already taken</li>
                <li>• Consider who you're writing to when choosing tone</li>
              </ul>
            </div>
          </div>

          {/* Output Panel */}
          <div className="space-y-6">
            <div className="bg-white/60 dark:bg-slate-900/50 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 backdrop-blur-sm overflow-hidden min-h-[500px]">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Generated Email
                    </h2>
                  </div>
                  {email && (
                    <button
                      onClick={copyEmail}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800/60 rounded-lg transition-all duration-200"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {email ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {/* Subject */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <Mail className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-xs uppercase font-medium tracking-wide text-gray-500 dark:text-gray-400">Subject</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{email.subject}</p>
                      </div>

                      {/* Greeting */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-xs uppercase font-medium tracking-wide text-gray-500 dark:text-gray-400">Greeting</span>
                        </div>
                        <p className="text-gray-900 dark:text-gray-200">{email.greeting}</p>
                      </div>

                      {/* Body */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-xs uppercase font-medium tracking-wide text-gray-500 dark:text-gray-400">Message Body</span>
                        </div>
                        <div className="text-gray-900 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                          {email.body}
                        </div>
                      </div>

                      {/* Closing */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <Send className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-xs uppercase font-medium tracking-wide text-gray-500 dark:text-gray-400">Closing</span>
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium">{email.closing}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-blue-100 dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Generate</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                      Fill in your email requirements and click generate to create a professional email draft.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Professional email generation powered by AI
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Fast</span>
              <span>•</span>
              <span>Reliable</span>
              <span>•</span>
              <span>Professional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}