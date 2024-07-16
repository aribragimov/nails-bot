import { DateTime } from 'luxon';
import { Context } from '../../index';
import { windowUpdateOptions } from './options/update.options';
import {
  getMonthsNamesWithActualMonth,
  splitMonthsOnYear,
} from '../../helpers/month.helper';
import { addBackButton } from '../../helpers/add-back-button.helper';
import { splitDaysOnWeek } from '../../helpers/day.helper';
import { getSplitPath } from '../../helpers/path.helper';
import { splitWindowsOnDay } from '../../helpers/window.helper';

// ---------------------------------------------------------------------------------------------------
// Callback query handler
// ---------------------------------------------------------------------------------------------------

export async function windowUpdate(context: Context, chatId: number) {
  await context.bot.sendMessage(
    chatId,
    'Выберите действие',
    windowUpdateOptions,
  );
}

export async function windowUpdateIsBooked(context: Context, chatId: number) {
  const dateNow = DateTime.now();

  const actualMonth = dateNow.month;

  const months = getMonthsNamesWithActualMonth(actualMonth).map((month) => ({
    callback_data: `/win/u/isBooked/month/${month.number}`,
    text: month.name,
  }));

  return context.bot.sendMessage(chatId, 'Выберите месяц', {
    reply_markup: {
      inline_keyboard: [...splitMonthsOnYear(months), addBackButton('/start')],
    },
  });
}

export async function windowUpdateIsBookedMonth(
  context: Context,
  chatId: number,
  path: string,
) {
  const dateNow = DateTime.now();

  const windowMonth = Number(path.split('/')[5]);

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
        addBackButton('/win/u/isBooked'),
      ],
    },
  });
}

export async function windowUpdateIsBookedMonthDay(
  context: Context,
  chatId: number,
  path: string,
) {
  const dateNow = DateTime.now();
  const splitPath = getSplitPath(path);

  const month = Number(splitPath[4]);
  const day = Number(splitPath[6]);

  const gte = DateTime.fromObject({
    year: dateNow.year,
    month,
    day,
  }).toJSDate();

  const lte = DateTime.fromObject({
    year: dateNow.year,
    month,
    day: day + 1,
  }).toJSDate();

  const windows = await context.prisma.window.findMany({
    where: { date: { gte, lte } },
    orderBy: { date: 'asc' },
  });

  const windowsData = windows.map((window) => ({
    callback_data: path + `/win/${window.id}`,
    text: DateTime.fromJSDate(window.date).toFormat('HH:mm').toString(),
  }));

  console.log(JSON.stringify(splitWindowsOnDay(windowsData), null, 2));

  return context.bot.sendMessage(chatId, 'Выберите окошко', {
    reply_markup: {
      inline_keyboard: [
        ...splitWindowsOnDay(windowsData),
        addBackButton('/win/u/isBooked'),
      ],
    },
  });
}
