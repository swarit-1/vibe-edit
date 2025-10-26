"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEventHandler, KeyboardEventHandler } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import {
  AlertTriangle,
  ArrowUpCircle,
  Loader2,
  MessageCircle,
  RefreshCcw,
  Server,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";

import { RESOLVE_TOOLS, type ResolveTool } from "@/lib/resolve-tools";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type MessageRole = "system" | "user" | "assistant" | "tool" | "error";

type ResolveMessageMetadata = {
  mode?: "chat" | "tool";
  label?: string;
  toolId?: string;
  ok?: boolean;
  error?: string;
  durationMs?: number;
  timestamp?: string;
};

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  label?: string;
  meta?: {
    durationMs?: number;
    toolId?: string;
  };
  timestamp: Date;
};

const INTRO_MESSAGE: ChatMessage = {
  id: "system-greeting",
  role: "system",
  content:
    "Connected to the DaVinci Resolve bridge. Ask a question, run a script, or launch one of the quick tools.",
  timestamp: new Date(),
};

export default function ChatShell() {
  const [currentTool, setCurrentTool] = useState<ResolveTool | null>(null);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    messages: chatMessages,
    sendMessage,
    setMessages,
    status,
    error,
  } = useChat({ id: "resolve-copilot" });

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: status === "streaming" ? "auto" : "smooth",
      block: "end",
    });
  }, [chatMessages, status]);

  const derivedMessages = useMemo<ChatMessage[]>(() => {
    const mapped = chatMessages.map((message) =>
      mapUIMessageToChatMessage(message),
    );
    return [INTRO_MESSAGE, ...mapped];
  }, [chatMessages]);

  const hasError = useMemo(
    () =>
      Boolean(error) ||
      derivedMessages.some((message) => message.role === "error"),
    [error, derivedMessages],
  );

  const activeModeLabel = currentTool
    ? `Tool · ${currentTool.label}`
    : "Chat · Resolve Copilot";

  const isStreaming = status === "submitted" || status === "streaming";

  const canSubmit = useMemo(() => {
    if (currentTool) {
      if (currentTool.requiresInput) {
        return input.trim().length > 0;
      }
      return true;
    }
    return input.trim().length > 0;
  }, [currentTool, input]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!canSubmit || isStreaming) {
      return;
    }

    const rawInput = input;
    const trimmedInput = rawInput.trim();
    const toolSnapshot = currentTool;
    const mode = toolSnapshot ? "tool" : "chat";
    const label = toolSnapshot?.label ?? "Resolve Copilot";
    const displayedText = toolSnapshot
      ? toolSnapshot.requiresInput
        ? trimmedInput || toolSnapshot.label
        : toolSnapshot.label
      : trimmedInput;

    try {
      await sendMessage(
        {
          text: displayedText,
          metadata: {
            mode,
            label,
            toolId: toolSnapshot?.id,
          } satisfies ResolveMessageMetadata,
        },
        {
          body: {
            mode,
            toolId: toolSnapshot?.id,
            userInput: trimmedInput,
          },
        },
      );
    } catch (err) {
      // Errors are surfaced via the hook's `error` state and status badge.
      console.error(err);
    } finally {
      if (!toolSnapshot || toolSnapshot.requiresInput) {
        setInput("");
      }
    }
  };

  const handleToolSelect = (tool: ResolveTool) => {
    setCurrentTool(tool);
    if (tool.requiresInput && !input.trim()) {
      setInput(tool.sample ?? "");
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setCurrentTool(null);
  };

  const handleInputKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }
    event.preventDefault();
    if (!canSubmit || isStreaming) return;
    formRef.current?.requestSubmit();
    setInput("");
  };

  const connectionBadgeVariant = hasError ? "destructive" : "secondary";

  return (
    <div className="h-screen bg-linear-to-br from-background via-background to-muted/30 px-4 pb-12 pt-10 sm:px-8">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-6">
        <Card className="flex min-h-0 flex-1 flex-col border border-border/70 bg-card/80 shadow-lg backdrop-blur">
          <CardHeader className="shrink-0 px-6">
            <header className="flex flex-col gap-3 rounded-2xl   sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold sm:text-xl">
                    Resolve Copilot
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Chat with the DaVinci Resolve LLM, launch tools, or execute
                    inline scripts.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={connectionBadgeVariant}>
                  {hasError ? "Check connection" : "Bridge ready"}
                </Badge>
                {currentTool ? (
                  <Badge
                    variant="outline"
                    className="hidden gap-1 sm:inline-flex"
                  >
                    <currentTool.icon className="size-3.5 shrink-0" />
                    {currentTool.label}
                  </Badge>
                ) : null}
              </div>
            </header>
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                <MessageCircle className="size-3.5" />
                {activeModeLabel}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={handleClearConversation}
              >
                <RefreshCcw className="size-3.5" />
                Reset chat
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-6">
            <ScrollArea className="flex-1 min-h-0 pr-4">
              <div className="space-y-6">
                {derivedMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={endRef} />
              </div>
            </ScrollArea>

            <Separator />

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {currentTool
                    ? "Tool payload will be sent to the Resolve bridge."
                    : "Send conversational prompts or switch to a quick tool."}
                </span>
                {currentTool ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setCurrentTool(null)}
                  >
                    Clear tool
                  </Button>
                ) : null}
              </div>

              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  currentTool?.placeholder ??
                  "E.g. “Balance the colors on the selected clip” or “How do I set up a Fusion composition?”"
                }
                rows={currentTool?.requiresInput ? 8 : 4}
                className="resize-none border border-border/70 bg-background/60 backdrop-blur transition-all focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Chat input"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        Resolve tools
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={6}
                      className="w-72"
                    >
                      <DropdownMenuLabel>
                        Quick automation presets
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {RESOLVE_TOOLS.map((tool) => (
                        <DropdownMenuItem
                          key={tool.id}
                          onSelect={(event) => {
                            event.preventDefault();
                            handleToolSelect(tool);
                          }}
                          className="items-start gap-2 py-2"
                        >
                          <tool.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              {tool.label}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {tool.description}
                            </p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {currentTool ? (
                    <Badge
                      variant="outline"
                      className="inline-flex items-center gap-1"
                    >
                      <currentTool.icon className="size-3.5" />
                      {currentTool.label}
                    </Badge>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  disabled={!canSubmit || isStreaming}
                  className="ml-auto inline-flex items-center gap-2 sm:ml-0"
                >
                  {isStreaming ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Working…
                    </>
                  ) : (
                    <>
                      <ArrowUpCircle className="size-4" />
                      {currentTool ? "Run tool" : "Send"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isError = message.role === "error";
  const isTool = message.role === "tool";

  const bubbleClasses = [
    "rounded-2xl border px-3.5 py-2.5 text-sm shadow-sm backdrop-blur transition text-left",
    isUser && !isError
      ? "bg-primary text-primary-foreground border-primary/40"
      : "",
    !isUser && !isSystem && !isError ? "bg-background/70 border-border/70" : "",
    isSystem
      ? "bg-muted/60 border-dashed border-border/60 text-muted-foreground"
      : "",
    isError ? "bg-destructive/10 border-destructive text-destructive" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const contentElement =
    message.content.includes("\n") || message.content.length > 120 ? (
      <pre className="whitespace-pre-wrap break-words text-sm">
        {message.content}
      </pre>
    ) : (
      <span>{message.content}</span>
    );

  const durationLabel =
    typeof message.meta?.durationMs === "number"
      ? formatDuration(message.meta.durationMs)
      : null;

  const RoleIcon = isUser
    ? UserRound
    : isError
      ? AlertTriangle
      : isTool
        ? Wrench
        : isSystem
          ? Server
          : Sparkles;

  const avatarToneClass = isError
    ? "bg-destructive/10 text-destructive"
    : isUser
      ? "bg-primary/10 text-primary"
      : isTool
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground";

  return (
    <div className="flex items-start gap-3 justify-start">
      <Avatar className="size-9 border border-border/60 shadow-sm">
        <AvatarFallback
          className={`flex h-full w-full items-center justify-center rounded-full ${avatarToneClass}`}
        >
          <RoleIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">
            {isUser
              ? "You"
              : isSystem
                ? "System"
                : isTool
                  ? "Resolve tool"
                  : isError
                    ? "Error"
                    : "Resolve copilot"}
          </span>
        </AvatarFallback>
      </Avatar>

      <div className="max-w-[82%] space-y-2 sm:max-w-[70%]">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          <span className="font-semibold">
            {isUser
              ? "You"
              : isSystem
                ? "System"
                : isTool
                  ? "Resolve Tool"
                  : isError
                    ? "Resolve Error"
                    : "Resolve Copilot"}
          </span>

          {durationLabel ? <span>{durationLabel}</span> : null}
        </div>
        <div className={bubbleClasses}>{contentElement}</div>
      </div>
    </div>
  );
}

function mapUIMessageToChatMessage(message: UIMessage): ChatMessage {
  const metadata = (message.metadata ?? {}) as ResolveMessageMetadata;
  const textContent = collectTextFromParts(message);
  const timestamp = metadata.timestamp
    ? new Date(metadata.timestamp)
    : new Date();

  let role: MessageRole;
  if (message.role === "user") {
    role = "user";
  } else if (metadata.ok === false) {
    role = "error";
  } else if (metadata.mode === "tool") {
    role = "tool";
  } else if (message.role === "system") {
    role = "system";
  } else {
    role = "assistant";
  }

  return {
    id: message.id,
    role,
    content: textContent || (role === "assistant" ? "…" : ""),
    label: metadata.label ?? message.metadata?.label,
    meta: {
      durationMs: metadata.durationMs,
      toolId: metadata.toolId,
    },
    timestamp,
  };
}

function collectTextFromParts(message: UIMessage): string {
  const segments: string[] = [];

  for (const part of message.parts ?? []) {
    if (part.type === "text") {
      if (part.text.trim().length > 0) {
        segments.push(part.text.trim());
      }
      continue;
    }

    const toolSegment = formatToolPart(part);
    if (toolSegment) {
      segments.push(toolSegment);
    }
  }

  return segments.filter(Boolean).join("\n\n").trim();
}

function formatDuration(durationMs: number) {
  if (durationMs < 1000) {
    return `${durationMs}ms`;
  }
  const seconds = durationMs / 1000;
  return `${seconds.toFixed(1)}s`;
}

function formatToolPart(part: UIMessage["parts"][number]): string | undefined {
  if (!part || typeof part !== "object") return undefined;

  if (typeof (part as { type?: string }).type !== "string") return undefined;

  if ((part as { type: string }).type === "dynamic-tool") {
    const dyn = part as Extract<
      UIMessage["parts"][number],
      { type: "dynamic-tool" }
    >;
    const toolName = dyn.toolName ?? "tool";
    switch (dyn.state) {
      case "output-available": {
        const output = stringifyValue(dyn.output);
        return `Tool ${toolName} output:\n${output}`;
      }
      case "output-error": {
        return `Tool ${toolName} error: ${dyn.errorText ?? "Unknown error"}`;
      }
      case "input-available": {
        const input = stringifyValue(dyn.input);
        return `Tool ${toolName} input:\n${input}`;
      }
      default:
        return undefined;
    }
  }

  if ((part as { type: string }).type.startsWith("tool-")) {
    const toolPart = part as Extract<
      UIMessage["parts"][number],
      { type: string; state: string }
    > & {
      toolCallId?: string;
      input?: unknown;
      output?: unknown;
      errorText?: string;
      rawInput?: unknown;
    };

    const toolName = toolPart.type.replace(/^tool-/, "") || "tool";

    switch (toolPart.state) {
      case "output-available": {
        const output = stringifyValue(toolPart.output);
        return `Tool ${toolName} output:\n${output}`;
      }
      case "output-error": {
        const fallback =
          toolPart.errorText ??
          (toolPart.rawInput
            ? `Failed with input: ${stringifyValue(toolPart.rawInput)}`
            : "Resolve tool execution failed.");
        return `Tool ${toolName} error: ${fallback}`;
      }
      case "input-available": {
        const inputText = stringifyValue(toolPart.input);
        return `Tool ${toolName} input:\n${inputText}`;
      }
      default:
        return undefined;
    }
  }

  return undefined;
}

function stringifyValue(value: unknown): string {
  if (value == null) {
    return "No data returned.";
  }
  if (typeof value === "string") {
    return value.trim().length > 0 ? value : "No data returned.";
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value);
  }
}
