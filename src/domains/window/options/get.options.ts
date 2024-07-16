import { SendMessageOptions } from 'node-telegram-bot-api';
import { addBackButton } from '../../../helpers/add-back-button.helper';

export const windowGetOptions: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [{ callback_data: '/win/g/today', text: 'На сегодня' }],
      [{ callback_data: '/win/g/week', text: 'На этой неделе' }],
      [{ callback_data: '/win/g/nextweek', text: 'На следующей неделе' }],
      [{ callback_data: '/win/g/month', text: 'В этом месяц' }],
      [{ callback_data: '/win/g/all', text: 'Все' }],
      addBackButton('/start'),
    ],
  },
};
