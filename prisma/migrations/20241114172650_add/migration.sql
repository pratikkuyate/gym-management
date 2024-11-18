-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "monthlyMembership" DOUBLE PRECISION NOT NULL,
    "quarterlyMembership" DOUBLE PRECISION NOT NULL,
    "yearlyMembership" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
