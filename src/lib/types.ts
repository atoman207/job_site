export type EmploymentType = '正社員' | '契約社員' | 'アルバイト・パート' | '派遣社員' | '業務委託';
export type SalaryType = 'monthly' | 'hourly' | 'annual';
export type JobStatus = 'published' | 'draft' | 'closed';

export interface Category {
  id: number;
  slug: string;
  name: string;
  emoji: string | null;
  sort: number;
}

export interface Company {
  id: string;
  name: string;
  catch_copy: string | null;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  founded_year: number | null;
  employee_count: string | null;
  pref_code: string;
  city: string;
  created_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  category_id: number;
  title: string;
  catch_copy: string | null;
  description: string;
  pref_code: string;
  city: string;
  address_detail: string | null;
  station: string | null;
  employment_type: EmploymentType;
  salary_type: SalaryType;
  salary_min: number | null;
  salary_max: number | null;
  work_hours: string | null;
  holidays: string | null;
  is_inexperienced_ok: boolean;
  is_no_academic_req: boolean;
  is_first_job_ok: boolean;
  has_dormitory: boolean;
  is_weekend_off: boolean;
  features: string[];
  benefits: string | null;
  image_url: string | null;
  status: JobStatus;
  is_featured: boolean;
  view_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// job_cards ビューの1行
export interface JobCard {
  id: string;
  title: string;
  catch_copy: string | null;
  pref_code: string;
  city: string;
  station: string | null;
  employment_type: EmploymentType;
  salary_type: SalaryType;
  salary_min: number | null;
  salary_max: number | null;
  is_inexperienced_ok: boolean;
  is_no_academic_req: boolean;
  is_first_job_ok: boolean;
  has_dormitory: boolean;
  is_weekend_off: boolean;
  features: string[];
  image_url: string | null;
  is_featured: boolean;
  status: JobStatus;
  published_at: string;
  view_count: number;
  company_id: string;
  company_name: string;
  company_logo: string | null;
  category_id: number;
  category_name: string;
  category_slug: string;
  category_emoji: string | null;
}

export interface JobDetail extends Job {
  company: Company;
  category: Category;
}
