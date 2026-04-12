# Telegram Duplicate ID Error - Prevention Guide

## Problem
HTTP 400: Invalid request: tool call id write:X is duplicated

This happens when Telegram sends stale callback query IDs from old inline keyboard buttons.

## Root Cause
1. Telegram caches callback queries from inline buttons
2. When you click old buttons after a gateway restart, the IDs conflict
3. The gateway has already processed those IDs in a previous session

## Immediate Fix
1. **Don't click old inline buttons** from previous messages
2. **Send fresh text messages** instead
3. **Delete chat history** and start a new conversation if needed
4. **Restart gateway** if the error persists

## Prevention Strategies

### 1. Avoid Inline Buttons for Critical Work
Use text commands instead of inline keyboards:
- ✅ `/status` - Good
- ❌ [Status Button] - Risky (cached callbacks)

### 2. Use Web Chat for Development
The web chat (this interface) doesn't have callback ID issues:
- No inline button caching
- More reliable for file edits
- Better for long sessions

### 3. Telegram Best Practices
- Start fresh conversations after gateway restarts
- Don't scroll up and click old buttons
- Use text-based interactions when possible
- If you see the error, stop clicking buttons and type fresh commands

### 4. Session Management
- Prefer web chat for multi-step development work
- Use Telegram for quick checks and notifications only
- When switching from Telegram to web, acknowledge the context switch

## Recovery Checklist
If duplicate ID error occurs:
1. [ ] Stop clicking any inline buttons
2. [ ] Send a fresh text message (like "hello")
3. [ ] If still broken, delete Telegram chat and start new
4. [ ] If persists, restart OpenClaw gateway
5. [ ] Switch to web chat for critical work

## Recommendation
**For development work (code edits, file changes): Use Web Chat**
**For quick queries and notifications: Use Telegram**

This prevents callback ID conflicts during complex multi-step operations.
