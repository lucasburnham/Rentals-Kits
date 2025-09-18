const fs = require('fs');
const assert = require('assert');

// Read index.html
const html = fs.readFileSync('index.html', 'utf8');

// Ensure the main heading is present with the updated text
const headingMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
const headingText = headingMatch ? headingMatch[1].replace(/<[^>]+>/g, '').trim() : '';
assert(
  headingText.includes('Roommate Lease') && headingText.includes('Move-In/Out Kits for Student Rentals'),
  'Main heading should highlight roommate lease and move-in/out kits for student rentals'
);

// Ensure the hero CTA clearly states the bundle and price
const ctaMatches = html.match(/>Buy the Bundle — \$35</g) || [];
assert(ctaMatches.length >= 2, 'Expect at least two "Buy the Bundle — $35" CTAs');

// Ensure all external anchors include rel="noopener noreferrer"
const anchorTags = html.match(/<a\b[^>]*href=["'][^"']+["'][^>]*>/gi) || [];
anchorTags.forEach(tag => {
  const hrefMatch = tag.match(/href\s*=\s*["']([^"']+)["']/i);
  const href = hrefMatch ? hrefMatch[1] : '';
  if (/^https?:\/\//i.test(href)) {
    const relMatch = tag.match(/rel\s*=\s*["']([^"']+)["']/i);
    const rel = relMatch ? relMatch[1] : '';
    const relParts = rel.split(/\s+/);
    assert(
      relParts.includes('noopener') && relParts.includes('noreferrer'),
      `External link ${href} must include rel="noopener noreferrer"`
    );
  }
});

// Ensure FAQ schema markup is present for SEO
assert(
  /"@type"\s*:\s*"FAQPage"/.test(html),
  'FAQ schema should be included for rich results'
);

console.log('All checks passed.');
