import net from "net";

export const runtime = "nodejs";

type RPCResponse<T = unknown> = {
  ok: boolean;
} & (
  | {
      ok: false;
      err: string;
    }
  | {
      ok: true;
    }
) &
  Record<string, T>;

export const rpc = <T = unknown>(
  payload: Record<string, unknown>,
): Promise<RPCResponse<T>> =>
  new Promise((resolve, reject) => {
    const sock = net.createConnection({ host: "127.0.0.1", port: 8765 });
    let buf = "";

    sock.on("connect", () => {
      sock.write(JSON.stringify(payload) + "\n");
    });

    sock.on("data", (chunk) => {
      buf += chunk.toString("utf8");
      let newline: number;
      // process complete lines in case Resolve sends more than one
      while ((newline = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, newline).trim();
        buf = buf.slice(newline + 1);
        if (!line) continue;
        try {
          const json = JSON.parse(line);
          resolve(json);
        } catch (e) {
          reject(e);
        } finally {
          sock.end();
        }
      }
    });

    sock.on("error", reject);
    sock.on("end", () => {
      if (buf.length === 0) return;
      try {
        resolve(JSON.parse(buf.trim()));
      } catch (e) {
        reject(e);
      }
    });
  });
