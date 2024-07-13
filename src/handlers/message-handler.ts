import { start } from './start';
import { createWindow } from '../domains/window';
import { createWindowRegex } from '../domains/window/regex';
import { Context } from '..';

export function messageHandler(context: Context) {
  context.bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(msg);

    if (text) {
      if (text === '/start') {
        return start(context, msg.chat.id);
      }

      if (createWindowRegex.test(text)) {
        const checkAwait = await context.prisma.state.findUnique({
          where: { chatId },
          select: { isAwait: true },
        });

        if (checkAwait?.isAwait) {
          return createWindow(context, chatId, text);
        }
      }
    }

    return context.bot.sendMessage(chatId, 'Undefined ');
  });
}
