// 博客分类元数据：slug → 展示信息
export const CATEGORIES = {
  ios: {
    name: 'iOS 手记',
    en: 'iOS Notes',
    desc: 'Objective-C、UIKit 与底层原理的学习记录',
  },
  notes: {
    name: '技术笔记',
    en: 'Tech Notes',
    desc: 'AI、工具链与各种折腾的过程记录',
  },
  essays: {
    name: '随笔',
    en: 'Essays',
    desc: '代码之外的想法与生活',
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

export const isCategory = (v: string): v is CategorySlug => v in CATEGORIES;

export const formatDate = (d: Date) =>
  `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
