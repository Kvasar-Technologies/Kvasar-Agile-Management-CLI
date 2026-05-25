/**
 * Output formatting utilities
 */

export interface FormatOptions {
  output?: 'json' | 'pretty';
  fields?: string[];
  quiet?: boolean;
}

/**
 * Format data for CLI output
 */
export function formatOutput(data: any, options: FormatOptions): string {
  if (options.quiet) {
    return '';
  }

  // Filter fields if requested
  let displayData = data;
  if (options.fields && options.fields.length > 0) {
    displayData = filterFields(data, options.fields);
  }

  // Choose format
  if (options.output === 'pretty') {
    return JSON.stringify(displayData, null, 2);
  }

  return JSON.stringify(displayData);
}

/**
 * Filter object to only include specified fields
 */
function filterFields(obj: any, fields: string[]): any {
  if (Array.isArray(obj)) {
    return obj.map(item => filterFields(item, fields));
  }

  if (typeof obj === 'object' && obj !== null) {
    const filtered: Record<string, any> = {};
    for (const field of fields) {
      if (field in obj) {
        filtered[field] = obj[field];
      }
    }
    return filtered;
  }

  return obj;
}
