-- CreateTable
CREATE TABLE "states" (
    "id" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,
    "isAwait" BOOLEAN NOT NULL DEFAULT true,
    "path" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "windows" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "windows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "states_chatId_key" ON "states"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "windows_date_key" ON "windows"("date");
