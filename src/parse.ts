import { AdstxtEntry, AdstxtManifest, AdstxtParseOptions, AdstxtVariables } from './interfaces';
import { isComment, isEmptyLine, isValidAccountType, isVariableAssignment, stripComment, toAccountType, VARIABLE_DEFINITION } from './utils/adstxt-helper';
import { isDomainName } from './utils/is-domain-name';

const DEFAULT_OPTIONS: AdstxtParseOptions = {
  invalidLineAction: 'filter',
};

export const isDataEntry = (line: string): boolean => {
  const { main: commentStrippedLine } = stripComment(line);
  try {
    const [domain, , accountType] = commentStrippedLine.split(",").map(item => item.trim());
    return [
      isDomainName(domain),
      isValidAccountType(accountType)
    ].every(result => result);
  } catch (err) {
    // silently fail
    return false;
  }
}

export const createDataEntry = (line: string): AdstxtEntry => {
  const { main: commentStrippedLine, comment } = stripComment(line);
  const [advertisingSystemDomainName, publisherAccountId, accountType, certificationAuthorityId] = commentStrippedLine
    .split(",")
    .map(item => decodeURIComponent(item.trim()));
  const entry: AdstxtEntry = {
    advertisingSystemDomainName: advertisingSystemDomainName.toLowerCase(),
    publisherAccountId,
    accountType: toAccountType(accountType),
    certificationAuthorityId
  };
  if (comment && comment.length > 0) {
    entry.comment = comment;
  }
  return entry;
}

/**
 * Parse ads.txt data
 *
 * @param text The ads.txt string
 * @param parseOptions Parser options
 * @returns A processed manifest
 */
export const parseAdsTxt = (text: string, parseOptions: AdstxtParseOptions = DEFAULT_OPTIONS): AdstxtManifest => {
  const { invalidLineAction }: AdstxtParseOptions = { ...DEFAULT_OPTIONS, ...parseOptions };
  if (['filter', 'throw'].includes(invalidLineAction) !== true) {
    throw new Error(`Invalid option value for 'invalidLineAction' (must be 'filter' or 'throw'): ${invalidLineAction}`);
  }
  const lines = text.split("\n");
  const entries: AdstxtEntry[] = [];
  const variables: AdstxtVariables = {};
  lines.forEach(line => {
    if (isComment(line) || isEmptyLine(line)) {
      return;
    }
    if (isVariableAssignment(line)) {
      const [, key, value] = line.match(VARIABLE_DEFINITION) || [];
      if (typeof variables[key] === "string") {
        variables[key] = [
          variables[key] as string,
          decodeURIComponent(value)
        ];
      } else if (Array.isArray(variables[key])) {
        (variables[key] as string[]).push(decodeURIComponent(value));
      } else {
        variables[key] = decodeURIComponent(value);
      }
    } else if (isDataEntry(line)) {
      entries.push(createDataEntry(line));
    } else {
      if (invalidLineAction === "throw") {
        throw new Error(`Failed parsing ads.txt: Invalid line: "${line}"`);
      }
    }
  });
  return {
    variables,
    entries
  };
}
