```md
# 🏗️ System Architecture – Fullstack Shopee Clone

This document describes the **architecture design, technical decisions, and data flow**
of the Fullstack Shopee Clone project.

---

## 🧠 High-Level Overview

┌─────────────┐ REST API ┌──────────────┐
│ Frontend │ ───────────────────▶ │ Backend │
│ (React) │ │ (Spring Boot)│
│ │ ◀─────────────────── │ │
│ │ WebSocket │ │
└──────┬──────┘ └──────┬───────┘
│ │
▼ ▼
Redux Toolkit MySQL Database
(RTK Query)

yaml
 

---

## 🎯 Architectural Goals

- Scalability
- Maintainability
- Realtime capability
- Clean separation of concerns
- Production-ready patterns

---

## 🖥️ Frontend Architecture

### State Management
- **RTK Query**: server state (products, chat, orders)
- **Redux slices**: auth & UI state
- **Local state**: forms & inputs
- **Custom hooks**: WebSocket lifecycle

### Why RTK Query?
- Built-in caching
- Cache updates via `updateQueryData`
- Optimistic UI support
- Reduced boilerplate

---

## 💬 Realtime Chat Architecture

### Communication Strategy
- REST API → Load chat history
- WebSocket → Realtime messages
- Optimistic UI → Instant sender feedback

### Message Flow
Sender sends message
│
Optimistic update (UI)
│
Backend persists message
│
WebSocket push to receiver

yaml
 

Sender does NOT rely on WebSocket echo.

---

## 🔐 Authentication & Security

- JWT-based authentication
- Same token used for REST & WebSocket
- Role-based access control:
  - USER
  - SHOP
  - ADMIN

---

## 🗄️ Backend Architecture

Layered structure:
Controller
↓
Service
↓
Repository
↓
Database

python
 

Responsibilities:
- Controller → API contracts
- Service → Business logic
- Repository → Data access
- Projection → Performance optimization

---

## ⚡ JPA Projection Usage

### Problem
When **Shop sends a message**, WebSocket requires the **User ID**, not Shop ID.

### Solution
Use JPA Projection to fetch owner user ID directly:

```java
public interface ShopOwnerIdProjection {
    Long getOwnerId();
}

@Query("""
    select s.owner.id as ownerId
    from Shop s
    where s.id = :shopId
""")
ShopOwnerIdProjection findOwnerIdByShopId(Long shopId);
Benefits
No entity loading

No N+1 queries

Faster execution

💳 Payment Architecture (VNPAY)
Flow
Generate payment URL

Redirect user to VNPAY

VNPAY callback to backend

Verify secure hash

Update order status

Security
Server-side verification only

No client-side trust

Idempotent callback handling

📈 Scalability Considerations
Stateless backend

JWT authentication

WebSocket user-based routing

Easily extendable with Redis or message broker