import { getUsers } from './dbOperations';

export interface KenyanCounty {
  code: string;
  name: string;
}

export const kenyanCounties: KenyanCounty[] = [
  { code: 'BAR', name: 'Baringo' },
  { code: 'BOM', name: 'Bomet' },
  { code: 'BGM', name: 'Bungoma' },
  { code: 'BUS', name: 'Busia' },
  { code: 'EMK', name: 'Elgeyo/Marakwet' },
  { code: 'EMB', name: 'Embu' },
  { code: 'GRS', name: 'Garissa' },
  { code: 'HBY', name: 'Homa Bay' },
  { code: 'ISL', name: 'Isiolo' },
  { code: 'KAJ', name: 'Kajiado' },
  { code: 'KKG', name: 'Kakamega' },
  { code: 'KRC', name: 'Kericho' },
  { code: 'KBU', name: 'Kiambu' },
  { code: 'KLF', name: 'Kilifi' },
  { code: 'KIR', name: 'Kirinyaga' },
  { code: 'KSI', name: 'Kisii' },
  { code: 'KSM', name: 'Kisumu' },
  { code: 'KTU', name: 'Kitui' },
  { code: 'KWL', name: 'Kwale' },
  { code: 'LKP', name: 'Laikipia' },
  { code: 'LAM', name: 'Lamu' },
  { code: 'MCH', name: 'Machakos' },
  { code: 'MKN', name: 'Makueni' },
  { code: 'MDR', name: 'Mandera' },
  { code: 'MRS', name: 'Marsabit' },
  { code: 'MER', name: 'Meru' },
  { code: 'MGR', name: 'Migori' },
  { code: 'MBA', name: 'Mombasa' },
  { code: 'MUR', name: "Murang'a" },
  { code: 'NRB', name: 'Nairobi City' },
  { code: 'NKR', name: 'Nakuru' },
  { code: 'NAN', name: 'Nandi' },
  { code: 'NAR', name: 'Narok' },
  { code: 'NYM', name: 'Nyamira' },
  { code: 'NYN', name: 'Nyandarua' },
  { code: 'NYR', name: 'Nyeri' },
  { code: 'SMB', name: 'Samburu' },
  { code: 'SIA', name: 'Siaya' },
  { code: 'TTV', name: 'Taita/Taveta' },
  { code: 'TNR', name: 'Tana River' },
  { code: 'TNT', name: 'Tharaka-Nithi' },
  { code: 'TNZ', name: 'Trans Nzoia' },
  { code: 'TRK', name: 'Turkana' },
  { code: 'UAS', name: 'Uasin Gishu' },
  { code: 'VHG', name: 'Vihiga' },
  { code: 'WJR', name: 'Wajir' },
  { code: 'WPK', name: 'West Pokot' },
];

export function getKenyanMarketStats(): { code: string; name: string; clients: number }[] {
  const users = getUsers();
  const counts = new Map<string, number>();

  for (const user of users) {
    if (user.country !== 'Kenya' || !user.region) continue;
    const match = kenyanCounties.find((c) => c.name === user.region || c.code === user.region);
    if (!match) continue;
    counts.set(match.code, (counts.get(match.code) || 0) + 1);
  }

  return kenyanCounties.map((county) => ({
    code: county.code,
    name: county.name,
    clients: counts.get(county.code) || 0,
  }));
}
