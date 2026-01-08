import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

interface CleanupItem {
  id: string;
  type: 'unused-import' | 'dead-code' | 'commented-code' | 'duplicate' | 'unused-file' | 'unused-dependency';
  file: string;
  line?: number;
  description: string;
  codeSnippet?: string;
  action: 'remove' | 'archive' | 'review';
}

interface CleanupReport {
  generatedAt: string;
  summary: {
    filesScanned: number;
    unusedImports: number;
    deadCode: number;
    commentedCode: number;
    duplicatePatterns: number;
    unusedFiles: number;
    unusedDependencies: number;
  };
  items: CleanupItem[];
  todoComments: { file: string; line: number; content: string }[];
  largeFiles: { file: string; lines: number }[];
}

const report: CleanupReport = {
  generatedAt: new Date().toISOString(),
  summary: {
    filesScanned: 0,
    unusedImports: 0,
    deadCode: 0,
    commentedCode: 0,
    duplicatePatterns: 0,
    unusedFiles: 0,
    unusedDependencies: 0
  },
  items: [],
  todoComments: [],
  largeFiles: []
};

let itemCounter = 1;

function addItem(item: Omit<CleanupItem, 'id'>): void {
  report.items.push({ ...item, id: `CLEANUP-${String(itemCounter++).padStart(3, '0')}` });
  if (item.type === 'unused-import') report.summary.unusedImports++;
  if (item.type === 'dead-code') report.summary.deadCode++;
  if (item.type === 'commented-code') report.summary.commentedCode++;
  if (item.type === 'duplicate') report.summary.duplicatePatterns++;
  if (item.type === 'unused-file') report.summary.unusedFiles++;
  if (item.type === 'unused-dependency') report.summary.unusedDependencies++;
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

function analyzeImports(filePath: string, content: string, lines: string[]): void {
  const relativePath = path.relative(PROJECT_ROOT, filePath);

  // Extract all imports
  const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const namedImports = match[1];
    const defaultImport = match[2];
    const modulePath = match[3];

    if (namedImports) {
      // Check each named import
      const imports = namedImports.split(',').map(i => i.trim().split(' as ')[0].trim());

      for (const importName of imports) {
        if (!importName) continue;

        // Check if import is used in the file (excluding the import line itself)
        const contentWithoutImports = content.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');

        // Simple check: is the import name used anywhere?
        const usageRegex = new RegExp(`\\b${importName}\\b`, 'g');
        const usages = contentWithoutImports.match(usageRegex);

        if (!usages || usages.length === 0) {
          const lineNum = lines.findIndex(l => l.includes(importName) && l.includes('import')) + 1;
          addItem({
            type: 'unused-import',
            file: relativePath,
            line: lineNum,
            description: `Unused import: "${importName}" from "${modulePath}"`,
            codeSnippet: `import { ${importName} } from '${modulePath}'`,
            action: 'remove'
          });
        }
      }
    }

    if (defaultImport) {
      const contentWithoutImports = content.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');
      const usageRegex = new RegExp(`\\b${defaultImport}\\b`, 'g');
      const usages = contentWithoutImports.match(usageRegex);

      if (!usages || usages.length === 0) {
        const lineNum = lines.findIndex(l => l.includes(defaultImport) && l.includes('import')) + 1;
        addItem({
          type: 'unused-import',
          file: relativePath,
          line: lineNum,
          description: `Unused default import: "${defaultImport}" from "${modulePath}"`,
          codeSnippet: `import ${defaultImport} from '${modulePath}'`,
          action: 'remove'
        });
      }
    }
  }
}

function findCommentedCode(filePath: string, content: string, lines: string[]): void {
  const relativePath = path.relative(PROJECT_ROOT, filePath);

  // Find large blocks of commented code (3+ consecutive lines)
  let commentBlockStart = -1;
  let commentBlockLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for single-line comments that look like code
    if (line.startsWith('//') && !line.startsWith('// @') && !line.startsWith('// TODO') && !line.startsWith('// FIXME')) {
      const commentContent = line.substring(2).trim();

      // Check if it looks like code (has code-like patterns)
      const looksLikeCode = /^(const|let|var|function|if|for|while|return|import|export|await|\{|\}|<|>)/.test(commentContent) ||
                           /[=();{}[\]]/.test(commentContent);

      if (looksLikeCode) {
        if (commentBlockStart === -1) {
          commentBlockStart = i;
        }
        commentBlockLines.push(line);
      } else {
        if (commentBlockLines.length >= 3) {
          addItem({
            type: 'commented-code',
            file: relativePath,
            line: commentBlockStart + 1,
            description: `${commentBlockLines.length} lines of commented-out code`,
            codeSnippet: commentBlockLines.slice(0, 3).join('\n') + (commentBlockLines.length > 3 ? '\n...' : ''),
            action: 'review'
          });
        }
        commentBlockStart = -1;
        commentBlockLines = [];
      }
    } else {
      if (commentBlockLines.length >= 3) {
        addItem({
          type: 'commented-code',
          file: relativePath,
          line: commentBlockStart + 1,
          description: `${commentBlockLines.length} lines of commented-out code`,
          codeSnippet: commentBlockLines.slice(0, 3).join('\n') + (commentBlockLines.length > 3 ? '\n...' : ''),
          action: 'review'
        });
      }
      commentBlockStart = -1;
      commentBlockLines = [];
    }
  }

  // Check for specific patterns we know about (demo mode)
  if (content.includes('TEMPORARILY DISABLED') || content.includes('DISABLED FOR DEMO')) {
    const lineNum = lines.findIndex(l => l.includes('DISABLED')) + 1;
    addItem({
      type: 'commented-code',
      file: relativePath,
      line: lineNum,
      description: 'Demo mode: Authentication code disabled',
      codeSnippet: lines[lineNum - 1]?.trim(),
      action: 'review'
    });
  }
}

function findTodoComments(filePath: string, content: string, lines: string[]): void {
  const relativePath = path.relative(PROJECT_ROOT, filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const todoMatch = line.match(/\/\/\s*(TODO|FIXME|HACK|XXX):\s*(.+)/i);

    if (todoMatch) {
      report.todoComments.push({
        file: relativePath,
        line: i + 1,
        content: todoMatch[2].trim()
      });
    }
  }
}

function findDuplicatePatterns(files: string[]): void {
  const patterns: Map<string, string[]> = new Map();

  // Look for repeated Supabase query patterns
  const supabasePattern = /await\s+\(supabase\.from\(['"](\w+)['"]\)\s+as\s+any\)/g;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(PROJECT_ROOT, file);

    // Find "as any" type casting patterns
    if (content.includes('as any')) {
      const key = 'supabase-as-any';
      if (!patterns.has(key)) {
        patterns.set(key, []);
      }
      patterns.get(key)!.push(relativePath);
    }
  }

  // Report duplicate patterns
  for (const [pattern, files] of patterns.entries()) {
    if (files.length >= 3) {
      addItem({
        type: 'duplicate',
        file: files.join(', '),
        description: `Pattern "${pattern}" repeated in ${files.length} files`,
        codeSnippet: 'await (supabase.from(\'table\') as any)',
        action: 'review'
      });
    }
  }
}

function findUnusedExports(files: string[]): void {
  const exports: Map<string, { file: string; name: string }> = new Map();
  const imports: Set<string> = new Set();

  // First pass: collect all exports
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(PROJECT_ROOT, file);

    // Find named exports
    const exportMatches = content.matchAll(/export\s+(?:const|function|class|type|interface)\s+(\w+)/g);
    for (const match of exportMatches) {
      const exportName = match[1];
      exports.set(`${relativePath}:${exportName}`, { file: relativePath, name: exportName });
    }
  }

  // Second pass: collect all imports
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    const importMatches = content.matchAll(/import\s+(?:{([^}]+)}|(\w+))\s+from/g);
    for (const match of importMatches) {
      if (match[1]) {
        const names = match[1].split(',').map(n => n.trim().split(' as ')[0].trim());
        names.forEach(n => imports.add(n));
      }
      if (match[2]) {
        imports.add(match[2]);
      }
    }
  }

  // Note: This is a simplified check. A real implementation would need to
  // track import sources and handle re-exports properly.
}

function checkLargeFiles(files: string[]): void {
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lineCount = content.split('\n').length;
    const relativePath = path.relative(PROJECT_ROOT, file);

    if (lineCount > 300) {
      report.largeFiles.push({ file: relativePath, lines: lineCount });
    }
  }

  // Sort by line count
  report.largeFiles.sort((a, b) => b.lines - a.lines);
}

async function checkUnusedDependencies(): Promise<void> {
  const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');

  if (!fs.existsSync(packageJsonPath)) return;

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  // Get all source files
  const tsFiles = getAllFiles(SRC_DIR, ['.ts', '.tsx']);
  let allContent = '';

  for (const file of tsFiles) {
    allContent += fs.readFileSync(file, 'utf-8');
  }

  // Check each dependency
  for (const dep of Object.keys(dependencies)) {
    // Skip type definitions
    if (dep.startsWith('@types/')) continue;

    // Check if dependency is imported anywhere
    const importPatterns = [
      `from '${dep}'`,
      `from "${dep}"`,
      `from '${dep}/`,
      `from "${dep}/`,
      `require('${dep}')`,
      `require("${dep}")`
    ];

    const isUsed = importPatterns.some(pattern => allContent.includes(pattern));

    if (!isUsed) {
      // Double check for aliased imports (like @supabase/ssr -> supabase)
      const shortName = dep.split('/').pop();
      const mightBeUsed = shortName && allContent.includes(shortName);

      if (!mightBeUsed) {
        addItem({
          type: 'unused-dependency',
          file: 'package.json',
          description: `Potentially unused dependency: "${dep}"`,
          action: 'review'
        });
      }
    }
  }
}

function generateMarkdownReport(report: CleanupReport): string {
  const unusedImports = report.items.filter(i => i.type === 'unused-import');
  const commentedCode = report.items.filter(i => i.type === 'commented-code');
  const duplicates = report.items.filter(i => i.type === 'duplicate');
  const unusedDeps = report.items.filter(i => i.type === 'unused-dependency');

  return `# Cleanup Report
Generated: ${report.generatedAt}

## Executive Summary

| Category | Count |
|----------|-------|
| Files Scanned | ${report.summary.filesScanned} |
| Unused Imports | ${report.summary.unusedImports} |
| Commented-Out Code | ${report.summary.commentedCode} |
| Duplicate Patterns | ${report.summary.duplicatePatterns} |
| Potentially Unused Dependencies | ${report.summary.unusedDependencies} |
| TODO/FIXME Comments | ${report.todoComments.length} |

---

## Unused Imports

${unusedImports.length === 0 ? 'No unused imports detected.' : `
Found ${unusedImports.length} unused imports that can be safely removed:

| File | Import | Line |
|------|--------|------|
${unusedImports.slice(0, 30).map(item => `| \`${item.file}\` | ${item.description.split('"')[1] || item.description} | ${item.line || '-'} |`).join('\n')}
${unusedImports.length > 30 ? `\n*... and ${unusedImports.length - 30} more*` : ''}

### Quick Fix
Run ESLint with auto-fix to remove unused imports:
\`\`\`bash
npm run lint -- --fix
\`\`\`
`}

---

## Commented-Out Code

${commentedCode.length === 0 ? 'No significant commented-out code blocks found.' : `
Found ${commentedCode.length} blocks of commented-out code that should be reviewed:

${commentedCode.map(item => `
### ${item.id}: ${item.file}
- **Line:** ${item.line}
- **Description:** ${item.description}
- **Action:** ${item.action}
${item.codeSnippet ? `\n\`\`\`typescript\n${item.codeSnippet}\n\`\`\`` : ''}
`).join('\n---\n')}

### Known Demo Mode Changes
The following files have authentication disabled for demo purposes:
- src/app/(dashboard)/page.tsx
- src/app/(dashboard)/properties/page.tsx
- src/app/(dashboard)/guests/page.tsx
- src/app/(dashboard)/maintenance/page.tsx
- src/app/(dashboard)/financials/page.tsx
- src/app/(dashboard)/settings/page.tsx
- src/app/(dashboard)/inquiries/page.tsx

**To restore authentication:** See \`DEMO_MODE_CHANGES.md\` for revert instructions.
`}

---

## Duplicate Code Patterns

${duplicates.length === 0 ? 'No significant duplicate patterns detected.' : `
Found ${duplicates.length} duplicate patterns that could be refactored:

${duplicates.map(item => `
### ${item.id}: ${item.description}
- **Files:** ${item.file}
- **Pattern:**
\`\`\`typescript
${item.codeSnippet}
\`\`\`
- **Recommendation:** Create a shared utility function or typed helper
`).join('\n')}

### Suggested Refactoring
Create a typed Supabase query helper:
\`\`\`typescript
// src/lib/supabase/queries.ts
import { createClient } from './server';
import type { Database } from '@/types/database';

export async function query<T extends keyof Database['public']['Tables']>(
  table: T
) {
  const supabase = await createClient();
  return supabase.from(table);
}
\`\`\`
`}

---

## Potentially Unused Dependencies

${unusedDeps.length === 0 ? 'All dependencies appear to be in use.' : `
The following dependencies may not be used (verify before removing):

| Package | Recommendation |
|---------|----------------|
${unusedDeps.map(item => `| ${item.description.split('"')[1]} | Review usage |`).join('\n')}

### Verify with depcheck
\`\`\`bash
npx depcheck
\`\`\`
`}

---

## TODO/FIXME Comments

${report.todoComments.length === 0 ? 'No TODO/FIXME comments found.' : `
Found ${report.todoComments.length} TODO/FIXME comments that may need attention:

| File | Line | Comment |
|------|------|---------|
${report.todoComments.map(t => `| \`${t.file}\` | ${t.line} | ${t.content.substring(0, 60)}${t.content.length > 60 ? '...' : ''} |`).join('\n')}
`}

---

## Large Files (Consider Splitting)

${report.largeFiles.length === 0 ? 'No unusually large files found.' : `
The following files exceed 300 lines and may benefit from being split:

| File | Lines |
|------|-------|
${report.largeFiles.slice(0, 10).map(f => `| \`${f.file}\` | ${f.lines} |`).join('\n')}
`}

---

## Archive Recommendations

### Files Safe to Delete
Based on the analysis, these items can likely be removed:
${unusedImports.slice(0, 10).map((item, i) => `${i + 1}. Remove unused import in \`${item.file}\``).join('\n') || 'None identified'}

### Files to Review Before Archiving
${commentedCode.map((item, i) => `${i + 1}. \`${item.file}\` - ${item.description}`).join('\n') || 'None identified'}

### SQL Migration Files
Consider archiving old migration files in \`supabase/\`:
- migration-phase9.sql (if already applied)
- migration-remove-user-isolation.sql (if already applied)

---

## Actionable Commands

### Remove Unused Imports
\`\`\`bash
# Using ESLint
npm run lint -- --fix

# Or manually with VS Code
# Install "Organize Imports" extension and run on save
\`\`\`

### Check for Unused Dependencies
\`\`\`bash
npx depcheck
\`\`\`

### Find All TODOs
\`\`\`bash
grep -r "TODO\\|FIXME" src/ --include="*.ts" --include="*.tsx"
\`\`\`

### Run Security Audit
\`\`\`bash
npm audit
npm audit fix
\`\`\`

---

## Summary

This cleanup report identifies opportunities to improve code quality by:
1. Removing ${report.summary.unusedImports} unused imports
2. Reviewing ${report.summary.commentedCode} blocks of commented-out code
3. Refactoring ${report.summary.duplicatePatterns} duplicate patterns
4. Addressing ${report.todoComments.length} TODO comments
5. Considering splitting ${report.largeFiles.length} large files

**Estimated cleanup impact:** Reducing technical debt and improving maintainability.
`;
}

// Main execution
async function main() {
  console.log('Starting cleanup scan...');

  const tsFiles = getAllFiles(SRC_DIR, ['.ts', '.tsx']);
  console.log(`Found ${tsFiles.length} TypeScript files to scan`);

  report.summary.filesScanned = tsFiles.length;

  // Analyze each file
  for (const file of tsFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      analyzeImports(file, content, lines);
      findCommentedCode(file, content, lines);
      findTodoComments(file, content, lines);
    } catch (error) {
      console.error(`Error analyzing ${file}:`, error);
    }
  }

  // Cross-file analysis
  findDuplicatePatterns(tsFiles);
  checkLargeFiles(tsFiles);
  await checkUnusedDependencies();

  // Generate and save report
  const markdown = generateMarkdownReport(report);
  const reportPath = path.join(__dirname, '..', 'reports', 'CLEANUP_REPORT.md');

  // Ensure reports directory exists
  const reportsDir = path.dirname(reportPath);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, markdown);
  console.log(`\nCleanup Report saved to: ${reportPath}`);
  console.log(`Total items found: ${report.items.length}`);
  console.log(`Unused imports: ${report.summary.unusedImports}`);
  console.log(`Commented code blocks: ${report.summary.commentedCode}`);
}

main().catch(console.error);
