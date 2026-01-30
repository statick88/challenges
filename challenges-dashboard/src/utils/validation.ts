/**
 * Data validation utilities
 * Ensures data structure integrity and provides helpful error messages
 */

import type { ChallengesData, ProgramData, Overview } from '../types/challenges';

/**
 * Validate program data structure
 */
export function validateProgramData(data: any): data is ProgramData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.total === 'number' &&
    typeof data.completed === 'number' &&
    typeof data.percentage === 'number' &&
    typeof data.name === 'string' &&
    typeof data.icon === 'string' &&
    Array.isArray(data.recentActivity) &&
    Array.isArray(data.skills)
  );
}

/**
 * Validate overview data structure
 */
export function validateOverviewData(data: any): data is Overview {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.totalChallenges === 'number' &&
    typeof data.completed === 'number' &&
    typeof data.completionRate === 'number' &&
    typeof data.streak === 'number'
  );
}

/**
 * Validate complete challenges data structure
 * Returns true if valid, false otherwise
 */
export function validateChallengesData(data: any): data is ChallengesData {
  try {
    if (typeof data !== 'object' || data === null) return false;
    if (typeof data.lastUpdated !== 'string') return false;
    if (!validateOverviewData(data.overview)) return false;
    if (typeof data.programs !== 'object') return false;

    const programs = data.programs;
    if (
      !validateProgramData(programs.linux) ||
      !validateProgramData(programs.docker) ||
      !validateProgramData(programs.devops)
    ) {
      return false;
    }

    if (!Array.isArray(data.recentActivity)) return false;
    if (!Array.isArray(data.skills)) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Get error message for invalid data
 */
export function getDataValidationError(data: any): string | null {
  if (typeof data !== 'object' || data === null) {
    return 'Data is not an object';
  }

  if (typeof data.lastUpdated !== 'string') {
    return 'Missing or invalid lastUpdated field';
  }

  if (!validateOverviewData(data.overview)) {
    return 'Invalid or missing overview data';
  }

  if (typeof data.programs !== 'object') {
    return 'Missing programs data';
  }

  const programs = data.programs;
  if (!validateProgramData(programs.linux)) {
    return 'Invalid Linux program data';
  }
  if (!validateProgramData(programs.docker)) {
    return 'Invalid Docker program data';
  }
  if (!validateProgramData(programs.devops)) {
    return 'Invalid DevOps program data';
  }

  if (!Array.isArray(data.recentActivity)) {
    return 'Invalid recent activity data';
  }

  if (!Array.isArray(data.skills)) {
    return 'Invalid skills data';
  }

  return null;
}
