import TelegramApi from 'node-telegram-bot-api';
import { adminIds } from '../../config';
import { adminOptions } from '../options';
import { clientOptions } from '../options/client.options';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function start(bot: TelegramApi, chatId: number) {
  await prisma.state.delete({
    where: {
      chatId,
    },
  });

  if (adminIds.includes(chatId)) {
    return bot.sendMessage(
      chatId,
      'Добро пожаловать в тестовую версию бота, выберите что вы хотите сделать',
      adminOptions,
    );
  }

  bot.sendMessage(
    chatId,
    'Добро пожаловать в тестовую версию бота, выберите что вы хотите сделать',
    clientOptions,
  );
}
