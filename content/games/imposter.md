---
title: Imposter
slug: imposter
route: /game-lab/imposter
command: open ~/game-lab/imposter.save
status: In development
featured: true
platform: Mobile-first local party game
technology: Engine and final stack still being decided
last_updated: "2026"
summary: A multilingual phone-passing social-deduction game where everyone receives a secret word except one player. Players ask questions, defend themselves, and vote for whoever seems suspicious.
hero: "a multilingual phone-passing social-deduction game built around one very simple problem: everyone knows the word except the person trying to fake it."
stack: [Game systems, Multilingual content, Mobile interaction]
links: {source: null, live: null}
---
## Status

status: in development  
platform: mobile-first  
game type: local social deduction  
players: configurable  
languages: English, Arabic, Turkish

## Overview

players add their names and choose their preferred language. each player privately reveals a role and secret information on the same phone. most players receive the same word. one player receives the Imposter role and has to survive the discussion without knowing the word.

after the reveal phase, players ask questions, answer carefully, watch for suspicious behavior, and vote. the design goal is to keep setup fast, make secret information hard to reveal accidentally, and let people with different language preferences play together.

## Design direction

the current visual direction uses an old Arabic parchment-book feeling: warm antique paper, restrained interface controls, and a press-and-hold reveal where the page appears to lift or roll from the bottom.

## Current design principles

- one phone should be enough
- each player’s language choice should be respected
- private information should require deliberate input
- setup should not feel longer than the game
- the interface should feel playful without becoming visually noisy
- animations should communicate state, not delay the player
- the game should work in English, Arabic, and Turkish from the same content system

## Available / established direction

- phone-passing concept
- secret-word and Imposter role structure
- multilingual direction
- player-name setup
- parchment visual theme
- press-and-hold reveal concept

## In progress

- reveal interaction
- round flow
- role handoff safety
- question phase
- voting flow
- data structure for translated content
- mobile layout

## Planned

- per-player language preference
- configurable rounds
- question prompts
- suspicion hints
- game presets
- replay flow
- sound and haptics with user controls
- playtesting and balance changes

## What I am solving

most local party games assume everyone uses the same language and that passing a phone is automatically private. this project treats both of those as design problems rather than small settings.

## Current technical direction

the final implementation stack is still being decided. C# and game-engine workflows are part of the learning path, but the portfolio must not claim a final engine until the project actually uses one.

## Devlog — Entry 001: The concept · 2026

the first useful version is intentionally local. no accounts, matchmaking, or server infrastructure. the goal is to make the room interaction good before adding anything that makes the project look bigger.

## Devlog — Entry 002: Language per player · 2026

language should belong to the player, not the whole session. one player should be able to reveal the same game state in Arabic while the next uses Turkish or English.

## Devlog — Entry 003: The reveal problem · 2026

tapping once is too easy to do accidentally when the phone is moving between people. the current idea uses press and hold, with the parchment lifting only while the player keeps contact.

## Devlog — Entry 004: Making it feel physical · 2026

the reveal should have weight without becoming a five-second animation. the motion needs to be interruptible, responsive, and clear enough that players understand when information is hidden again.

## Next checkpoint

finish a complete setup-to-vote vertical slice before adding more game modes.
