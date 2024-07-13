import TelegramApi from 'node-telegram-bot-api';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { messageHandler } from './handlers';
import { callbackQueryHandler } from './handlers/callback-query-handler';

const prisma = new PrismaClient();

async function start() {
  config();

  const token = process.env.BOT_TOKEN!;
  const bot = new TelegramApi(token, { polling: true });

  await bot.setMyCommands([
    {
      command: '/start',
      description: 'Запустить бота',
    },
  ]);

  messageHandler(bot);
  callbackQueryHandler(bot);
}

start()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

console.log('Bot successfully started 🚀');
