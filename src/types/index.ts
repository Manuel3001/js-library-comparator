export interface Library {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  bundle_size_kb: number;
  github_stars: number;
  weekly_downloads: number;
  license: string;
  has_security_policy: boolean;
  unresolved_cves: number;
  pros: string[];
  cons: string[];
  code_example: string;
}