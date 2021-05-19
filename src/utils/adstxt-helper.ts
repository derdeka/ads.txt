import { AdstxtAccountType } from '../interfaces';

export const VARIABLE_DEFINITION = /^([a-zA-Z]+)=(.+)$/;

export const isValidAccountType = (type: string): boolean => Object.values<string>(AdstxtAccountType).indexOf(type.toUpperCase()) >= 0;

export const toAccountType = (input: string): AdstxtAccountType => input === 'DIRECT' ? AdstxtAccountType.DIRECT : AdstxtAccountType.RESELLER;

export const isVariableAssignment = (line: string): boolean => VARIABLE_DEFINITION.test(line);

export const isEmptyLine = (line: string): boolean => /^\s*$/.test(line);

export const isComment = (line: string): boolean => /^\s*#/.test(line);

export const stripComment = (line: string): { main: string; comment: string; } => {
  const [main, ...commentParts] = line.split('#');
  return {
      main,
      comment: commentParts.join('#').trim(),
  };
}
