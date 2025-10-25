"""
Defines the core data structures shared between all modules.
Think of this as the 'contract' between the planner, executor, and verifier.
No external libraries — just clean dataclasses.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional


# Represents one editing step

@dataclass
class Step:
    action: str                   # name of the operation (e.g., "add_keyframe_zoom")
    params: Dict[str, Any]        # input parameters for that action
    explain: Optional[str] = None # human-readable reasoning (used for UI or logs)
    verify: List[str] = field(default_factory=list)  # optional list of checks


# Represents a sequence of steps = the full plan
@dataclass
class Plan:
    steps: List[Step]


# Describes user intent and context

@dataclass
class TaskSpec:
    goal: str                      # what the user wants (in plain language)
    targets: Dict[str, Any]        # info like input file, segment, etc.
    constraints: Dict[str, Any] = field(default_factory=dict)
    prefs: Dict[str, Any] = field(default_factory=dict)


# Result object after each action
@dataclass
class ExecResult:
    step_id: str
    status: str                    # "ok" or "error"
    outputs: Dict[str, Any]        # anything the adapter returns (logs, file path)
    error: Optional[str] = None
