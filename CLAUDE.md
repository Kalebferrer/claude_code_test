# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Games

Open either HTML file directly in a browser — no build step, server, or dependencies required:

```
open tictactoe.html
open snake.html
```

## Architecture

This repo contains two self-contained, single-file browser games. Each file bundles HTML, CSS, and JavaScript with no external dependencies (Snake loads a Google Font for aesthetics only).

**tictactoe.html** — 2-player local game on a 3×3 grid. State is held in plain JS variables (`board`, `current`, `gameOver`, `scores`). Win detection uses a hardcoded `WINS` combo array. Scores persist across rounds within the same page session (reset on page reload).

**snake.html** — Classic snake on a 20×20 canvas grid. Game loop runs via `setInterval` with a `tick` value that decreases every 5 food items (speeds up). State machine has three states: `idle`, `playing`, `dead`. High score persists via `localStorage` (`snake_hi` key). Input handling queues direction changes in `nextDir` to avoid 180° reversals.

Both games share a dark color palette (`#1a1a2e` background, `#e94560` accent, `#a8dadc` secondary).

## Git Workflow

Commit and push to `github.com/Kalebferrer/claude_code_test` (main) after every meaningful unit of work. Use concise, descriptive commit messages. Never let significant progress sit uncommitted.
