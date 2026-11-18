import { Player, Region, PlayerRole, ExperienceLevel } from "./types";

export function getExperience(rating: number): ExperienceLevel {
  if (rating < 1150) return "Beginner";
  if (rating < 1650) return "Intermediate";
  if (rating < 2100) return "Advanced";
  return "Pro";
}

const INDIAN_COLLEGE_PLAYERS = [
  { name: "Viper_Ace", rating: 1820, ping: 16, role: "Rusher", wait: 42, winRate: 64 },
  { name: "Shadow_Apex", rating: 1790, ping: 18, role: "Sniper", wait: 38, winRate: 61 },
  { name: "Aarav_Sharma", rating: 1540, ping: 22, role: "Support", wait: 15, winRate: 54 },
  { name: "Rohan_Verma", rating: 1510, ping: 24, role: "Tank", wait: 55, winRate: 52 },
  { name: "Ishaan_Gupta", rating: 1640, ping: 19, role: "Rusher", wait: 28, winRate: 58 },
  { name: "Kabir_Mehta", rating: 1480, ping: 25, role: "Flex", wait: 64, winRate: 49 },
  { name: "Ananya_Rao", rating: 1720, ping: 20, role: "Support", wait: 12, winRate: 60 },
  { name: "Diya_Patel", rating: 1590, ping: 28, role: "Sniper", wait: 34, winRate: 56 },
  { name: "Aditya_Singh", rating: 1950, ping: 15, role: "Rusher", wait: 48, winRate: 68 },
  { name: "Vihaan_Joshi", rating: 1390, ping: 32, role: "Tank", wait: 72, winRate: 46 },
  { name: "Shreya_Nair", rating: 1610, ping: 21, role: "Flex", wait: 22, winRate: 57 },
  { name: "Tanmay_Bose", rating: 1450, ping: 26, role: "Support", wait: 45, winRate: 50 },
  { name: "Arjun_Reddy", rating: 2080, ping: 18, role: "Sniper", wait: 50, winRate: 71 },
  { name: "Dev_Malhotra", rating: 1530, ping: 23, role: "Rusher", wait: 18, winRate: 53 },
  { name: "Kavya_Iyer", rating: 1670, ping: 25, role: "Support", wait: 31, winRate: 59 },
  { name: "Manish_Tiwari", rating: 1420, ping: 30, role: "Tank", wait: 80, winRate: 47 },
  { name: "Neha_Kapoor", rating: 1580, ping: 22, role: "Flex", wait: 19, winRate: 55 },
  { name: "Ritvik_Chopra", rating: 1860, ping: 17, role: "Rusher", wait: 41, winRate: 65 },
  { name: "Siddharth_Roy", rating: 1490, ping: 27, role: "Sniper", wait: 26, winRate: 51 },
  { name: "Tara_Deshmukh", rating: 1740, ping: 20, role: "Support", wait: 35, winRate: 62 },
  { name: "Varun_Saxena", rating: 1350, ping: 34, role: "Tank", wait: 92, winRate: 44 },
  { name: "Yash_Kulkarni", rating: 1620, ping: 24, role: "Flex", wait: 29, winRate: 56 },
  { name: "Zoya_Khan", rating: 1910, ping: 16, role: "Rusher", wait: 44, winRate: 67 },
  { name: "Aakash_Yadav", rating: 1440, ping: 29, role: "Sniper", wait: 58, winRate: 48 },
  { name: "Bhavya_Jain", rating: 1560, ping: 23, role: "Support", wait: 14, winRate: 54 },
  { name: "Chirag_Sen", rating: 1690, ping: 21, role: "Tank", wait: 33, winRate: 59 },
  { name: "Deepak_Pandey", rating: 1410, ping: 31, role: "Flex", wait: 75, winRate: 46 },
  { name: "Gaurav_Mishra", rating: 1840, ping: 18, role: "Rusher", wait: 39, winRate: 63 },
  { name: "Harshita_Goyal", rating: 1520, ping: 25, role: "Sniper", wait: 21, winRate: 52 },
  { name: "Kunal_Bahl", rating: 1760, ping: 19, role: "Support", wait: 36, winRate: 61 },
  { name: "Lalit_Kumar", rating: 1380, ping: 33, role: "Tank", wait: 88, winRate: 45 },
  { name: "Mayank_Aggarwal", rating: 1630, ping: 22, role: "Flex", wait: 27, winRate: 57 },
];

export function getDUCollegiateDataset(): Player[] {
  return INDIAN_COLLEGE_PLAYERS.map((p, idx) => ({
    id: `P${101 + idx}`,
    numId: 101 + idx,
    name: p.name,
    rating: p.rating,
    ping: p.ping,
    region: "India" as Region,
    role: p.role as PlayerRole,
    gameMode: "4v4",
    wait: p.wait,
    winRate: p.winRate,
    experienceLevel: getExperience(p.rating),
  }));
}

export function getGlobalLadderDataset(): Player[] {
  const regions: Region[] = ["India", "Asia", "EU", "NA"];
  const roles: PlayerRole[] = ["Rusher", "Sniper", "Support", "Tank", "Flex"];

  return Array.from({ length: 48 }, (_, i) => {
    const numId = 200 + i;
    const region = regions[i % 4];
    let ping = 20;
    if (region === "India") ping = 16 + (i % 15);
    else if (region === "Asia") ping = 35 + (i % 25);
    else if (region === "EU") ping = 60 + (i % 30);
    else ping = 85 + (i % 40);

    const rating = 1100 + ((i * 37) % 1300);

    return {
      id: `P${numId}`,
      numId,
      name: `Global_${region}_${numId}`,
      rating,
      ping,
      region,
      role: roles[i % 5],
      gameMode: "4v4",
      wait: 10 + ((i * 13) % 95),
      winRate: 44 + ((i * 7) % 28),
      experienceLevel: getExperience(rating),
    };
  });
}

export function getStarvationStressDataset(): Player[] {
  const base = getDUCollegiateDataset();
  return base.map((p, idx) => ({
    ...p,
    // First 8 players have extreme wait times (starving!)
    wait: idx < 6 ? 95 + idx * 15 : 8 + (idx * 3),
  }));
}

export function generateFreshQueue(count = 32, mode: import("./types").GameMode = "4v4"): Player[] {
  const firstNames = [
    "Aarav", "Kabir", "Vihaan", "Aditya", "Rohan", "Ishaan", "Arjun", "Dev",
    "Ritvik", "Tanmay", "Siddharth", "Zoya", "Ananya", "Diya", "Shreya", "Kavya",
    "Tara", "Neha", "Bhavya", "Harshita", "Aakash", "Deepak", "Gaurav", "Chirag",
    "Kunal", "Lalit", "Mayank", "Nikhil", "Pranav", "Rahul", "Varun", "Yash"
  ];
  const lastNames = [
    "Sharma", "Verma", "Gupta", "Mehta", "Rao", "Patel", "Singh", "Joshi",
    "Nair", "Bose", "Reddy", "Malhotra", "Iyer", "Tiwari", "Kapoor", "Chopra",
    "Roy", "Deshmukh", "Saxena", "Kulkarni", "Khan", "Yadav", "Jain", "Sen",
    "Pandey", "Mishra", "Goyal", "Bahl", "Kumar", "Aggarwal", "Bhatia", "Chauhan"
  ];
  const regions: Region[] = ["India", "Asia", "EU", "NA"];
  const roles: PlayerRole[] = ["Rusher", "Sniper", "Support", "Tank", "Flex"];

  return Array.from({ length: count }, (_, i) => {
    const numId = 300 + Math.floor(Math.random() * 800);
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const region = regions[Math.random() < 0.65 ? 0 : Math.floor(Math.random() * regions.length)];
    const rating = Math.floor(1300 + Math.random() * 750);
    const ping = region === "India" ? Math.floor(15 + Math.random() * 18) : Math.floor(35 + Math.random() * 50);
    const wait = Math.floor(8 + Math.random() * 65);
    const winRate = Math.floor(45 + Math.random() * 25);

    return {
      id: `P${numId}`,
      numId,
      name: `${fn}_${ln}`,
      rating,
      ping,
      region,
      role,
      gameMode: mode,
      wait,
      winRate,
      experienceLevel: getExperience(rating),
    };
  });
}

export const getStandardRankedDataset = getDUCollegiateDataset;

