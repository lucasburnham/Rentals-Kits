const fs = require('fs');
const assert = require('assert');

const content = fs.readFileSync('index.html', 'utf8');
assert(content.includes('Rental Kits'), 'index.html should reference Rental Kits');

console.log('All tests passed.');
