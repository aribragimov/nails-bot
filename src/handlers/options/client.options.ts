import { SendMessageOptions } from 'node-telegram-bot-api';

export const clientOptions: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      // [{ text: '/g/prise', callback_data: 'Хочу узнать цены' }],
      [
        {
          callback_data: '/win/get',
          text: 'Хочу узнать когда есть свободные окошки',
        },
      ],
    ],
  },
};
