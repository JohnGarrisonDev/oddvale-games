-- Oddvale Games API: anonymous counts only. No column may ever hold an IP, a hash of one, a device ID or anything else about a person.
-- hour is "YYYY-MM-DDTHH" (UTC) for recent rows and "YYYY-MM-DD" once rolled up after 90 days.
CREATE TABLE IF NOT EXISTS votes (game TEXT NOT NULL, key TEXT NOT NULL, board TEXT NOT NULL, choice TEXT NOT NULL, hour TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (game, key, board, choice, hour));
CREATE TABLE IF NOT EXISTS scores (game TEXT NOT NULL, key TEXT NOT NULL, board TEXT NOT NULL, score INTEGER NOT NULL, hour TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (game, key, board, score, hour));
CREATE TABLE IF NOT EXISTS tells (game TEXT NOT NULL, choice TEXT NOT NULL, hour TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (game, choice, hour));
CREATE TABLE IF NOT EXISTS thumbs (game TEXT NOT NULL, up INTEGER NOT NULL, hour TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (game, up, hour));
CREATE TABLE IF NOT EXISTS pollvotes (poll TEXT NOT NULL, choice TEXT NOT NULL, hour TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (poll, choice, hour));
CREATE INDEX IF NOT EXISTS votes_by_key ON votes (key);
-- Kill switch: UPDATE settings SET value = '0' WHERE name = 'enabled' turns every widget off within 30 seconds, no redeploy.
CREATE TABLE IF NOT EXISTS settings (name TEXT PRIMARY KEY, value TEXT NOT NULL);
INSERT OR IGNORE INTO settings (name, value) VALUES ('enabled', '1');
