---
title: CV Bro
slug: cv-bro
route: /projects/cv-bro
category: Automation and product tooling
filters: [Automation, Backend]
status: MVP
featured: true
summary: A company-research and internship-outreach tool that checks criteria, avoids duplicate contacts, explains skipped companies, and prepares emails for review.
stack: [Next.js, TypeScript, Supabase, Gmail workflow, AI APIs]
role: Designer and developer
links: {source: null, live: null}
---
## Context

internship outreach became repetitive enough that building a tool started to feel more reasonable than continuing to do everything manually.

## Problem

finding companies was only one part of the work. i also needed to check whether each company matched my criteria, avoid contacting the same place twice, verify that the company was real enough to approach, and prepare messages without losing the human review step.

## What I built

- Supabase-backed company and contacted-company records
- company-research workflow
- skip logs explaining why a company was rejected
- LinkedIn and website checks
- broken-domain filtering
- Gmail draft preparation
- master-detail review workflow
- exclusion handling to avoid duplicate outreach

## Technical notes

the goal was not to create a fully autonomous spam tool. the useful version keeps a review step, makes skipped decisions visible, and treats the contacted-company list as the source of truth.

## What I learned

automation becomes much more trustworthy when it explains what it skipped and why. a fast system that silently makes bad decisions is mostly just a faster way to create a mess.

## Next step

simplify the review workflow, improve source verification, and make the company criteria easier to configure without touching code.
