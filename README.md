# Relay Ops Mobile

An incident-command workspace for engineering teams, built with React Native and Expo. Relay Ops condenses service health, on-call context, active incidents, and an auditable event timeline into a fast operational surface.

## What it demonstrates

- Severity filtering and immutable incident-state transitions
- Responsive operations dashboard for phone, tablet, and web
- Live-style SLO, latency, error-rate, and service-health visualization
- Incident acknowledgement and resolution workflows
- Accessible, dependency-light UI composed from React Native primitives

## Run locally

```bash
pnpm install
pnpm start
```

Use `pnpm typecheck` for strict TypeScript validation. Press `a`, `i`, or `w` in Expo for Android, iOS, or web.

## Architecture direction

The current repository is a deterministic, fully interactive portfolio demo. A production build would connect the domain layer to WebSocket event streams, persist an offline command queue, add authenticated deep links from push notifications, and integrate typed adapters for observability providers. Incident mutations are already expressed as immutable state transitions so that moving to a server-authoritative cache is straightforward.

## Stack

React Native · Expo · React 19 · TypeScript · React Native Web

## License

MIT
