# Implementation Plan: Superpowers Integration

This plan outlines the steps to integrate the [obra/superpowers](https://github.com/obra/superpowers) framework into your current Next.js project, which already utilizes the **Antigravity Kit**.

## Goals
- Add core Superpowers discipline skills (e.g., `using-superpowers`, `using-git-worktrees`).
- Align agent behavior with Jesse Vincent's "Superpowers" methodology (Strict TDD, Socratic brainstorming).
- Maintain the advanced specialist capabilities of the existing Antigravity Kit.

## Proposed Changes

### 1. Skill Integration
We will download and add the following skills to `.agent/skills/`:
- `using-superpowers`: The master discipline skill.
- `using-git-worktrees`: For isolated development environments.
- `writing-skills`: Guidelines for creating new agent capabilities.
- `finishing-a-development-branch`: Workflow for merging and cleanup.

### 2. Configuration Updates
- Update `.agent/rules/global.md` (or equivalent) to include the "Superpowers Rule": *Check for skills before any action.*
- Ensure `GEMINI.md` references the new Superpowers entry point.

### 3. Workflow Alignment
- Verify that `/brainstorm` and `/plan` commands follow the Superpowers spec exactly.

## Verification Plan
- Run `/status` to check the updated skill list.
- Initiate a small task to trigger the `using-superpowers` flow.

> [!IMPORTANT]
> This integration will enhance your existing setup without removing the specialized Antigravity skills for Next.js, Security, and UI/UX.

## Questions for the User
1. Do you want me to **replace** any existing Antigravity skills that might overlap with Superpowers (e.g., replacing Antigravity's `brainstorming` with the original `superpowers/brainstorming`)?
2. Are you using a specific CLI (like `claude-code` or `gemini`) where you need the plugin metadata files (`gemini-extension.json`, etc.)?
