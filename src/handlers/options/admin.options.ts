import { SendMessageOptions } from 'node-telegram-bot-api';

export const adminOptions: SendMessageOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          callback_data: '/window/create/many',
          text: 'Добавить несколько окошек',
        },
      ],
      [{ callback_data: '/window/create', text: 'Добавить окошко' }],
      [{ callback_data: '/window/get/all', text: 'Посмотреть окошки' }],
      // [{ callback_data: '/window/update', text: 'Обновить окошко' }],
      // [{ callback_data: '/window/delete', text: 'Удалить окошко' }],
    ],
  },
};
