export function generateMailtoLink(to: string, subject: string, body: string, cc?: string): string {
  const params = new URLSearchParams();
  params.set('subject', subject);
  params.set('body', body);
  if (cc) params.set('cc', cc);
  return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}
