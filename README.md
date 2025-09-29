<div align="center">
  <img src="logo.png" alt="app.build logo" width="150">
</div>

# app.build (platform)

> **Note**: This version of app.build is currently paused. We've learned a lot from this experiment and are working on the next iteration. Check out our [blog posts](https://neon.com/blog/why-we-built-app-build) and [research paper](https://arxiv.org/abs/2509.03310) to learn more about what we built and the insights we gained.

**app.build** is an open-source AI agent for generating production-ready full-stack applications from a single prompt.

## What's in this repository

This platform repository contains the infrastructure that powers app.build:

- **CLI** - Command-line interface accessible via `npx @app.build/cli`
- **Control plane** - Backend platform managing communication between CLI and agent
- **Deployment pipeline** - Orchestrates application generation and deployment to live URLs

![Architecture of CLI->platform->agent](./readme-docs/architecture_diagram.png)

## Architecture

The platform acts as the orchestration layer between user interfaces and the code generation agent:

1. **CLI receives** user prompts and project requirements
2. **Control plane coordinates** with the agent for code generation
3. **Platform manages** database provisioning, testing, and deployment
4. **Applications deploy** to live URLs with full CI/CD

The actual code generation agent is available in the [agent repository](https://github.com/appdotbuild/agent).

## Source Code

The platform code is available in this repository, and the agent code is in the [agent repository](https://github.com/appdotbuild/agent). Feel free to explore, learn from, and build upon this work.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and contribution guidelines.

## Running locally

Local development instructions are available in [CONTRIBUTING.md](CONTRIBUTING.md).

---

Built to showcase agent-native infrastructure patterns. Fork it, remix it, use it as a reference for your own projects.
