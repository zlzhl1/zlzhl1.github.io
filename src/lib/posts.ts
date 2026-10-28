import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, type CategoryId } from '../config';

export async function getPosts() {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const posts = await getCollection('posts', ({ data }) => !data.draft && data.date.toISOString().slice(0, 10) <= today);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
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

export function categoryFor(id: CategoryId | string) {
  return CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[0];
}

export function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!);
}
