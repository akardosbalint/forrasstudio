-- DropIndex
DROP INDEX "email_templates_key_key";

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'hu';

-- AlterTable
ALTER TABLE "questionnaire_questions" ADD COLUMN     "help_text_en" TEXT,
ADD COLUMN     "label_en" TEXT,
ADD COLUMN     "options_en" JSONB;

-- AlterTable
ALTER TABLE "email_templates" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'hu';

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_key_locale_key" ON "email_templates"("key", "locale");

