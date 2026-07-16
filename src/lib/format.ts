import { JobCard, SalaryType } from './types';
import { prefByCode } from './areas';

/** 給与を求職者にやさしい表記へ整形 */
export function formatSalary(
  type: SalaryType,
  min: number | null,
  max: number | null,
): string {
  const unit = type === 'hourly' ? '円' : '万円';
  const suffix =
    type === 'hourly' ? '' : type === 'annual' ? '' : '';
  const label =
    type === 'hourly' ? '時給' : type === 'annual' ? '年収' : '月給';

  const fmt = (n: number) =>
    type === 'hourly' ? n.toLocaleString('ja-JP') : String(n);

  if (min && max && min !== max) {
    return `${label} ${fmt(min)}〜${fmt(max)}${unit}${suffix}`;
  }
  if (min) return `${label} ${fmt(min)}${unit}〜${suffix}`;
  if (max) return `${label} 〜${fmt(max)}${unit}${suffix}`;
  return `${label} 応相談`;
}

/** 勤務地を「東京都 渋谷区」の形に */
export function formatLocation(prefCode: string, city: string): string {
  const pref = prefByCode(prefCode);
  return pref ? `${pref.name} ${city}` : city;
}

/** 求人カードの魅力バッジを収集 */
export function jobBadges(job: JobCard): string[] {
  const badges: string[] = [];
  if (job.is_inexperienced_ok) badges.push('未経験歓迎');
  if (job.is_no_academic_req) badges.push('学歴不問');
  if (job.is_first_job_ok) badges.push('第二新卒OK');
  if (job.is_weekend_off) badges.push('土日祝休み');
  if (job.has_dormitory) badges.push('寮・社宅あり');
  return badges;
}

/** 「3日前に掲載」的な表記 */
export function relativeDate(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now.getTime() - then);
  const day = 24 * 60 * 60 * 1000;
  const days = Math.floor(diff / day);
  if (days <= 0) return '本日掲載';
  if (days === 1) return '昨日掲載';
  if (days < 7) return `${days}日前に掲載`;
  if (days < 30) return `${Math.floor(days / 7)}週間前に掲載`;
  return `${Math.floor(days / 30)}ヶ月前に掲載`;
}
