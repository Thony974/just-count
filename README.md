This is a project to handle expenses and accounting regarding personnal salary in a couple (based on [Next.js](https://nextjs.org) framework).

## Getting Started

### Initialize local database

Using prisma to handle Postgres database seed:

```bash
npm run prisma:init         # Seed local database
```

Local database can be used with the following commands:

```bash
npx prisma dev --detach     # Create local database and start in background
npx prisma dev ls           # List existing database and current status
npx prisma dev start <name> # Start existing local database
npm run prisma:init         # Seed local database if needed
npx prisma dev stop <name>  # Stop running local database
```

### Run server

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

Unit tests were created to check acccounting computation mainly, run it using:

```bash
npm run test
```
