import {
  FileCode2,
  TerminalSquare,
  Wand2,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type ResolveTool = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  requiresInput?: boolean;
  placeholder?: string;
  sample?: string;
  buildPayload: (input: string) => Record<string, unknown>;
};

export const RESOLVE_TOOLS: ResolveTool[] = [
  // {
  //   id: "run-lua-script",
  //   label: "Run Lua Script",
  //   description:
  //     "Executes inline Lua within the Resolve scripting environment.",
  //   icon: TerminalSquare,
  //   requiresInput: true,
  //   placeholder: '-- Lua script\nprint("Hello from Resolve")',
  //   sample:
  //     "-- Adjust gain on the selected clip\nclip = resolve:GetCurrentMediaItem()\nclip:GetColorPageGrade():SetGain(1.02, 1.0, 0.98)",
  //   buildPayload: (input: string) => ({
  //     op: "run_script",
  //     language: "lua",
  //     source: input,
  //   }),
  // },
  {
    id: "run-python-script",
    label: "Run Python Script",
    description: `Runs a Python snippet using the Resolve scripting API (Python 3).
      You can use 'resolve', 'fusion', and 'comp' in your script. Those are already defined for you.
      If you want to return a value, you must set a global variable named 'result' in your script.
    `,
    icon: FileCode2,
    requiresInput: true,
    placeholder:
      "# Python script\nprint('Resolve timeline:', resolve.GetProjectManager().GetCurrentProject().GetName())",
    sample:
      "# Normalize audio levels on selected clips\nproject = resolve.GetProjectManager().GetCurrentProject()\ntimeline = project.GetCurrentTimeline()\nfor clip in timeline.GetItemListInTrack('audio', 1):\n    clip.SetProperty('NormalizeAudioLevels', True)",
    buildPayload: (input: string) => {
      console.log(input);
      return {
        op: "run_script",
        language: "python",
        source: input,
      };
    },
  },
];
