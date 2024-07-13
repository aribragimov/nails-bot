import { SendMessageOptions } from 'node-telegram-bot-api';

export const getWindowsOptions: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [{ callback_data: '/window/get/all', text: 'Все' }],
      [{ callback_data: '/window/get/month', text: 'В этом месяце' }],
      [{ callback_data: '/window/get/week', text: 'На этой неделе' }],
      [{ callback_data: '/window/get/day', text: 'Сегодня' }],
    ],
  },
};
