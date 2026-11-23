const replacements: [RegExp, string][] = [
  [/\bin order to\b/gi, 'to'],
  [/\bdue to the fact that\b/gi, 'because'],
  [/\bat this point in time\b/gi, 'now'],
  [/\bin the event that\b/gi, 'if'],
  [/\bwith regard to\b/gi, 'about'],
  [/\bfor the purpose of\b/gi, 'for'],
  [/\bon a daily basis\b/gi, 'daily'],
  [/\butilize\b/gi, 'use'],
  [/\butilized\b/gi, 'used'],
  [/\butilizing\b/gi, 'using'],
  [/\bprior to\b/gi, 'before']
];

export function plainEdit(text: string): string {
  return replacements.reduce((draft, [pattern, simpler]) =>
    draft.replace(pattern, match => {
      if (match === match.toUpperCase()) return simpler.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return simpler[0].toUpperCase() + simpler.slice(1);
      return simpler;
    }), text);
}
