export type UserRole = 'titular' | 'asociado' | 'pasante' | 'secretaria';

export interface RoleConfig {
  label: string;
  badgeClass: string;
}

export const ROLES: Record<UserRole, RoleConfig> = {
  titular: {
    label: 'Titular',
    badgeClass: 'bg-jack-gold/20 text-jack-gold border border-jack-gold/30',
  },
  asociado: {
    label: 'Asociado',
    badgeClass: 'bg-blue-900/30 text-blue-400 border border-blue-900/30',
  },
  pasante: {
    label: 'Pasante',
    badgeClass: 'bg-purple-900/30 text-purple-400 border border-purple-900/30',
  },
  secretaria: {
    label: 'Secretaria',
    badgeClass: 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/30',
  },
};

export function getUserRole(): UserRole {
  if (typeof window === 'undefined') return 'titular';
  return (localStorage.getItem('user_role') as UserRole) || 'titular';
}

export function setUserRole(role: UserRole) {
  localStorage.setItem('user_role', role);
}

const routeAccess: Record<string, UserRole[]> = {
  '/laboral': ['titular', 'asociado', 'pasante'],
  '/codex': ['titular', 'asociado', 'pasante'],
  '/protocolo': ['titular', 'asociado'],
  '/plantillas': ['titular', 'asociado'],
  '/investigacion': ['titular', 'asociado', 'pasante'],
  '/expedientes': ['titular', 'asociado', 'pasante', 'secretaria'],
  '/clientes': ['titular', 'asociado', 'pasante', 'secretaria'],
  '/calendario': ['titular', 'asociado', 'pasante', 'secretaria'],
};

export function canAccessRoute(role: UserRole, route: string): boolean {
  const allowed = routeAccess[route];
  if (!allowed) return true;
  return allowed.includes(role);
}

export function canCreate(role: UserRole): boolean {
  return ['titular', 'asociado', 'secretaria'].includes(role);
}

export function canDelete(role: UserRole): boolean {
  return role === 'titular';
}

export function canEdit(role: UserRole): boolean {
  return ['titular', 'asociado', 'secretaria'].includes(role);
}
