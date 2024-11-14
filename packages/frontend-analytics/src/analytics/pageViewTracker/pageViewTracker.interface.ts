export interface PageViewEventInterface {
  event: string; // page_view_ga4
  page_view: {
    language: string;
    location: string;
    organisations: string; // <OT1056>
    primary_publishing_organisation: string; // government digital service - digital identity
    status_code: string;
    title: string;
    referrer: string;
    taxonomy_level1: string;
    taxonomy_level2: string;
    content_id: string;
    logged_in_status: string;
    dynamic: string;
    taxonomy_level3?: string;
    taxonomy_level4?: string;
    taxonomy_level5?: string;
    first_published_at?: string;
    updated_at?: string;
    relying_party?: string;
  };
}

export interface PageViewParametersInterface {
  statusCode: number;
  englishPageTitle: string;
  taxonomy_level1: string;
  taxonomy_level2: string;
  content_id: string;
  logged_in_status: boolean;
  dynamic: boolean;
  taxonomy_level3?: string;
  taxonomy_level4?: string;
  taxonomy_level5?: string;
}

export interface GTMInitInterface {
  event: string;
  "gtm.allowlist": string[];
  "gtm.blocklist": string[];
  "gtm.start": number;
}

export enum TaxonomyLevels {
  Level1 = "taxonomy_level1",
  Level2 = "taxonomy_level2",
  Level3 = "taxonomy_level3",
  Level4 = "taxonomy_level4",
  Level5 = "taxonomy_level5",
}
