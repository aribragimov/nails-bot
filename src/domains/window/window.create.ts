import { DateTime } from 'luxon';
import { timezone } from '../../config';
import { Context } from '../..';
import { addBackButton } from '../../helpers/add-back-button.helper';
import { getMonthName } from '../../helpers/month.helper';
import { windowCreateMonthDayRegex } from './regex/create.regex';
import { splitDaysOnWeek } from '../../helpers/day.helper';

// ---------------------------------------------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------------------------------------------

export async function createWindowMany(
  context: Context,
  chatId: number,
  text: string,
) {
  try {
    const checkAwait = await context.prisma.state.findUnique({
      where: { chatId },
    });

    if (!checkAwait) return;

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

    const parsedDates = Object.values(uniqueDates);

    if (!parsedDates.length) {
      await context.bot.sendMessage(chatId, 'Окошки не созданы');
    }

    const createdWindows = await context.prisma.window.createManyAndReturn({
      data: parsedDates.map((parsedDate) => ({ date: parsedDate })),
      select: { date: true },
    });

    const results = buildResponse(
      createdWindows.map((createdWindow) => createdWindow.date),
    );

    for await (const result of results) {
      await context.bot.sendMessage(chatId, result);
    }

    await context.prisma.state.delete({ where: { chatId } });
  } catch (e) {
    const state = await context.prisma.state.findUnique({
      where: { chatId },
    });

    if (state) {
      await context.prisma.state.delete({
        where: { chatId },
      });
    }
  }
}

export async function createWindow(
  context: Context,
  chatId: number,
  text: string,
) {
  try {
    const checkAwait = await context.prisma.state.findUnique({
      where: { chatId },
    });

    if (
      !checkAwait ||
      !checkAwait.path ||
      !windowCreateMonthDayRegex.test(checkAwait.path)
    )
      return;

    const uniqueDates: Record<string, Date> = {};
    const currentYear = DateTime.now().year;

    const month = checkAwait.path.split('/')[3].split('=')[1];
    const day = checkAwait.path.split('/')[4].split('=')[1];

    const times = text.split(', ');

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

    const parsedDates = Object.values(uniqueDates);

    if (!parsedDates.length) {
      await context.bot.sendMessage(chatId, 'Окошки не созданы');
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

    await context.prisma.state.delete({ where: { chatId } });
  } catch (e) {
    const state = await context.prisma.state.findUnique({
      where: { chatId },
    });

    if (state) {
      await context.prisma.state.delete({
        where: { chatId },
      });
    }
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
    let preResult = `${dayMonth}: `;
    preResult += times.map((time) => `  ${time}`).join(',');

    result.push(preResult.trim());
  }

  return result;
}

// ---------------------------------------------------------------------------------------------------
// Callback query handler
// ---------------------------------------------------------------------------------------------------
export async function windowCreate(context: Context, chatId: number) {
  return context.bot.sendMessage(chatId, `Выберите действие`, {
    reply_markup: {
      inline_keyboard: [
        addBackButton('/start'),
        [
          {
            callback_data: '/win/c/one',
            text: 'Добавить окошки на один день',
          },
        ],
        [
          {
            callback_data: '/win/c/many',
            text: 'Добавить окошки на разные даты',
          },
        ],
      ],
    },
  });
}

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

export function windowCreateOne(context: Context, chatId: number) {
  const dateNow = DateTime.fromJSDate(new Date());

  const thisMonth = dateNow.month;
  const nextMonth = thisMonth + 1;

  return context.bot.sendMessage(chatId, 'Выберите месяц', {
    reply_markup: {
      inline_keyboard: [
        addBackButton('/start'),
        [
          {
            text: getMonthName(thisMonth),
            callback_data: `/win/c/month/${thisMonth}`,
          },
        ],
        [
          {
            text: getMonthName(nextMonth),
            callback_data: `/win/c/month/${nextMonth}`,
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
  const windowMonth = Number(path.split('month/')[1]);

  const dateNow = DateTime.now();

  let allDays: { text: string; callback_data: string }[];

  if (windowMonth === dateNow.month) {
    allDays = Array.from(Array(dateNow.daysInMonth))
      .map((_, i) => i + 1)
      .splice(dateNow.day - 1)
      .map((value) => ({
        text: value.toString(),
        callback_data: path + `/day/${value}`,
      }));
  } else {
    const windowDate = DateTime.fromObject({
      year: dateNow.year,
      month: windowMonth,
    });

    allDays = Array.from(Array(windowDate.daysInMonth)).map((_, i) => {
      const value = (i + 1).toString();
      return { text: value, callback_data: path + `/day/${value}` };
    });
  }

  return context.bot.sendMessage(chatId, 'Выберите день', {
    reply_markup: {
      inline_keyboard: [
        ...splitDaysOnWeek(allDays),
        addBackButton('/win/c/one'),
      ],
    },
  });
}

export async function windowCreateMonthDay(
  context: Context,
  chatId: number,
  path: string,
) {
  await context.prisma.state.create({ data: { chatId, path } });

  return context.bot.sendMessage(
    chatId,
    'Пришлите время окошек в формате:\n10:00, 11:00, 12:00\n',
  );
}
