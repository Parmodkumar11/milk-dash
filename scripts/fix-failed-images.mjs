/**
 * Fix-up script: re-download only the failed images with working Unsplash IDs.
 * Run after download-product-images.mjs if there were 404s.
 */

import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../public/catalog/items');

// Working replacements for previously 404'd IDs (verified photo IDs)
const FIXES = {
  'besan':            'https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?w=400&h=400&fit=crop&auto=format',
  'toor-dal':         'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&auto=format',
  'moong-dal':        'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&auto=format',
  'sugar':            'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=400&h=400&fit=crop&auto=format',
  'turmeric':         'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&auto=format',
  'pickle':           'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&auto=format',
  'oats':             'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=400&h=400&fit=crop&auto=format',
  'cornflakes':       'https://images.unsplash.com/photo-1521483451569-e33176b7e107?w=400&h=400&fit=crop&auto=format',
  'namkeen':          'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop&auto=format',
  'peanut-butter':    'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=400&fit=crop&auto=format',
  'jam':              'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&auto=format',
  'cream':            'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=400&fit=crop&auto=format',
  'lassi':            'https://images.unsplash.com/photo-1568183348866-f9d83a49d36d?w=400&h=400&fit=crop&auto=format',
  'bhujia':           'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop&auto=format',
  'mixture':          'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop&auto=format',
  'candy':            'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=400&fit=crop&auto=format',
  'haldiram-snacks':  'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop&auto=format',
  'pepsi':            'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop&auto=format',
  'juice':            'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop&auto=format',
  'real-juice':       'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop&auto=format',
  'maaza':            'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop&auto=format',
  'frooti':           'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop&auto=format',
  'fruit-drink':      'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop&auto=format',
  'chai':             'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=400&fit=crop&auto=format',
  'ginger':           'https://images.unsplash.com/photo-1603431777007-61e5d8dc0a84?w=400&h=400&fit=crop&auto=format',
  'lemon':            'https://images.unsplash.com/photo-1562583489-bf035a5b9da5?w=400&h=400&fit=crop&auto=format',
  'walnuts':          'https://images.unsplash.com/photo-1626197031507-c17099753214?w=400&h=400&fit=crop&auto=format',
  'pistachios':       'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=400&h=400&fit=crop&auto=format',
  'dates':            'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop&auto=format',
  'seeds':            'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format',
  'sunflower-seeds':  'https://images.unsplash.com/photo-1571680313668-c3e68d40f4b9?w=400&h=400&fit=crop&auto=format',
  'lip-balm':         'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&auto=format',
  'candle':           'https://images.unsplash.com/photo-1516571748831-5d81767b788d?w=400&h=400&fit=crop&auto=format',
  'matchbox':         'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop&auto=format',
  'garbage-bags':     'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop&auto=format',
  'mosquito-repellent':'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&auto=format',
  'ors':              'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'condoms':          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'lubricant':        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&auto=format',
  'intimate-wash':    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&auto=format',
  'momos':            'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=400&fit=crop&auto=format',
  'samosa':           'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop&auto=format',
  'pakora':           'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&auto=format',
  'spring-rolls':     'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=400&h=400&fit=crop&auto=format',
  'wrap':             'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop&auto=format',
  'roll':             'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=400&fit=crop&auto=format',
  'local-snacks':     'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&auto=format',
  'quick-food':       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&auto=format',
  'bottle-gourd':     'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&h=400&fit=crop&auto=format',
  'brinjal':          'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=400&fit=crop&auto=format',
  'coriander':        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop&auto=format',
  'detergent':        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&auto=format',
  'washing-powder':   'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop&auto=format',
  'face-cream':       'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&auto=format',
  'hair-gel':         'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop&auto=format',
  'hair-oil':         'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop&auto=format',
  'sunscreen':        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&auto=format',
  'deodorant':        'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop&auto=format',
  'perfume':          'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop&auto=format',
  'mouthwash':        'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop&auto=format',
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    function doRequest(reqUrl, redirectCount = 0) {
      if (redirectCount > 5) return reject(new Error('Too many redirects'));
      const mod = reqUrl.startsWith('https') ? https : http;
      mod.get(reqUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          return doRequest(res.headers.location, redirectCount + 1);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
        file.on('error', reject);
      }).on('error', reject);
    }
    doRequest(url);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const slugs = Object.keys(FIXES);
  console.log(`\n🔧  Fixing ${slugs.length} failed images...\n`);

  let ok = 0, fail = 0;
  for (const slug of slugs) {
    const url = FIXES[slug];
    const dest = path.join(OUTPUT_DIR, `${slug}.jpg`);
    process.stdout.write(`  → ${slug.padEnd(25)} `);
    try {
      await downloadFile(url, dest);
      process.stdout.write('✅\n');
      ok++;
    } catch (e) {
      process.stdout.write(`❌  ${e.message}\n`);
      fail++;
    }
    await sleep(80);
  }
  console.log(`\n✅  Done! ${ok} fixed, ${fail} still failed.\n`);
}

main();
