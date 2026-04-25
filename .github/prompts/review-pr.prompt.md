---
name: Review PR Risk-First
description: "Review a PR with risk-first findings (bugs, regressions, security, tests)."
argument-hint: "Qué PR/cambios revisar y el nivel de profundidad"
agent: "Reviewer Code"
---
Review the requested changes with a risk-first approach.

Requirements:
- Prioritize correctness bugs, regressions, and security risks.
- Include missing test coverage risks when behavior changed.
- Keep summary brief and focus on findings first.

Output:
1. Findings (ordered by severity with file references)
2. Open Questions
3. Risk Summary

If no issues are found, explicitly state that and mention residual risk or testing gaps.
