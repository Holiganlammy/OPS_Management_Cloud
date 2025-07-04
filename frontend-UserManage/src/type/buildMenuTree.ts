// types.ts หรืออยู่ใน component ก็ได้
export interface MenuItem {
  id: number;
  name: string;
  path: string;
  parent_id: number | null;
  order_no: number;
  children?: MenuItem[];
  badge?: string // <– สำหรับป้าย NEW
}

export function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const tree: MenuItem[] = [];
  const lookup: Record<number, MenuItem & { children: MenuItem[] }> = {};

  // สร้าง lookup และเพิ่ม children array ให้แต่ละ item
  items.forEach((item) => {
    lookup[item.id] = { ...item, children: [] };
  });

  // จัด hierarchy ตาม parent_id
  items.forEach((item) => {
    if (item.parent_id === null) {
      tree.push(lookup[item.id]);
    } else {
      const parent = lookup[item.parent_id];
      if (parent) {
        parent.children.push(lookup[item.id]);
      }
    }
  });

  return tree;
}
