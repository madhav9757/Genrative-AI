"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const QandASection = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:4000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("⚠️ Error fetching answer.");
    }

    setLoading(false);
  };

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Ask a Question
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea
          rows={3}
          placeholder="Ask something about the uploaded PDF..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="flex w-full gap-3">
          <Button
            onClick={handleAsk}
            className="flex-1"
            disabled={!question.trim() || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </span>
            ) : (
              "Ask"
            )}
          </Button>
          {question && (
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={loading}
              className="flex-1"
            >
              Clear
            </Button>
          )}
        </div>

        <AnimatePresence>
          {answer && (
            <motion.div
              key="answer-box"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 border rounded-md bg-muted"
            >
              <strong className="block mb-2 text-sm">Answer:</strong>
              <p className="text-sm leading-relaxed">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default QandASection;
