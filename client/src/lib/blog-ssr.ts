export function consumeJsonPayload<T>(id: string): T | null {
  if (typeof document === "undefined") return null;

  const element = document.getElementById(id);
  if (!element) return null;

  const serialized = element.textContent || "";
  element.remove();

  try {
    return JSON.parse(serialized) as T;
  } catch {
    return null;
  }
}

export function getBlogPostSlugFromLocation(): string | null {
  if (typeof window === "undefined") return null;

  const match = window.location.pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}
