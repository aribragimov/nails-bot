import { SendMessageOptions } from 'node-telegram-bot-api';

export const adminOptions: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          callback_data: '/window/create',
          text: 'Добавить окошки',
        },
      ],

      [{ callback_data: '/window/get', text: 'Посмотреть окошки' }],
      // [{ callback_data: '/window/update', text: 'Обновить окошко' }],
      // [{ callback_data: '/window/delete', text: 'Удалить окошко' }],
    ],
  },
};
