import { adminIds } from '../../config';
import { adminOptions } from '../../handlers/options/admin.options';
import { clientOptions } from '../../handlers/options/client.options';
import { Context } from '../..';

export async function start(
  context: Context,

  chatId: number,
) {
  const checkState = await context.prisma.state.findUnique({
    where: {
      chatId,
    },
  });

  if (checkState) {
    await context.prisma.state.delete({
      where: {
        chatId,
      },
    });
  }

  if (adminIds.includes(chatId)) {
    return context.bot.sendMessage(
      chatId,
      'Добро пожаловать в тестовую версию бота,\n выберите что вы хотите сделать:',
      adminOptions,
    );
  }

  await context.bot.sendMessage(
    chatId,
    'Добро пожаловать в тестовую версию бота,\n выберите что вы хотите сделать:',
    clientOptions,
  );
}
