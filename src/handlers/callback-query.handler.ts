import { getWindowsOptions } from '../domains/window/options';
import { DateTime } from 'luxon';
import { getMonthName } from '../helpers';
import {
  windowCreateMonthDayRegex,
  windowCreateMonthRegex,
} from '../domains/window/regex';
import {
  windowCreate,
  windowCreateMany,
  windowCreateMonth,
} from '../domains/window';
import { start } from '../domains/start';
import { Context } from '..';

export function callbackQueryHandler(context: Context) {
  context.bot.on('callback_query', async (msg) => {
    console.log(msg);
    const chatId = msg.from.id;
    const path = msg.data;

    await context.bot.answerCallbackQuery(msg.id);

    if (path) {
      if (path === '/start') {
        return start(context, chatId);
      } else if (path === '/window/create/many') {
        return windowCreateMany(context, chatId);
      } else if (path === '/window/create') {
        return windowCreate(context, chatId);
      } else if (windowCreateMonthRegex.test(path)) {
        return windowCreateMonth(context, chatId, path);
      } else if (windowCreateMonthDayRegex.test(path)) {
      } else if (path === '/window/get') {
        return context.bot.sendMessage(
          chatId,
          'Выберите период',
          getWindowsOptions,
        );
      }
    }

    return context.bot.sendMessage(chatId, 'Undefined ');
  });
}
