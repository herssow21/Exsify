const VISITS_KEY = 'exsify_visits';
const SESSION_FLAG = 'exsify_visit_recorded';

export function recordVisit(): void {
  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    const visits: string[] = JSON.parse(localStorage.getItem(VISITS_KEY) || '[]');
    visits.push(new Date().toISOString());
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
    sessionStorage.setItem(SESSION_FLAG, 'true');
  } catch {
    // ignore storage errors
  }
}

export function getVisits(): string[] {
  try {
    return JSON.parse(localStorage.getItem(VISITS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getVisitsByDay(days: number): { date: string; visits: number }[] {
  const visits = getVisits();
  const counts = new Map<string, number>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    counts.set(key, 0);
  }

  for (const timestamp of visits) {
    const key = timestamp.split('T')[0];
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }

  return Array.from(counts.entries()).map(([date, visits]) => ({ date, visits }));
}
