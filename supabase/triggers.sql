CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS 'BEGIN NEW.actualizado_en = NOW(); RETURN NEW; END;' LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tr_abogados_updated ON abogados;
CREATE TRIGGER tr_abogados_updated BEFORE UPDATE ON abogados FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS tr_expedientes_updated ON expedientes;
CREATE TRIGGER tr_expedientes_updated BEFORE UPDATE ON expedientes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS tr_posts_updated ON posts;
CREATE TRIGGER tr_posts_updated BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
