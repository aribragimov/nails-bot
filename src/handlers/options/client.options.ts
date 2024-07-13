import { SendMessageOptions } from 'node-telegram-bot-api';

export const clientOptions: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      // [{ text: '/get/prise', callback_data: 'Хочу узнать цены' }],
      [
        {
          callback_data: '/window/get',
          text: 'Хочу узнать когда есть свободные окошки',
        },
      ],
    ],
  },
};
