import { AdstxtEntry, AdstxtManifest } from './interfaces';
import { isValidAccountType } from './utils/adstxt-helper';
import { isDomainName } from './utils/is-domain-name';

export const generateLineForEntry = (entry: AdstxtEntry): string => {
  const { advertisingSystemDomainName, publisherAccountId, accountType, certificationAuthorityId, comment } = entry;
  if (!isDomainName(advertisingSystemDomainName)) {
    throw new Error(`Failed generating ads.txt line: Invalid domain: ${advertisingSystemDomainName}`);
  }
  if (!publisherAccountId) {
    throw new Error("Failed generating ads.txt line: Invalid or missing publisher account ID");
  }
  if (!isValidAccountType(accountType)) {
    throw new Error(`Failed generating ads.txt line: Invalid account type: ${accountType}`);
  }
  let line = `${advertisingSystemDomainName}, ${publisherAccountId}, ${accountType}`;
  if (certificationAuthorityId && certificationAuthorityId.length > 0) {
    line += `, ${certificationAuthorityId}`;
  }
  if (comment && comment.length > 0) {
    line += ` # ${comment}`;
  }
  return line;
}

export const generateLineForVariable = (key: string, value: string | string[]): string => {
  if (Array.isArray(value)) {
    return value.map(single => `${key}=${single}`).join("\n");
  } else if (typeof value === "string") {
    return `${key}=${value}`;
  } else {
    throw new Error(`Failed generating ads.txt variable line: Invalid variable value: ${value}`);
  }
}

/**
 * Generate an ads.txt file from a manifest
 * @param manifest The manifest to use
 * @param header A header string to attach at the top of the ads.txt file
 * @param footer A footer string to attach at the bottom of the ads.txt file
 * @returns Generated ads.txt content
 */
export const generateAdsTxt = (manifest: AdstxtManifest, header: string, footer: string): string => {
  const { entries, variables } = manifest;
  const lines = [
    ...(entries || []).map(entry => generateLineForEntry(entry)),
    ...Object.keys(variables || {}).map(key => generateLineForVariable(key, manifest.variables[key]))
  ];
  if (header && header.length > 0) {
    lines.unshift(
      ...header
        .split("\n")
        .map(line => `# ${line}`)
    );
  }
  if (footer && footer.length > 0) {
    lines.push(
      ...footer
        .split("\n")
        .map(line => `# ${line}`)
    );
  }
  return lines.join("\n");
}
