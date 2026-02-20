import type { Programs, ProgramKey } from '../types/challenges';

export const PROGRAM_COLORS: Record<ProgramKey, { bg: string; border: string; icon: string }> = {
  linux: { bg: 'bg-gradient-to-br from-orange-500/20 to-red-600/20', border: 'border-orange-500/30', icon: 'text-orange-400' },
  docker: { bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-600/20', border: 'border-blue-500/30', icon: 'text-blue-400' },
  devops: { bg: 'bg-gradient-to-br from-purple-500/20 to-pink-600/20', border: 'border-purple-500/30', icon: 'text-purple-400' },
  ctf: { bg: 'bg-gradient-to-br from-green-500/20 to-emerald-600/20', border: 'border-green-500/30', icon: 'text-green-400' },
  htb: { bg: 'bg-gradient-to-br from-teal-500/20 to-cyan-600/20', border: 'border-teal-500/30', icon: 'text-teal-400' },
};

export const CTF_ICONS: Record<string, string> = {
  forensics: '🔍',
  crypto: '🔐',
  web: '🌐',
  pwn: '💥',
  reversing: '🔄',
  misc: '📦',
  academy: '🎓',
  ctf: '🚩',
};

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function calculateProgramStats(programs: Programs) {
  let blockedCount = 0;
  let inProgressCount = 0;
  let readyCount = 0;

  Object.values(programs).forEach((program) => {
    blockedCount += program.blocked || 0;
    inProgressCount += program.inProgress || 0;
    readyCount += program.ready || 0;
  });

  return { blockedCount, inProgressCount, readyCount };
}

export function getProgramPercentage(program: Programs[ProgramKey]): number {
  return program.percentage || Math.round((program.completed / program.total) * 100);
}
