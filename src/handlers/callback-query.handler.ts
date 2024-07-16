import { windowCreateMonthDayRegex } from '../domains/window/regex/create.regex';
import { windowCreateMonthRegex } from '../domains/window/regex/create.regex';
import {
  windowCreateOne,
  windowCreateMany,
  windowCreateMonth,
  windowCreateMonthDay,
  windowCreate,
} from '../domains/window/window.create';
import { start } from '../domains/start/start';
import { Context } from '..';
import {
  windowGet,
  windowGetAll,
  windowGetMonth,
  windowGetNextWeek,
  windowGetToday,
  windowGetWeek,
} from '../domains/window/window.get';
import {
  windowUpdate,
  windowUpdateIsBooked,
  windowUpdateIsBookedMonth,
  windowUpdateIsBookedMonthDay,
} from '../domains/window/window.update';
import {
  windowUpdateIsBookedMonthDayRegex,
  windowUpdateIsBookedMonthRegex,
} from '../domains/window/regex/update.regex';

export function callbackQueryHandler(context: Context) {
  context.bot.on('callback_query', async (msg) => {
    const chatId = msg.from.id;
    const path = msg.data;
    console.log('callbackQueryHandler: ', path);

    await context.bot.answerCallbackQuery(msg.id);

    if (path) {
      if (path === '/start') {
        return start(context, chatId);
      } else if (path === '/win/create') {
        return windowCreate(context, chatId);
      } else if (path === '/win/c/many') {
        return windowCreateMany(context, chatId);
      } else if (path === '/win/c/one') {
        return windowCreateOne(context, chatId);
      } else if (windowCreateMonthRegex.test(path)) {
        return windowCreateMonth(context, chatId, path);
      } else if (windowCreateMonthDayRegex.test(path)) {
        return windowCreateMonthDay(context, chatId, path);
      } else if (path === '/win/get') {
        return windowGet(context, chatId);
      } else if (path === '/win/g/all') {
        return windowGetAll(context, chatId);
      } else if (path === '/win/g/today') {
        return windowGetToday(context, chatId);
      } else if (path === '/win/g/week') {
        return windowGetWeek(context, chatId);
      } else if (path === '/win/g/nextweek') {
        return windowGetNextWeek(context, chatId);
      } else if (path === '/win/g/month') {
        return windowGetMonth(context, chatId);
      } else if (path === '/win/update') {
        return windowUpdate(context, chatId);
      } else if (path === '/win/u/isBooked') {
        return windowUpdateIsBooked(context, chatId);
      } else if (windowUpdateIsBookedMonthRegex.test(path)) {
        return windowUpdateIsBookedMonth(context, chatId, path);
      } else if (windowUpdateIsBookedMonthDayRegex.test(path)) {
        return windowUpdateIsBookedMonthDay(context, chatId, path);
      }
    }

    return context.bot.sendMessage(chatId, 'Undefined ');
  });
}
