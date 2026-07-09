import { asc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { menu_items } from '~/server/db/schema';

export interface MenuTreeItem {
  label: string;
  path: string;
  blank: boolean;
  children?: MenuTreeItem[];
}

export class MenuService {
  constructor(private db: ORM) {}

  list() {
    return this.db.select().from(menu_items).orderBy(asc(menu_items.ordem));
  }

  /** Menu aninhado (1 nível): topo ordenado por ordem, filhos idem. */
  async tree(): Promise<MenuTreeItem[]> {
    const all = await this.list();
    return all
      .filter((i) => i.parent_id == null)
      .map((p) => {
        const children = all
          .filter((c) => c.parent_id === p.id)
          .map((c) => ({ label: c.label, path: c.path, blank: c.blank }));
        return {
          label: p.label,
          path: p.path,
          blank: p.blank,
          ...(children.length ? { children } : {}),
        };
      });
  }

  /**
   * Substitui o menu inteiro (delete-all + reinsert em batch).
   * IDs são atribuídos explicitamente para que os filhos referenciem o pai
   * dentro do mesmo batch. Aninhamento máximo: 1 nível (filhos de filhos são ignorados).
   */
  async replace(items: MenuTreeItem[]) {
    const rows: Array<typeof menu_items.$inferInsert> = [];
    let nextId = 1;

    items.forEach((item, idx) => {
      const parentId = nextId++;
      rows.push({ id: parentId, label: item.label, path: item.path, blank: item.blank, ordem: idx, parent_id: null });
      (item.children ?? []).forEach((child, cidx) => {
        rows.push({ id: nextId++, label: child.label, path: child.path, blank: child.blank, ordem: cidx, parent_id: parentId });
      });
    });

    return this.db.batch([
      this.db.delete(menu_items),
      ...rows.map((r) => this.db.insert(menu_items).values(r)),
    ] as any);
  }
}
