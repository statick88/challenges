export const translations = {
  es: {
    // Brand
    'brand': 'Tech Challenges',
    
    // Hero
    'hero.badge': 'Plataforma de Aprendizaje',
    'hero.title.line1': 'Domina Linux, Docker,',
    'hero.title.line2': 'DevOps & Security',
    'hero.subtitle': 'Plataforma interactiva con 70+ desafíos prácticos. Aprende haciendo, no solo leyendo.',
    'hero.stat.completed': 'Completados',
    'hero.stat.progress': 'Progreso',
    'hero.stat.challenges': 'Desafíos',
    
    // Progress
    'progress.title': 'Progreso General',
    'progress.completed': 'completados',
    'progress.in_progress': 'en progreso',
    'progress.blocked': 'bloqueados',
    
    // Programs
    'programs.title': 'Programas de Aprendizaje',
    'programs.subtitle': 'Selecciona un programa para ver sus desafíos',
    'programs.completed': 'Completados',
    'programs.total': 'Total',
    'programs.view': 'Ver desafíos',
    
    // Program names
    'program.linux': 'Linux',
    'program.docker': 'Docker',
    'program.devops': 'DevOps',
    'program.ctf': 'CTF',
    'program.htb': 'HTB Academy',
    
    // Program descriptions
    'program.linux.desc': 'Administración de sistemas Linux, usuarios, permisos y automatización',
    'program.docker.desc': 'Containerización, orquestación y mejores prácticas de Docker',
    'program.devops.desc': 'CI/CD, automatización y cultura DevOps',
    'program.ctf.desc': 'Desafíos de seguridad: criptografía, web, forense y más',
    'program.htb.desc': 'Módulos de Hack The Box Academy completados',
    
    // Certifications
    'cert.title': 'Certificaciones Obtenidas',
    'cert.subtitle': 'Reconocimientos oficiales de tu progreso',
    'cert.docker.title': 'Docker Certification',
    'cert.docker.platform': 'KodeKloud Engineer',
    'cert.challenges': 'Challenges',
    'cert.verify': 'Verificar Certificado',
    
    // Activity
    'activity.title': 'Actividad Reciente',
    'activity.subtitle': 'Últimos desafíos completados',
    
    // Footer
    'footer.update': 'Última actualización',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.linux': 'Linux',
    'nav.docker': 'Docker',
    'nav.devops': 'DevOps',
    'nav.ctf': 'CTF',
    'nav.htb': 'HTB',
    
    // Theme
    'theme.toggle': 'Cambiar tema',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    
    // Language
    'lang.toggle': 'Cambiar idioma',
  },
  en: {
    // Brand
    'brand': 'Tech Challenges',
    
    // Hero
    'hero.badge': 'Learning Platform',
    'hero.title.line1': 'Master Linux, Docker,',
    'hero.title.line2': 'DevOps & Security',
    'hero.subtitle': 'Interactive platform with 70+ practical challenges. Learn by doing, not just reading.',
    'hero.stat.completed': 'Completed',
    'hero.stat.progress': 'Progress',
    'hero.stat.challenges': 'Challenges',
    
    // Progress
    'progress.title': 'Overall Progress',
    'progress.completed': 'completed',
    'progress.in_progress': 'in progress',
    'progress.blocked': 'blocked',
    
    // Programs
    'programs.title': 'Learning Programs',
    'programs.subtitle': 'Select a program to view its challenges',
    'programs.completed': 'Completed',
    'programs.total': 'Total',
    'programs.view': 'View challenges',
    
    // Program names
    'program.linux': 'Linux',
    'program.docker': 'Docker',
    'program.devops': 'DevOps',
    'program.ctf': 'CTF',
    'program.htb': 'HTB Academy',
    
    // Program descriptions
    'program.linux.desc': 'Linux system administration, users, permissions and automation',
    'program.docker.desc': 'Containerization, orchestration and Docker best practices',
    'program.devops.desc': 'CI/CD, automation and DevOps culture',
    'program.ctf.desc': 'Security challenges: cryptography, web, forensics and more',
    'program.htb.desc': 'Completed Hack The Box Academy modules',
    
    // Certifications
    'cert.title': 'Earned Certifications',
    'cert.subtitle': 'Official recognition of your progress',
    'cert.docker.title': 'Docker Certification',
    'cert.docker.platform': 'KodeKloud Engineer',
    'cert.challenges': 'Challenges',
    'cert.verify': 'Verify Certificate',
    
    // Activity
    'activity.title': 'Recent Activity',
    'activity.subtitle': 'Latest completed challenges',
    
    // Footer
    'footer.update': 'Last updated',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.linux': 'Linux',
    'nav.docker': 'Docker',
    'nav.devops': 'DevOps',
    'nav.ctf': 'CTF',
    'nav.htb': 'HTB',
    
    // Theme
    'theme.toggle': 'Toggle theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    
    // Language
    'lang.toggle': 'Change language',
  }
};

export type Language = 'es' | 'en';
export type TranslationKey = keyof typeof translations.es;
