-- CreateTable
CREATE TABLE "roles" (
    "role" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role")
);

-- CreateTable
CREATE TABLE "fleets" (
    "fleet" TEXT NOT NULL,

    CONSTRAINT "fleets_pkey" PRIMARY KEY ("fleet")
);

-- CreateTable
CREATE TABLE "sailors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "sailors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "sailor_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "fleet" TEXT,
    "raceday_id" TEXT NOT NULL,
    "details" JSONB NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "finishes" (
    "id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "finished_at" TIMESTAMP(3) NOT NULL,
    "failure" TEXT,
    "note" TEXT,

    CONSTRAINT "finishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "races" (
    "id" TEXT NOT NULL,
    "raceday_id" TEXT NOT NULL,
    "fleet" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT[],

    CONSTRAINT "races_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "racedays" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weather" JSONB,
    "fleets" TEXT[],
    "config" JSONB,

    CONSTRAINT "racedays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_races_finishers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_races_finishers_AB_unique" ON "_races_finishers"("A", "B");

-- CreateIndex
CREATE INDEX "_races_finishers_B_index" ON "_races_finishers"("B");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_sailor_id_fkey" FOREIGN KEY ("sailor_id") REFERENCES "sailors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_role_fkey" FOREIGN KEY ("role") REFERENCES "roles"("role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_fleet_fkey" FOREIGN KEY ("fleet") REFERENCES "fleets"("fleet") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_raceday_id_fkey" FOREIGN KEY ("raceday_id") REFERENCES "racedays"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finishes" ADD CONSTRAINT "finishes_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "races" ADD CONSTRAINT "races_raceday_id_fkey" FOREIGN KEY ("raceday_id") REFERENCES "racedays"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "races" ADD CONSTRAINT "races_fleet_fkey" FOREIGN KEY ("fleet") REFERENCES "fleets"("fleet") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_races_finishers" ADD CONSTRAINT "_races_finishers_A_fkey" FOREIGN KEY ("A") REFERENCES "finishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_races_finishers" ADD CONSTRAINT "_races_finishers_B_fkey" FOREIGN KEY ("B") REFERENCES "races"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Default values

INSERT INTO "roles" ("role") VALUES ('Racer'), ('Race committee'), ('Volunteer'), ('Crash boat');

INSERT INTO "fleets" ("fleet") VALUES ('A'), ('B'), ('AB');