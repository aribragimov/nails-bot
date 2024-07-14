import { getWindowsOptions } from '../domains/window/options';

import {
  windowCreateMonthDayRegex,
  windowCreateMonthRegex,
} from '../domains/window/regex';
import {
  windowCreateOne,
  windowCreateMany,
  windowCreateMonth,
  windowCreateMonthDay,
  windowCreate,
} from '../domains/window';
import { start } from '../domains/start';
import { Context } from '..';
import { windowGetAll } from '../domains/window/window.get';

export function callbackQueryHandler(context: Context) {
  context.bot.on('callback_query', async (msg) => {
    const chatId = msg.from.id;
    const path = msg.data;
    console.log('callbackQueryHandler: ', path);

    await context.bot.answerCallbackQuery(msg.id);

    if (path) {
      if (path === '/start') {
        return start(context, chatId);
      } else if (path === '/window/create') {
        return windowCreate(context, chatId);
      } else if (path === '/window/create/many') {
        return windowCreateMany(context, chatId);
      } else if (path === '/window/create/one') {
        return windowCreateOne(context, chatId);
      } else if (windowCreateMonthRegex.test(path)) {
        return windowCreateMonth(context, chatId, path);
      } else if (windowCreateMonthDayRegex.test(path)) {
        return windowCreateMonthDay(context, chatId, path);
      } else if (path === '/window/get/all') {
        return windowGetAll(context, chatId);
      }
    }

    return context.bot.sendMessage(chatId, 'Undefined ');
  });
}
