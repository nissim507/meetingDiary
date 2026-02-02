# Test Data for Meeting Diary API

This folder contains sample JSON test data for testing the Meeting Diary backend API endpoints.

## Structure

- `users/` - User-related API test data
- `meetings/` - Meeting-related API test data
- `participants/` - Participant-related API test data
- `auth/` - Authentication tokens and examples

## Usage

These JSON files can be used with:
- **Postman** - Import as request bodies
- **curl** - Use with `-d @filename.json`
- **REST Client extensions** (VS Code, etc.)
- **Automated testing scripts**

## Base URL

All endpoints use: `http://localhost:3000`

## Authentication

Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Get a token by logging in via `POST /users/login` (see `users/login-request.json`).

## Quick Test Examples

### Using curl

**Login:**
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d @test-data/users/login-request.json
```

**Create Meeting (with auth token):**
```bash
curl -X POST http://localhost:3000/meetings/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d @test-data/meetings/create-meeting-request.json
```

### Using Postman

1. Import the JSON files as request bodies
2. Set the appropriate HTTP method (GET, POST, DELETE)
3. Add the Authorization header with Bearer token for protected endpoints
4. Use variables for dynamic values (user IDs, meeting IDs, etc.)

## Notes

- Replace placeholder values (like `USER_ID`, `MEETING_ID`) with actual IDs from your database
- Token values in examples are placeholders - use real tokens from login responses
- Date formats: `YYYY-MM-DD` for dates, `HH:MM:SS` for times
- All timestamps are in ISO format

