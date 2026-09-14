# Server Action Contracts

This document outlines the TypeScript interfaces for the Server Actions used in the CRM Dashboard template. All actions follow a standard `ActionState` return pattern for consistent error handling and progressive enhancement.

## Common Types

```typescript
export type ActionState<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};
```

## Authentication Actions

```typescript
export async function authenticate(
  prevState: ActionState<void>,
  formData: FormData
): Promise<ActionState<void>>

export async function register(
  prevState: ActionState<void>,
  formData: FormData
): Promise<ActionState<void>>

export async function logOut(): Promise<void>
```

## Contact Actions

```typescript
export async function createContact(
  prevState: ActionState<Contact>,
  formData: FormData
): Promise<ActionState<Contact>>

export async function updateContact(
  id: string,
  prevState: ActionState<Contact>,
  formData: FormData
): Promise<ActionState<Contact>>

export async function deleteContact(
  id: string
): Promise<ActionState<void>>
```

## Company Actions

```typescript
export async function createCompany(
  prevState: ActionState<Company>,
  formData: FormData
): Promise<ActionState<Company>>

export async function updateCompany(
  id: string,
  prevState: ActionState<Company>,
  formData: FormData
): Promise<ActionState<Company>>

export async function deleteCompany(
  id: string
): Promise<ActionState<void>>
```

## Deal Actions

```typescript
export async function createDeal(
  prevState: ActionState<Deal>,
  formData: FormData
): Promise<ActionState<Deal>>

export async function updateDeal(
  id: string,
  prevState: ActionState<Deal>,
  formData: FormData
): Promise<ActionState<Deal>>

export async function updateDealStage(
  id: string,
  stage: DealStage
): Promise<ActionState<Deal>>

export async function deleteDeal(
  id: string
): Promise<ActionState<void>>
```
