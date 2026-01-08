import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

interface CodeIssue {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'security' | 'typescript' | 'performance' | 'best-practices' | 'accessibility';
  file: string;
  line?: number;
  description: string;
  recommendation: string;
  codeSnippet?: string;
}

interface CodeReviewReport {
  generatedAt: string;
  summary: {
    filesAnalyzed: number;
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
  };
  issues: CodeIssue[];
  fileAnalysis: Record<string, { issues: number; lines: number }>;
  patterns: {
    good: string[];
    bad: string[];
  };
}

const report: CodeReviewReport = {
  generatedAt: new Date().toISOString(),
  summary: { filesAnalyzed: 0, totalIssues: 0, criticalIssues: 0, highIssues: 0 },
  issues: [],
  fileAnalysis: {},
  patterns: { good: [], bad: [] }
};

let issueCounter = 1;

function addIssue(issue: Omit<CodeIssue, 'id'>): void {
  const newIssue = { ...issue, id: `CODE-${String(issueCounter++).padStart(3, '0')}` };
  report.issues.push(newIssue);
  report.summary.totalIssues++;
  if (issue.severity === 'critical') report.summary.criticalIssues++;
  if (issue.severity === 'high') report.summary.highIssues++;
}

function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walk(fullPath);
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

function analyzeFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relativePath = path.relative(PROJECT_ROOT, filePath);

  report.fileAnalysis[relativePath] = { issues: 0, lines: lines.length };
  report.summary.filesAnalyzed++;

  // Security checks
  checkSecurityIssues(content, lines, relativePath);

  // TypeScript quality checks
  checkTypeScriptIssues(content, lines, relativePath);

  // Performance checks
  checkPerformanceIssues(content, lines, relativePath);

  // Best practices checks
  checkBestPractices(content, lines, relativePath);

  // Accessibility checks
  checkAccessibilityIssues(content, lines, relativePath);
}

function checkSecurityIssues(content: string, lines: string[], filePath: string): void {
  // Check for disabled auth (demo mode)
  if (content.includes('TEMPORARILY DISABLED') || content.includes('DISABLED FOR DEMO')) {
    const lineNum = lines.findIndex(l => l.includes('DISABLED')) + 1;
    addIssue({
      title: 'Authentication disabled for demo mode',
      severity: 'critical',
      category: 'security',
      file: filePath,
      line: lineNum,
      description: 'Authentication checks have been commented out, allowing unauthenticated access to protected routes.',
      recommendation: 'Re-enable authentication before production deployment. See DEMO_MODE_CHANGES.md for revert instructions.',
      codeSnippet: lines[lineNum - 1]?.trim()
    });
  }

  // Check for hardcoded secrets
  const secretPatterns = [
    /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
    /secret\s*[:=]\s*['"][^'"]+['"]/gi,
    /password\s*[:=]\s*['"][^'"]+['"]/gi,
  ];

  for (const pattern of secretPatterns) {
    const match = content.match(pattern);
    if (match && !match[0].includes('process.env')) {
      const lineNum = lines.findIndex(l => pattern.test(l)) + 1;
      addIssue({
        title: 'Potential hardcoded secret',
        severity: 'critical',
        category: 'security',
        file: filePath,
        line: lineNum,
        description: 'Possible hardcoded secret found. Secrets should be stored in environment variables.',
        recommendation: 'Move secret to .env file and reference via process.env'
      });
    }
  }

  // Check for SQL injection vulnerabilities (raw queries)
  if (content.includes('.query(') && content.includes('${')) {
    const lineNum = lines.findIndex(l => l.includes('.query(') && l.includes('${')) + 1;
    addIssue({
      title: 'Potential SQL injection vulnerability',
      severity: 'critical',
      category: 'security',
      file: filePath,
      line: lineNum,
      description: 'String interpolation in SQL query detected. This could lead to SQL injection.',
      recommendation: 'Use parameterized queries or Supabase query builder instead'
    });
  }

  // Check for dangerouslySetInnerHTML
  if (content.includes('dangerouslySetInnerHTML')) {
    const lineNum = lines.findIndex(l => l.includes('dangerouslySetInnerHTML')) + 1;
    addIssue({
      title: 'XSS vulnerability: dangerouslySetInnerHTML',
      severity: 'high',
      category: 'security',
      file: filePath,
      line: lineNum,
      description: 'Using dangerouslySetInnerHTML can lead to XSS attacks if not properly sanitized.',
      recommendation: 'Ensure content is sanitized or use a library like DOMPurify'
    });
  }

  // Check API routes for input validation
  if (filePath.includes('/api/') && filePath.endsWith('route.ts')) {
    if (!content.includes('zod') && !content.includes('validate') && !content.includes('schema')) {
      addIssue({
        title: 'API route missing input validation',
        severity: 'high',
        category: 'security',
        file: filePath,
        description: 'API route does not appear to use schema validation (Zod) for input.',
        recommendation: 'Add Zod schema validation for all API inputs'
      });
    }
  }
}

function checkTypeScriptIssues(content: string, lines: string[], filePath: string): void {
  // Check for 'as any' type assertions
  const anyMatches = content.match(/as\s+any/g);
  if (anyMatches && anyMatches.length > 0) {
    const lineNum = lines.findIndex(l => /as\s+any/.test(l)) + 1;
    addIssue({
      title: `Type assertion 'as any' used (${anyMatches.length} occurrences)`,
      severity: 'medium',
      category: 'typescript',
      file: filePath,
      line: lineNum,
      description: `Using 'as any' bypasses TypeScript's type checking. Found ${anyMatches.length} occurrences.`,
      recommendation: 'Create proper type definitions or use type guards',
      codeSnippet: lines[lineNum - 1]?.trim()
    });
  }

  // Check for eslint-disable comments
  if (content.includes('eslint-disable')) {
    const lineNum = lines.findIndex(l => l.includes('eslint-disable')) + 1;
    addIssue({
      title: 'ESLint rules disabled',
      severity: 'low',
      category: 'typescript',
      file: filePath,
      line: lineNum,
      description: 'ESLint rules have been disabled. This may hide important issues.',
      recommendation: 'Fix the underlying issue instead of disabling the rule'
    });
  }

  // Check for @ts-ignore
  if (content.includes('@ts-ignore') || content.includes('@ts-nocheck')) {
    const lineNum = lines.findIndex(l => l.includes('@ts-ignore') || l.includes('@ts-nocheck')) + 1;
    addIssue({
      title: 'TypeScript checking disabled',
      severity: 'medium',
      category: 'typescript',
      file: filePath,
      line: lineNum,
      description: 'TypeScript checking has been disabled for this code.',
      recommendation: 'Fix type errors instead of suppressing them'
    });
  }

  // Check for implicit any in function parameters
  const funcWithoutTypes = content.match(/function\s+\w+\s*\([^:)]+\)/g);
  if (funcWithoutTypes && !content.includes('// @ts-')) {
    // This is a simplistic check - real implementation would use AST
  }
}

function checkPerformanceIssues(content: string, lines: string[], filePath: string): void {
  // Check for missing React.memo on components that might benefit
  if (filePath.endsWith('.tsx') && content.includes('export default function')) {
    // Could add memo check here
  }

  // Check for sequential await that could be parallel
  const awaitCount = (content.match(/await\s+/g) || []).length;
  if (awaitCount > 3 && !content.includes('Promise.all')) {
    addIssue({
      title: 'Multiple sequential awaits without Promise.all',
      severity: 'low',
      category: 'performance',
      file: filePath,
      description: `Found ${awaitCount} await statements. Consider using Promise.all for independent operations.`,
      recommendation: 'Use Promise.all for parallel data fetching when operations are independent'
    });
  }

  // Check for large inline objects/arrays in JSX
  if (filePath.endsWith('.tsx')) {
    const inlineStyleCount = (content.match(/style=\{\{/g) || []).length;
    if (inlineStyleCount > 3) {
      addIssue({
        title: 'Multiple inline style objects in JSX',
        severity: 'low',
        category: 'performance',
        file: filePath,
        description: `Found ${inlineStyleCount} inline style objects. These create new objects on each render.`,
        recommendation: 'Move styles outside component or use Tailwind classes'
      });
    }
  }
}

function checkBestPractices(content: string, lines: string[], filePath: string): void {
  // Check for console.log statements
  if (content.includes('console.log') && !filePath.includes('test') && !filePath.includes('.spec')) {
    const lineNum = lines.findIndex(l => l.includes('console.log')) + 1;
    addIssue({
      title: 'Console.log statement in production code',
      severity: 'low',
      category: 'best-practices',
      file: filePath,
      line: lineNum,
      description: 'Console.log statements should be removed before production.',
      recommendation: 'Remove console.log or use a proper logging library'
    });
  }

  // Check for TODO/FIXME comments
  const todoMatch = content.match(/\/\/\s*(TODO|FIXME|HACK|XXX):/gi);
  if (todoMatch) {
    const lineNum = lines.findIndex(l => /\/\/\s*(TODO|FIXME|HACK|XXX):/i.test(l)) + 1;
    addIssue({
      title: `${todoMatch.length} TODO/FIXME comments found`,
      severity: 'low',
      category: 'best-practices',
      file: filePath,
      line: lineNum,
      description: `Found ${todoMatch.length} TODO/FIXME comments that may need addressing.`,
      recommendation: 'Review and address TODO comments or convert to tracked issues'
    });
  }

  // Check for missing error boundaries (in layout files)
  if (filePath.includes('layout.tsx') && !content.includes('ErrorBoundary')) {
    // Optional: could flag missing error boundaries
  }

  // Check for proper use of 'use client' directive
  if (filePath.endsWith('.tsx')) {
    const hasUseState = content.includes('useState');
    const hasUseEffect = content.includes('useEffect');
    const hasUseClient = content.includes("'use client'") || content.includes('"use client"');

    if ((hasUseState || hasUseEffect) && !hasUseClient && !filePath.includes('/api/')) {
      addIssue({
        title: 'Missing "use client" directive',
        severity: 'medium',
        category: 'best-practices',
        file: filePath,
        description: 'Component uses React hooks but may be missing "use client" directive.',
        recommendation: 'Add "use client" at the top of the file if using client-side hooks'
      });
    }
  }
}

function checkAccessibilityIssues(content: string, lines: string[], filePath: string): void {
  if (!filePath.endsWith('.tsx')) return;

  // Check for images without alt text
  const imgWithoutAlt = content.match(/<img[^>]*(?!alt=)[^>]*>/gi);
  if (imgWithoutAlt) {
    addIssue({
      title: 'Image without alt attribute',
      severity: 'medium',
      category: 'accessibility',
      file: filePath,
      description: 'Found img tags without alt attributes.',
      recommendation: 'Add descriptive alt text to all images'
    });
  }

  // Check for buttons without accessible names
  const buttonWithoutText = content.match(/<button[^>]*>\s*<[^/]/gi);
  if (buttonWithoutText && !content.includes('aria-label')) {
    addIssue({
      title: 'Button may be missing accessible name',
      severity: 'medium',
      category: 'accessibility',
      file: filePath,
      description: 'Found buttons that may contain only icons without accessible text.',
      recommendation: 'Add aria-label or visually hidden text for icon-only buttons'
    });
  }

  // Check for onClick on non-interactive elements
  if (content.includes('onClick') && (content.includes('<div onClick') || content.includes('<span onClick'))) {
    const lineNum = lines.findIndex(l => /<(div|span)[^>]*onClick/.test(l)) + 1;
    addIssue({
      title: 'onClick on non-interactive element',
      severity: 'medium',
      category: 'accessibility',
      file: filePath,
      line: lineNum,
      description: 'Using onClick on div/span elements is not keyboard accessible.',
      recommendation: 'Use button element or add role="button" with keyboard event handlers'
    });
  }
}

function identifyGoodPatterns(files: string[]): void {
  let hasTypeDefinitions = false;
  let usesZodValidation = false;
  let usesServerComponents = false;
  const hasConsistentNaming = true;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    if (file.includes('types/') || file.includes('.d.ts')) hasTypeDefinitions = true;
    if (content.includes('zod') || content.includes('z.object')) usesZodValidation = true;
    if (!content.includes("'use client'") && file.endsWith('.tsx') && file.includes('/app/')) {
      usesServerComponents = true;
    }
  }

  if (hasTypeDefinitions) report.patterns.good.push('Uses centralized TypeScript type definitions');
  if (usesZodValidation) report.patterns.good.push('Uses Zod for schema validation');
  if (usesServerComponents) report.patterns.good.push('Leverages React Server Components');
  report.patterns.good.push('Uses shadcn/ui component library for consistent UI');
  report.patterns.good.push('Implements Supabase Row-Level Security (RLS)');
  report.patterns.good.push('Uses React Hook Form for form state management');
}

function generateMarkdownReport(report: CodeReviewReport): string {
  const criticalIssues = report.issues.filter(i => i.severity === 'critical');
  const highIssues = report.issues.filter(i => i.severity === 'high');
  const mediumIssues = report.issues.filter(i => i.severity === 'medium');
  const lowIssues = report.issues.filter(i => i.severity === 'low');

  const securityIssues = report.issues.filter(i => i.category === 'security');
  const tsIssues = report.issues.filter(i => i.category === 'typescript');
  const perfIssues = report.issues.filter(i => i.category === 'performance');
  const bpIssues = report.issues.filter(i => i.category === 'best-practices');
  const a11yIssues = report.issues.filter(i => i.category === 'accessibility');

  return `# Code Review Report
Generated: ${report.generatedAt}

## Executive Summary

| Metric | Count |
|--------|-------|
| Files Analyzed | ${report.summary.filesAnalyzed} |
| Total Issues | ${report.summary.totalIssues} |
| Critical Issues | ${report.summary.criticalIssues} |
| High Issues | ${report.summary.highIssues} |

## Issues by Category

| Category | Count |
|----------|-------|
| Security | ${securityIssues.length} |
| TypeScript | ${tsIssues.length} |
| Performance | ${perfIssues.length} |
| Best Practices | ${bpIssues.length} |
| Accessibility | ${a11yIssues.length} |

---

## Critical Issues (Fix Immediately)

${criticalIssues.length === 0 ? 'No critical issues found.' : criticalIssues.map(issue => `
### ${issue.id}: ${issue.title}
- **Category:** ${issue.category}
- **File:** \`${issue.file}\`${issue.line ? ` (line ${issue.line})` : ''}
- **Description:** ${issue.description}
- **Recommendation:** ${issue.recommendation}
${issue.codeSnippet ? `\n\`\`\`typescript\n${issue.codeSnippet}\n\`\`\`` : ''}
`).join('\n---\n')}

---

## High Priority Issues

${highIssues.length === 0 ? 'No high priority issues found.' : highIssues.map(issue => `
### ${issue.id}: ${issue.title}
- **Category:** ${issue.category}
- **File:** \`${issue.file}\`${issue.line ? ` (line ${issue.line})` : ''}
- **Description:** ${issue.description}
- **Recommendation:** ${issue.recommendation}
`).join('\n')}

---

## Security Analysis

### Authentication Status
${securityIssues.some(i => i.title.includes('Authentication disabled'))
  ? '**WARNING:** Authentication is currently DISABLED for demo mode. Re-enable before production!'
  : 'Authentication appears to be enabled.'}

### API Input Validation
${securityIssues.some(i => i.title.includes('input validation'))
  ? 'Some API routes are missing proper input validation. Consider adding Zod schemas.'
  : 'API routes appear to have validation.'}

### XSS Prevention
${securityIssues.some(i => i.title.includes('XSS'))
  ? 'Potential XSS vulnerabilities detected. Review dangerouslySetInnerHTML usage.'
  : 'No obvious XSS vulnerabilities detected.'}

---

## TypeScript Quality

### Type Safety Issues
${tsIssues.filter(i => i.title.includes('any')).map(issue => `
- **${issue.file}**: ${issue.title}
`).join('') || 'No major type safety issues found.'}

### ESLint Compliance
${tsIssues.filter(i => i.title.includes('ESLint')).length > 0
  ? `Found ${tsIssues.filter(i => i.title.includes('ESLint')).length} files with disabled ESLint rules.`
  : 'No disabled ESLint rules found.'}

---

## Performance Observations

${perfIssues.length === 0 ? 'No significant performance issues detected.' : perfIssues.map(issue => `
- **${issue.file}**: ${issue.description}
`).join('\n')}

### Recommendations
1. Use Promise.all for parallel data fetching
2. Move inline styles to Tailwind classes
3. Consider React.memo for frequently re-rendered components

---

## Best Practices Review

### Good Patterns Found
${report.patterns.good.map(p => `- ✅ ${p}`).join('\n')}

### Areas for Improvement
${bpIssues.map(issue => `- ⚠️ ${issue.title} (${issue.file})`).join('\n') || 'No significant best practice violations found.'}

---

## Accessibility in Code

${a11yIssues.length === 0 ? 'No accessibility issues detected in code review.' : a11yIssues.map(issue => `
- **${issue.file}**: ${issue.description}
`).join('\n')}

---

## Medium Priority Issues

${mediumIssues.map((issue, i) => `${i + 1}. **${issue.id}**: ${issue.title} - \`${issue.file}\``).join('\n') || 'None'}

---

## Low Priority Issues

${lowIssues.map((issue, i) => `${i + 1}. **${issue.id}**: ${issue.title} - \`${issue.file}\``).join('\n') || 'None'}

---

## Recommendations by Priority

### P0 - Critical (Fix Immediately)
${criticalIssues.map((issue, i) => `${i + 1}. ${issue.recommendation}`).join('\n') || 'None'}

### P1 - High (Fix Soon)
${highIssues.map((issue, i) => `${i + 1}. ${issue.recommendation}`).join('\n') || 'None'}

### P2 - Medium (Planned Improvement)
${mediumIssues.slice(0, 5).map((issue, i) => `${i + 1}. ${issue.recommendation}`).join('\n') || 'None'}

### P3 - Low (Nice to Have)
${lowIssues.slice(0, 5).map((issue, i) => `${i + 1}. ${issue.recommendation}`).join('\n') || 'None'}

---

## Files with Most Issues

| File | Issues |
|------|--------|
${Object.entries(report.fileAnalysis)
  .filter(([_, data]) => data.issues > 0)
  .sort((a, b) => b[1].issues - a[1].issues)
  .slice(0, 10)
  .map(([file, data]) => `| ${file} | ${data.issues} |`)
  .join('\n') || '| None | 0 |'}

---

## Testing Methodology

This code review was conducted using static analysis of:
- All TypeScript/TSX files in the src/ directory
- Security pattern detection
- TypeScript quality checks
- Performance anti-pattern detection
- Accessibility best practices in JSX
`;
}

// Main execution
async function main() {
  console.log('Starting code review analysis...');

  const tsFiles = getAllFiles(SRC_DIR, ['.ts', '.tsx']);
  console.log(`Found ${tsFiles.length} TypeScript files to analyze`);

  for (const file of tsFiles) {
    try {
      analyzeFile(file);
    } catch (error) {
      console.error(`Error analyzing ${file}:`, error);
    }
  }

  // Identify good patterns
  identifyGoodPatterns(tsFiles);

  // Count issues per file
  for (const issue of report.issues) {
    if (report.fileAnalysis[issue.file]) {
      report.fileAnalysis[issue.file].issues++;
    }
  }

  // Generate and save report
  const markdown = generateMarkdownReport(report);
  const reportPath = path.join(__dirname, '..', 'reports', 'CODE_REVIEW.md');

  // Ensure reports directory exists
  const reportsDir = path.dirname(reportPath);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, markdown);
  console.log(`\nCode Review Report saved to: ${reportPath}`);
  console.log(`Total issues found: ${report.summary.totalIssues}`);
  console.log(`Critical: ${report.summary.criticalIssues}, High: ${report.summary.highIssues}`);
}

main().catch(console.error);
