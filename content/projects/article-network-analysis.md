---
title: Article Network Analysis Tool
slug: article-network-analysis
route: /projects/article-network-analysis
category: Desktop software and graph algorithms
filters: [Desktop, Algorithms]
status: Completed university project
featured: false
summary: A WPF desktop tool that turns article and author data into citation and collaboration graphs, then calculates H-index and betweenness centrality.
stack: [C#, .NET, WPF, Graph theory, JSON]
role: C# desktop developer
links: {source: null, live: null}
---
## Context

a university project for turning article and author data into networks that could be analyzed and displayed.

## Problem

citation and collaboration relationships are difficult to inspect directly from raw JSON data.

## What I built

- JSON parsing
- article and author graph structures
- citation relationships
- collaboration relationships
- H-index calculation
- betweenness-centrality calculation
- WPF interface for viewing analysis results

## Technical notes

graph construction and data consistency mattered before any metric could be trusted. the interface was kept simple so the network logic remained the focus.

## What I learned

graph algorithms become much easier to reason about when the data model is explicit and intermediate results can be inspected.

## Next step

improve network visualization, add larger-dataset testing, and separate algorithm benchmarking from the UI.
