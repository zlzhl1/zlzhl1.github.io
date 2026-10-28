export const SITE = {
  title: '朝辉的 AI 手记',
  description: '记录 Agent、知识库与自动化实践，把技术讲明白，也把工作想清楚。',
  author: '朝辉',
  githubUrl: 'https://github.com/zlzhl1',
  siteUrl: import.meta.env.PUBLIC_SITE_URL || 'https://zlzhl1.github.io',
};

export const CATEGORIES = [
  { id: 'project', name: '项目现场', description: '从需求到验收，记录一件事怎样做出来。', label: 'PROJECT NOTES', accent: '#2d665b' },
  { id: 'lab', name: '效率实验室', description: '把方法、工作流和工具变成可复用的实践。', label: 'WORKING LAB', accent: '#b65e37' },
  { id: 'explain', name: '技术白话', description: '从具体问题出发，把复杂原理讲明白。', label: 'PLAIN EXPLAINERS', accent: '#606690' },
  { id: 'journal', name: '个人手记', description: '关于工作、学习与成长，留下一些自己的判断。', label: 'PERSONAL JOURNAL', accent: '#8c6a40' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
