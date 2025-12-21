export default function MessageList({ messages }: any) {
  return (
    <div className="space-y-2">
      {messages.map((m: any, i: number) => (
        <div key={i} className="p-2 rounded bg-muted">
          <b>{m.role}:</b> {m.content}
        </div>
      ))}
    </div>
  );
}
