# Welcome to prisma command helper to handle database

## Reset my database

```bash
rm prisma/dev.db          # For SQLite (delete the database file)
npx prisma migrate reset  # Reset migrations and database
npx prisma db push        # Push the new schema
npx prisma generate       # Regenerate Prisma client
```

## Just push some current schema modification to current db

```bash
npx prisma db push        # Push the new schema
```
