import { PrismaClient } from '@prisma/client';
import TelegramApi from 'node-telegram-bot-api';
import { DateTime } from 'luxon';
import { timezone } from '../../config';

const prisma = new PrismaClient();

export async function createWindow(
  bot: TelegramApi,
  chatId: number,
  text: string,
) {
  const parsedDates = parseDates(text);

  if (!parsedDates.length) {
    bot.sendMessage(chatId, 'Окошки не созданы');
  }

  const createdWindows = await prisma.window.createManyAndReturn({
    data: parsedDates.map((parsedDate) => ({ date: parsedDate })),
    select: { date: true },
  });

  const results = buildResponse(
    createdWindows.map((createdWindow) => createdWindow.date),
  );

  results.forEach(async (result) => await bot.sendMessage(chatId, result));
}

function parseDates(text: string): Date[] {
  const uniqueDates: Record<string, Date> = {};
  const lines = text.split('\n');
  const currentYear = DateTime.now().year;

  lines.forEach((line) => {
    const [datePart, timesPart] = line.split(': ');
    if (datePart && timesPart) {
      const [day, month] = datePart.split('.');
      const times = timesPart.split(', ');

      times.forEach((time) => {
        const [hours, minutes] = time.split(':');
        const dateObj = DateTime.fromObject(
          {
            year: currentYear,
            month: parseInt(month),
            day: parseInt(day),
            hour: parseInt(hours),
            minute: parseInt(minutes),
          },
          timezone,
        ).toJSDate();

        const dateKey = dateObj.toISOString();

        if (!uniqueDates[dateKey]) {
          uniqueDates[dateKey] = dateObj;
        }
      });
    }
  });

  return Object.values(uniqueDates);
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

export function windowCreateMonth(
  bot: TelegramApi,
  chatId: number,
  route: string,
) {
  const dateNow = DateTime.fromJSDate(new Date());

  const monthLength = dateNow.daysInMonth;
  const toDay = dateNow.day;

  const days = Array.from(Array(monthLength))
    .map((_, i) => i)
    .splice(toDay)
    .map((value) => [
      { text: value.toString(), callback_data: route + `/day=${value}` },
    ]);

  return bot.sendMessage(chatId, 'Выберите день', {
    reply_markup: {
      inline_keyboard: [
        [{ callback_data: '/window/create', text: '<<--' }],
        ...days,
      ],
    },
  });
}
