"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createWassengerClient } from "@/lib/wassenger-axios";
import { cn } from "@/lib/utils";
import type { LoginResponse } from "@/types/wassenger";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const api = createWassengerClient();
      const { data } = await api.post<LoginResponse>("/auth/login", {
        username,
        password,
      });
      if (data.ok) {
        router.replace("/messages");
        return;
      }
      setError("Login was not accepted.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          typeof err.response?.data === "string"
            ? err.response.data
            : JSON.stringify(err.response?.data ?? err.message);
        setError(msg || "Request failed");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-semibold tracking-tight">Admin sign in</h1>
          <p className="text-muted-foreground text-sm">
            Use your Wassenger save-message credentials.
          </p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? (
            <p className="text-destructive text-sm whitespace-pre-wrap wrap-break-word">
              {error}
            </p>
          ) : null}
          <Button className="w-full" disabled={pending} type="submit">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
