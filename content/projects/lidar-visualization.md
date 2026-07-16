---
title: LIDAR Scan Visualization
slug: lidar-visualization
route: /projects/lidar-visualization
category: Systems and graphics
filters: [Visualization, Algorithms]
status: Completed university project
featured: false
summary: A C program that parses LIDAR point data, processes spatial angles, and renders the result as a point cloud using SDL3.
stack: [C, SDL3, File parsing, Manual memory management]
role: C developer
links: {source: null, live: null}
---
## Context

a low-level graphics project focused on parsing scan data and rendering spatial points.

## Problem

raw LIDAR measurements needed to be read, converted into usable coordinates, and visualized without relying on a high-level engine.

## What I built

- file parsing
- angle processing
- point conversion
- SDL3 rendering
- point-cloud display
- manual memory handling

## Technical notes

keeping the C code small and debuggable was more important than adding a long feature list.

## What I learned

graphics bugs become much easier to isolate when parsing, transformation, and rendering are separate steps.

## Next step

add camera controls, larger input support, and performance measurements.
