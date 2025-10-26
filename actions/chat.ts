"use server";

import { rpc } from "@/actions/resolve";

export type ResolveInstruction = {
  label: string;
  payload: Record<string, unknown>;
};

export type ResolveInstructionResult = {
  ok: boolean;
  label: string;
  response?: unknown;
  error?: string;
  durationMs: number;
  payload: Record<string, unknown>;
};

export async function dispatchResolveInstruction(
  instruction: ResolveInstruction,
): Promise<ResolveInstructionResult> {
  const startedAt = Date.now();

  try {
    const response = await rpc(instruction.payload);

    const durationMs = Date.now() - startedAt;

    console.log(response);

    if (response.ok === false) {
      const errorMessage =
        response.err ?? "Davinci Resolve reported a failure.";

      return {
        ok: false,
        label: instruction.label,
        error: errorMessage,
        response,
        durationMs,
        payload: instruction.payload,
      };
    }

    return {
      ok: true,
      label: instruction.label,
      response,
      durationMs,
      payload: instruction.payload,
    };
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const message =
      error instanceof Error
        ? error.message
        : "Davinci Resolve is unreachable. Ensure the integration bridge is running.";

    return {
      ok: false,
      label: instruction.label,
      error: message,
      durationMs,
      payload: instruction.payload,
    };
  }
}
