import { DateTime } from 'luxon';
import { Context } from '../..';

// ---------------------------------------------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------
// Callback query handler
// ---------------------------------------------------------------------------------------------------

export async function windowGetAll(context: Context, chatId: number) {
  const { year, month, day } = DateTime.now();

  const windows = await context.prisma.window.findMany({
    where: {
      date: { gte: DateTime.fromObject({ year, month, day }).toJSDate() },
    },
    orderBy: { date: 'asc' },
  });

  const results = buildResponse(windows.map((window) => window.date));

  for await (const result of results) {
    context.bot.sendMessage(chatId, result);
  }
}

function buildResponse(dates: Date[]): string[] {
  let result: string[] = [];

  const groupedDates = dates.reduce(
    (acc: { [key: string]: string[] }, date) => {
      const dt = DateTime.fromJSDate(date);
      const dayMonth = dt.toFormat('dd.MM');

      if (!acc[dayMonth]) {
        acc[dayMonth] = [];
      }

      acc[dayMonth].push(dt.toFormat('HH:mm'));

      return acc;
    },
    {},
  );

  for (const [dayMonth, times] of Object.entries(groupedDates)) {
    let preResult = `${dayMonth}:\n`;
    preResult += times.map((time) => `  ${time}`).join('\n');

    result.push(preResult.trim());
  }

  return result;
}
