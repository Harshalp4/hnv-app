import { storage } from './storage';

export function generateRefNumber(prefix: string): string {
  const year = new Date().getFullYear();
  const counterKey = `counter:${prefix}:${year}`;
  const current = storage.get<number>(counterKey, 0);
  const next = current + 1;
  storage.set(counterKey, next);
  return `${prefix}-${year}-${String(next).padStart(4, '0')}`;
}

export function peekNextRefNumber(prefix: string): string {
  const year = new Date().getFullYear();
  const counterKey = `counter:${prefix}:${year}`;
  const current = storage.get<number>(counterKey, 0);
  return `${prefix}-${year}-${String(current + 1).padStart(4, '0')}`;
}
