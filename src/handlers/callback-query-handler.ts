import { PrismaClient } from '@prisma/client';
import TelegramApi from 'node-telegram-bot-api';
import { getWindowsOptions } from '../domains/window/options';
import { DateTime } from 'luxon';
import { getMonthName } from '../helpers';
import {
  windowCreateMonthDayRegex,
  windowCreateMonthRegex,
} from '../domains/window/regex';
import { windowCreateMonth } from '../domains/window';
import { start } from './start';

const prisma = new PrismaClient();
export function callbackQueryHandler(bot: TelegramApi) {
  bot.on('callback_query', async (msg) => {
    console.log(msg);
    const chatId = msg.from.id;
    const path = msg.data;

    await bot.answerCallbackQuery(msg.id);

    if (path) {
      if (path === '/start') {
        return start(bot, chatId);
      } else if (path === '/window/create/many') {
        await prisma.state.upsert({
          where: { chatId },
          create: { chatId },
          update: { updatedAt: new Date() },
        });

        return bot.sendMessage(
          chatId,
          `Пришлите одно или несколько окошек в формате:\nчисло\\.месяц: часы:минуты, часы:минуты\n\nПример:\n01\\.01: 10:00, 11:00, 12:00\n02\\.01: 16:35, 18:20, 19:00`,
          { parse_mode: 'MarkdownV2' },
        );
      } else if (path === '/window/create') {
        const dateNow = DateTime.fromJSDate(new Date());

        const thisMonth = dateNow.month;
        const nextMonth = thisMonth + 1;

        return bot.sendMessage(chatId, 'Выберите месяц', {
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
      } else if (windowCreateMonthRegex.test(path)) {
        return windowCreateMonth(bot, chatId, path);
      } else if (windowCreateMonthDayRegex.test(path)) {
      } else if (path === '/window/get') {
        return bot.sendMessage(chatId, 'Выберите период', getWindowsOptions);
      }
    }

    return bot.sendMessage(chatId, 'Undefined ');
  });
}
