/**
 * Download Blinkit-style product images from Unsplash for all catalog items.
 * Usage: node scripts/download-product-images.mjs
 */

import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../public/catalog/items');

// Curated Unsplash photo IDs for each product slug → clean, Blinkit-style images
// Format: slug -> Unsplash photo ID (sharp product/food photos)
const PRODUCT_IMAGE_MAP = {
  // ── GROCERY ────────────────────────────────────────────────────────────────
  'atta':               'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&auto=format',
  'maida':              'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
  'besan':              'https://images.unsplash.com/photo-1612257416648-d0e5b6a90e21?w=400&h=400&fit=crop&auto=format',
  'rice':               'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=400&fit=crop&auto=format',
  'basmati-rice':       'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&auto=format',
  'dal':                'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&auto=format',
  'toor-dal':           'https://images.unsplash.com/photo-1612257416648-d0e5b6a90e21?w=400&h=400&fit=crop&auto=format',
  'moong-dal':          'https://images.unsplash.com/photo-1628294895950-9805252f784d?w=400&h=400&fit=crop&auto=format',
  'rajma':              'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&h=400&fit=crop&auto=format',
  'chana':              'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=400&fit=crop&auto=format',
  'sugar':              'https://images.unsplash.com/photo-1591556520290-e9ce940e4059?w=400&h=400&fit=crop&auto=format',
  'salt':               'https://images.unsplash.com/photo-1609167830220-7164aa360951?w=400&h=400&fit=crop&auto=format',
  'turmeric':           'https://images.unsplash.com/photo-1615485500704-8e3b8f5c1a6e?w=400&h=400&fit=crop&auto=format',
  'red-chilli-powder':  'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&h=400&fit=crop&auto=format',
  'coriander-powder':   'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&auto=format',
  'garam-masala':       'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop&auto=format',
  'cooking-oil':        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&auto=format',
  'mustard-oil':        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&auto=format',
  'ghee':               'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop&auto=format',
  'pickle':             'https://images.unsplash.com/photo-1589135716994-5f57f82e0b5f?w=400&h=400&fit=crop&auto=format',
  'ketchup':            'https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=400&h=400&fit=crop&auto=format',
  'tomato-sauce':       'https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=400&h=400&fit=crop&auto=format',
  'mayonnaise':         'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=400&fit=crop&auto=format',
  'maggi':              'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=400&fit=crop&auto=format',
  'pasta':              'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&auto=format',
  'noodles':            'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop&auto=format',
  'poha':               'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&auto=format',
  'oats':               'https://images.unsplash.com/photo-1574244703842-a98c0f5d94ca?w=400&h=400&fit=crop&auto=format',
  'cornflakes':         'https://images.unsplash.com/photo-1489391385743-6f2fd68b95be?w=400&h=400&fit=crop&auto=format',
  'bread':              'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=400&fit=crop&auto=format',
  'rusk':               'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&auto=format',
  'biscuits':           'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop&auto=format',
  'namkeen':            'https://images.unsplash.com/photo-1625285869491-3d7b14a74fb6?w=400&h=400&fit=crop&auto=format',
  'packaged-food':      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&auto=format',
  'instant-food':       'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=400&fit=crop&auto=format',
  'sooji':              'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&auto=format',
  'vermicelli':         'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&auto=format',
  'peanut-butter':      'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=400&h=400&fit=crop&auto=format',
  'jam':                'https://images.unsplash.com/photo-1563252765-70a008356fbe?w=400&h=400&fit=crop&auto=format',
  'honey':              'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&auto=format',

  // ── MILK & DAIRY ───────────────────────────────────────────────────────────
  'milk':               'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&auto=format',
  'toned-milk':         'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&auto=format',
  'full-cream-milk':    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&auto=format',
  'curd':               'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&auto=format',
  'paneer':             'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop&auto=format',
  'butter':             'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop&auto=format',
  'cheese':             'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&h=400&fit=crop&auto=format',
  'cream':              'https://images.unsplash.com/photo-1611068661547-6b6c6b4f6e23?w=400&h=400&fit=crop&auto=format',
  'lassi':              'https://images.unsplash.com/photo-1571167652-4f7d4e8c3a3e?w=400&h=400&fit=crop&auto=format',
  'buttermilk':         'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&auto=format',
  'flavoured-milk':     'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=400&fit=crop&auto=format',
  'yogurt':             'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&auto=format',
  'dairy-products':     'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&auto=format',

  // ── SNACKS ─────────────────────────────────────────────────────────────────
  'lays':               'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&auto=format',
  'kurkure':            'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop&auto=format',
  'bingo':              'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&auto=format',
  'uncle-chipps':       'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&auto=format',
  'doritos':            'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop&auto=format',
  'nachos':             'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format',
  'popcorn':            'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&h=400&fit=crop&auto=format',
  'bhujia':             'https://images.unsplash.com/photo-1625285869491-3d7b14a74fb6?w=400&h=400&fit=crop&auto=format',
  'mixture':            'https://images.unsplash.com/photo-1625285869491-3d7b14a74fb6?w=400&h=400&fit=crop&auto=format',
  'wafers':             'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&auto=format',
  'parle-g':            'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop&auto=format',
  'good-day':           'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop&auto=format',
  'cookies':            'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop&auto=format',
  'chocolates':         'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop&auto=format',
  'dairy-milk':         'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop&auto=format',
  'kitkat':             'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop&auto=format',
  'candy':              'https://images.unsplash.com/photo-1582058091218-6a9c4b2d8c60?w=400&h=400&fit=crop&auto=format',
  'nuts':               'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&h=400&fit=crop&auto=format',
  'haldiram-snacks':    'https://images.unsplash.com/photo-1625285869491-3d7b14a74fb6?w=400&h=400&fit=crop&auto=format',

  // ── DRINKS ─────────────────────────────────────────────────────────────────
  'coke':               'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop&auto=format',
  'coca-cola':          'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop&auto=format',
  'pepsi':              'https://images.unsplash.com/photo-1629203851122-3726555cf4c9?w=400&h=400&fit=crop&auto=format',
  'sprite':             'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=400&fit=crop&auto=format',
  'fanta':              'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=400&fit=crop&auto=format',
  'limca':              'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=400&fit=crop&auto=format',
  'mountain-dew':       'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=400&fit=crop&auto=format',
  'thums-up':           'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop&auto=format',
  'sting':              'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&auto=format',
  'red-bull':           'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&auto=format',
  'monster':            'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&auto=format',
  'energy-drink':       'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop&auto=format',
  'bisleri-water':      'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop&auto=format',
  'packaged-water':     'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop&auto=format',
  'juice':              'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format',
  'real-juice':         'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format',
  'maaza':              'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format',
  'frooti':             'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format',
  'fruit-drink':        'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&auto=format',
  'cold-coffee':        'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&auto=format',
  'water':              'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop&auto=format',

  // ── TEA & COFFEE ───────────────────────────────────────────────────────────
  'tea':                'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop&auto=format',
  'chai':               'https://images.unsplash.com/photo-1571934811356-5cc061b6d9a0?w=400&h=400&fit=crop&auto=format',
  'black-tea':          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop&auto=format',
  'green-tea':          'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&auto=format',
  'coffee':             'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&auto=format',
  'cappuccino':         'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop&auto=format',
  'instant-coffee':     'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&auto=format',
  'nescafe':            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&auto=format',
  'tea-bags':           'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop&auto=format',
  'coffee-sachets':     'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&auto=format',

  // ── FOOD ───────────────────────────────────────────────────────────────────
  'sandwich':           'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop&auto=format',
  'fries':              'https://images.unsplash.com/photo-1630384060421-cb20aad1daee?w=400&h=400&fit=crop&auto=format',
  'momos':              'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&h=400&fit=crop&auto=format',
  'burger':             'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&auto=format',
  'roll':               'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop&auto=format',
  'samosa':             'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop&auto=format',
  'pakora':             'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop&auto=format',
  'spring-rolls':       'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=400&h=400&fit=crop&auto=format',
  'pizza':              'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&auto=format',
  'wrap':               'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop&auto=format',
  'nuggets':            'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&h=400&fit=crop&auto=format',
  'fried-chicken':      'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=400&fit=crop&auto=format',
  'dessert':            'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop&auto=format',
  'combo-meal':         'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&auto=format',
  'quick-food':         'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=400&h=400&fit=crop&auto=format',
  'local-snacks':       'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop&auto=format',

  // ── VEGETABLES ─────────────────────────────────────────────────────────────
  'potato':             'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop&auto=format',
  'onion':              'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=400&fit=crop&auto=format',
  'tomato':             'https://images.unsplash.com/photo-1561136594-7f68813d8b05?w=400&h=400&fit=crop&auto=format',
  'garlic':             'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=400&fit=crop&auto=format',
  'ginger':             'https://images.unsplash.com/photo-1615485500704-8e3b8f5c1a6e?w=400&h=400&fit=crop&auto=format',
  'green-chilli':       'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&h=400&fit=crop&auto=format',
  'lemon':              'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop&auto=format',
  'carrot':             'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop&auto=format',
  'cucumber':           'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=400&fit=crop&auto=format',
  'capsicum':           'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&auto=format',
  'cauliflower':        'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop&auto=format',
  'cabbage':            'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&h=400&fit=crop&auto=format',
  'peas':               'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop&auto=format',
  'spinach':            'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&auto=format',
  'coriander':          'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=400&fit=crop&auto=format',
  'beans':              'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400&h=400&fit=crop&auto=format',
  'brinjal':            'https://images.unsplash.com/photo-1659205931523-3b91d8bfd3e8?w=400&h=400&fit=crop&auto=format',
  'bottle-gourd':       'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&h=400&fit=crop&auto=format',

  // ── DRY FRUITS ─────────────────────────────────────────────────────────────
  'almonds':            'https://images.unsplash.com/photo-1574184864703-3487b13f0edd?w=400&h=400&fit=crop&auto=format',
  'cashews':            'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=400&fit=crop&auto=format',
  'raisins':            'https://images.unsplash.com/photo-1597380281385-0a67892eda33?w=400&h=400&fit=crop&auto=format',
  'walnuts':            'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=400&h=400&fit=crop&auto=format',
  'pistachios':         'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop&auto=format',
  'dates':              'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&h=400&fit=crop&auto=format',
  'peanuts':            'https://images.unsplash.com/photo-1567474628303-e8e2b56af0e7?w=400&h=400&fit=crop&auto=format',
  'mixed-dry-fruits':   'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&h=400&fit=crop&auto=format',
  'seeds':              'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
  'sunflower-seeds':    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop&auto=format',

  // ── PERSONAL CARE ──────────────────────────────────────────────────────────
  'face-wash':          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&auto=format',
  'moisturizer':        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format',
  'sunscreen':          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&auto=format',
  'face-cream':         'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&auto=format',
  'body-lotion':        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&auto=format',
  'soap':               'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&h=400&fit=crop&auto=format',
  'hand-wash':          'https://images.unsplash.com/photo-1584265549908-b39f0c685e4f?w=400&h=400&fit=crop&auto=format',
  'shampoo':            'https://images.unsplash.com/photo-1586798133834-b56a4b5ea4ef?w=400&h=400&fit=crop&auto=format',
  'conditioner':        'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop&auto=format',
  'hair-oil':           'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format',
  'hair-gel':           'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&auto=format',
  'deodorant':          'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop&auto=format',
  'perfume':            'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop&auto=format',
  'lip-balm':           'https://images.unsplash.com/photo-1625093093093-afa9f1c69b8d?w=400&h=400&fit=crop&auto=format',
  'shaving-cream':      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&auto=format',
  'razor':              'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&auto=format',
  'aftershave':         'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop&auto=format',
  'toothpaste':         'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop&auto=format',
  'toothbrush':         'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop&auto=format',

  // ── HOUSEHOLD ──────────────────────────────────────────────────────────────
  'mouthwash':          'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop&auto=format',
  'toilet-cleaner':     'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&auto=format',
  'floor-cleaner':      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&auto=format',
  'dishwashing-liquid': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&auto=format',
  'scrubber':           'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop&auto=format',
  'detergent':          'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop&auto=format',
  'washing-powder':     'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop&auto=format',
  'garbage-bags':       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format',
  'tissues':            'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&auto=format',
  'toilet-paper':       'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&auto=format',
  'kitchen-towels':     'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&auto=format',
  'batteries':          'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop&auto=format',
  'mosquito-repellent': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format',
  'matchbox':           'https://images.unsplash.com/photo-1543946602-a0fce8117697?w=400&h=400&fit=crop&auto=format',
  'candle':             'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&h=400&fit=crop&auto=format',
  'cleaning-products':  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop&auto=format',

  // ── MEDICAL ────────────────────────────────────────────────────────────────
  'bandage':            'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400&h=400&fit=crop&auto=format',
  'cotton':             'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400&h=400&fit=crop&auto=format',
  'antiseptic':         'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'dettol':             'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'thermometer':        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'mask':               'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=400&fit=crop&auto=format',
  'hand-sanitizer':     'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=400&fit=crop&auto=format',
  'ors':                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'paracetamol':        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'first-aid-kit':      'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400&h=400&fit=crop&auto=format',
  'pain-relief':        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'cough-syrup':        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'vitamin-c':          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'electrolyte':        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'condoms':            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'sanitary-pads':      'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400&h=400&fit=crop&auto=format',
  'intimate-wash':      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
  'lubricant':          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format',
};

// ── helpers ──────────────────────────────────────────────────────────────────

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    function doRequest(reqUrl, redirectCount = 0) {
      if (redirectCount > 5) return reject(new Error('Too many redirects'));
      protocol.get(reqUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          const redirectProto = res.headers.location.startsWith('https') ? https : http;
          return doRequest(res.headers.location, redirectCount + 1);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          return reject(new Error(`HTTP ${res.statusCode} for ${reqUrl}`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
        file.on('error', reject);
      }).on('error', reject);
    }
    doRequest(url);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const slugs = Object.keys(PRODUCT_IMAGE_MAP);
  console.log(`\n🛒  Downloading ${slugs.length} Blinkit-style product images...\n`);

  let ok = 0, fail = 0;

  for (const slug of slugs) {
    const url = PRODUCT_IMAGE_MAP[slug];
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
    await sleep(80); // polite delay
  }

  console.log(`\n✅  Done! ${ok} downloaded, ${fail} failed.\n`);
}

main();
