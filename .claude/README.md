# Claude Code Configuration

This directory contains Claude Code configuration files for the StellarIX UI project.

## Files

### `settings.json`
Main Claude Code configuration file with:
- **Permissions**: Allowed bash commands and MCP tools
- **Environment**: Basic environment variables

This file is checked into version control and shared with the team.

### Development Guidelines

Development rules and patterns are organized in context-specific CLAUDE.md files:

- **Core Architecture**: `packages/core/CLAUDE.md`
- **Framework Adapters**: `packages/adapters/CLAUDE.md` 
- **Primitive Components**: `packages/primitives/CLAUDE.md`
- **Project Overview**: `CLAUDE.md` (root)

## Notes

- `settings.local.json` files are ignored by git for personal preferences
- This configuration follows official Claude Code settings specifications
- Development patterns are kept in documentation files, not settings files