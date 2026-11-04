import { execSync } from 'node:child_process';

/** Applies migrations to the test database once before all tests. */
export default function setup() {
  execSync('npx prisma migrate deploy', {
    stdio: 'ignore',
    env: {
      ...process.env,
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ??
        'postgresql://finance:finance@localhost:5440/finance_tracker_test',
    },
  });
}
