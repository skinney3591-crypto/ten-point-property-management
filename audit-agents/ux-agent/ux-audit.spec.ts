import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

const ENVIRONMENTS = {
  local: 'http://localhost:3000',
  production: 'https://ten-point-property-management.vercel.app'
};

const DASHBOARD_PAGES = [
  { name: 'Dashboard', path: '/' },
  { name: 'Properties', path: '/properties' },
  { name: 'Guests', path: '/guests' },
  { name: 'Inquiries', path: '/inquiries' },
  { name: 'Maintenance', path: '/maintenance' },
  { name: 'Financials', path: '/financials' },
  { name: 'Settings', path: '/settings' },
];

const PUBLIC_PAGES = [
  { name: 'Listings', path: '/listings' },
  { name: 'Login', path: '/login' },
];

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

interface UXIssue {
  page: string;
  environment: string;
  type: 'accessibility' | 'visual' | 'responsive' | 'keyboard';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  wcagCriterion?: string;
  element?: string;
  screenshot?: string;
}

interface UXReport {
  generatedAt: string;
  summary: {
    totalPages: number;
    totalIssues: number;
    criticalIssues: number;
    accessibilityScore: number;
  };
  issues: UXIssue[];
  screenshots: { page: string; viewport: string; path: string }[];
  accessibilityResults: Record<string, any>;
}

const report: UXReport = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalPages: 0,
    totalIssues: 0,
    criticalIssues: 0,
    accessibilityScore: 100
  },
  issues: [],
  screenshots: [],
  accessibilityResults: {}
};

const screenshotDir = path.join(__dirname, 'screenshots');

// Ensure screenshot directory exists
test.beforeAll(async () => {
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
});

// Save report after all tests
test.afterAll(async () => {
  // Calculate summary
  report.summary.totalIssues = report.issues.length;
  report.summary.criticalIssues = report.issues.filter(i => i.severity === 'critical').length;

  // Generate markdown report
  const markdown = generateMarkdownReport(report);
  const reportPath = path.join(__dirname, '..', 'reports', 'UX_REVIEW.md');
  fs.writeFileSync(reportPath, markdown);
  console.log(`UX Report saved to: ${reportPath}`);
});

function generateMarkdownReport(report: UXReport): string {
  const criticalIssues = report.issues.filter(i => i.severity === 'critical');
  const seriousIssues = report.issues.filter(i => i.severity === 'serious');
  const moderateIssues = report.issues.filter(i => i.severity === 'moderate');
  const minorIssues = report.issues.filter(i => i.severity === 'minor');

  return `# UX/UI Review Report
Generated: ${report.generatedAt}

## Executive Summary
- **Total Pages Tested:** ${report.summary.totalPages}
- **Total Issues Found:** ${report.summary.totalIssues}
- **Critical Issues:** ${criticalIssues.length}
- **Serious Issues:** ${seriousIssues.length}
- **Moderate Issues:** ${moderateIssues.length}
- **Minor Issues:** ${minorIssues.length}

## Environments Tested
- Local: http://localhost:3000
- Production: https://ten-point-property-management.vercel.app

---

## Critical Issues (Requires Immediate Attention)

${criticalIssues.length === 0 ? 'No critical issues found.' : criticalIssues.map((issue, i) => `
### ${i + 1}. ${issue.description}
- **Page:** ${issue.page}
- **Environment:** ${issue.environment}
- **Type:** ${issue.type}
${issue.wcagCriterion ? `- **WCAG Criterion:** ${issue.wcagCriterion}` : ''}
${issue.element ? `- **Element:** \`${issue.element}\`` : ''}
${issue.screenshot ? `- **Screenshot:** ${issue.screenshot}` : ''}
`).join('\n')}

---

## Serious Issues

${seriousIssues.length === 0 ? 'No serious issues found.' : seriousIssues.map((issue, i) => `
### ${i + 1}. ${issue.description}
- **Page:** ${issue.page}
- **Environment:** ${issue.environment}
- **Type:** ${issue.type}
${issue.wcagCriterion ? `- **WCAG Criterion:** ${issue.wcagCriterion}` : ''}
`).join('\n')}

---

## Moderate Issues

${moderateIssues.length === 0 ? 'No moderate issues found.' : moderateIssues.map((issue, i) => `
${i + 1}. **${issue.page}** - ${issue.description} (${issue.type})
`).join('\n')}

---

## Minor Issues

${minorIssues.length === 0 ? 'No minor issues found.' : minorIssues.map((issue, i) => `
${i + 1}. **${issue.page}** - ${issue.description}
`).join('\n')}

---

## Accessibility Analysis by Page

${Object.entries(report.accessibilityResults).map(([page, results]: [string, any]) => `
### ${page}
- **Violations:** ${results.violations?.length || 0}
- **Passes:** ${results.passes?.length || 0}
${results.violations?.length > 0 ? `
**Top Violations:**
${results.violations.slice(0, 5).map((v: any) => `- ${v.description} (${v.impact})`).join('\n')}
` : ''}
`).join('\n')}

---

## Screenshots Captured

| Page | Viewport | Screenshot |
|------|----------|------------|
${report.screenshots.map(s => `| ${s.page} | ${s.viewport} | [View](${s.path}) |`).join('\n')}

---

## Recommendations

### Priority 1 - Fix Immediately
${criticalIssues.map((issue, i) => `${i + 1}. ${issue.description}`).join('\n') || 'None'}

### Priority 2 - Fix Soon
${seriousIssues.map((issue, i) => `${i + 1}. ${issue.description}`).join('\n') || 'None'}

### Priority 3 - Planned Improvement
${moderateIssues.slice(0, 10).map((issue, i) => `${i + 1}. ${issue.description}`).join('\n') || 'None'}

---

## Testing Methodology

This UX/UI audit was conducted using:
- **Playwright** for browser automation and screenshot capture
- **axe-core** for automated accessibility testing (WCAG 2.1 AA)
- **Multiple viewports**: Mobile (390x844), Tablet (768x1024), Desktop (1920x1080)
- **Both environments**: Local development and Vercel production

### Test Coverage
- Full-page screenshots at multiple breakpoints
- Automated accessibility scanning on every page
- Keyboard navigation testing
- Color contrast verification
- Form accessibility validation
`;
}

// Test each environment
for (const [envName, baseUrl] of Object.entries(ENVIRONMENTS)) {
  test.describe(`${envName} Environment`, () => {
    test.use({ baseURL: baseUrl });

    // Test dashboard pages
    for (const page of DASHBOARD_PAGES) {
      test.describe(`${page.name} Page`, () => {

        test(`accessibility audit`, async ({ page: browserPage }) => {
          await browserPage.goto(page.path, { waitUntil: 'networkidle' });
          await browserPage.waitForTimeout(1000); // Wait for any animations

          const accessibilityResults = await new AxeBuilder({ page: browserPage })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

          report.accessibilityResults[`${envName}-${page.name}`] = accessibilityResults;
          report.summary.totalPages++;

          // Add issues to report
          for (const violation of accessibilityResults.violations) {
            report.issues.push({
              page: page.name,
              environment: envName,
              type: 'accessibility',
              severity: violation.impact as any || 'moderate',
              description: violation.description,
              wcagCriterion: violation.tags.find(t => t.startsWith('wcag'))?.toUpperCase(),
              element: violation.nodes[0]?.html?.substring(0, 100)
            });
          }

          // Log but don't fail on accessibility issues (we want to collect all)
          if (accessibilityResults.violations.length > 0) {
            console.log(`${page.name}: ${accessibilityResults.violations.length} accessibility violations`);
          }
        });

        // Screenshot tests at different viewports
        for (const viewport of VIEWPORTS) {
          test(`screenshot - ${viewport.name}`, async ({ page: browserPage }) => {
            await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });
            await browserPage.goto(page.path, { waitUntil: 'networkidle' });
            await browserPage.waitForTimeout(1000);

            const screenshotName = `${envName}-${page.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.name}.png`;
            const screenshotPath = path.join(screenshotDir, screenshotName);

            await browserPage.screenshot({
              path: screenshotPath,
              fullPage: true
            });

            report.screenshots.push({
              page: page.name,
              viewport: viewport.name,
              path: `screenshots/${screenshotName}`
            });
          });
        }

        test(`keyboard navigation`, async ({ page: browserPage }) => {
          await browserPage.goto(page.path, { waitUntil: 'networkidle' });

          // Test Tab navigation
          let tabCount = 0;
          const maxTabs = 50;
          const focusedElements: string[] = [];

          while (tabCount < maxTabs) {
            await browserPage.keyboard.press('Tab');
            tabCount++;

            const focusedElement = await browserPage.evaluate(() => {
              const el = document.activeElement;
              if (!el || el === document.body) return null;
              return {
                tag: el.tagName,
                role: el.getAttribute('role'),
                text: el.textContent?.substring(0, 50),
                hasVisibleFocus: window.getComputedStyle(el).outlineStyle !== 'none' ||
                                 window.getComputedStyle(el).boxShadow !== 'none'
              };
            });

            if (!focusedElement) break;

            // Check for visible focus indicator
            if (!focusedElement.hasVisibleFocus) {
              report.issues.push({
                page: page.name,
                environment: envName,
                type: 'keyboard',
                severity: 'serious',
                description: `Missing visible focus indicator on ${focusedElement.tag} element`,
                wcagCriterion: 'WCAG 2.4.7',
                element: focusedElement.text || focusedElement.tag
              });
            }
          }
        });
      });
    }

    // Test public pages
    for (const page of PUBLIC_PAGES) {
      test(`${page.name} - accessibility audit`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path, { waitUntil: 'networkidle' });
        await browserPage.waitForTimeout(1000);

        const accessibilityResults = await new AxeBuilder({ page: browserPage })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();

        report.accessibilityResults[`${envName}-${page.name}`] = accessibilityResults;

        for (const violation of accessibilityResults.violations) {
          report.issues.push({
            page: page.name,
            environment: envName,
            type: 'accessibility',
            severity: violation.impact as any || 'moderate',
            description: violation.description,
            wcagCriterion: violation.tags.find(t => t.startsWith('wcag'))?.toUpperCase()
          });
        }
      });
    }

    // Responsive design tests
    test('responsive - sidebar behavior', async ({ page: browserPage }) => {
      // Desktop - sidebar should be visible
      await browserPage.setViewportSize({ width: 1920, height: 1080 });
      await browserPage.goto('/', { waitUntil: 'networkidle' });

      const sidebarDesktop = await browserPage.locator('nav, [class*="sidebar"]').first();
      const isVisibleDesktop = await sidebarDesktop.isVisible().catch(() => false);

      if (!isVisibleDesktop) {
        report.issues.push({
          page: 'Dashboard',
          environment: envName,
          type: 'responsive',
          severity: 'moderate',
          description: 'Sidebar not visible on desktop viewport'
        });
      }

      // Mobile - sidebar should be hidden, mobile nav should be available
      await browserPage.setViewportSize({ width: 390, height: 844 });
      await browserPage.waitForTimeout(500);

      const mobileNavTrigger = await browserPage.locator('button[class*="mobile"], [aria-label*="menu"]').first();
      const hasMobileNav = await mobileNavTrigger.isVisible().catch(() => false);

      if (!hasMobileNav) {
        report.issues.push({
          page: 'Dashboard',
          environment: envName,
          type: 'responsive',
          severity: 'serious',
          description: 'Mobile navigation trigger not found or not visible on mobile viewport'
        });
      }
    });

    // Form accessibility tests
    test('forms - label associations', async ({ page: browserPage }) => {
      await browserPage.goto('/properties', { waitUntil: 'networkidle' });

      // Try to open add property dialog
      const addButton = await browserPage.locator('button:has-text("Add"), button:has-text("New")').first();
      if (await addButton.isVisible().catch(() => false)) {
        await addButton.click();
        await browserPage.waitForTimeout(500);

        // Check for inputs without labels
        const inputs = await browserPage.locator('input:not([type="hidden"]), textarea, select').all();

        for (const input of inputs) {
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');

          if (id) {
            const hasLabel = await browserPage.locator(`label[for="${id}"]`).count() > 0;
            if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
              const placeholder = await input.getAttribute('placeholder') || 'unknown';
              report.issues.push({
                page: 'Properties Form',
                environment: envName,
                type: 'accessibility',
                severity: 'serious',
                description: `Input "${placeholder}" has no associated label`,
                wcagCriterion: 'WCAG 1.3.1'
              });
            }
          }
        }

        // Close dialog
        await browserPage.keyboard.press('Escape');
      }
    });
  });
}
