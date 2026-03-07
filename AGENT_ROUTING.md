# Agent Routing Strategy

## Active Agents

| Agent | Purpose | Model |
|-------|---------|-------|
| `main` | Default agent, general tasks, orchestration | moonshot/kimi-k2.5 |
| `are-app-eng` | Application Engineering | ollama/qwen3.5 |
| `are-rob-rd` | Robotics R&D | ollama/qwen3.5 |
| `are-enr-rd` | Energy R&D | ollama/qwen3.5 |
| `are-fin-ops` | Finance Operations | ollama/qwen3.5 |

## Workflow

1. **You message me (main agent)**
2. **I analyze the task** and determine which agent is best suited
3. **If an existing agent fits:** I delegate to that agent
4. **If no agent fits:** I propose a new agent definition for your approval
5. **You approve:** I create and spawn the new agent
6. **You decline:** I handle the task myself or suggest alternatives

## Agent Responsibilities

### are-app-eng (ARE-APP-ENG)
- Software development
- App architecture
- Code reviews
- CI/CD pipelines
- GitHub operations

### are-rob-rd (ARE-ROB-RD)
- Robotics hardware
- Firmware development
- Sensor integration
- Motion control
- ROS/robotics frameworks

### are-enr-rd (ARE-ENR-RD)
- Energy systems
- Power electronics
- Battery technology
- Renewable energy
- Grid integration

### are-fin-ops (ARE-FIN-OPS)
- Financial analysis
- Budgeting
- Reporting
- Compliance
- Investment research

## New Agent Proposal Template

When a new agent is needed, I'll propose:

```
**New Agent Proposal**
- Name: [suggested-agent-name]
- Purpose: [what it will handle]
- Model: [recommended model]
- Workspace: [workspace location]
- Reason: [why it's needed]
```

**Reply "approve" to create, or suggest changes.**
