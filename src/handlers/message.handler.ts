import { start } from '../domains/start';
import { createWindow, createWindowMany } from '../domains/window';
import {
  createWindowManyRegex,
  createWindowRegex,
  windowCreateMonthDayRegex,
} from '../domains/window/regex';
import { Context } from '..';

export function messageHandler(context: Context) {
  context.bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log('messageHandler: ', text);

    if (text) {
      if (text === '/start') {
        return start(context, msg.chat.id);
      }

      if (createWindowManyRegex.test(text)) {
        const checkAwait = await context.prisma.state.findUnique({
          where: { chatId },
          select: { isAwait: true },
        });

        if (checkAwait?.isAwait) {
          return createWindowMany(context, chatId, text);
        }
      } else if (createWindowRegex.test(text)) {
        const checkAwait = await context.prisma.state.findUnique({
          where: { chatId },
          select: { isAwait: true, path: true },
        });

        if (
          checkAwait?.path &&
          checkAwait?.isAwait &&
          windowCreateMonthDayRegex.test(checkAwait.path)
        ) {
          return createWindow(context, chatId, text, checkAwait.path);
        }
      }
    }

    return context.bot.sendMessage(chatId, 'Undefined ');
  });
}
