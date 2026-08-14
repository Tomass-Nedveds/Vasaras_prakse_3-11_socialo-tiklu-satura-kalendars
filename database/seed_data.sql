-- Fiktīvi dati lokālai izstrādei. Šeit nav īstu lietotāju vai paroļu.

INSERT INTO users (full_name, email, role) VALUES
    ('Demo administrators', 'admin@example.local', 'administrator'),
    ('Demo redaktors', 'editor@example.local', 'standard_user'),
    ('Demo viesis', 'guest@example.local', 'guest')
ON CONFLICT (email) DO NOTHING;

INSERT INTO channels (name, platform) VALUES
    ('Instagram · @greenroom', 'instagram'),
    ('Facebook · Green Room', 'facebook'),
    ('LinkedIn · Green Room', 'linkedin')
ON CONFLICT (name, platform) DO NOTHING;

INSERT INTO posts (title, body, channel_id, status, scheduled_at, assignee, created_by)
SELECT sample.title, sample.body, channel.id, sample.status, sample.scheduled_at,
       sample.assignee, administrator.id
FROM (VALUES
    ('Pavasara kolekcija ir klāt', 'Jaunās pavasara kolekcijas krāsas un detaļas.', 'Instagram · @greenroom', 'scheduled', date_trunc('day', NOW()) + INTERVAL '2 days 10 hours', 'Marija Smirnova'),
    ('Mūsu zīmola stāsts', 'Īss stāsts par Green Room izveidi.', 'LinkedIn · Green Room', 'pending_approval', date_trunc('day', NOW()) + INTERVAL '4 days 14 hours', 'Andris Ozols'),
    ('Nedēļas nogale Green Room', 'Idejas un iedvesma nedēļas nogalei.', 'Facebook · Green Room', 'approved', date_trunc('day', NOW()) + INTERVAL '6 days 12 hours', 'Marija Smirnova'),
    ('Maija fotosesijas plāns', 'Sagatavot nākamās fotosesijas vizuālās atsauces.', 'Instagram · @greenroom', 'draft', date_trunc('day', NOW()) + INTERVAL '10 days 11 hours', 'Laura Bērziņa'),
    ('Komandas jaunumi', 'Mēneša rezultāti un komandas jaunumi.', 'LinkedIn · Green Room', 'published', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '9 hours', 'Andris Ozols')
) AS sample(title, body, channel_name, status, scheduled_at, assignee)
JOIN channels channel ON channel.name = sample.channel_name
CROSS JOIN users administrator
WHERE administrator.email = 'admin@example.local'
  AND NOT EXISTS (SELECT 1 FROM posts WHERE posts.title = sample.title);

INSERT INTO post_approvals (post_id, reviewer_id, status, comment, reviewed_at)
SELECT post.id,
       reviewer.id,
       sample.status,
       sample.comment,
       CASE WHEN sample.status = 'pending' THEN NULL ELSE CURRENT_TIMESTAMP - INTERVAL '1 day' END
FROM (VALUES
    ('Pavasara kolekcija ir klāt', 'editor@example.local', 'pending', ''),
    ('Mūsu zīmola stāsts', 'admin@example.local', 'rejected', 'Lūdzu, precizēt publikācijas noslēgumu.'),
    ('Nedēļas nogale Green Room', 'admin@example.local', 'approved', 'Apstiprināts publicēšanai.')
) AS sample(post_title, reviewer_email, status, comment)
JOIN posts post ON post.title = sample.post_title
JOIN users reviewer ON reviewer.email = sample.reviewer_email
WHERE NOT EXISTS (
    SELECT 1 FROM post_approvals approval
    WHERE approval.post_id = post.id AND approval.reviewer_id = reviewer.id
);

INSERT INTO assets (post_id, uploaded_by, file_name, file_url, mime_type, file_size_bytes, alt_text)
SELECT post.id, uploader.id, sample.file_name, sample.file_url,
       sample.mime_type, sample.file_size_bytes, sample.alt_text
FROM (VALUES
    ('Pavasara kolekcija ir klāt', 'editor@example.local', 'pavasara-kolekcija.jpg', '/assets/pavasara-kolekcija.jpg', 'image/jpeg', 245760, 'Pavasara kolekcijas produktu foto'),
    ('Mūsu zīmola stāsts', 'admin@example.local', 'greenroom-komanda.png', '/assets/greenroom-komanda.png', 'image/png', 183500, 'Green Room komanda')
) AS sample(post_title, uploader_email, file_name, file_url, mime_type, file_size_bytes, alt_text)
JOIN posts post ON post.title = sample.post_title
JOIN users uploader ON uploader.email = sample.uploader_email
WHERE NOT EXISTS (
    SELECT 1 FROM assets asset
    WHERE asset.post_id = post.id AND asset.file_name = sample.file_name
);
