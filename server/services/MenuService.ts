import { asc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { menu_items } from '~/server/db/schema';

export class MenuService {
  constructor(private db: ORM) {}

  list() {
    return this.db.select().from(menu_items).orderBy(asc(menu_items.ordem));
  }

  async replace(items: { label: string; path: string }[]) {
    const inserts = items.map((item, idx) =>
      this.db.insert(menu_items).values({ label: item.label, path: item.path, ordem: idx })
    );
    return this.db.batch([this.db.delete(menu_items), ...inserts] as any);
  }
}
