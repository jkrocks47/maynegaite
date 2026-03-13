import pg from 'pg';
import crypto from 'crypto';
import fs from 'fs';
import { readFileSync } from 'fs';

// Load .env manually
const envContent = readFileSync('.env', 'utf8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set in .env');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });

async function main() {
  await client.connect();
  console.log('Connected to database');

  const migrations = [
    { file: 'drizzle/0000_glorious_purifiers.sql', created: 1773350744007 },
    { file: 'drizzle/0001_minor_maginty.sql', created: 1773351931781 }
  ];

  for (const { file, created } of migrations) {
    const content = fs.readFileSync(file, 'utf8');
    const hash = crypto.createHash('sha256').update(content).digest('hex');

    const existing = await client.query(
      'SELECT 1 FROM drizzle.__drizzle_migrations WHERE hash = $1',
      [hash]
    );

    if (existing.rows.length > 0) {
      console.log(`Already tracked: ${file}`);
      continue;
    }

    await client.query(
      'INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)',
      [hash, created]
    );
    console.log(`Registered as applied: ${file}`);
  }

  await client.end();
  console.log('Done! You can now run: npm run db:migrate');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
