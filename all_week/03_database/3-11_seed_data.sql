INSERT INTO users (full_name, email, role) VALUES
    ('Demo Administrator', 'admin@example.local', 'administrator'),
    ('Demo Editor', 'editor@example.local', 'standard_user'),
    ('Demo Guest', 'guest@example.local', 'guest')
ON CONFLICT (email) DO NOTHING;

INSERT INTO channels (name, platform) VALUES
    ('Instagram · @greenroom', 'instagram'),
    ('Facebook · Green Room', 'facebook'),
    ('LinkedIn · Green Room', 'linkedin')
ON CONFLICT DO NOTHING;

INSERT INTO posts (title, body, channel_id, status, scheduled_at, assignee, created_by)
SELECT sample.title, sample.body, channel.id, sample.status, sample.scheduled_at, sample.assignee, 1
FROM (VALUES
    ('Весенняя коллекция уже здесь', 'Показываем новые оттенки и детали весенней коллекции.', 'Instagram · @greenroom', 'scheduled', date_trunc('day', NOW()) + INTERVAL '2 days 10 hours', 'Мария Смирнова'),
    ('История нашего бренда', 'Короткий рассказ о том, с чего начался Green Room.', 'LinkedIn · Green Room', 'pending_approval', date_trunc('day', NOW()) + INTERVAL '4 days 14 hours', 'Андрей Озолс'),
    ('Выходные в Green Room', 'Подборка идей и вдохновения на выходные.', 'Facebook · Green Room', 'approved', date_trunc('day', NOW()) + INTERVAL '6 days 12 hours', 'Мария Смирнова'),
    ('План съёмки на май', 'Подготовить референсы для следующей фотосессии.', 'Instagram · @greenroom', 'draft', date_trunc('day', NOW()) + INTERVAL '10 days 11 hours', 'Лаура Берзиня'),
    ('Новость команды', 'Делимся итогами месяца и новостями команды.', 'LinkedIn · Green Room', 'published', date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '9 hours', 'Андрей Озолс')
) AS sample(title, body, channel_name, status, scheduled_at, assignee)
JOIN channels channel ON channel.name = sample.channel_name
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE posts.title = sample.title);
