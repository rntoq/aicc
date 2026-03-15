import fs from "fs";

const testData = JSON.parse(fs.readFileSync("public/test.json", "utf8"));
const specs = JSON.parse(fs.readFileSync("public/specialities.json", "utf8"));

// Build speciality code → id map
const codeToId = {};
specs.forEach(s => { codeToId[s.code] = s.id; });

// Mapping: speciality code → profession ids to attach it to
const MAPPING = {
  // ── Дубликаты международных программ ──────────────────────────────────────
  "09.03.01":           ["001","002","003","005","006","009","010","011","012"],
  "14.03.02":           ["073","080"],

  "B003 (KZ-040)":      ["052"],
  "В003 (KZ-US)":       ["052"],

  "B018 (KZ-FR-007)":   ["058"],
  "B018(KZ-CHN-185)":   ["058"],
  "B036(KZ-CHN-185)":   ["058"],

  "B020 (KZ-US)":       ["056"],
  "B020 (KZ-US-040)":   ["056"],

  "B044 (KZ-DE-003)":   ["021","022","023","024","025","026","027","031","032","033","038","057","059","061","062","063","064","085","088","103","109","110"],
  "B044 (KZ-FR-007)":   ["021","022","023","024","025","026","027","031","032","033","038","057","059","061","062","063","064","085","088","103","109","110"],
  "B044(KZ-IRL-021)":   ["021","022","023","024","025","026","027","031","032","033","038","057","059","061","062","063","064","085","088","103","109","110"],
  "RU 38.03.02":        ["021","022","023"],

  "B046 (KZ-FR-007)":   ["022","024","025","026","037","038","039","041","063"],
  "B046 (KZ-IRL-021":   ["022","024","025","026","037","038","039","041","063"],
  "В046 (KZ-040)":      ["022","024","025","026","037","038","039","041","063"],
  "RU":                 ["037","038","041","024"],

  "B047 (KZ-FR-007)":   ["020","027","028","029","030","031","032","033","034","070"],

  "B053 (RU-533)":      ["076","101"],
  "В053 (KZ-040)":      ["076","101"],

  "B057 (KZ-DE-003)":   ["001","002","003","004","005","006","007","009","010","011","012","013","015","018","028","083"],
  "B057 (KZ-UK-005)":   ["001","002","003","004","005","006","007","009","010","011","012","013","015","018","028","083"],
  "B057(KZ-HKG-029)":   ["001","002","003","004","005","006","007","009","010","011","012","013","015","018","028","083"],
  "В057 (KZ-US)":       ["001","002","003","004","005","006","007","009","010","011","012"],
  "В057 (KZ-US-040)":   ["001","002","003","004","005","006","007","009","010","011","012"],

  "B060 (RU-533)":      ["076","077","080"],
  "B061(KZ-HKG-029)":   ["079","080"],

  "B062 (KZ-DE-003":    ["073","078","096"],
  "B062 (KZ-UK-005)":   ["073","078","096"],

  "В054 (KZ-040)":      ["073","072"],
  "В050 (KZ-US)":       ["091","090","049"],
  "В050 (KZ-US-040)":   ["091","090","049"],

  "B071 (KZ-UK-005)":   ["082"],
  "B074(KZ-HKG-029)":   ["074","097"],
  "B077 (KZ-US-040)":   ["089","094"],
  "B082 (KZ-UZ-024)":   ["093"],
  "B093 (KZ-FR-007)":   ["110","111","112","115"],
  "B095 (KZ-DE-003)":   ["084","085","088"],
  "В001 (KZ-US)":       ["055","057","059","062","064"],
  "В001 (KZ-US-040)":   ["055","057","059","062","064"],
  "В059 (KZ-US-040)":   ["008","005","007"],

  "RU 01.03.01":        ["001","002","003","037"],
  "RU 01.03.02":        ["001","002","003","037"],
  "RU 01.03.04":        ["001","002","003","037"],
  "RU 05.03.06":        ["091"],
  "RU 24.05.03":        ["086","087"],
  "RU 45.03.01":        ["065","066","058","070"],

  // ── Уникальные специальности → существующие профессии ─────────────────────

  // Педагогика
  "B004":   ["052","053","055"],           // Нач. военная подготовка → учителя
  "B006":   ["052","053","055","105"],     // Преп. музыки → учителя + Music Producer
  "B007":   ["052","053","055","014","019"], // Преп. ИЗО → учителя + Graphic/Illustrator
  "B008":   ["053","055","116"],           // Преп. права/экономики → учителя + Lawyer
  "B019":   ["052","053","055","048"],     // Социальный педагог → учителя + Psychologist
  "B120":   ["052","053","055","057"],     // Профобразование → учителя + Corporate Trainer

  // Искусство
  "B022":   ["105","071"],                 // Музыковедение → Music Producer, Sound Engineer
  "B025":   ["105"],                       // Дирижирование → Music Producer
  "B026":   ["105"],                       // Композиция → Music Producer
  "B027":   ["104","067","103"],           // Театр → Art Director, Video Producer, Event Manager
  "B028":   ["103","107","108"],           // Хореография → Event Manager, Trainer, Fitness Instructor
  "B234":   ["055","104"],                 // Музееведение → Lecturer, Art Director

  // Гуманитарные науки
  "B032":   ["055","048"],                 // Философия → Lecturer + Psychologist
  "B033":   ["055"],                       // Религия → Lecturer
  "B034":   ["053","055"],                 // История → Secondary Teacher + Lecturer
  "B035":   ["053","055","058"],           // Тюркология → учителя + Translator
  "B037":   ["065","066","058","070"],     // Филология → Journalist, Editor, Translator, Copywriter
  "B038":   ["048","050","065"],           // Социология → Psychologist, Public Health, Journalist
  "B039":   ["065","103","034"],           // Культурология → Journalist, Event Manager, PR
  "B040":   ["065","034","116"],           // Политология → Journalist, PR, Lawyer
  "B043":   ["066","065"],                 // Библиотечное дело → Editor, Journalist
  "B134":   ["055"],                       // Археология → Lecturer
  "B135":   ["058","055"],                 // Востоковедение → Translator + Lecturer
  "B140":   ["034","116","065"],           // Международные отношения → PR, Lawyer, Journalist
  "B140 (KZ-FR-007)": ["034","116","065"],

  // Экономика / право / HR
  "B048":   ["059","063","057"],           // Трудовые навыки → HR, C&B, Trainer
  "B145":   ["036","035"],                 // Госаудит → Auditor, Accountant

  // Естественные науки
  "B050":   ["091","090","049"],           // Биологические науки → Ecologist, Animal Scientist, Vet
  "B052":   ["091","082","089"],           // Науки о Земле → Ecologist, Mining Engineer, Agronomist
  "B053":   ["076","101","046"],           // Химия → Chemical Engineer, Food Technologist, Pharmacist
  "B054":   ["073","072","080"],           // Физика → Electrical, Mechanical, Process Engineer
  "B055":   ["001","002","003","037"],     // Математика (уже в 001-003)
  "B056":   ["072","078"],                 // Механика → Mechanical, Automation Engineer
  "B157":   ["003","002","004"],           // Мат. и компьютерное моделирование → AI, Data, Cybersec
  "B158":   ["004"],                       // Криптология → Cybersecurity

  // Инженерия / строительство
  "B066":   ["084","088"],                 // Морской транспорт → Logistics, Transport Manager
  "B075":   ["074","092"],                 // Кадастр → Civil Engineer, Landscape Designer
  "B126":   ["074","084","088"],           // Транспортное строительство → Civil Eng, Logistics, Transport
  "B162":   ["073","080"],                 // Теплоэнергетика → Electrical Engineer, Process Engineer
  "B165":   ["008"],                       // Магистральные сети → Network Engineer
  "B166":   ["074","088"],                 // Транспортные сооружения → Civil Eng, Transport Mgr
  "B265":   ["084","088"],                 // Ж/д транспорт → Logistics, Transport Manager

  // Сельское хозяйство / природа
  "B173":   ["093","089"],                 // Ирригация → Water Resources, Agronomist
  "B175":   ["097","093"],                 // Водоснабжение → Plumber, Water Resources
  "B176":   ["093"],                       // Гидротехника → Water Resources

  // Медицина / соцработа
  "B090":   ["048","047","050"],           // Социальная работа → Psychologist, Nurse, Public Health
  "B094":   ["050","047"],                 // Санитария → Public Health, Nurse
  "BM089":  ["050"],                       // Профилактическая медицина → Public Health

  // Дизайн / мода
  "B070":   ["014","015","020"],           // Текстиль/мода → Graphic Designer, Product Designer, Brand

  // Нефтегаз (Губкин)
  "ГУБКИН":  ["077"],                      // Нефтегаз → Petroleum Engineer
};

// Build profession id → entry map
const profMap = {};
testData.forEach(p => { profMap[p.id] = p; });

let addedCount = 0;
let skippedCount = 0;

for (const [specCode, profIds] of Object.entries(MAPPING)) {
  const specId = codeToId[specCode];
  if (!specId) {
    console.log(`⚠️  Speciality code not found in specialities.json: "${specCode}"`);
    continue;
  }
  for (const profId of profIds) {
    const prof = profMap[profId];
    if (!prof) {
      console.log(`⚠️  Profession not found: ${profId}`);
      continue;
    }
    const alreadyExists = prof.specialities.some(s => s.code === specCode);
    if (!alreadyExists) {
      prof.specialities.push({ code: specCode, id: specId });
      addedCount++;
    } else {
      skippedCount++;
    }
  }
}

fs.writeFileSync("public/test.json", JSON.stringify(testData, null, 2));
console.log(`\n✅ Done. Added: ${addedCount}, Skipped (already existed): ${skippedCount}`);

// Check coverage now
const usedCodes = new Set();
testData.forEach(p => p.specialities.forEach(s => usedCodes.add(s.code)));
const stillUnused = specs.filter(s => !usedCodes.has(s.code));
const meaningful = stillUnused.filter(s => s.name?.en && !["COV","CU"].includes(s.code) && !s.name?.en?.includes("undefined"));
console.log(`\nStill unused (with names): ${meaningful.length}`);
meaningful.forEach(s => console.log(`  ${s.id} | ${s.code} | ${s.name?.en}`));
