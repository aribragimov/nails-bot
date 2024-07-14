import { SendMessageOptions } from 'node-telegram-bot-api';
import { addBackButton } from '../../../helpers';

export const getWindowsOptions: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [{ callback_data: '/window/get/today', text: 'На сегодня' }],
      [{ callback_data: '/window/get/week', text: 'На этой неделе' }],
      [{ callback_data: '/window/get/month', text: 'В этом месяц' }],
      [{ callback_data: '/window/get/all', text: 'Все' }],
      addBackButton('/start'),
    ],
  },
};
