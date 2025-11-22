-- Create knowledge_base table to store website content
CREATE TABLE IF NOT EXISTS knowledge_base (
    id BIGSERIAL PRIMARY KEY,
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    meta_description TEXT,
    last_modified TIMESTAMPTZ DEFAULT NOW(),
    content_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create knowledge_scan_logs table to track scanning activity
CREATE TABLE IF NOT EXISTS knowledge_scan_logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    pages_scanned INTEGER NOT NULL DEFAULT 0,
    pages_updated INTEGER NOT NULL DEFAULT 0,
    pages_added INTEGER NOT NULL DEFAULT 0,
    errors_count INTEGER NOT NULL DEFAULT 0,
    scan_duration_ms INTEGER,
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_url ON knowledge_base(url);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content_hash ON knowledge_base(content_hash);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_last_modified ON knowledge_base(last_modified);
CREATE INDEX IF NOT EXISTS idx_knowledge_scan_logs_timestamp ON knowledge_scan_logs(timestamp);

-- Create full-text search index for content search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content_search ON knowledge_base USING gin(to_tsvector('english', title || ' ' || content || ' ' || meta_description));

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_knowledge_base_updated_at 
    BEFORE UPDATE ON knowledge_base 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add column to chatbot_interactions table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chatbot_interactions' AND column_name = 'used_knowledge_base') THEN
        ALTER TABLE chatbot_interactions ADD COLUMN used_knowledge_base BOOLEAN DEFAULT FALSE;
    END IF;
END $$;