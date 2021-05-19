/**
 * 
 */
export enum AdstxtAccountType {
  DIRECT = 'DIRECT',
  RESELLER = 'RESELLER',
};

/**
 * Ads.txt file manifest
 */
export interface AdstxtManifest {
  /**
   * All variables used in the ads.txt
   */
  entries: AdstxtEntry[];
  /**
   * All entries listed in the ads.txt
   */
  variables: AdstxtVariables;
}

/**
 * Ads.txt processed entry
 */
export interface AdstxtEntry {
  /**
   * The advertiser domain
   */
  advertisingSystemDomainName: string;
  /**
   * The ID of the publisher within the advertiser
   */
  publisherAccountId: string;
  /**
   * The type of account (DIRECT/RESELLER)
   */
  accountType: AdstxtAccountType;
  /**
   * The certificate authority ID for the advertiser
   */
  certificationAuthorityId?: string;
  /**
   * A comment at the end of the ads.txt line
   */
  comment?: string;
}

/**
 * 
 */
export interface AdstxtVariables {
  [key: string]: string | string[];
}

/**
 * 
 */
export interface AdstxtParseOptions {
  invalidLineAction: 'filter' | 'throw';
}
