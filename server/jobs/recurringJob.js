import cron from "node-cron";
import { addDays, addWeeks, addMonths, isBefore } from "date-fns";
import RecurringTransaction from "../models/RecurringTransaction.js";
import Transaction from "../models/Transaction.js";

export function startRecurringJob() {
  // Runs every hour
  cron.schedule("0 * * * *", async () => {
    const now = new Date();
    const due = await RecurringTransaction.find({ active: true, nextRun: { $lte: now } });

    for (const rec of due) {
      await Transaction.create({
        user: rec.user,
        title: rec.title,
        amount: rec.amount,
        type: rec.type,
        category: rec.category,
        isRecurring: true,
        note: `Auto: ${rec.frequency}`,
      });

      // Calculate next run
      let nextRun;
      if (rec.frequency === "daily")   nextRun = addDays(now, 1);
      if (rec.frequency === "weekly")  nextRun = addWeeks(now, 1);
      if (rec.frequency === "monthly") nextRun = addMonths(now, 1);

      rec.nextRun = nextRun;
      await rec.save();
    }

    if (due.length) console.log(`Processed ${due.length} recurring transactions`);
  });
}