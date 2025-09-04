const fs = require('fs');
const assert = require('assert');

// Read index.html
const html = fs.readFileSync('index.html', 'utf8');

// Extract the content of the first element with class "product-links"
const productLinksMatch = html.match(/<[^>]*class=["'][^"']*product-links[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i);
const productLinksContent = productLinksMatch ? productLinksMatch[1] : '';

// Find all anchor opening and closing tags within the section
const anchorOpens = productLinksContent.match(/<a\b[^>]*>/gi) || [];
const anchorCloses = productLinksContent.match(/<\/a>/gi) || [];

// Ensure each anchor has a closing tag
assert.strictEqual(
  anchorOpens.length,
  anchorCloses.length,
  'Each anchor in .product-links must have a closing tag'
);

// Validate external links have rel="noopener noreferrer"
anchorOpens.forEach(tag => {
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

console.log('All checks passed.');
