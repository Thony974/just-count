This is a project to handle expenses and accounting regarding personnal salary in a couple (based on [Next.js](https://nextjs.org) framework).

## Getting Started

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

## Database

Using prisma to handle local database (sqlite one for now), here are some usefull command to initiate / reset it:

### Reset my database

```bash
rm prisma/dev.db          # For SQLite (delete the database file)
npx prisma migrate reset  # Reset migrations and database
npx prisma db push        # Push the new schema
npx prisma generate       # Regenerate Prisma client
```

### Just push some current schema modification to current db

```bash
npx prisma db push        # Push the new schema
```
