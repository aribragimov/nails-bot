import TelegramApi from 'node-telegram-bot-api';
import { start } from './start';
import { createWindow } from '../domains/window';
import { PrismaClient } from '@prisma/client';

const createWindowRegex = /(?:d{2}.d{2}: d{2}:d{2}(?:, d{2}:d{2})*\n?)*/;

const prisma = new PrismaClient();

export function messageHandler(bot: TelegramApi) {
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(msg);

    if (text) {
      if (text === '/start') {
        return start(bot, msg.chat.id);
      }

      if (createWindowRegex.test(text)) {
        const checkAwait = await prisma.state.findUnique({
          where: { chatId },
          select: { isAwait: true },
        });

        if (checkAwait?.isAwait) {
          return createWindow(bot, chatId, text);
        }
      }
    }

    return bot.sendMessage(chatId, 'Undefined ');
  });
}
