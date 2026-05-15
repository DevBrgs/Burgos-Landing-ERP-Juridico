-- Agregar columna visible_cliente a documentos
-- Permite al abogado controlar qué documentos ve el cliente en su portal
ALTER TABLE documentos ADD COLUMN IF NOT EXISTS visible_cliente BOOLEAN NOT NULL DEFAULT false;
