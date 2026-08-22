## Naming and serialization

AHCoF uses different naming conventions at different system boundaries.

- Database columns use `snake_case`.
- SQLAlchemy model attributes use `snake_case`.
- Backend Python code uses `snake_case`.
- Public JSON request fields use `camelCase`.
- Public JSON response fields use `camelCase`.
- Frontend TypeScript properties use `camelCase`.

Pydantic alias generation converts between backend `snake_case` and public
API `camelCase`.

For example:

| Backend field | API field |
|---|---|
| `first_name` | `firstName` |
| `membership_type` | `membershipType` |
| `email_address` | `emailAddress` |
| `phone_number` | `phoneNumber` |
| `church_branch` | `churchBranch` |
| `is_active` | `isActive` |
| `membership_id` | `membershipId` |
| `is_demo` | `isDemo` |
| `created_at` | `createdAt` |
| `updated_at` | `updatedAt` |
| `gps_address` | `gpsAddress` |

Backend code should use Python field names:

```python
member.membership_id
member.first_name
member.is_active
```

Frontend code should use API field names:

```typescript
member.membershipId
member.firstName
member.isActive
```

Routes must return declared Pydantic response models. Routes must not manually
rename fields. Serialization and deserialization are handled by the shared
Pydantic API model configuration.