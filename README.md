# Vito API — Banks & Lenders Directory


[![Backend CI](https://github.com/ChaimTriebitz/crud-table/actions/workflows/ci.yml/badge.svg)](https://github.com/ChaimTriebitz/crud-table/actions/workflows/ci.yml)

Express and MongoDB API for Vito, a table-based directory for managing bank and lender records. The API supports user authentication, listing data, and owner-scoped record changes.

**Live API health:** [vito-back.onrender.com/health](https://vito-back.onrender.com/health)  
**Frontend app:** [vito-front.onrender.com](https://vito-front.onrender.com)  
**Frontend source:** [crud-table-front](https://github.com/ChaimTriebitz/crud-table-front)

## Features

- REST endpoints for bank and lender records
- JWT-based registration and login
- Public read access to bank and lender directories
- Authenticated create and bulk-create operations
- Owner-scoped updates and deletes
- MongoDB persistence with Mongoose
- Health endpoint that reports database connectivity
- Spreadsheet-to-JSON utility that accepts a caller-provided file path

## Tech stack

- Node.js and Express
- MongoDB and Mongoose
- JWT and bcryptjs
- SheetJS (xlsx)
- Render deployment

## Local development

### Requirements

- Node.js and npm
- MongoDB running locally or an Atlas database

Install dependencies:

~~~bash
npm install
~~~

Create a local .env file based on .env.example:

~~~env
MONGO_URI=mongodb://127.0.0.1:27017/vito
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRATION=7d
PORT=5000
~~~

Start the API:

~~~bash
npm start
~~~

The server listens on port 5000 by default. Check the health endpoint at [http://localhost:5000/health](http://localhost:5000/health). A healthy response includes success=true and database=connected.

## API reference

All endpoints except health are prefixed with /api.

| Method | Path | Purpose | Access |
| --- | --- | --- | --- |
| GET | /health | Report database connectivity | Public |
| POST | /api/auth/register | Register a user | Public |
| POST | /api/auth/login | Authenticate and receive a JWT | Public |
| GET | /api/private | Return the authenticated user | Bearer token |
| GET | /api/banks | Read bank records | Public |
| POST | /api/banks/create | Create a bank record | Bearer token |
| POST | /api/banks/createMany | Bulk-create bank records | Bearer token |
| PUT | /api/banks/update/:id | Update a bank record owned by the user | Bearer token + ownership |
| DELETE | /api/banks/remove/:id | Delete a bank record owned by the user | Bearer token + ownership |
| GET | /api/lenders | Read lender records | Public |
| POST | /api/lenders/create | Create a lender record | Bearer token |
| POST | /api/lenders/createMany | Bulk-create lender records | Bearer token |
| PUT | /api/lenders/update/:id | Update a lender record owned by the user | Bearer token + ownership |
| DELETE | /api/lenders/remove/:id | Delete a lender record owned by the user | Bearer token + ownership |

Protected requests use this header:

~~~http
Authorization: Bearer <token>
~~~

## Spreadsheet conversion utility

The utility reads the first worksheet from a local Excel file. It does not require a repository-stored spreadsheet.

~~~bash
# Print converted rows to stdout
node utils/xlToJson.js path/to/input.xlsx

# Write converted rows to a JSON file
node utils/xlToJson.js path/to/input.xlsx path/to/output.json
~~~

Do not commit real contact lists, customer notes, spreadsheet exports, or other private business data.

## Quality checks

~~~bash
npm test
node --check index.js
~~~

GitHub Actions runs unit tests and syntax checks on pushes to main and pull requests. Current unit tests verify spreadsheet conversion using synthetic data.

## Security notes

- Keep .env files and credentials out of Git. Use a strong, unique JWT_SECRET in production.
- Database reads are currently public; do not store confidential records in this service without changing its access model.
- Create/update/delete controllers check that the current user owns the record.
- Review CORS policy, request-body limits, rate limiting, and authentication integration tests before treating this API as production-hardened.
