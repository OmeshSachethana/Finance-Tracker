import { toISODate } from '@finance-tracker/shared';
import { logger } from '../lib/logger.ts';
import { processDueRules } from '../modules/recurring/recurring.processor.ts';

const HOUR = 60 * 60 * 1000;

async function runRecurringRules() {
  try {
    const created = await processDueRules(toISODate(new Date()));
    if (created > 0) logger.info({ created }, 'Created recurring transactions');
  } catch (err) {
    logger.error({ err }, 'Failed to process recurring rules');
  }
}

/** Processes recurring rules on startup and then every hour. */
export function startScheduler(): () => void {
  void runRecurringRules();
  const timer = setInterval(runRecurringRules, HOUR);
  timer.unref();
  return () => clearInterval(timer);
}
