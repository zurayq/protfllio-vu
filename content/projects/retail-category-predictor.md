---
title: Retail Sales Category Predictor
slug: retail-category-predictor
route: /projects/retail-category-predictor
category: Machine-learning fundamentals
filters: [Desktop, Algorithms]
status: Completed university project
featured: false
summary: A Java desktop app that reads retail data from Excel, predicts product categories using KNN and Decision Tree implementations, and compares results in the interface.
stack: [Java, Swing, Apache POI, KNN, Decision Tree]
role: Java developer
links: {source: null, live: null}
---
## Context

a university desktop application comparing basic classification approaches on retail data.

## Problem

the project needed to read structured sales data, prepare features, run predictions, and show the results clearly.

## What I built

- Excel data import with Apache POI
- data preparation and encoding
- KNN implementation
- Decision Tree implementation
- accuracy comparison
- timing comparison
- confusion-matrix display
- Swing user interface

## Technical notes

the algorithms were implemented for learning rather than hidden behind a high-level machine-learning library.

## What I learned

model output is not useful by itself. data preparation, evaluation, timing, and a readable comparison matter just as much as the prediction.

## Next step

improve validation, support more datasets, and separate the algorithm layer from the Swing interface.
