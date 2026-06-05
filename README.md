# Banking4Students

Banking4Students is a hackathon student banking prototype built with an Expo
React Native app and a Django REST backend. The app focuses on student-friendly
banking flows such as payments, virtual cards, subscription tracking, grants,
cash stuffing, and receipt/bill splitting.

Built for the G+D Netcetera and Halkbank hackathon.

## What is in this repo

```text
.
├── BankingForStudents/      # Expo React Native frontend
├── backend/                 # Django + Django REST Framework backend
├── docker-compose.yml       # Backend Docker setup
└── README.md
```

## Features

- OneID-style demo sign-in with selectable seeded users
- User accounts, cards, balances, and transaction history
- Send/request money flows
- Virtual/shared card screens
- Cash-stuffing budget buckets
- Receipt scanning and bill splitting
- Subscription management screens
- Grant and partner-offer screens
- Student-focused pages such as My Uni, events, and future predictions

## Tech stack

### Frontend

- Expo 52
- React Native 0.76
- Expo Router
- NativeWind / Tailwind CSS
- TypeScript
- Expo Camera

### Backend

- Python 3.10
- Django 5
- Django REST Framework
- SQLite for local development
- OpenCV, Pillow, pytesseract, Tesseract OCR, qrcode

## Prerequisites

- Node.js and npm
- Expo CLI through `npx expo`
- Python 3.10+ if running the backend locally
- Docker and Docker Compose if running the backend in Docker
- Expo Go or an Android/iOS simulator for the mobile app

## Quick start

From the repository root:

```bash
git clone https://github.com/IamMistake/Banking4Students.git
cd Banking4Students
```

### 1. Start the backend with Docker

```bash
docker compose up --build backend
```

The API will be available at:

```text
http://localhost:8000
```

The Docker image installs the native dependencies needed by receipt scanning,
including Tesseract OCR.

### 2. Configure the frontend backend host

The mobile app currently uses a hard-coded backend address in:

```text
BankingForStudents/lib/global-provider.tsx
```

Update this value before starting Expo:

```ts
const ipAddress = "YOUR_LOCAL_IP:8000";
```

Use your computer's LAN IP when testing on a physical phone. For example:

```ts
const ipAddress = "192.168.1.25:8000";
```

If you run the app in a browser or simulator, `localhost:8000` may work,
depending on the environment.

### 3. Start the frontend

```bash
cd BankingForStudents
npm install
npm start
```

Then choose the target from the Expo terminal:

- Press `a` for Android
- Press `i` for iOS
- Scan the QR code with Expo Go
- Press `w` for web

## Running the backend without Docker

Docker is recommended because the receipt-scanning flow needs native OCR/image
dependencies. For a local Python-only setup:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

If OCR features fail locally, install Tesseract OCR on your machine and make
sure the Bulgarian language data is available. The Docker setup handles this for
you.

## Useful commands

### Frontend

Run these from `BankingForStudents/`:

```bash
npm start          # Start Expo
npm run android    # Start on Android
npm run ios        # Start on iOS
npm run web        # Start on web
npm run lint       # Run Expo lint
npm test           # Run Jest in watch mode
```

### Backend

Run these from `backend/` when using a local Python environment:

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
python manage.py test
```

## API overview

The backend exposes these main route groups:

| Area | Base route | Purpose |
| --- | --- | --- |
| Main banking | `/api/main/` | Users, accounts, transactions, send money |
| Cash stuffing | `/api/cashstuffing` | Budget bucket items |
| Claim hub | `/api/claimhub/` | Services, products, purchases, grants |
| Forecast | `/api/forecast/` | Placeholder app, no active routes yet |
| Owents | `/api/owents/` | Receipt analysis, bill parties, bill payments |
| Subscriptions | `/api/subscription/` | Subscription entities and card subscriptions |
| Virtual pool | `/api/virtualpool/` | Virtual cards and card associations |
| Admin | `/admin/` | Django admin |

Example endpoints:

```text
GET  /api/main/user-list/
GET  /api/main/user/<id>/
GET  /api/main/transactions/<email>/
GET  /api/main/transaction-accounts/<user_id>/
POST /api/main/send-money/
POST /api/main/make-transaction/

GET  /api/cashstuffing/bucketitems/
GET  /api/virtualpool/virtualcards/
GET  /api/subscription/subscriptions/
POST /api/owents/analyze-receipt/
POST /api/owents/make-party/
POST /api/owents/pay-bill/
```

## Development notes

- The backend is configured for development, with `DEBUG = True`,
  `ALLOWED_HOSTS = ["*"]`, and permissive CORS.
- SQLite is used by default through `backend/db.sqlite3`.
- The React Native app expects the backend to be reachable from the device
  running Expo, so the backend host may need to be a LAN IP instead of
  `localhost`.
- Some screens still contain mock/demo data alongside API-backed data.
- The Docker Compose file currently starts only the backend service. The Expo
  frontend is intended to run directly with npm.

## Troubleshooting

### The app cannot fetch users on sign-in

Check `BankingForStudents/lib/global-provider.tsx` and make sure `ipAddress`
points to the backend from the device running Expo. A physical phone usually
cannot reach your laptop through `localhost`.

### Port 8000 is already in use

Stop the process using the port or run Django on another port:

```bash
python manage.py runserver 0.0.0.0:8001
```

Then update the frontend `ipAddress` to use the same port.

### Receipt scanning does not work locally

Use Docker, or install Tesseract OCR and the required language files locally.
The project includes `backend/tessdata/bul.traineddata`, and the Dockerfile
copies it into the container.

## Project status

This is a hackathon prototype, not a production banking system. Do not deploy it
as-is without replacing demo secrets, hard-coded hosts, permissive CORS, local
SQLite storage, mock data, and development server settings.
