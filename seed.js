import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Manual env parser since we want to run it easily via node seed.js
const envPath = new URL('./.env.local', import.meta.url).pathname;
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyData = [
  {
    perkara: "Sewa Dewan",
    vendor: "Dewan Majlis Bandaraya",
    jumlah_penuh: 3500,
    deposit_dibayar: 1000,
    tarikh_bayar: "2026-01-15",
    status: "Deposit",
    nota: "Dewan kapasiti 1000 pax"
  },
  {
    perkara: "Baju Nikah & Sanding",
    vendor: "Butik Pengantin Indah",
    jumlah_penuh: 2800,
    deposit_dibayar: 2800,
    tarikh_bayar: "2026-02-20",
    status: "Selesai",
    nota: "Termasuk aksesori"
  },
  {
    perkara: "Rumah Sewa / Homestay",
    vendor: "Villa Keluarga",
    jumlah_penuh: 1200,
    deposit_dibayar: 600,
    tarikh_bayar: "2026-03-10",
    status: "Deposit",
    nota: "Untuk keluarga belah pengantin, 3 hari 2 malam"
  },
  {
    perkara: "Kasut Pengantin",
    vendor: "Aldo / Vincci",
    jumlah_penuh: 350,
    deposit_dibayar: 350,
    tarikh_bayar: "2026-04-05",
    status: "Selesai",
    nota: "Sepasang kasut nikah & sanding"
  },
  {
    perkara: "Doorgift",
    vendor: "Kilang Doorgift Murah",
    jumlah_penuh: 1500,
    deposit_dibayar: 0,
    tarikh_bayar: null,
    status: "Belum",
    nota: "Kotak kaca + madu 1000 pcs"
  },
  {
    perkara: "Katering",
    vendor: "Katering Selera Kampung",
    jumlah_penuh: 15000,
    deposit_dibayar: 3000,
    tarikh_bayar: "2026-02-01",
    status: "Deposit",
    nota: "Pakej makanan beradab + tetamu"
  },
  {
    perkara: "Mekap & Andaman",
    vendor: "MUA Bella",
    jumlah_penuh: 1200,
    deposit_dibayar: 500,
    tarikh_bayar: "2025-12-10",
    status: "Deposit",
    nota: "Mekap nikah & sanding"
  },
  {
    perkara: "Jurugambar (Photographer)",
    vendor: "Lensa Studio",
    jumlah_penuh: 2500,
    deposit_dibayar: 0,
    tarikh_bayar: null,
    status: "Belum",
    nota: "Pakej outdoor + majlis"
  },
  {
    perkara: "Kad Kahwin & Bunting",
    vendor: "Print Expert",
    jumlah_penuh: 400,
    deposit_dibayar: 400,
    tarikh_bayar: "2026-05-15",
    status: "Selesai",
    nota: "Kad digital + 200 kad fizikal + 2 bunting"
  },
  {
    perkara: "Hantaran",
    vendor: "DIY",
    jumlah_penuh: 1000,
    deposit_dibayar: 0,
    tarikh_bayar: null,
    status: "Belum",
    nota: "7 dulang berbalas 9"
  }
];

async function seedData() {
  console.log("Seeding data into 'payments' table...");
  const { data, error } = await supabase
    .from('payments')
    .insert(dummyData);

  if (error) {
    console.error("Error inserting data:", error.message);
  } else {
    console.log("Successfully seeded 10 items!");
  }
}

seedData();
