import { DateTime } from 'luxon';
import { timezone } from '../../config';
import { Context } from '../..';
import { getMonthName } from '../../helpers';

// ---------------------------------------------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------------------------------------------

export async function createWindow(
  context: Context,
  chatId: number,
  text: string,
) {
  const parsedDates = parseDates(text);

  if (!parsedDates.length) {
    context.bot.sendMessage(chatId, 'Окошки не созданы');
  }

  const createdWindows = await context.prisma.window.createManyAndReturn({
    data: parsedDates.map((parsedDate) => ({ date: parsedDate })),
    select: { date: true },
  });

  const results = buildResponse(
    createdWindows.map((createdWindow) => createdWindow.date),
  );

  results.forEach(
    async (result) => await context.bot.sendMessage(chatId, result),
  );
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

// ---------------------------------------------------------------------------------------------------
// Callback query handler
// ---------------------------------------------------------------------------------------------------

export async function windowCreateMany(context: Context, chatId: number) {
  await context.prisma.state.upsert({
    where: { chatId },
    create: { chatId },
    update: { updatedAt: new Date() },
  });

  return context.bot.sendMessage(
    chatId,
    `Пришлите одно или несколько окошек в формате:\nчисло\\.месяц: часы:минуты, часы:минуты\n\nПример:\n01\\.01: 10:00, 11:00, 12:00\n02\\.01: 16:35, 18:20, 19:00`,
    { parse_mode: 'MarkdownV2' },
  );
}

export function windowCreate(context: Context, chatId: number) {
  const dateNow = DateTime.fromJSDate(new Date());

  const thisMonth = dateNow.month;
  const nextMonth = thisMonth + 1;

  return context.bot.sendMessage(chatId, 'Выберите месяц', {
    reply_markup: {
      inline_keyboard: [
        [{ callback_data: '/start', text: '<<--' }],
        [
          {
            text: getMonthName(thisMonth),
            callback_data: `/window/create/month=${thisMonth}`,
          },
        ],
        [
          {
            text: getMonthName(nextMonth),
            callback_data: `/window/create/month=${nextMonth}`,
          },
        ],
      ],
    },
  });
}

export function windowCreateMonth(
  context: Context,
  chatId: number,
  path: string,
) {
  const dateNow = DateTime.fromJSDate(new Date());

  const monthLength = dateNow.daysInMonth;
  const toDay = dateNow.day;

  const days = Array.from(Array(monthLength))
    .map((_, i) => i)
    .splice(toDay)
    .map((value) => [
      { text: value.toString(), callback_data: path + `/day=${value}` },
    ]);

  return context.bot.sendMessage(chatId, 'Выберите день', {
    reply_markup: {
      inline_keyboard: [
        [{ callback_data: '/window/create', text: '<<--' }],
        ...days,
      ],
    },
  });
}
