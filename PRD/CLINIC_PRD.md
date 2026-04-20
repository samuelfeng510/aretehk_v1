# Aesthetic Clinic System - Production V1 Architecture & Scope

## 1. System Objectives
This document outlines the Production V1 requirements for an aesthetic clinic management system. The application must be a highly stable, secure, and iPad-optimized Next.js web app deployed via Google Firebase (Hosting, Firestore, Cloud Storage). 

The focus of this build is operational reliability, clean architecture, and strict data validation. External scheduling (Google Calendar) is maintained, and complex product/package deduction logic is deferred to V2.

## 2. Operational Workflow Flowchart
```mermaid
graph TD
    %% Define Roles
    classDef nurse fill:#f9f871,stroke:#333,stroke-width:1px;
    classDef doctor fill:#ffc75f,stroke:#333,stroke-width:1px;

    %% Pre-opening & Prep
    A[Check External Google Calendar]:::nurse --> B[Pull Patient Records via System]:::nurse
    B --> C[Doctor reviews clinical history & dosages]:::doctor

    %% Patient Journey
    E{Patient Arrives}:::nurse
    E -- New Patient --> F[Fill Validated Digital Intake Form on iPad]:::nurse
    E -- Returning Patient --> G[Direct to Treatment Room]:::nurse
    F --> H[Doctor Consultation]:::doctor
    H --> G

    %% Treatment Phase
    G --> I[Take Photos & Upload Securely to Firebase Storage]:::doctor
    I --> J[Execute Treatment]:::doctor
    J --> K{Compare Before/After?}:::doctor
    K -- Yes --> L[Open Dedicated Slider: Select ANY Date A vs Date B]:::doctor
    K -- No --> M[Conclude Treatment]:::doctor
    L --> M

    %% Checkout & Audit
    M --> N[Nurse manually inputs Credit Deduction]:::nurse
    N --> P[Patient E-Signature Canvas]:::nurse
    P --> Q[Generate Immutable Transaction Record & Update Ledger]:::nurse