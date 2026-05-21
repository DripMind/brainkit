// Gestion du quota gratuit côté client (localStorage)
// 3 générations/jour pour les users gratuits

export const FREE_LIMIT = 3;

export function getTodayKey(): string {
  return `revise_quota_${new Date().toISOString().split('T')[0]}`;
}

export function getQuotaUsed(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(getTodayKey()) || '0', 10);
}

export function incrementQuota(): void {
  if (typeof window === 'undefined') return;
  const key = getTodayKey();
  const current = parseInt(localStorage.getItem(key) || '0', 10);
  localStorage.setItem(key, String(current + 1));
}

export function hasReachedLimit(): boolean {
  return getQuotaUsed() >= FREE_LIMIT;
}

export function getRemainingGenerations(): number {
  return Math.max(0, FREE_LIMIT - getQuotaUsed());
}

// Vérifie si l'user a un accès Pro (token stocké après paiement Stripe)
export function isProUser(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('revise_pro_token');
  if (!token) return false;
  try {
    const { expires } = JSON.parse(atob(token.split('.')[1] || ''));
    return Date.now() < expires;
  } catch {
    return !!token; // fallback si pas de JWT structuré
  }
}
