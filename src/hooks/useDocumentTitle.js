import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    const base = 'AI Sprint';
    document.title = title ? `${title} | ${base}` : base;
  }, [title]);
}
