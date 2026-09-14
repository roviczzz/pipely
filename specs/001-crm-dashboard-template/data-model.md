# Data Model: CRM Dashboard Template

## Entities

### User
Represents an authenticated person using the CRM.
- **id**: String (CUID/UUID) [Primary Key]
- **email**: String [Unique, Required]
- **passwordHash**: String [Required]
- **displayName**: String [Optional]
- **createdAt**: DateTime [Default: now()]
- **updatedAt**: DateTime [Updated automatically]

### Contact
Represents an individual person in the CRM.
- **id**: String (CUID/UUID) [Primary Key]
- **firstName**: String [Required]
- **lastName**: String [Required]
- **email**: String [Unique, Required]
- **phone**: String [Optional]
- **status**: Enum (LEAD, ACTIVE, INACTIVE) [Default: LEAD]
- **companyId**: String [Optional, Foreign Key to Company]
- **createdAt**: DateTime [Default: now()]
- **updatedAt**: DateTime [Updated automatically]

### Company
Represents an organization.
- **id**: String (CUID/UUID) [Primary Key]
- **name**: String [Required]
- **industry**: String [Optional]
- **website**: String [Optional]
- **size**: Enum (SIZE_1_10, SIZE_11_50, SIZE_51_200, SIZE_200_PLUS) [Optional]
- **createdAt**: DateTime [Default: now()]
- **updatedAt**: DateTime [Updated automatically]
- **contacts**: Relationship (One-to-Many with Contact)
- **deals**: Relationship (One-to-Many with Deal)

### Deal
Represents a sales opportunity.
- **id**: String (CUID/UUID) [Primary Key]
- **title**: String [Required]
- **value**: Float [Required, minimum 0]
- **currency**: String [Default: "USD"]
- **stage**: Enum (PROSPECT, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST) [Default: PROSPECT]
- **expectedCloseDate**: DateTime [Optional]
- **contactId**: String [Optional, Foreign Key to Contact]
- **companyId**: String [Optional, Foreign Key to Company]
- **createdAt**: DateTime [Default: now()]
- **updatedAt**: DateTime [Updated automatically]

## Relationships

1. **Company to Contact**: One-to-Many. A Company can have many Contacts. A Contact can belong to zero or one Company. If a Company is deleted, the `companyId` on associated Contacts is set to null (SetNull).
2. **Contact to Deal**: One-to-Many. A Contact can be associated with many Deals. A Deal can have zero or one associated Contact. (SetNull on delete)
3. **Company to Deal**: One-to-Many. A Company can be associated with many Deals. A Deal can have zero or one associated Company. (SetNull on delete)

## Validation Rules

- **User**: `email` must be a valid email format. Password must meet length requirements (e.g., minimum 8 chars) during registration.
- **Contact**: `firstName`, `lastName`, and `email` are required.
- **Company**: `name` is required.
- **Deal**: `title` and `value` are required. `value` must be >= 0.

## State Transitions
- **Deal Stage**: Can transition freely between PROSPECT, PROPOSAL, NEGOTIATION, CLOSED_WON, and CLOSED_LOST via explicit user action (select dropdown).
