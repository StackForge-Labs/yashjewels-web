---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Why subagents:** You delegate tasks to specialized agents with isolated context.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration

## The Process
1. **Read plan**, extract tasks, create TodoWrite.
2. For each task:
    - **Dispatch implementer subagent** (./implementer-prompt.md).
    - **Implementer subagent implements**, tests, commits, self-reviews.
    - **Dispatch spec reviewer subagent** (./spec-reviewer-prompt.md).
    - **Implementer fixes spec gaps** if needed.
    - **Dispatch code quality reviewer subagent** (./code-quality-reviewer-prompt.md).
    - **Implementer fixes quality issues** if needed.
    - **Mark task complete**.
3. **Dispatch final code reviewer** for entire implementation.
4. Use **finishing-a-development-branch**.

## Prompt Templates
- [Implementer Prompt](./implementer-prompt.md)
- [Spec Reviewer Prompt](./spec-reviewer-prompt.md)
- [Code Quality Reviewer Prompt](./code-quality-reviewer-prompt.md)
