const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const artifactsDir = 'C:\\Users\\aryar\\.gemini\\antigravity-ide\\brain\\7a5a9153-a1d6-4c6f-86cb-56b15dc77a49';
const publicDir = 'C:\\PROJECTS\\WEB DEV\\KID\\frontend\\public\\mocks';

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Map of category to generated image
const images = {
  'Sayuran': 'mock_sayuran_1784287377280.png',
  'Buah-buahan': 'mock_buah_1784287387762.png',
  'Ternak (Hidup)': 'mock_ternak_1784287398084.png',
  'Daging': 'mock_daging_1784287407027.png',
  'Telur': 'mock_telur_1784287417129.png',
  'Susu & Olahan': 'mock_susu_1784287426207.png',
  'Pupuk & Bibit': 'mock_pupuk_1784287436416.png',
  'Alat Tani': 'mock_alat_1784287447181.png',
};

// Copy images to frontend public
for (const [cat, filename] of Object.entries(images)) {
  const src = path.join(artifactsDir, filename);
  const dest = path.join(publicDir, filename);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

// Generate realistic mock data with highly optimized safe keywords for LoremFlickr
const mockData = {
  'Sayuran': [
    { title: 'Bayam Hidroponik Segar', price: 5000, unit: 'ikat', kw: 'spinach' },
    { title: 'Kangkung Cabut Organik', price: 4000, unit: 'ikat', kw: 'spinach' },
    { title: 'Sawi Hijau Manis', price: 6000, unit: 'kg', kw: 'vegetable' },
    { title: 'Wortel Brastagi Pilihan', price: 12000, unit: 'kg', kw: 'carrot' },
    { title: 'Brokoli Hijau Segar', price: 18000, unit: 'kg', kw: 'broccoli' },
    { title: 'Tomat Merah Cherry', price: 15000, unit: 'kg', kw: 'tomato' },
    { title: 'Kubis Kol Bulat', price: 8000, unit: 'kg', kw: 'cabbage' },
    { title: 'Kacang Panjang Muda', price: 9000, unit: 'kg', kw: 'beans' },
    { title: 'Bawang Merah Brebes', price: 32000, unit: 'kg', kw: 'onion' },
    { title: 'Cabai Rawit Merah Pedas', price: 45000, unit: 'kg', kw: 'chili' }
  ],
  'Buah-buahan': [
    { title: 'Pisang Cavendish Manis', price: 20000, unit: 'sisir', kw: 'banana' },
    { title: 'Mangga Harumanis Super', price: 25000, unit: 'kg', kw: 'mango' },
    { title: 'Jeruk Medan Manis Segar', price: 22000, unit: 'kg', kw: 'orange' },
    { title: 'Alpukat Mentega Tua', price: 28000, unit: 'kg', kw: 'avocado' },
    { title: 'Melon Sky Rocket Besar', price: 30000, unit: 'buah', kw: 'melon' },
    { title: 'Semangka Merah Tanpa Biji', price: 40000, unit: 'buah', kw: 'watermelon' },
    { title: 'Pepaya California Matang', price: 15000, unit: 'buah', kw: 'papaya' },
    { title: 'Salak Pondoh Manis', price: 12000, unit: 'kg', kw: 'fruit' },
    { title: 'Nanas Madu Subang', price: 10000, unit: 'buah', kw: 'pineapple' },
    { title: 'Apel Malang Segar', price: 24000, unit: 'kg', kw: 'apple' }
  ],
  'Ternak (Hidup)': [
    { title: 'Sapi Limosin Super Jantan', price: 25000000, unit: 'ekor', kw: 'cow' },
    { title: 'Kambing Etawa Betina', price: 3500000, unit: 'ekor', kw: 'goat' },
    { title: 'Domba Garut Jantan', price: 4000000, unit: 'ekor', kw: 'sheep' },
    { title: 'Ayam Kampung Petelur', price: 75000, unit: 'ekor', kw: 'chicken' },
    { title: 'Bebek Peking Pedaging', price: 85000, unit: 'ekor', kw: 'duck' },
    { title: 'Sapi Brahman Betina', price: 18000000, unit: 'ekor', kw: 'cow' },
    { title: 'Kambing Kacang Siap Potong', price: 2500000, unit: 'ekor', kw: 'goat' },
    { title: 'Ayam Joper Usia 2 Bulan', price: 35000, unit: 'ekor', kw: 'rooster' },
    { title: 'Anak Sapi (Pendet) Super', price: 8000000, unit: 'ekor', kw: 'calf' },
    { title: 'Kelinci Pedaging New Zealand', price: 120000, unit: 'ekor', kw: 'rabbit' }
  ],
  'Daging': [
    { title: 'Daging Sapi Has Dalam', price: 135000, unit: 'kg', kw: 'raw,beef' },
    { title: 'Daging Sapi Tetelan', price: 95000, unit: 'kg', kw: 'raw,beef' },
    { title: 'Daging Ayam Broiler Utuh', price: 36000, unit: 'ekor', kw: 'raw,chicken' },
    { title: 'Dada Ayam Fillet Segar', price: 48000, unit: 'kg', kw: 'raw,chicken' },
    { title: 'Sayap Ayam (Chicken Wings)', price: 32000, unit: 'kg', kw: 'raw,chicken' },
    { title: 'Daging Kambing Paha Muda', price: 125000, unit: 'kg', kw: 'raw,meat' },
    { title: 'Iga Sapi Potong Sop', price: 110000, unit: 'kg', kw: 'ribs,meat' },
    { title: 'Ati Ampela Ayam Bersih', price: 25000, unit: 'kg', kw: 'raw,meat' },
    { title: 'Buntut Sapi Utuh', price: 145000, unit: 'kg', kw: 'raw,beef' },
    { title: 'Daging Bebek Potong', price: 55000, unit: 'ekor', kw: 'raw,duck' }
  ],
  'Telur': [
    { title: 'Telur Ayam Ras Segar', price: 28000, unit: 'kg', kw: 'egg' },
    { title: 'Telur Ayam Kampung Asli', price: 3000, unit: 'butir', kw: 'egg' },
    { title: 'Telur Bebek Mentah Besar', price: 3500, unit: 'butir', kw: 'egg' },
    { title: 'Telur Asin Brebes Masir', price: 4500, unit: 'butir', kw: 'egg' },
    { title: 'Telur Puyuh Rebus', price: 35000, unit: 'kg', kw: 'egg' },
    { title: 'Telur Omega 3 Premium', price: 35000, unit: 'kg', kw: 'egg' },
    { title: 'Telur Ayam Ras (Peti)', price: 400000, unit: 'peti', kw: 'egg' },
    { title: 'Telur Tetas Ayam Kampung', price: 4500, unit: 'butir', kw: 'egg' },
    { title: 'Telur Entok (Menthok)', price: 4000, unit: 'butir', kw: 'egg' },
    { title: 'Telur Arab Organik', price: 3500, unit: 'butir', kw: 'egg' }
  ],
  'Susu & Olahan': [
    { title: 'Susu Sapi Murni Pasteurisasi', price: 15000, unit: 'liter', kw: 'milk' },
    { title: 'Susu Kambing Etawa Segar', price: 25000, unit: 'liter', kw: 'milk' },
    { title: 'Yogurt Plain Homemade', price: 35000, unit: 'liter', kw: 'yogurt' },
    { title: 'Keju Mozzarella Lokal', price: 85000, unit: 'kg', kw: 'cheese' },
    { title: 'Mentega Tawar Organik', price: 45000, unit: 'kg', kw: 'butter' },
    { title: 'Susu Kental Manis Farm', price: 12000, unit: 'kaleng', kw: 'milk' },
    { title: 'Es Krim Susu Murni', price: 25000, unit: 'cup', kw: 'icecream' },
    { title: 'Kefir Susu Kambing', price: 30000, unit: 'liter', kw: 'milk' },
    { title: 'Bubuk Susu Kambing Etawa', price: 55000, unit: 'box', kw: 'milk' },
    { title: 'Susu Kedelai Organik', price: 10000, unit: 'liter', kw: 'milk' }
  ],
  'Pupuk & Bibit': [
    { title: 'Pupuk Kompos Organik', price: 25000, unit: 'karung', kw: 'soil' },
    { title: 'Pupuk Kandang Sapi Kering', price: 20000, unit: 'karung', kw: 'soil' },
    { title: 'Bibit Padi Mamberamo', price: 15000, unit: 'kg', kw: 'seeds' },
    { title: 'Bibit Cabai Rawit Polybag', price: 2500, unit: 'pohon', kw: 'seedling' },
    { title: 'Bibit Durian Musang King', price: 125000, unit: 'pohon', kw: 'tree' },
    { title: 'Pupuk Urea Nitrea', price: 120000, unit: 'sak', kw: 'fertilizer' },
    { title: 'Pupuk NPK Mutiara 16-16-16', price: 18000, unit: 'kg', kw: 'fertilizer' },
    { title: 'Bibit Alpukat Miki Berbuah', price: 85000, unit: 'pohon', kw: 'tree' },
    { title: 'Bibit Tomat Servo', price: 85000, unit: 'sachet', kw: 'seeds' },
    { title: 'Media Tanam Siap Pakai', price: 15000, unit: 'karung', kw: 'soil' }
  ],
  'Alat Tani': [
    { title: 'Cangkul Baja Asli', price: 85000, unit: 'pcs', kw: 'hoe' },
    { title: 'Sabit Rumput Tajam', price: 45000, unit: 'pcs', kw: 'sickle' },
    { title: 'Sprayer Elektrik 16L', price: 450000, unit: 'unit', kw: 'sprayer' },
    { title: 'Selang Air Irigasi 50m', price: 125000, unit: 'roll', kw: 'hose' },
    { title: 'Garpu Tanah Besi Tebal', price: 95000, unit: 'pcs', kw: 'pitchfork' },
    { title: 'Gunting Dahan Pruning', price: 65000, unit: 'pcs', kw: 'pruner' },
    { title: 'Sepatu Boots Petani Anti Air', price: 55000, unit: 'pasang', kw: 'boots' },
    { title: 'Paranet 65% Peneduh Tanaman', price: 15000, unit: 'meter', kw: 'net' },
    { title: 'Traktor Mini Cultivator', price: 6500000, unit: 'unit', kw: 'tractor' },
    { title: 'Pompa Air Irigasi Bensin', price: 1250000, unit: 'unit', kw: 'pump' }
  ]
};

const keywordMap = {
  'Sayuran': 'vegetable',
  'Buah-buahan': 'fruit',
  'Ternak (Hidup)': 'livestock',
  'Daging': 'raw-meat',
  'Telur': 'egg',
  'Susu & Olahan': 'dairy',
  'Pupuk & Bibit': 'seedling',
  'Alat Tani': 'farming-tool'
};

async function seed() {
  console.log('Finding a PRODUCER seller...');
  let seller = await prisma.profile.findFirst({
    where: { role: 'PRODUCER' }
  });

  if (!seller) {
    console.log('No producer found, creating one...');
    seller = await prisma.profile.create({
      data: {
        username: 'petani_demo_mock',
        password: 'password123',
        fullName: 'Bapak Petani Makmur',
        farmName: 'Makmur Jaya Farm',
        role: 'PRODUCER'
      }
    });
  }

  console.log(`Using seller: ${seller.fullName} (${seller.id})`);

  // Flatten all mock titles
  let mockTitles = [];
  for (const items of Object.values(mockData)) {
    for (const item of items) {
      mockTitles.push(item.title);
    }
  }

  console.log('Deleting previous mock products for ALL sellers to avoid duplicates...');
  await prisma.product.deleteMany({
    where: { title: { in: mockTitles } }
  });

  let productsToInsert = [];
  
  let globalIndex = 1;
  for (const [category, items] of Object.entries(mockData)) {
    for (const item of items) {
      // Using highly optimized LoremFlickr URL for maximum reliability and speed
      const imageUrl = `https://loremflickr.com/800/600/${item.kw}/all?lock=${globalIndex}`;
      
      productsToInsert.push({
        title: item.title,
        category: category,
        price: item.price,
        unit: item.unit,
        stock: Math.floor(Math.random() * 90) + 10,
        imageUrls: [imageUrl],
        sellerId: seller.id,
        description: `Produk ${item.title} berkualitas tinggi langsung dari peternakan/pertanian kami.`
      });
      globalIndex++;
    }
  }

  const result = await prisma.product.createMany({
    data: productsToInsert,
    skipDuplicates: true
  });

  console.log(`Successfully seeded ${result.count} products across 8 categories!`);
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
