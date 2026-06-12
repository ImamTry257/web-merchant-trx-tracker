# Merchant Status Tracker - Frontend Planning

## Overview

Merchant Status Tracker merupakan halaman yang digunakan merchant untuk memantau status transaksi secara realtime.

Frontend akan mengonsumsi API:

```http
GET /api/v1/merchant/transactions
```

dengan mekanisme keamanan:

* Bearer Token
* X-TIMESTAMP
* X-SIGNATURE

---

# Technology Stack

## Frontend

* React.js
* TypeScript
* Axios
* Tailwind CSS
* DayJS

---

# Features

## Transaction Search

Merchant dapat melakukan pencarian transaksi berdasarkan:

* Merchant ID
* Status
* Transaction Date Range
* Reference Number
* Partner Reference Number

---

## Transaction List

Menampilkan daftar transaksi dalam bentuk table.

Field yang ditampilkan:

| Column               | Description                           |
| -------------------- | ------------------------------------- |
| Merchant ID          | Merchant identifier                   |
| Partner Reference No | Reference number dari merchant        |
| Reference Number     | Reference number dari Payment Gateway |
| Amount               | Nominal transaksi                     |
| Status               | Status transaksi                      |
| Transaction Date     | Tanggal transaksi dibuat              |
| Paid Date            | Tanggal pembayaran berhasil           |

---

## Real-Time Refresh

Data transaksi akan diperbarui secara otomatis setiap:

```text
5 Seconds
```

Menggunakan polling:

```javascript
setInterval(() => {
  fetchTransactions();
}, 5000);
```

---

## Loading State

Saat request sedang berjalan:

```text
Loading Transactions...
```

atau menggunakan spinner.

Contoh:

```text
+-------------------------+
| Loading Transactions... |
+-------------------------+
```

---

## Empty State

Jika belum ada data transaksi:

```text
No Transaction Found
```

Contoh:

```text
+----------------------+
| No Transaction Found |
+----------------------+
```

---

## Error State

Jika request gagal:

### Unauthorized

```text
Unauthorized Access
```

### Invalid Signature

```text
Invalid Signature
```

### Invalid Timestamp

```text
Invalid Timestamp
```

### Transaction Not Found

```text
Transaction Not Found
```

### Internal Server Error

```text
Internal Server Error
```

---

# Page Layout

## Filter Section

```text
+----------------------------------------------------------+
| Merchant Status Tracker                                  |
+----------------------------------------------------------+

Merchant ID
[________________________]

Status
[ SUCCESS ▼ ]

Transaction Date
[ Start Date ] [ End Date ]

Search
[ Reference Number / Partner Reference Number ]

[ Search ] [ Reset ]
```

---

## Result Section

```text
+----------------------------------------------------------------------------------------------+
| Merchant ID | Partner Ref No | Ref No | Amount | Status | Transaction Date | Paid Date |
+----------------------------------------------------------------------------------------------+
| EP27842182  | MRC-001        | PG001  | 100000 | SUCCESS| 2026-06-11       | 2026-06-11|
| EP27842182  | MRC-002        | PG002  | 150000 | PENDING| 2026-06-11       | -         |
+----------------------------------------------------------------------------------------------+
```

---

# Status Badge

Status akan ditampilkan menggunakan badge.

| Status  | Display       |
| ------- | ------------- |
| SUCCESS | Success Badge |
| PENDING | Pending Badge |
| EXPIRED | Expired Badge |

Contoh:

```text
[SUCCESS]
[PENDING]
[EXPIRED]
```

---

# Pagination

Frontend menggunakan pagination berdasarkan metadata dari API.

Response:

```json
{
  "meta": {
    "page": 1,
    "size": 5,
    "total": 15,
    "totalPages": 3,
    "nextPage": true,
    "previousPage": false
  }
}
```

Pagination UI:

```text
< Previous | Page 1 of 3 | Next >
```

---

# API Integration

## Request Headers

```http
Authorization: Bearer merchant-demo-token
Content-Type: application/json
X-TIMESTAMP: 2026-06-12T10:00:00+07:00
X-SIGNATURE: generated-signature
```

---

## Generate Timestamp

Frontend akan membuat timestamp sebelum request dikirim.

Contoh:

```text
2026-06-12T10:00:00+07:00
```

---

## Generate Signature

Format:

```text
StringToSign =
HTTP_METHOD + ":" + REQUEST_URI_WITH_QUERY + ":" + TIMESTAMP
```

Contoh:

```text
GET:/api/v1/merchant/transactions?page=1&size=5&merchantId=EP27842182:2026-06-12T10:00:00+07:00
```

Generate:

```text
Signature =
Base64(
    HMAC_SHA256(
        StringToSign,
        SecretKey
    )
)
```

---

# Folder Structure

```text
src/
│
├── pages/
│   └── MerchantStatusTracker/
│       ├── index.tsx
│       └── MerchantStatusTrackerPage.tsx
│
├── components/
│   ├── TransactionTable.tsx
│   ├── TransactionFilter.tsx
│   ├── Pagination.tsx
│   ├── LoadingState.tsx
│   ├── EmptyState.tsx
│   └── ErrorState.tsx
│
├── services/
│   └── transaction.service.ts
│
├── utils/
│   ├── timestamp.ts
│   └── signature.ts
│
├── hooks/
│   └── useTransactions.ts
│
└── types/
    └── transaction.ts
```

---

# Application Flow

```text
Merchant Open Page
        |
        v
Load Transaction List
        |
        v
Generate Timestamp
        |
        v
Generate Signature
        |
        v
Call Transaction API
        |
        v
Receive Response
        |
        +--> Success
        |       |
        |       +--> Render Table
        |
        +--> Empty
        |       |
        |       +--> Show Empty State
        |
        +--> Error
                |
                +--> Show Error State

        |
        v
Auto Refresh Every 5 Seconds
```

---

# Assumptions

* Authentication menggunakan dummy bearer token.
* Signature menggunakan dummy secret key untuk kebutuhan technical test.
* API backend telah menyediakan pagination dan filtering.
* Realtime update menggunakan polling setiap 5 detik.
* Tampilan responsive untuk desktop dan mobile.
* Tidak menggunakan WebSocket atau SSE karena polling sudah mencukupi untuk kebutuhan technical test.

