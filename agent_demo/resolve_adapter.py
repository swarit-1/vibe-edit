"""
Placeholder for the future DaVinci Resolve adapter.
Right now, it just returns 'not implemented' so Executor can still run safely.
Later, we will implement these with Resolve’s scripting API (via Python ).
"""

def adjust_color_eq(*args, **kwargs):
    return {"code": -1, "log": "Resolve adapter not implemented"}

def add_keyframe_zoom(*args, **kwargs):
    return {"code": -1, "log": "Resolve adapter not implemented"}

def duck_music(*args, **kwargs):
    return {"code": -1, "log": "Resolve adapter not implemented"}

def export_preview(*args, **kwargs):
    return {"code": -1, "log": "Resolve adapter not implemented"}
