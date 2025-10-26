import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  stepCountIs,
  streamText,
  Tool,
  tool,
  type UIMessage,
  type UIMessageStreamWriter,
} from "ai";
import { NextRequest } from "next/server";

import { dispatchResolveInstruction } from "@/actions/chat";
import { RESOLVE_TOOLS, type ResolveTool } from "@/lib/resolve-tools";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export const runtime = "nodejs";

type ResolveMessageMetadata = {
  mode?: "chat" | "tool";
  label?: string;
  toolId?: string;
  ok?: boolean;
  error?: string;
  durationMs?: number;
  timestamp?: string;
};

type ResolveHistoryItem = {
  role: "assistant" | "user";
  content: string;
  label?: string;
  mode?: string;
  timestamp?: string;
};

type ChatRequestBody = {
  id?: string;
  messages?: UIMessage[];
  trigger?: string;
  messageId?: string | null;
  mode?: "chat" | "tool";
  toolId?: string | null;
  userInput?: string;
};

const RESOLVE_AI_TOOLS: Record<string, Tool> = createResolveAITools();
const RESOLVE_TOOL_INDEX = new Map(
  RESOLVE_TOOLS.map((resolveTool) => [resolveTool.id, resolveTool] as const),
);

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatRequestBody;
  const { messages = [], mode: incomingMode, toolId, userInput = "" } = body;

  const normalizedMode: "chat" | "tool" =
    incomingMode === "tool" ? "tool" : "chat";

  const tool =
    normalizedMode === "tool" && toolId
      ? (RESOLVE_TOOLS.find((candidate) => candidate.id === toolId) ?? null)
      : null;

  const targetLabel = tool?.label ?? "Resolve Copilot";
  const baseMetadata = {
    mode: normalizedMode,
    label: targetLabel,
    toolId: tool?.id,
  };

  const prompt = getLatestUserText(messages);
  const history = buildHistory(messages);

  let immediateError: string | null = null;

  if (normalizedMode === "tool") {
    if (!tool) {
      immediateError =
        "The selected tool is unavailable. Refresh the page and try again.";
    } else if (tool.requiresInput && userInput.trim().length === 0) {
      immediateError = "Provide scripting content for this Resolve tool.";
    }
  } else {
    if (!prompt) {
      immediateError = "Please provide a prompt for Resolve.";
    }
  }

  if (!process.env.ANTHROPIC_API_KEY && !immediateError) {
    immediateError =
      "ANTHROPIC_API_KEY is not set. Add it to your environment to enable Resolve Copilot.";
  }

  const stream = createUIMessageStream({
    originalMessages: messages,
    async execute({ writer }) {
      const messageId = generateId();
      writer.write({ type: "start", messageMetadata: baseMetadata });
      writer.write({ type: "text-start", id: messageId });

      if (immediateError) {
        writer.write({
          type: "text-delta",
          id: messageId,
          delta: immediateError,
        });
        writer.write({ type: "text-end", id: messageId });
        writer.write({
          type: "finish",
          messageMetadata: {
            ...baseMetadata,
            ok: false,
            error: immediateError,
            durationMs: 0,
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      await streamLLMResponse({
        baseMetadata,
        history,
        messageId,
        prompt,
        writer,
        selectedTool: normalizedMode === "tool" ? (tool ?? null) : null,
        toolInput: normalizedMode === "tool" ? userInput : undefined,
      });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

function getLatestUserText(messages: UIMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const candidate = messages[index];
    if (candidate.role === "user") {
      const text = collectText(candidate);
      if (text) {
        return text;
      }
    }
  }
  return "";
}

function buildHistory(messages: UIMessage[]): ResolveHistoryItem[] {
  const recent = messages.filter(
    (message) => message.role === "assistant" || message.role === "user",
  );

  return recent.slice(-12).map((message) => {
    const metadata = (message.metadata ?? {}) as ResolveMessageMetadata;
    const role: ResolveHistoryItem["role"] =
      message.role === "assistant" ? "assistant" : "user";
    const content = collectText(message);
    return {
      role,
      content,
      label: metadata.label,
      mode: metadata.mode,
      timestamp: metadata.timestamp,
    };
  });
}

function collectText(message: UIMessage): string {
  return message.parts
    .filter(
      (
        part,
      ): part is Extract<
        UIMessage["parts"][number],
        { type: "text"; text: string }
      > => part.type === "text",
    )
    .map((part) => part.text)
    .join("\n\n")
    .trim();
}

function formatResponsePayload(response: unknown): string {
  if (response == null) {
    return "Resolve did not return any data.";
  }
  if (typeof response === "string") {
    return response.trim() || "Resolve returned an empty string.";
  }
  try {
    return JSON.stringify(response, null, 2);
  } catch {
    return String(response);
  }
}

function createResolveAITools() {
  return RESOLVE_TOOLS.reduce(
    (acc, resolveTool) => {
      if (resolveTool.requiresInput) {
        acc[resolveTool.id] = tool({
          description: `${resolveTool.description} Provide the script body as plain text.`,
          inputSchema: z
            .object({
              script: z
                .string()
                .min(1, "Provide the script content.")
                .describe(
                  resolveTool.placeholder
                    ? "Resolve scripting content to execute."
                    : "Script to execute within Resolve.",
                ),
            })
            .strict()
            .describe("Script execution input."),
          execute: async ({ script }) => {
            const result = await dispatchResolveInstruction({
              label: resolveTool.label,
              payload: resolveTool.buildPayload(script),
            });

            if (!result.ok) {
              throw new Error(result.error ?? "Resolve tool execution failed.");
            }

            return formatResponsePayload(result.response);
          },
        });
      } else {
        acc[resolveTool.id] = tool({
          description: resolveTool.description,
          inputSchema: z
            .object({})
            .strict()
            .describe("No parameters required."),
          execute: async () => {
            const result = await dispatchResolveInstruction({
              label: resolveTool.label,
              payload: resolveTool.buildPayload(""),
            });

            if (!result.ok) {
              throw new Error(result.error ?? "Resolve tool execution failed.");
            }

            return formatResponsePayload(result.response);
          },
        });
      }
      return acc;
    },
    {} as Record<string, Tool>,
  );
}

async function streamLLMResponse({
  baseMetadata,
  history,
  messageId,
  prompt,
  writer,
  selectedTool = null,
  toolInput,
}: {
  baseMetadata: ResolveMessageMetadata;
  history: ResolveHistoryItem[];
  messageId: string;
  prompt: string;
  writer: UIMessageStreamWriter;
  selectedTool?: ResolveTool | null;
  toolInput?: string;
}) {
  const contextualHistory = [...history];
  const lastEntry = contextualHistory[contextualHistory.length - 1];
  if (lastEntry?.role === "user") {
    contextualHistory.pop();
  }

  const messages = contextualHistory
    .filter((entry) => entry.content.length > 0)
    .map((entry) => ({
      role: entry.role,
      content: entry.content,
    }));

  if (selectedTool) {
    const trimmedInput = (toolInput ?? prompt).trim();
    const segments = [`Execute the "${selectedTool.label}" Resolve tool.`];
    if (selectedTool.requiresInput) {
      segments.push(
        trimmedInput
          ? `Use the following script inside Resolve:\n\n${trimmedInput}`
          : "No script was provided. If execution is impossible, respond with an error.",
      );
    } else if (trimmedInput.length > 0) {
      segments.push(trimmedInput);
    }
    messages.push({
      role: "user",
      content: segments.join("\n\n"),
    });
  } else {
    messages.push({
      role: "user",
      content: prompt,
    });
  }

  const startedAt = Date.now();
  let resolvedToolName = selectedTool?.id ?? null;

  try {
    const result = await streamText({
      model: anthropic("claude-3-7-sonnet-latest"),
      system:
        "You are Resolve Copilot, an assistant who helps editors automate DaVinci Resolve. You can call Resolve automation tools when useful. Prefer using tools for actions inside Resolve and explain what you did afterwards. Keep answers concise.",
      tools: RESOLVE_AI_TOOLS,
      toolChoice: selectedTool
        ? ({ type: "tool", toolName: selectedTool.id } as const)
        : "auto",
      activeTools: selectedTool ? [selectedTool.id] : undefined,
      stopWhen: stepCountIs(5),
      messages,
      temperature: 0.3,
    });

    let hasDelta = false;
    for await (const delta of result.textStream) {
      hasDelta = true;
      writer.write({
        type: "text-delta",
        id: messageId,
        delta,
      });
    }

    if (result.toolResults) {
      for (const toolResult of await result.toolResults) {
        if (toolResult.toolName) {
          resolvedToolName = toolResult.toolName;
        }
        const outputText =
          "error" in toolResult && toolResult.error
            ? `Error: ${toolResult.error}`
            : typeof toolResult.output === "string"
              ? toolResult.output
              : formatResponsePayload(toolResult.output);
        const header =
          selectedTool && toolResult.toolName === selectedTool.id
            ? "Resolve tool response:\n"
            : `Tool "${toolResult.toolName}" response:\n`;
        hasDelta = true;
        writer.write({
          type: "text-delta",
          id: messageId,
          delta: `\n\n${header}${outputText}`,
        });
      }
    }

    if (!hasDelta) {
      writer.write({
        type: "text-delta",
        id: messageId,
        delta: "Resolve Copilot did not return any text.",
      });
    }

    writer.write({ type: "text-end", id: messageId });
    const resolvedTool =
      resolvedToolName != null
        ? RESOLVE_TOOL_INDEX.get(resolvedToolName)
        : null;
    const finishMetadata: ResolveMessageMetadata = {
      ...baseMetadata,
      ok: true,
      durationMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
      toolId: resolvedToolName ?? baseMetadata.toolId,
      label:
        resolvedTool?.label ??
        (resolvedToolName
          ? `Resolve tool (${resolvedToolName})`
          : baseMetadata.label),
      mode: resolvedToolName ? "tool" : baseMetadata.mode,
    };
    writer.write({
      type: "finish",
      messageMetadata: finishMetadata,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate a response from Resolve Copilot.";
    writer.write({
      type: "text-delta",
      id: messageId,
      delta: `Resolve Copilot error: ${message}`,
    });
    writer.write({ type: "text-end", id: messageId });
    const resolvedTool =
      resolvedToolName != null
        ? RESOLVE_TOOL_INDEX.get(resolvedToolName)
        : null;
    const finishMetadata: ResolveMessageMetadata = {
      ...baseMetadata,
      ok: false,
      error: message,
      durationMs: 0,
      timestamp: new Date().toISOString(),
      toolId: resolvedToolName ?? baseMetadata.toolId,
      label:
        resolvedTool?.label ??
        (resolvedToolName
          ? `Resolve tool (${resolvedToolName})`
          : baseMetadata.label),
      mode: resolvedToolName ? "tool" : baseMetadata.mode,
    };
    writer.write({
      type: "finish",
      messageMetadata: finishMetadata,
    });
  }
}
