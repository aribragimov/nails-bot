import { adminIds } from '../../config';
import { adminOptions } from '../options';
import { clientOptions } from '../options/client.options';
import { Context } from '../..';

export async function start(
  context: Context,

  chatId: number,
) {
  await context.prisma.state.delete({
    where: {
      chatId,
    },
  });

  if (adminIds.includes(chatId)) {
    return context.bot.sendMessage(
      chatId,
      'Добро пожаловать в тестовую версию бота, выберите что вы хотите сделать',
      adminOptions,
    );
  }

  context.bot.sendMessage(
    chatId,
    'Добро пожаловать в тестовую версию бота, выберите что вы хотите сделать',
    clientOptions,
  );
}
