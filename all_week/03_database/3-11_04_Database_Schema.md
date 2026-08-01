# 3-11 Database Design

## Entity Relationship Description

- `users` stores development users and their administrator, standard user, or guest role.
- `channels` stores social platforms connected to the content calendar.
- `posts` is the main calendar entity. Each post belongs to one channel and may have an assigned editor.
- `audit_logs` records post creation, updates, and archival actions.
- `channels (1) -> (many) posts`; `users (1) -> (many) posts` through `created_by`; `users (1) -> (many) audit_logs`.

## Tables

| Table | Purpose | Important fields |
| --- | --- | --- |
| `users` | Project user directory and roles | unique email, role, audit timestamps |
| `channels` | Social media channel configuration | platform, active state, timestamps |
| `posts` | Content, status workflow, assignee, and publish schedule | channel foreign key, status, scheduled time, timestamps |
| `audit_logs` | Record of changes to content | user, action, entity, entity id, timestamp |

The schema creates indexes for the publishing date, status, channel relationship, and audit entity lookup. Foreign keys prevent orphaned post and audit references. Seed records are fictional examples for local development only.

## Required Deliverables

- Entity relationship description: above.
- SQL schema: `3-11_schema.sql`.
- Seed data: `3-11_seed_data.sql`.
- Table explanations: above.
- Database run evidence: capture `docker compose ps` and database logs after starting the services using `3-11_05_Docker_Instructions.md`.
