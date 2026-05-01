export interface MenuItem {
  id: number;
  label: string;
  path: string;
  ordem: number;
}

export function dbListMenu(db: D1Database) {
  return db.prepare('SELECT * FROM menu_items ORDER BY ordem ASC').all<MenuItem>();
}

export async function dbReplaceMenu(db: D1Database, items: { label: string; path: string }[]) {
  const stmts = [
    db.prepare('DELETE FROM menu_items'),
    ...items.map((item, idx) =>
      db.prepare('INSERT INTO menu_items (label, path, ordem) VALUES (?, ?, ?)').bind(item.label, item.path, idx),
    ),
  ];
  return db.batch(stmts);
}
