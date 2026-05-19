# HivePulse CRM — API Reference

Base URL: `http://localhost:4000/api`

All JSON responses follow:

```json
{ "success": true, "data": { } }
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": { "email": ["Enter a valid email address."] }
  }
}
```

Protected routes require header: `Authorization: Bearer <token>`

---

## Auth

### POST `/auth/register`

```json
{
  "name": "Jordan Lee",
  "email": "jordan@company.com",
  "password": "securepass123",
  "role": "sales"
}
```

`role` is optional (`admin` | `sales`, default `sales`).

**201** — `{ accessToken, user }`

### POST `/auth/login`

```json
{
  "email": "sales@hivepulse.io",
  "password": "Sales123!"
}
```

**200** — `{ accessToken, user }`

### GET `/auth/me`

**200** — current user profile

---

## Leads

### GET `/leads`

| Param    | Type   | Description                          |
| -------- | ------ | ------------------------------------ |
| `page`   | number | Page number (default 1)              |
| `limit`  | number | Page size (default 10, max 50)       |
| `status` | enum   | New, Contacted, Qualified, Lost      |
| `source` | enum   | Website, Instagram, Referral         |
| `search` | string | Case-insensitive name or email match |
| `sort`   | string | `latest` (default) or `oldest`       |

**200**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Maya Chen",
      "email": "maya@northwind.io",
      "status": "New",
      "source": "Website",
      "createdAt": "2026-05-20T10:00:00.000Z",
      "updatedAt": "2026-05-20T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### GET `/leads/export`

Same query params as list (no pagination). Returns `text/csv` attachment.

### GET `/leads/:id`

**200** — single lead object in `data`

### POST `/leads`

```json
{
  "name": "Maya Chen",
  "email": "maya@northwind.io",
  "status": "New",
  "source": "Website"
}
```

**201** — created lead

### PATCH `/leads/:id`

Partial update; any subset of `name`, `email`, `status`, `source`.

### DELETE `/leads/:id`

**Admin only.** **200** — `{ id }`

---

## Status codes

| Code | Usage                          |
| ---- | ------------------------------ |
| 200  | Success                        |
| 201  | Created                        |
| 400  | Validation / bad request       |
| 401  | Missing or invalid token       |
| 403  | Insufficient role              |
| 404  | Resource not found             |
| 409  | Conflict (e.g. email exists)   |
| 500  | Server error                   |
