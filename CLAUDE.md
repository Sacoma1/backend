# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start server:**
```bash
npm start          # Production mode (node app.js)
npm run dev        # Development mode with auto-reload (nodemon)
```

**Linting:**
```bash
npx eslint .       # Run ESLint on codebase
```

**Notes:**
- No test suite is currently configured
- No build step required (vanilla JavaScript with ES modules)

## Technology Stack

- **Backend:** Express.js 4.16.1
- **Database:** MongoDB with Mongoose ODM 8.19.2
- **Authentication:** JWT (jsonwebtoken 9.0.2) + bcryptjs 3.0.2
- **Security:** Arcjet Node SDK 1.0.0-beta.13 (rate limiting, bot detection, SQL injection/XSS protection)
- **Module System:** ES Modules (`type: "module"`)
- **Dev Tools:** Nodemon, ESLint, Morgan (HTTP logger), Debug

## Architecture Overview

**Application Type:** Veterinary Clinic Management System (RESTful API)

**Pattern:** MVC (Model-View-Controller) with middleware-based architecture

**Core Entities:**
- **Users** (Veterinarians) - authentication and appointment assignment
- **Owners** - pet owners with contact information
- **Pets** - patient records linked to owners
- **Appointments** - scheduling with veterinarian assignment

**Security Layers:**
1. Arcjet middleware (rate limiting: 5 requests/10s, bot detection, shield against attacks)
2. JWT-based authentication with Bearer tokens
3. Authorization middleware on protected routes
4. Password hashing with bcrypt
5. Cookie parser for secure cookie handling

**API Structure:**
- Base pattern: `/api/v1/{resource}`
- RESTful endpoints with JSON request/response
- Versioned API (v1)

## Directory Structure

```
├── app.js                    # Main application entry point, server setup
├── arcjet.js                 # Arcjet security configuration
├── data.js                   # Dummy/seed data for testing
├── bin/www                   # Server startup script
├── config/
│   └── env.js               # Environment variables configuration
├── database/
│   └── mongodb.js           # MongoDB connection setup
├── models/                  # Mongoose schemas
│   ├── user.model.js        # User/Veterinarian model
│   ├── owner.model.js       # Pet owner model
│   ├── pet.model.js         # Pet model
│   └── appoitment.model.js  # Appointment model (note: filename typo)
├── controllers/             # Business logic for each resource
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── owner.controller.js
│   ├── pet.controller.js
│   ├── appointment.controller.js
│   └── search.controller.js # (incomplete implementation)
├── routes/                  # Route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── owner.routes.js
│   ├── pet.routes.js
│   ├── appointment.routes.js
│   └── search.route.js
├── middlewares/
│   ├── auth.middleware.js        # JWT authorization
│   ├── error.middleware.js       # Global error handler
│   └── arject.middleware.js      # Arcjet security middleware
└── public/                       # Static files
```

## Required Environment Variables

Create `.env.{NODE_ENV}.local` file (e.g., `.env.development.local`):

```
PORT                    # Server port
NODE_ENV               # Environment (development/production)
DB_URI                 # MongoDB connection string
JWT_SECRET             # Secret for JWT signing
JWT_EXPIRES_IN         # JWT expiration time (e.g., "7d", "24h")
ARCJET_ENV             # Arcjet environment
ARCJET_KEY             # Arcjet API key
```

## Key Patterns & Conventions

### Controller Pattern
All controllers use async/await with try-catch and pass errors to next() for centralized error handling:

```javascript
export const functionName = async (req, res, next) => {
  try {
    // Logic here
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
```

### Response Format
Standard JSON response structure:

```javascript
{
  success: boolean,
  message?: string,
  data?: any,
  count?: number,
  error?: string
}
```

### Authentication Flow
1. User signs up → password hashed with bcrypt → JWT token generated
2. User signs in → credentials verified → JWT token returned in response
3. Protected routes → Bearer token in `Authorization` header → JWT verified → user attached to `req.user`

### Middleware Chain
```
express.json()
→ express.urlencoded()
→ cookieParser()
→ arcjetMiddleware (security)
→ Route-specific middleware (authorize)
→ Controller
→ errorMiddleware (global error handler)
```

## Database Models & Relationships

### User (Veterinarian)
```javascript
{
  name: String (2-50 chars),
  email: String (unique, validated),
  password: String (hashed, min 6 chars),
  timestamps: true
}
```

### Owner
```javascript
{
  name: String,
  lastname: String,
  email: String (unique),
  birthDate: Date,
  phone: String,
  gender: Enum ["Hombre", "Mujer", "Prefiero no responder"],
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

### Pet
```javascript
{
  owner: ObjectId (ref: Owner),
  petName: String,
  chipNumber: String (unique),
  species: Enum ["Perro", "Gato", "Otro"],
  breed: String (default: "Mestizo/Desconocido"),
  birthDate: Date (validated: not future),
  gender: Enum ["Macho", "Hembra"],
  color: String,
  weight: Number,
  timestamps: true
}
```

### Appointment
```javascript
{
  pet: ObjectId (ref: Pet),
  date: Date,
  reason: Enum ["Estetica", "Consulta veterinaria", "Cirugia", "Vacunacion", "Urgencia"],
  status: Enum ["Programada", "Confirmada", "Cancelada", "Completada", "No Asistió", "Re-agendada"],
  veterinarianNotes: String,
  veterinarian: {
    user: ObjectId (ref: User, optional)
  },
  timestamps: true
}
```

**Relationships:**
- Owner → has many Pets (referenced via ObjectId)
- Pet → belongs to Owner
- Appointment → references Pet
- Appointment → references User (Veterinarian) when assigned
- Owner → created by User (tracks which veterinarian created the record)

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /sign-up` - User registration
- `POST /sign-in` - User login
- `POST /sign-out` - User logout (not implemented)

### Users (`/api/v1/users`)
- `GET /` - Get all users
- `GET /:id` - Get user by ID (protected)
- `POST /` - Create user (stub)
- `PUT /:id` - Update user (stub)
- `DELETE /:id` - Delete user (stub)

### Owners (`/api/v1/owner`)
All endpoints are stubs (implementation pending):
- `GET /` - Get all owners
- `GET /:id` - Get owner by ID
- `POST /` - Create owner
- `PUT /:id/update` - Update owner
- `DELETE /:id/delete` - Delete owner

### Appointments (`/api/v1/appointments`) - All Protected
- `GET /` - Get unassigned appointments
- `GET /user/:id` - Get user's appointments
- `POST /` - Create appointment
- `PUT /:id/assign` - Assign veterinarian to appointment
- `DELETE /:id` - Delete appointment

### Search (`/api/v1/search`)
- `GET /` - Search using query params (filter, value)
- Currently uses dummy data

## Arcjet Security Configuration

Located in `arcjet.js`:
- **Shield mode:** LIVE (protects against SQL injection, XSS, etc.)
- **Bot detection:** LIVE (allows search engine crawlers)
- **Rate limiting:** Token bucket
  - Refill rate: 5 tokens
  - Interval: 10 seconds
  - Capacity: 10 tokens
  - Tracked by: IP address

## Known Issues & TODOs

1. **Filename typo:** `models/appoitment.model.js` should be `appointment.model.js`
2. **Model typo:** `owner.model.js` line 35 has `Stringk` instead of `String`
3. **Incomplete implementations:**
   - `controllers/search.controller.js` exports nothing
   - Owner routes are all stubs
   - Sign-out functionality not implemented
4. **Missing features:**
   - No test suite configured
   - No `.env.example` file for reference
5. **Transactions:** Only user signup uses MongoDB transactions; consider adding to other critical operations

## Development Notes

- **Language:** Application is primarily in Spanish (comments, enum values, messages)
- **Database:** MongoDB connection established in `app.js` after server starts listening
- **Error handling:** Centralized in `middlewares/error.middleware.js`
- **File references:** When discussing code, use pattern `file_path:line_number` (e.g., `app.js:712`)
