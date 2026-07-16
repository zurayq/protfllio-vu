---
title: MemoCore
slug: memocore
route: /projects/memocore
category: Backend and automation
filters: [Backend, Automation]
status: Prototype
featured: true
summary: A FastAPI backend for a WhatsApp-based assistant that stores tasks, calendar events, and reminders, then runs scheduled jobs automatically.
stack: [Python, FastAPI, SQLAlchemy, APScheduler]
role: Backend developer
links: {source: null, live: null}
---
## Context

a prototype for managing tasks, calendar events, and reminders through WhatsApp-style messages.

## Problem

reminders are easy to write down and surprisingly easy to forget. the project explored how conversational input could become structured tasks and scheduled jobs.

## What I built

- FastAPI backend
- SQLAlchemy database models
- task and calendar-event storage
- APScheduler reminder jobs
- service-layer organization
- API and database integration

## Technical notes

the important part was separating message input, stored data, and scheduled execution instead of treating the assistant as one giant request handler.

## What I learned

anything involving time becomes more complicated than it first appears. scheduling, persistence, retries, and clear data models matter more than the chat interface.

## Next step

add stronger validation, time-zone handling, and a cleaner interface for reviewing stored tasks and reminders.
