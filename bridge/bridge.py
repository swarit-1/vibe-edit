import sys, io, contextlib, traceback, time


import json, socket
import fusionscript as bmd  # Fusion/alt builds


HOST, PORT = "127.0.0.1", 8765


def handle(cmd):
    op = cmd.get("op")

    if op == "run_script" and cmd.get("language", "").lower() == "python":
        src = cmd.get("source", "")

        ns = {
            **globals(),
            "result": None,
        }
        exec(src, ns)
        return {"ok": True, "result": ns["result"]}

    if op == "ping":
        return {"ok": True, "page": resolve.GetCurrentPage() if resolve else None}

    # ops below require an open Fusion comp
    if not comp:
        return {"ok": False, "err": "no_fusion_comp_open"}

    if op == "list_tools":
        out = []
        tl = comp.GetToolList(False) or {}
        for t in tl.values():
            a = t.GetAttrs() or {}
            out.append({"id": t.ID, "name": t.Name, "cls": a.get("TOOLS_RegID")})
        return {"ok": True, "tools": out}

    if op == "create_tool":
        cls = cmd["cls"]
        x = cmd.get("x", 0.5)
        y = cmd.get("y", 0.5)
        comp.StartUndo("CreateTool")
        try:
            tool = comp.AddTool(cls, x, y)
            return {"ok": True, "id": tool.ID, "name": tool.Name}
        finally:
            comp.EndUndo(True)

    if op == "set_input":
        t = comp.FindTool(cmd["tool"])
        if not t:
            return {"ok": False, "err": "tool_not_found"}
        t.SetInput(cmd["input"], cmd["value"], cmd.get("time"))
        return {"ok": True}

    if op == "get_inputs":
        t = comp.FindTool(cmd["tool"])
        if not t:
            return {"ok": False, "err": "tool_not_found"}
        ct = comp.CurrentTime
        vals = {}
        for name, inp in (t.GetInputList() or {}).items():
            try:
                vals[name] = inp[ct]
            except Exception:
                pass
        return {"ok": True, "inputs": vals}

    if op == "connect":
        src = comp.FindTool(cmd["src"])
        dst = comp.FindTool(cmd["dst"])
        if not src or not dst:
            return {"ok": False, "err": "tool_not_found"}
        comp.StartUndo("Connect")
        try:
            dst.Input.ConnectTo(
                src.Output
            )  # main pipe; extend for named inputs as needed
            return {"ok": True}
        finally:
            comp.EndUndo(True)

    return {"ok": False, "err": "unknown_op"}


# Blocking server keeps the script alive (no UI needed)
print(f"[bridge] listening on {HOST}:{PORT}")
s = socket.socket()
s.bind((HOST, PORT))
s.listen(1)
while True:
    conn, _ = s.accept()
    print("[bridge] connection accepted")
    f = conn.makefile("rwb")
    try:
        for line in f:
            if not line:
                break
            try:
                res = handle(json.loads(line.decode("utf-8")))
            except Exception as e:
                res = {"ok": False, "err": type(e).__name__, "detail": str(e)}
            f.write((json.dumps(res) + "\n").encode("utf-8"))
            f.flush()
    finally:
        conn.close()
