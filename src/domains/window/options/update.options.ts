import { SendMessageOptions } from 'node-telegram-bot-api';
import { addBackButton } from '../../../helpers/add-back-button.helper';

export const windowUpdateOptions: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          callback_data: '/win/u/isBooked',
          text: 'Отметить окошко как забронированное',
        },
      ],
      addBackButton('/start'),
    ],
  },
};
