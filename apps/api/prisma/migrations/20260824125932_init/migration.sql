-- CreateExtension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "company_name" VARCHAR(200) NOT NULL,
    "website" VARCHAR(255) NOT NULL,
    "industry" VARCHAR(100) NOT NULL,
    "employee_count" INTEGER NOT NULL CHECK (employee_count >= 0),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companies_created_at_idx" ON "companies"("created_at");

-- CreateIndex
CREATE INDEX "idx_companies_name_trgm" ON "companies" USING GIN ("company_name" gin_trgm_ops);
