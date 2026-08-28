const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, error: e.message });
        }
      });
    }).on('error', reject);
  });
}

const englishTranslations = [
  { code: 'KJV', name: 'King James Version' },
  { code: 'WEB', name: 'World English Bible' },
  { code: 'ASV', name: 'American Standard Version' },
  { code: 'BBE', name: 'Bible in Basic English' },
  { code: 'YLT', name: 'Young\'s Literal Translation' },
  { code: 'DARBY', name: 'Darby Translation' },
  { code: 'DRA', name: 'Douay-Rheims American' },
  { code: 'GNV', name: 'Geneva Bible' },
  { code: 'ESV', name: 'English Standard Version' },
  { code: 'NIV', name: 'New International Version' },
  { code: 'NASB', name: 'New American Standard' },
  { code: 'NLT', name: 'New Living Translation' },
  { code: 'NET', name: 'NET Bible' },
];

const testPassages = [
  { bookOrder: 1, chapter: 1, name: 'Genesis 1' },
  { bookOrder: 19, chapter: 23, name: 'Psalms 23' },
  { bookOrder: 43, chapter: 1, name: 'John 1' },
  { bookOrder: 45, chapter: 8, name: 'Romans 8' },
  { bookOrder: 66, chapter: 22, name: 'Revelation 22' },
];

async function verifyEnglish() {
  console.log('=== VERIFYING ENGLISH TRANSLATIONS ACROSS 66 BOOKS ===\n');

  for (const tr of englishTranslations) {
    console.log(`Checking [${tr.code}] - ${tr.name}:`);
    for (const p of testPassages) {
      const url = `https://bolls.life/get-chapter/${tr.code}/${p.bookOrder}/${p.chapter}/`;
      try {
        const res = await fetchJson(url);
        if (res.status === 200 && Array.isArray(res.json)) {
          const sample = res.json[0]?.text?.replace(/<[^>]+>/g, '').trim() || '';
          console.log(`  ✓ ${p.name}: ${res.json.length} verses | V1: "${sample.slice(0, 45)}..."`);
        } else {
          console.log(`  ⚠ ${p.name}: Status ${res.status}`);
        }
      } catch (err) {
        console.log(`  ❌ ${p.name}: Error ${err.message}`);
      }
    }
    console.log('');
  }
}

verifyEnglish().catch(console.error);
