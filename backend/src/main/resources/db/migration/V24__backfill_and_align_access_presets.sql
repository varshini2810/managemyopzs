-- Backfill access_presets null values
UPDATE access_presets SET created_by = 'SYSTEM' WHERE created_by IS NULL;

-- Modify access_presets.created_by to NOT NULL
ALTER TABLE access_presets MODIFY created_by VARCHAR(100) NOT NULL;
