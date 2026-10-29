import { getCollection, type CollectionEntry } from 'astro:content';

const columnFiles = import.meta.glob('../content/columns/*.md', { query: '?raw', import: 'default' });

export async function getColumns(): Promise<CollectionEntry<'columns'>[]> {
  if (Object.keys(columnFiles).length === 0) return [];
  const columns = await getCollection('columns');
  return columns.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'zh-CN') || a.id.localeCompare(b.id));
}

export async function getPosts() {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const [posts, columns] = await Promise.all([getCollection('posts'), getColumns()]);
  const columnIds = new Set(columns.map((column) => column.id));
  for (const post of posts) {
    if (post.data.column && !columnIds.has(post.data.column.id)) {
      throw new Error(`文章 "${post.id}" 的栏目 "${post.data.column.id}" 不存在。请先创建对应的栏目 Markdown 文件，或移除文章的 column 字段。`);
    }
  }
  return posts
    .filter(({ data }) => !data.draft && data.date.toISOString().slice(0, 10) <= today)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export function url(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}

export function postPath(post: CollectionEntry<'posts'>) {
  return url(`posts/${post.id}/`);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function columnPath(column: CollectionEntry<'columns'>) {
  return url(`columns/${column.id}/`);
}

export async function getPostColumn(post: CollectionEntry<'posts'>): Promise<CollectionEntry<'columns'> | undefined> {
  const reference = post.data.column;
  if (!reference) return undefined;
  const column = (await getColumns()).find((entry) => entry.id === reference.id);
  if (!column) throw new Error(`文章 "${post.id}" 的栏目 "${reference.id}" 不存在。`);
  return column;
}

export function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!);
}
