import { DateTime } from 'luxon';
import { Context } from '../..';
import { windowGetOptions } from './options/get.options';

// ---------------------------------------------------------------------------------------------------
// Callback query handler
// ---------------------------------------------------------------------------------------------------

export async function windowGet(context: Context, chatId: number) {
  await context.bot.sendMessage(chatId, 'Выберите действие', windowGetOptions);
}

export async function windowGetToday(context: Context, chatId: number) {
  const dateNow = DateTime.now();

  const startDate = dateNow.toJSDate();
  const endDate = dateNow.endOf('day').toJSDate();

  const windows = await context.prisma.window.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: 'asc' },
  });

  const results = buildResponse(windows.map((window) => window.date));

  await context.bot.sendMessage(chatId, 'Окошки на сегодня:\n\n' + results);
}

export async function windowGetWeek(context: Context, chatId: number) {
  const dateNow = DateTime.now();

  const startDate = dateNow.toJSDate();
  const endDate = dateNow.endOf('week').toJSDate();

  const windows = await context.prisma.window.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: 'asc' },
  });

  const results = buildResponse(windows.map((window) => window.date));

  await context.bot.sendMessage(chatId, 'Окошки на этой неделе:\n\n' + results);
}

export async function windowGetNextWeek(context: Context, chatId: number) {
  const dt = DateTime.now().plus({ week: 1 });

  const startDate = dt.startOf('week').toJSDate();
  const endDate = dt.endOf('week').toJSDate();

  const windows = await context.prisma.window.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: 'asc' },
  });

  const results = buildResponse(windows.map((window) => window.date));

  await context.bot.sendMessage(chatId, 'Окошки на этой неделе:\n\n' + results);
}

export async function windowGetMonth(context: Context, chatId: number) {
  const dateNow = DateTime.now();

  const startDate = dateNow.toJSDate();
  const endDate = dateNow.endOf('month').toJSDate();

  const windows = await context.prisma.window.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    orderBy: { date: 'asc' },
  });

  const results = buildResponse(windows.map((window) => window.date));

  await context.bot.sendMessage(chatId, 'Окошки на этот месяц:\n\n' + results);
}

export async function windowGetAll(context: Context, chatId: number) {
  const startDate = DateTime.now().toJSDate();

  const windows = await context.prisma.window.findMany({
    where: {
      date: { gte: startDate },
    },
    orderBy: { date: 'asc' },
  });

  const results = buildResponse(windows.map((window) => window.date));

  await context.bot.sendMessage(chatId, 'Все:\n\n' + results);
}

function buildResponse(dates: Date[]): string {
  let result: string = '';

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
    let preResult = `${dayMonth}: `;
    preResult += times.map((time) => `  ${time}`).join(',');
    preResult += '\n';
    result += preResult;
  }

  return result;
}
