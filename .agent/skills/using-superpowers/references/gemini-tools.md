# Gemini CLI Tool Mapping

Gemini CLI uses different tool names than Claude Code. Use this mapping when executing skill instructions:

| Claude Code | Gemini CLI equivalents |
|-------------|-------------------------|
| `Edit`      | `multi_replace_file_content` (for multiple edits) or `replace_file_content` (single edit) |
| `Read`      | `view_file` |
| `Write`     | `write_to_file` |
| `Grep`      | `grep_search` |
| `Glob`      | `list_dir` |
| `Bash`      | `run_command` |
| `Skill`     | `activate_skill` (metadata loaded at start) |
| `Agent`     | `dispatch_subagent` |

Always use the most specific tool available for the task.
