# Ambulance & Healthcare Assistance App

My final year project (BSc Computing). A web app for patients, ambulances, hospitals and blood banks.

**Stack:** Node.js, Express, MongoDB (Mongoose), React (Vite), JWT

## Features
- Signup / login with JWT (httpOnly cookie) and bcrypt
- 5 user roles: patient, ambulance, hospital, bloodbank, admin
- Role based routes on backend and frontend
- Patients can save and view their medical history
- API tests with Jest and Supertest

## Todo
- Ambulance request and tracking with Google Maps
- Hospital and blood bank dashboards
- SMS alerts for blood requests

## API
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/patient/history`
- `GET /api/v1/patient/history`

## Run locally

Backend
```
cd Backend
cp .env.example .env
npm install
npm run dev
```

Frontend
```
cd Frontend
npm install
npm run dev
```

Tests
```
cd Backend
npm test
```
