import { SendMessageOptions } from 'node-telegram-bot-api';

export const adminOptions: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          callback_data: '/win/create',
          text: 'Добавить окошки',
        },
      ],

      [{ callback_data: '/win/get', text: 'Посмотреть окошки' }],
      [
        {
          callback_data: '/win/update',
          text: 'Обновить окошко',
        },
      ],
      // [{ callback_data: '/win/update', text: 'Обновить окошко' }],
      // [{ callback_data: '/win/delete', text: 'Удалить окошко' }],
    ],
  },
};
