import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        // "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        // "X-Title": "AI Email Generator",
    },
});

export async function POST(req) {
    try {
        const { prompt, tone, purpose } = await req.json();

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini", // better quality
            messages: [
                {
                    role: "system",
                    content: `You are an assistant that generates clear, well-formatted emails.
                                Return the email in this exact format:
                                Subject: <short subject line>
                                Greeting: <Dear..., Hi..., etc.>
                                Body: <multi-line body with paragraphs>
                                Closing: <Best regards, Sincerely, etc.>`,
                },
                {
                    role: "user",
                    content: `Write a ${tone} email for the purpose of ${purpose}.
                                Details: ${prompt}`,
                },
            ],
        });

        const rawEmail = completion.choices[0].message.content || "";

        const subjectMatch = rawEmail.match(/Subject:\s*(.*)/i);
        const greetingMatch = rawEmail.match(/Greeting:\s*(.*)/i);
        const closingMatch = rawEmail.match(/Closing:\s*(.*)/i);
        const bodyMatch = rawEmail.match(/Body:\s*([\s\S]*)(?=Closing:|$)/i);

        const email = {
            subject: subjectMatch?.[1] || "No subject",
            greeting: greetingMatch?.[1] || "Hello,",
            body: bodyMatch?.[1]?.trim() || prompt,
            closing: closingMatch?.[1] || "Best regards",
        };

        return new Response(JSON.stringify({ email }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Error generating email:", err);
        return new Response(
            JSON.stringify({ error: err.message || "Failed to generate email" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
