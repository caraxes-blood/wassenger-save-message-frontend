import type { SavedMessage } from "@/types/wassenger";

const dateFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
});

function getPreview(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const root = payload as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== "object") return "";
  const d = data as Record<string, unknown>;
  if (typeof d.body === "string") return d.body;
  const media = d.media;
  if (media && typeof media === "object") {
    const cap = (media as Record<string, unknown>).caption;
    if (typeof cap === "string") return cap;
  }
  return "";
}

function getMessageType(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const root = payload as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== "object") return "";
  const t = (data as Record<string, unknown>).type;
  return typeof t === "string" ? t : "";
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}

export function MessagesTable({ rows }: { rows: SavedMessage[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-4xl border-collapse text-left text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            <th className="border-border border-b px-3 py-2 font-medium">id</th>
            <th className="border-border border-b px-3 py-2 font-medium">
              message_id
            </th>
            <th className="border-border border-b px-3 py-2 font-medium">sender</th>
            <th className="border-border border-b px-3 py-2 font-medium">
              conversation_id
            </th>
            <th className="border-border border-b px-3 py-2 font-medium">
              timestamp
            </th>
            <th className="border-border border-b px-3 py-2 font-medium">type</th>
            <th className="border-border border-b px-3 py-2 font-medium">preview</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="odd:bg-background even:bg-muted/20">
              <td className="border-border border-b px-3 py-2 font-mono text-xs">
                {row.id}
              </td>
              <td className="border-border border-b px-3 py-2 font-mono text-xs">
                {row.message_id}
              </td>
              <td className="border-border border-b px-3 py-2">{row.sender}</td>
              <td className="border-border border-b px-3 py-2 font-mono text-xs">
                {row.conversation_id}
              </td>
              <td className="border-border border-b px-3 py-2 whitespace-nowrap">
                {dateFmt.format(new Date(row.timestamp))}
              </td>
              <td className="border-border border-b px-3 py-2">
                {getMessageType(row.payload) || "—"}
              </td>
              <td className="border-border border-b px-3 py-2 max-w-md">
                <span className="line-clamp-3 whitespace-pre-wrap wrap-break-word">
                  {truncate(getPreview(row.payload), 120) || "—"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
