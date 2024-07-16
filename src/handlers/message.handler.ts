import { start } from '../domains/start/start';
import { createWindow } from '../domains/window/window.create';
import { createWindowMany } from '../domains/window/window.create';

import { createWindowManyRegex } from '../domains/window/regex/create.regex';
import { createWindowRegex } from '../domains/window/regex/create.regex';
import { Context } from '..';

export function messageHandler(context: Context) {
  context.bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text) {
      if (text === '/start') {
        return start(context, msg.chat.id);
      } else if (createWindowManyRegex.test(text)) {
        return createWindowMany(context, chatId, text);
      } else if (createWindowRegex.test(text)) {
        return createWindow(context, chatId, text);
      }
    }

    return context.bot.sendMessage(chatId, 'Undefined ');
  });
}
