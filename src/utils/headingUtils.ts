// src/utils/headingUtils.ts

export const generateHeadingId = (text: string, index?: number): string => {
  const cleanText = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `heading-${cleanText}`;
};

export const extractTextFromChildren = (children: any[]): string => {
  if (!children) return '';
  return children.map((child: any) => {
    if (typeof child === 'string') return child;
    if (child.text) return child.text;
    if (child.children) return extractTextFromChildren(child.children);
    return '';
  }).join('');
};