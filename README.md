# 💸 BillSplitter — Split Bills, Not Friendships

A full-stack bill splitting web application built with **Java Spring Boot** (backend) and **React.js** (frontend). Split expenses with friends, track balances, and settle up with a UPI-style payment simulation.

---

## 🚀 Live Demo

- **Frontend:** [billsplitter.netlify.app](https://billsplitter.netlify.app)
- **Backend API:** [billsplitter-api.onrender.com](https://billsplitter-api.onrender.com)

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 21 | Core language |
| Spring Boot 3.x | Backend framework |
| Spring Security | Authentication & authorization |
| JWT (jjwt) | Token-based auth |
| Spring Data JPA | Database ORM |
| MySQL 8 | Database |
| Hibernate | Query management |
| Gradle | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| React Toastify | Notifications |
| CSS Variables | Dark/Light theming |

---

## ✨ Features

### 🔐 Authentication
- User registration with BCrypt password encryption
- JWT-based login with token stored in localStorage
- Duplicate email prevention
- Protected routes

### 👥 Groups
- Create groups (Goa Trip, Roommates, etc.)
- Add members by email
- Budget limit per group
- Budget increase request system (approve/reject)

### 💸 Expenses
- Add expenses with title, amount, category, split type
- Categories: Food, Travel, Rent, Shopping, Entertainment, Other
- Split types: Equal, Percentage, Exact
- Delete expenses (only by creator)

### ⚖️ Balance Calculation
- Real-time balance tracking per group
- See who owes whom and how much
- Settle up individual splits

### 💳 UPI Payment Simulation
- Each user gets a wallet (₹1000 starting balance)
- Set custom UPI ID (e.g. `rakshit@billsplitter`)
- Send payments to other users via UPI ID
- Transaction reference number (like GPay)
- Full transaction history

### 📋 Activity Feed
- Real-time activity log per group
- Tracks: expense added, member joined, payment made, group created, expense deleted
- Timestamps for every action

### 🌙 Dark / Light Mode
- Toggle between dark and light themes
- Preference saved in localStorage
- Smooth transition animations

---

## 📁 Project Structure

```
bill-splitter/
│
├── src/main/java/com/billsplitter/bill_splitter/
│   ├── BillSplitterApplication.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Group.java
│   │   ├── Expense.java
│   │   ├── ExpenseSplit.java
│   │   ├── Transaction.java
│   │   ├── Activity.java
│   │   └── BudgetIncreaseRequest.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── GroupRepository.java
│   │   ├── ExpenseRepository.java
│   │   ├── ExpenseSplitRepository.java
│   │   ├── TransactionRepository.java
│   │   ├── ActivityRepository.java
│   │   └── BudgetRequestRepository.java
│   ├── controller/
│   │   ├── UserController.java
│   │   ├── GroupController.java
│   │   ├── ExpenseController.java
│   │   ├── SplitController.java
│   │   ├── PaymentController.java
│   │   ├── ActivityController.java
│   │   └── BudgetController.java
│   ├── service/
│   │   ├── SplitService.java
│   │   └── ActivityService.java
│   └── config/
│       ├── SecurityConfig.java
│       └── JwtUtil.java
│
├── bill-splitter-frontend/
│   └── src/
│       ├── api/axios.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── Splash.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           ├── GroupPage.jsx
│           └── Wallet.jsx
│
└── src/main/resources/
    └── application.properties
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 21
- MySQL 8
- Node.js 18+
- Git

### Backend Setup

**1. Clone the repository:**
```bash
git clone https://github.com/Rakshitsoni1410/bill-splitter-api.git
cd bill-splitter-api
```

**2. Configure MySQL:**
```sql
CREATE DATABASE billsplitter;
```

**3. Update `application.properties`:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/billsplitter?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

jwt.secret=billsplitter_super_secret_key_32chars!!
jwt.expiration=86400000

spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

**4. Run the backend:**
```bash
./gradlew bootRun
```
Backend will start at `http://localhost:8080`

---

### Frontend Setup

**1. Navigate to frontend:**
```bash
cd bill-splitter-frontend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start development server:**
```bash
npm run dev
```
Frontend will start at `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login and get JWT token |
| PUT | `/api/users/{id}/upi` | Set UPI ID |

### Groups
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/groups/create` | Create new group |
| GET | `/api/groups/user/{userId}` | Get user's groups |
| GET | `/api/groups/{id}` | Get group by ID |
| POST | `/api/groups/{id}/members` | Add member to group |
| PUT | `/api/groups/{id}/budget` | Set budget limit |

### Expenses
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/expenses/add` | Add expense |
| GET | `/api/expenses/group/{groupId}` | Get group expenses |
| GET | `/api/expenses/group/{groupId}/filter` | Filter by category |
| DELETE | `/api/expenses/{id}` | Delete expense |

### Splits & Balances
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/splits/create` | Create expense splits |
| GET | `/api/splits/balances/{groupId}` | Get group balances |
| POST | `/api/splits/settle/{splitId}` | Settle a split |

### Payments (UPI Simulation)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/pay` | Make UPI payment |
| GET | `/api/payments/wallet/{userId}` | Get wallet balance |
| GET | `/api/payments/history/{userId}` | Transaction history |

### Activities
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/activities/group/{groupId}` | Get group activity feed |
| GET | `/api/activities/group/{groupId}/recent` | Get recent 10 activities |

### Budget Requests
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/budget/request` | Request budget increase |
| GET | `/api/budget/requests/{groupId}` | Get pending requests |
| PUT | `/api/budget/requests/{id}/approve` | Approve request |
| PUT | `/api/budget/requests/{id}/reject` | Reject request |

---

## 🗃️ Database Schema

```sql
users              → id, name, email, password, wallet_balance, upi_id
user_groups        → id, name, created_by, budget_limit, total_spent
group_members      → group_id, user_id
expenses           → id, title, amount, category, split_type, paid_by, group_id
expense_splits     → id, expense_id, user_id, amount_owed, percentage, is_settled
transactions       → id, sender_id, receiver_id, amount, upi_reference, note, status
activities         → id, group_id, user_id, type, message, created_at
budget_requests    → id, group_id, requested_by, requested_amount, reason, status
```

---

## 📸 Screenshots

> Login Page | Dashboard | Group Page | Wallet

---

## 🔮 Future Improvements

- [ ] Email notifications (SMTP)
- [ ] Push notifications
- [ ] Expense analytics with charts
- [ ] Recurring expenses (monthly rent)
- [ ] Real UPI/Razorpay integration
- [ ] Mobile app (Flutter)
- [ ] Export expenses as PDF

---

## 👨‍💻 Author

**Rakshit R Soni**
- Portfolio: [rakshitrsoni.netlify.app](https://rakshitrsoni.netlify.app)
- GitHub: [@Rakshitsoni1410](https://github.com/Rakshitsoni1410)
- LinkedIn: [rakshitrsoni1410](https://linkedin.com/in/rakshitrsoni1410)
- Email: rakshitrsoni@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
