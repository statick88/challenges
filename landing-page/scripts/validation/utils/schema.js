export const REQUIRED_FIELDS = ['title', 'category', 'difficulty', 'tags', 'date', 'status'];

export const VALID_CATEGORIES = ['linux', 'docker', 'devops', 'ctf'];

export const VALID_STATUSES = ['completed', 'in_progress', 'ready', 'blocked'];

export const DIFFICULTY_PATTERNS = {
  numeric: { min: 1, max: 5 },
  text: ['easy', 'medium', 'hard']
};

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const NAMING_PATTERNS = {
  linux: {
    dir: /^\d{2}-[a-z0-9-]+$/,
    file: 'README.md'
  },
  docker: {
    file: /^reto-\d{1,2}-[a-z0-9-]+\.md$/
  },
  devops: {
    file: /^day-\d{1,2}-[a-z0-9-]+\.md$/
  },
  ctf: {
    dir: /^\d{2}-[a-z0-9-]+$/,
    file: 'README.md'
  }
};
