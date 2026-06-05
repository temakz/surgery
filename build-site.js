const fs = require("fs");
const path = require("path");

const root = __dirname;
const originalRoot = path.join(root, "original");
const sourceLogo = path.resolve(root, "..", "logo.png");
const scrapeRoot = path.resolve(root, "..", "parse", "scrape-output");
const pagesRoot = path.join(scrapeRoot, "pages");
const rawRoot = path.join(pagesRoot, "raw-html");
const imageRoot = path.join(scrapeRoot, "assets", "images");
const outRoots = [root, path.join(root, "site-dist")];

const services = [
  ["exo", "Экзопротезирование лица — протезирование ушей, носа, пальцев"],
  ["nose_surgery", "Операция на нос"],
  ["free", "Бесплатное лечение по квоте ВМП"],
  ["tmj_treatment", "Артрогнатология (лечение ВНЧС)"],
  ["implantology", "Имплантология"],
  ["nasal_surgery", "Хирургия восстановления носового дыхания"],
  ["microsurgical", "Микрохирургическая реконструкция отсутствующих частей лица"],
  ["scars", "Лечение пациентов с рубцами"],
  ["cleft", "Лечение пациентов с расщелинами губы, неба, лица"],
  ["tmj_dysfunction", "Лечение пациентов с дисфункцией ВНЧС"],
  ["tmj", "Лечение ВНЧС"],
  ["orthognathic_surgery", "Ортогнатическая хирургия — исправление прикуса"],
  ["ilizarov_method", "Челюстные дистракторы по методу Илизарова"],
  ["plastic_surgeries", "Пластические операции: живот, грудь, ягодицы, руки, ноги"],
  ["alveolar", "Восстановительные операции альвеолярного отростка"],
  ["face_surgery", "Эстетическая — пластическая хирургия лица"],
  ["restoration", "Восстановление мягких тканей лица и костей лицевого скелета"],
  ["surgical_dentistry", "Хирургическая стоматология"],
  ["bite_restoration", "Восстановление прикуса и устранение деформаций"],
  ["mouthguards", "Спортивные защитные индивидуальные капы"],
  ["endolifting", "НОВИНКА! Эндолифтинг лица, удаление комков Биша"],
];

const serviceSlugs = new Set(services.map(([slug]) => slug));
const sensitiveGalleryImagePatterns = [
  /04-0[2-6]/,
  /06-0[3-9]/,
  /06-1[12678]/,
];
const microsurgicalHeroSubtitle = "и лицевого скелета с трансплантацией мягких, костных и комбинированных тканей";

const secondary = [
  ["trofimov", "Трофимов Евгений Иванович"],
  ["kravchenko", "Кравченко Дмитрий Валерьевич"],
  ["analyzes", "Необходимые анализы для операции"],
  ["oral_hygiene", "Гигиена полости рта"],
  ["newtech_imp", "Новые технологии в имплантологии"],
  ["newtech_ekzo", "Новые технологии в экзопротезировании"],
  ["newtech_tmj", "Новые технологии в лечении ВНЧС"],
  ["onlinehelp", "Онлайн консультация"],
  ["reviews", "Отзывы"],
  ["contacts", "Контакты"],
];

const linkMap = new Map([
  ...services.map(([slug, label]) => [label, pageHref(slug)]),
  ...secondary.map(([slug, label]) => [label, pageHref(slug)]),
  ["Хирургия восстановления носового дыхания", "nasal_surgery.html"],
  ["Микрохирургическая реконструкция отсутствующих частей лица", "microsurgical.html"],
  ["Лечение пациентов с рубцами", "scars.html"],
  ["Лечение пациентов с расщелинами губы, нёба, лица", "cleft.html"],
  ["Лечение пациентов с дисфункцией ВНЧС", "tmj_dysfunction.html"],
  ["Лечение ВНЧС", "tmj.html"],
  ["Ортогнатическая хирургия — исправление прикуса", "orthognathic_surgery.html"],
  ["Челюстные дистракторы по методу Илизарова", "ilizarov_method.html"],
  ["Пластические операции: живот, грудь, ягодицы, руки, ноги", "plastic_surgeries.html"],
  ["Пластические операции: живот, грудь, ягодицы, икры, руки, ноги", "plastic_surgeries.html"],
  ["Восстановительные операции альвеолярного отростка", "alveolar.html"],
  ["Эстетическая — пластическая хирургия лица", "face_surgery.html"],
  ["Восстановление мягких тканей лица и костей лицевого скелета", "restoration.html"],
  ["Хирургическая стоматология", "surgical_dentistry.html"],
  ["Восстановление прикуса и устранение деформаций", "bite_restoration.html"],
  ["Восстановление прикуса и устранение челюстно-лицевых деформаций", "bite_restoration.html"],
  ["Эндолифтинг лица", "endolifting.html"],
  ["Онлайн", "onlinehelp.html"],
  ["Трофимов Е. И.", "trofimov.html"],
  ["Трофимов Евгений Иванович", "trofimov.html"],
  ["Кравченко Д. В.", "kravchenko.html"],
  ["Кравченко Дмитрий Валерьевич", "kravchenko.html"],
]);

function pageHref(slug) {
  return slug === "home" ? "index.html" : `${slug}.html`;
}

function readJson(slug) {
  return JSON.parse(fs.readFileSync(path.join(pagesRoot, `${slug}.json`), "utf8"));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function capitalizeFirst(value = "") {
  const text = String(value).trim();
  if (!text) return "";
  return text.charAt(0).toLocaleUpperCase("ru-RU") + text.slice(1);
}

function cleanHeroLead(value = "") {
  return String(value)
    .replace(/\s*Московская область,\s*Одинцово\.?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const tmjTreatmentCards = [
  {
    title: "Сплинт терапия",
    text: "Лечение окклюзионными шинами, окклюзионными аппаратами (производство Германия, Австрия, Швейцария), либо совместное с Россией.",
  },
  {
    title: "Векторная Botox терапия",
    text: "Микро-инъекции в жевательную мускулатуру для проведения мышечного релаксационного ремоделирования.",
  },
  {
    title: "Микротоковая магнитная терапия",
    text: "Магнитная релаксационная корригирующая терапия.",
  },
  {
    title: "Декомпрессионный артроцентез-артролаваж",
    text: "Введение специфических противовоспалительных средств прямо внутрь сустава.",
  },
  {
    title: "Устранение внутрисуставных спаек",
    text: "Репозиция, вправление диска и его фиксация имплантатами и имплантацией задней связки.",
  },
];

const microsurgicalTreatmentCards = [
  {
    title: "Восстановление тканей лица",
    text: "",
  },
  {
    title: "Пересадка тканевых комплексов",
    text: "",
  },
  {
    title: "3D-анализ и CAD/CAM",
    text: "",
  },
  {
    title: "Выращивание тканей",
    text: "",
  },
];

const tmjArthroplastyIntro =
  "Артроскопическая артропластика. В продолжение методики Артоскопии (суть которой заключалась в проведении диагностики состояния сустава и дальнейшего его промывания, удалении участков деструкции хрящевой ткани и расширении суставной полости) были разработаны и внедрены в практику мировой артрогнатологии следующие методы возможной коррекции, которые выполняются в нашем центре:";

const tmjArthroplastyItems = [
  "репонирование диска",
  "фиксация диска резорбируемыми (рассасывающимися) материалами",
  "пластика мягких тканей сустава",
  "имплантация мягкотканых элементов для протезирования внутрисуставного диска и внутрисуставных связок",
];

const tmjTreatmentVideos = [
  {
    id: "_I0rorCC29s",
    title: "Артроскопия внчс патология виден сппечный процесс в верхнем этаже ВНЧС",
  },
  {
    id: "4R6QFMyCJe8",
    title: "Артроскопия внчс - норма",
  },
  {
    id: "3Mn4pa5f0Cs",
    title: "Принцип работы жевательного аппарата и этапы развития патологии жевательного аппарата ВНЧС",
  },
  {
    id: "JAs0wK6AK4g",
    title: "Принцип лечения пациентов с функциональными нарушениями жевательного аппарата, ВНЧС. Сплинт терапия.",
  },
];

function stripTmjTreatmentExtra(paragraphs) {
  return paragraphs.filter(
    (text) =>
      !/^Виды лечения/.test(text) &&
      !/^Артроскопическая артропластика/.test(text) &&
      !/^В продолжение методики Артоскопии/.test(text)
  );
}

function decodeEntities(value = "") {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&laquo;", "«")
    .replaceAll("&raquo;", "»")
    .replaceAll("&mdash;", "—")
    .replaceAll("&ndash;", "–");
}

function cleanText(value = "") {
  return decodeEntities(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractAtoms(slug) {
  const rawFile = path.join(rawRoot, `${slug}.html`);
  if (!fs.existsSync(rawFile)) return [];

  const html = fs.readFileSync(rawFile, "utf8");
  const re = /<(h1|h2|h3|div|a)\b[^>]*class=['"]tn-atom['"][^>]*>([\s\S]*?)<\/\1>/gi;
  const atoms = [];
  let match;

  while ((match = re.exec(html))) {
    const elemStart = html.lastIndexOf("<div class='t396__elem", match.index);
    const scope = elemStart >= 0 ? html.slice(elemStart, match.index) : "";
    if (scope && !/data-elem-type=['"]text['"]/.test(scope)) continue;
    const top = Number(scope.match(/data-field-top-value=["']?(-?\d+)/)?.[1] || 0);
    const text = cleanText(match[2]);
    if (text && text.length > 2) atoms.push({ tag: match[1].toLowerCase(), top, text });
  }

  const seen = new Set();
  return atoms
    .sort((a, b) => a.top - b.top)
    .filter((atom) => {
      const key = atom.text.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function firstHeading(page, atoms) {
  return (
    [...(page.headings?.h1 || []), ...atoms.filter((a) => a.tag === "h1").map((a) => a.text)]
      .find((text) => text && !/записаться/i.test(text) && text.length > 4) ||
    (page.seo?.title || "Center of Surgery").replace(/\s*\|\s*Москва,\s*Одинцово\s*\|\s*Center of Surgery/i, "")
  );
}

function usefulImages(page, limit = Number.POSITIVE_INFINITY) {
  const skip = /(logo|map|phone|wa-|insta|favicon|watch|mail-1|popup_fon)/i;
  const seen = new Set();
  const images = [...(page.covers || []), ...(page.images || []), ...(page.additional_images || [])]
    .filter((img) => img.local_file && !skip.test(img.local_file))
    .filter((img) => {
      const file = img.local_file.replace(/\\/g, "/");
      if (seen.has(file)) return false;
      seen.add(file);
      return fs.existsSync(path.join(scrapeRoot, file));
    })
    .map((img) => ({
      src: img.local_file.replace(/\\/g, "/"),
      originalSrc: img.src || "",
      alt: img.alt || page.seo?.title || "Center of Surgery",
    }));
  return Number.isFinite(limit) ? images.slice(0, limit) : images;
}

function localImageFromOriginalUrl(url = "", page) {
  const fileName = url.split("/").pop();
  const tildaId = url.match(/\/(tild[\w-]+)\//)?.[1];
  const candidates = [...(page.covers || []), ...(page.images || []), ...(page.additional_images || [])]
    .filter((img) => img.local_file)
    .map((img) => ({
      src: img.local_file.replace(/\\/g, "/"),
      originalSrc: img.src || "",
      alt: img.alt || page.seo?.title || "Center of Surgery",
    }));
  const fromPage =
    candidates.find((img) => tildaId && (img.src.includes(tildaId) || img.originalSrc.includes(tildaId))) ||
    candidates.find((img) => fileName && (img.src.endsWith(`_${fileName}`) || img.src.endsWith(fileName) || img.originalSrc.endsWith(fileName)));
  if (fromPage && fs.existsSync(path.join(scrapeRoot, fromPage.src))) return fromPage;

  if (tildaId || fileName) {
    const files = fs.readdirSync(imageRoot);
    const match =
      (tildaId && files.find((name) => name.includes(tildaId))) ||
      (fileName && files.find((name) => name.endsWith(`_${fileName}`)));
    if (match) {
      return {
        src: `assets/images/${match}`,
        originalSrc: url,
        alt: page.seo?.title || "Center of Surgery",
      };
    }
  }
  return null;
}

function heroImage(page, images) {
  const ogImage = page.seo?.og?.["og:image"];
  const fromOg = localImageFromOriginalUrl(ogImage, page);
  if (fromOg) return fromOg;
  return images[0] || null;
}

function normalizeContentKey(value = "") {
  return cleanText(value)
    .toLowerCase()
    .replace(/^[\s•\-–—\d.]+/g, "")
    .replace(/[.,;:!?()[\]«»"“”'’`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function meaningfulText(value = "") {
  const text = cleanText(value);
  if (!text || text.length < 18) return "";
  if (/Ваше имя|Ваш телефон|Заказ обратного звонка|Заявка отправлена|Отправляя форму|Политик[ае] обработки/i.test(text)) return "";
  if (/^\+?\d[\d\s()\-]+$/.test(text)) return "";
  return text;
}

function uniqueTexts(items, used = new Set()) {
  const out = [];
  for (const item of items) {
    const text = meaningfulText(item);
    if (!text) continue;
    const key = normalizeContentKey(text);
    if (!key || used.has(key)) continue;
    used.add(key);
    out.push(text);
  }
  return out;
}

function compactLead(value = "") {
  return cleanText(value)
    .replace(/✔/g, "")
    .replace(/☎\s*\+?[0-9\s()\-]+\.?/g, "")
    .replace(/\+7\s*\(?909\)?\s*957[-\s]?4107\.?/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function sameContent(a = "", b = "") {
  const ak = normalizeContentKey(a);
  const bk = normalizeContentKey(b);
  if (!ak || !bk) return false;
  return ak === bk || (ak.length > 40 && bk.includes(ak)) || (bk.length > 40 && ak.includes(bk));
}

function isBulletRun(value = "") {
  const text = cleanText(value);
  return (text.match(/(^|\s)[•\-–—]\s+/g) || []).length > 1;
}

function collectTextSections(atoms) {
  const longBlocks = atoms
    .filter((atom) => atom.text.length > 120 && !/Ваше имя|Ваш телефон|Заказ обратного звонка/i.test(atom.text))
    .map((atom) => atom.text)
    .filter((text, i, arr) => arr.findIndex((item) => normalizeContentKey(item) === normalizeContentKey(text)) === i);
  return longBlocks
    .map((text) => splitLongText(text))
    .filter((section) => section.paragraphs.length || section.bullets.length);
}

function renderParagraphs(paragraphs) {
  return paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
}

function strongPrefix(text, prefix) {
  const escapedText = escapeHtml(text);
  const escapedPrefix = escapeHtml(prefix);
  return escapedText.startsWith(escapedPrefix)
    ? `<strong class="font-semibold text-ink">${escapedPrefix}</strong>${escapedText.slice(escapedPrefix.length)}`
    : escapedText;
}

function renderTmjDetailCopy() {
  const paragraphs = [
    "Динамическая МРТ аксиография – запись движение ВНЧС при открывании, закрывании и жевании, а так же внутрисуставных структур и жевательных мышц. Возможность так же определять состояние ВНЧС и жевательной мускулатуры при нагрузке. Данная методика даёт исчерпывающий ответ на вопрос состояния, морфологии структур ВНЧС, жевательной мускулатуры, а так же состояния и положения прикуса.",
    "Гнатоанализ в системе полностью юстируемых артикуляторов, MPI анализ, механическая и ультрозвуковая аксиография, миография жевательной мускулатуры, УЗИ ВНЧС и жевательной мускулатуры.",
    "Hi-tech – персонализированный 3D-артикулятор изготовленный на основе STL-модели черепа пациента полученной методом спиральной компьютерной томографии и с возможностью анализа движения нижней челюсти в системе и программе полного виртуального анализа.",
  ];

  return paragraphs
    .map((paragraph) => `<p>${strongPrefix(paragraph, "Hi-tech – персонализированный 3D-артикулятор")}</p>`)
    .join("\n");
}

function tmjSubheading(text) {
  return `<h3 class="font-display text-[22px] sm:text-[24px] leading-snug font-bold text-ink mt-8 first:mt-0">${escapeHtml(text)}</h3>`;
}

function tmjTextParagraph(text, strong = []) {
  let html = escapeHtml(text);
  for (const phrase of strong) {
    const escapedPhrase = escapeHtml(phrase);
    html = html.replace(escapedPhrase, `<strong class="font-semibold text-ink">${escapedPhrase}</strong>`);
  }
  return `<p>${html}</p>`;
}

function medicalTextParagraph(text, strong = [], className = "") {
  let html = escapeHtml(text);
  for (const phrase of strong) {
    const escapedPhrase = escapeHtml(phrase);
    html = html.replace(escapedPhrase, `<strong class="font-semibold text-ink">${escapedPhrase}</strong>`);
  }
  return `<p${className ? ` class="${className}"` : ""}>${html}</p>`;
}

function renderMicrosurgicalDetailCopy() {
  const items = [
    [
      "Восстановление тканей лица",
      "после тяжелой травмы, онкологических операций огнестрельного ранения.",
    ],
    [
      "Пересадка тканевых комплексов",
      "самого пациента с возможностью замещения большого объёма отсутствующих тканей, как костных так и мягких.",
    ],
    [
      "Использование 3D-анализа",
      "планирования и моделирования CAD/CAM технологии, робототехники, получение твердотельных моделей лица и лицевого скелета – дает возможность увидеть результат лечения и операций еще до их проведения.",
    ],
    [
      "Возможность выращивания",
      "– гисто и органогенеза в заранее изготовленных биоматречных формах моделей будущие части лица и лицевого скелета, с дальнейшей их пересадкой в область отсутствующей части лица – идеальная форма, размер, объём, кровоснабжение пересаженного комплекса, а самое главное их совместимость с организмом пациента.",
    ],
  ];

  return `<ul class="space-y-5 text-[16px] leading-relaxed text-ink/70 text-pretty">
        ${items
          .map(
            ([title, text]) => `<li class="relative pl-5 before:absolute before:left-0 before:top-[0.72em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo2">
          <strong class="font-semibold text-ink">${escapeHtml(title)}</strong> ${escapeHtml(text)}
        </li>`
          )
          .join("\n")}
      </ul>`;
}

function implantologySubheading(text) {
  return `<h3 class="font-display text-[22px] sm:text-[24px] leading-snug font-bold text-ink mt-7 first:mt-0 text-balance">${escapeHtml(text)}</h3>`;
}

function renderImplantologyDetailCopy() {
  return [
    medicalTextParagraph("Мы используем более 15 видов систем имплантатов", ["15 видов систем имплантатов"]),
    medicalTextParagraph(
      "В сложных случаях мы можем изготовить Вам индивидуальный имплантат (из оксида циркония, сплава титана), учитывая Вашу анатомию, индивидуальные качественные и количественные показатели костной ткани. Это поможет Вам избежать многих осложнений, минимизировать риски операции, найти наиболее оптимальный вариант в решении Вашего вопроса, минимизировать травматичность.",
      ["индивидуальный имплантат"]
    ),
    medicalTextParagraph(
      "Возможность проведения имплантации без разрезов. При этом все манипуляции проводятся через десневые проколы и не требуют наложения швов.",
      ["без разрезов"]
    ),
    medicalTextParagraph("Часто установка имплантатов возможна только после реконструкции альвеолярного отростка."),
    medicalTextParagraph(
      "Мы используем новые методики, запатентованные нами – технология вакуумного синус-лифтинга, микротрепанационного синус-лифтинга, также каркаснотуннельной пластики альвеолярного отростка.",
      ["запатентованные", "вакуумного синус-лифтинга, микротрепанационного синус-лифтинга, также каркаснотуннельной пластики альвеолярного отростка"]
    ),
  ].join("\n");
}

function renderImplantologyStepCopy() {
  const items = [
    [
      "3D CAD/CAM биопроектирование",
      [
        medicalTextParagraph(
          "К Вашим услугам работает лаборатория по 3D CAD/CAM биопроектированию и моделированию.",
          ["лаборатория по 3D CAD/CAM биопроектированию и моделированию"]
        ),
        medicalTextParagraph("Это позволяет решать комплекс сложных проблем, связанных с моделированием и проектированием хирургических вмешательств в челюстно-лицевой хирургии и имплантологии."),
        medicalTextParagraph("Мы изготавливаем навигационные хирургические шаблоны, биомеханические эндопротезы и т.д.", ["навигационные хирургические шаблоны, биомеханические эндопротезы"]),
      ],
    ],
    [
      "Субпериостальные имплантаты и экзоскелеты",
      [
        medicalTextParagraph("При большой степени атрофии альвеолярных отростков нашим пациентам мы можем предложить технологии по установке систем субпериостальных имплантатов, или экзоскелетов."),
        medicalTextParagraph("Принцип заключен в создании точной копии поверхности кости верхней и нижней челюсти. По этой копии будет моделироваться будущий экзоскелет с посадочными местами под искусственные зубы. Конструкция дополнительно крепится к кости фиксационными элементами."),
        medicalTextParagraph("Такая конструкция изготавливается индивидуально на основании данных компьютерной томографии пациента и проектируется в 3D режиме CAD/CAM инженерных приложений. Это обеспечивает высокую точность в изготовлении конструкции. Экзоскелеты могут быть изготовлены как из медицинских сплавов титана, так и из оксида циркония."),
      ],
    ],
  ];

  return `<div class="lg:col-span-7">
      <ol class="space-y-1">
        ${items
          .map(
            ([title, paragraphs], i) => `<li class="step-line relative pl-16 py-5">
          <span class="absolute left-0 top-5 w-10 h-10 rounded-full bg-white border border-ink/10 flex items-center justify-center font-display font-bold text-indigo2">${i + 1}</span>
          <h3 class="font-display text-xl font-bold mb-3">${escapeHtml(title)}</h3>
          <div class="space-y-3 text-[15px] leading-relaxed text-ink/65 text-pretty">
            ${paragraphs.join("\n")}
          </div>
        </li>`
          )
          .join("\n")}
      </ol>
    </div>`;
}

function renderImplantologyExtraContent() {
  const highTechItems = [
    "реконструкция альвеолярного отростка свободными расщепленными костными аутотрансплантатами нижней челюсти, теменных костей, гребня подвздошной кости;",
    "реконструкция альвеолярного отростка с помощью дистракционного остеонеогенеза - выращивание кости методом Илизарова;",
    "латерализация нижнечелюстного нерва с одномоментной установкой имплантатов;",
    "реконструкция альвеолярного отростка туннельной пластикой;",
    "реконструкция альвеолярного отростка методом аутоклеточной матрицы (выращивание кости с помощью Вашего клеточного материала);",
    "реконструкция нижней и верхней челюсти с помощью микрохирургического метода пересадки васкулярезированных аутотрансплантатов (комплекса тканей, имеющих собственное кровоснабжение). Пересадка осуществляется с подсоединением сосудистой ножки трансплантата к магистральным сосудам в области отсутствующей челюсти. Данная методика используется у пациентов с полным или частичным отсутствием верхней или нижней челюсти после удаления опухолевых процессов или травм, приведших к потере челюсти;",
    "реконструкция нижней либо верхней челюсти методом префабрикации. Суть заключается в проектировании копии верхней либо нижней (отсутствующей) челюсти, после чего по данным проектирования изготавливается матрица будущей челюсти, которая заполняется биоимплантатом и помещается в заранее выбранный участок тела человека с магистральным сосудисто-нервным пучком. Через 1 год происходит прорастание сосудов и тканей в данный имплантат, позволяя в дальнейшем пересаживать его на собственной сосудистой ножке в область отсутствующей челюсти.",
  ];

  return [
    implantologySubheading("Высокотехнологическая медицинская помощь"),
    medicalTextParagraph(
      "В нашем центре пациенты могут получить высокотехнологическую медицинскую помощь в решении своих сложных проблем в виде:",
      ["высокотехнологическую медицинскую помощь"]
    ),
    `<ul class="space-y-3 pl-5 list-disc marker:text-indigo2 text-pretty">
      ${highTechItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}
    </ul>`,
    medicalTextParagraph("Данная методика также позволяет избежать излишнюю травматизацию при заборе собственного трансплантата из ноги либо гребня подвздошной кости.", [], "italic text-ink/80"),
    medicalTextParagraph("Данная методика относится к HI-TECH технологиям органогенеза.", [], "italic text-ink/80"),
    implantologySubheading("Операции под общим обезболиванием и седацией"),
    medicalTextParagraph(
      "В нашем центре возможно проведение хирургических манипуляций и операций под всеми видами общего обезболивания и седации.",
      ["операций под всеми видами общего обезболивания и седации"]
    ),
    implantologySubheading("Имплантация при сопутствующих заболеваниях"),
    medicalTextParagraph(
      "В нашем центре мы можем предложить услуги по имплантации пациентам, имеющим заболевания сердечно-сосудистой системы, сахарным диабетом и т.д.",
      ["услуги по имплантации пациентам, имеющим заболевания сердечно-сосудистой системы, сахарным диабетом"]
    ),
    medicalTextParagraph("В условиях стационара проводится полное обследование, включая гистологическое исследование костной ткани, денситометрию, исследования обменных процессов организма, состояния внутренних органов. После предварительной подготовки в условиях стационара проводится имплантация и последующее наблюдение за пациентом до полного выздоровления."),
  ].join("\n");
}

function renderTmjExtraContent() {
  return [
    tmjSubheading("Нашими новыми разработками и новыми технологическими внедрениями явились:"),
    tmjTextParagraph("Кинематическое МРТ — исследование движения нижней челюсти, ВНЧС, внутрисуставного диска, связок и жевательной мускулатуры в динамике."),
    tmjTextParagraph("Данный вид исследования несёт в себе более 90 % информативности и наглядно демонстрирует состояние тканей в динамике и при нагрузке. Это является важным и информативным в диагностике и понимании патологических процессов."),
    tmjSubheading("Эндоскопический остеосинтез челюстей"),
    tmjTextParagraph("Уникальностью данного исследования является то, что оно в себе одном объединяет: аксиографию, MPI исследования, миографию. И самое главное даёт визуальное отображение данных."),
    tmjSubheading("Лечебная и диагностическая артроскопия ВНЧС"),
    tmjTextParagraph("Также для врачей ортопедов и ортодонтов возможно проведение исследования для оценки влияния окклюзии, созданной во время лечения, на функцию ВНЧС при жевании и различных нагрузочных тестах, а также расчётов кривизны суставного пути и углов Беннета."),
    tmjSubheading("Гнатология и Артрология ВНЧС"),
    tmjTextParagraph("У пациентов с выраженными явлениями деструкции височно-нижнечелюстного сустава."),
    tmjTextParagraph("При разрушении диска или его выраженной вторичной деформации, атрофии, склерозировании связочного компонента или полном разрыве связок, гипертрофии и деформации костных структур, при деформирующем остеоартрозе ВНЧС, при компрессионном синдроме в нашем Центре выполняются операции реконструкции ВНЧС."),
    tmjTextParagraph("В виде открытой артропластики с реконструкцией, трансплантацией связочного аппарата ВНЧС, трансплантацией и пластикой диска ВНЧС и биламинарной зоны, с пластикой и моделированием костных структур, с удалением разрастаний и восстановлением функции ВНЧС.", ["открытой артропластики"]),
    tmjTextParagraph("У пациентов с отсутствием ВНЧС, больших дефектах нижней челюсти, у пациентов после онкологических заболеваний, у пациентов с тяжелыми травмами или огнестрельными ранениями нижней челюсти в нашем центре выполняются операции по дистракционному остеонеогенезу – аппаратному выращиванию суставного отростка, пересадка и пластика свободным костно-хрящевым трансплантатом и пересадка и пластика реваскуляризированным костно-хрящевым трансплантатом (микрохирургическая реконструкция).", ["остеонеогенезу"]),
    tmjTextParagraph("Отдельным направлением является новое революционное изобретение в виде наружнего (искусственного) сустава, по принципу экзоскелета, который на время может заменять функцию сустава и не позволять срастаться суставным поверхностям или запустить функцию сустава, вытянуть разрушающийся сустав, дав возможность убрать явления сдавливания и вернуть внутрисуставные структуры обратно в анатомически правильное положение."),
    tmjTextParagraph("Самое главное для структур сустава и окружающих его тканей является ранее восстановление их активности. Уникальностью данной технологии является возможность управлять степенью растяжения сустава, вытяжением суставного отростка (головки нижней челюсти) и его направлении."),
    tmjTextParagraph("При этом сама операция по установке данного устройства не травматична и малокровна, операционный доступ делается в волосистой части головы и в виде двух проколов в области угла нижней челюсти."),
    tmjSubheading("Направление аппаратной механотерапии пациентов с ограничением открывания рта"),
    tmjTextParagraph("В нашем центре применяется целый ряд аппаратов и методик для разработки открывания рта и движения нижней челюсти."),
    tmjTextParagraph("Hi-tech – получение, подготовка и введение – установка аутоклеточного тканевого материала взятого у самого пациента для регенерации хрящевой ткани и связачного аппарата сустава, способ введения через инъекции либо артроскопический.", ["Hi-tech"]),
  ].join("\n");
}

function renderTmjVideoSection(sectionLabel) {
  if (!tmjTreatmentVideos.length) return "";
  return `<section class="py-8 sm:py-10 lg:py-14 bg-white border-y border-ink/5">
  <div class="max-w-[1400px] mx-auto px-5 lg:px-10">
    ${sectionLabel("Видео", "text-indigo2", "bg-indigo2")}
    <h2 class="font-display text-[26px] sm:text-[30px] lg:text-[42px] font-bold leading-[1.12] sm:leading-[1.08] tracking-tight text-balance mb-6 sm:mb-8">Видео<br><span class="italic font-normal">по лечению ВНЧС</span></h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${tmjTreatmentVideos
        .map(
          (video) => `<article class="rounded-2xl bg-cream border border-ink/5 overflow-hidden shadow-sm">
        <h3 class="min-h-[88px] px-4 pt-4 pb-3 text-[13px] sm:text-[14px] leading-snug font-semibold text-indigo2">ВИДЕО: ${escapeHtml(video.title)}</h3>
        <a href="https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}" target="_blank" rel="noopener" class="group relative block aspect-video bg-ink overflow-hidden" aria-label="Смотреть видео на YouTube: ${escapeHtml(video.title)}">
          <img src="https://i.ytimg.com/vi/${encodeURIComponent(video.id)}/hqdefault.jpg" alt="${escapeHtml(video.title)}" class="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-[1.03]" loading="lazy">
          <span class="absolute inset-0 bg-ink/20 group-hover:bg-ink/10 transition"></span>
          <span class="absolute left-1/2 top-1/2 w-14 h-10 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#ff0000] text-white shadow-lg flex items-center justify-center transition duration-300 group-hover:scale-105">
            <span class="ml-1 w-0 h-0 border-y-[9px] border-y-transparent border-l-[15px] border-l-white"></span>
          </span>
          <span class="absolute right-3 bottom-3 rounded-full bg-ink/80 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur">Смотреть на YouTube</span>
        </a>
      </article>`
        )
        .join("\n")}
    </div>
  </div>
</section>`;
}

function galleryImageClass(image) {
  const src = image.src.toLowerCase();
  const contain = /\.(png|gif|webp)$/.test(src) || /(scheme|schema|slide|copy|nt|mrt|кт|аксио|diagram|result)/i.test(src);
  return contain ? "w-full aspect-[4/3] object-contain bg-white p-2" : "w-full aspect-[4/3] object-cover";
}

function isSensitiveGalleryImage(slug, image = {}) {
  const src = String(image.src || "").toLowerCase();
  return sensitiveGalleryImagePatterns.some((pattern) => pattern.test(src));
}

function renderSensitiveGalleryNotice() {
  return `<div class="mb-5 sm:mb-6 rounded-xl bg-white border border-ink/10 px-4 py-3 sm:px-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div class="max-w-[760px]">
        <p class="text-[14px] sm:text-[15px] leading-relaxed font-semibold text-ink">Часть фотографий содержит медицинские изображения хирургического лечения.</p>
        <p class="mt-0.5 text-[13px] sm:text-[14px] leading-relaxed text-ink/60">Чувствительные материалы скрыты до просмотра.</p>
      </div>
      <button type="button" data-sensitive-media-reveal-all class="inline-flex items-center justify-center rounded-full border border-ink/15 bg-white px-4 py-2.5 text-[13px] font-semibold text-ink hover:border-indigo2/30 hover:text-indigo2 transition focus:outline-none focus:ring-2 focus:ring-indigo2/20">Показать скрытые фото</button>
    </div>`;
}

function renderGalleryImage(image, className, alt, sensitive = false) {
  const img = `<img src="${image.src}" alt="${escapeHtml(alt)}" class="${className}" loading="lazy">`;
  if (!sensitive) return img;
  return `<div class="sensitive-media" data-sensitive-media="locked">
          ${img}
          <button type="button" data-sensitive-media-reveal class="sensitive-media__cover" aria-label="Показать медицинское изображение">
            <span class="sensitive-media__panel">
              <span class="sensitive-media__badge">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.7 5.1A10.9 10.9 0 0 1 12 5c5.4 0 9 5 9 7a8.7 8.7 0 0 1-2.3 3.4"/><path d="M6.6 6.6C4.2 8.1 3 10.4 3 12c0 2 3.6 7 9 7 1.4 0 2.7-.3 3.8-.9"/><path d="M9.9 9.9A3 3 0 0 0 14.1 14.1"/></svg>
                <span>Медицинское фото</span>
              </span>
              <span class="sensitive-media__title">Скрыто до просмотра</span>
              <span class="sensitive-media__text">Изображение хирургического лечения.</span>
              <span class="sensitive-media__action">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="3"/></svg>
                <span>Показать</span>
                <span aria-hidden="true">→</span>
              </span>
            </span>
          </button>
        </div>`;
}

function implantologyGalleryCaption(src = "") {
  const file = src.toLowerCase();
  if (/04-03/.test(file)) return "3D навигационная хирургия-имплантология";
  if (/04-04/.test(file)) return "Установка имплантатов на нижнюю челюсть справа с придвижением тройничного нерва – латерализация нижнелуночкового нерва";
  if (/04-05/.test(file)) return "Клинический пример имплантации и последующего протезирования";
  if (/04-06/.test(file)) return "Новые технологии в имплантологии: зубные имплантаты экзоскелетного типа";
  if (/04-02/.test(file)) return "Клинические примеры восстановления зубов на имплантатах";
  return "";
}

function renderImplantologyImageGrid(galleryImages, sectionLabel, imageSectionClass) {
  const sortedImages = [...galleryImages].sort((a, b) => {
    const order = ["04-03", "04-04", "04-05", "04-06", "04-02"];
    const ai = order.findIndex((key) => a.src.includes(key));
    const bi = order.findIndex((key) => b.src.includes(key));
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return `<section class="${imageSectionClass}">
  <div class="max-w-[1180px] mx-auto px-5 lg:px-10">
    ${sectionLabel("Материалы", "text-indigo2", "bg-indigo2")}
    <h2 class="font-display text-[26px] sm:text-[30px] lg:text-[42px] font-bold leading-[1.12] sm:leading-[1.08] tracking-tight text-balance mb-6 sm:mb-8">Наши работы</h2>
    ${sortedImages.some((image) => isSensitiveGalleryImage("implantology", image)) ? renderSensitiveGalleryNotice() : ""}
    <div class="grid md:grid-cols-2 gap-4 sm:gap-5">
      ${sortedImages
        .map((image) => {
          const caption = implantologyGalleryCaption(image.src);
          return `<figure class="card-hover overflow-hidden rounded-2xl bg-white border border-ink/5 shadow-sm">
        ${caption ? `<figcaption class="px-4 pt-4 pb-2 text-center font-display text-[15px] sm:text-[16px] leading-snug font-bold text-ink text-balance">${escapeHtml(caption)}</figcaption>` : ""}
        ${renderGalleryImage(image, "w-full aspect-[4/3] object-contain bg-white p-2", caption || image.alt, isSensitiveGalleryImage("implantology", image))}
      </figure>`;
        })
        .join("\n")}
    </div>
  </div>
</section>`;
}

function updateKnownLinks(html) {
  let out = html;
  for (const [label, href] of linkMap.entries()) {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(
      new RegExp(`<a href="#"((?:(?!</a>)[\\s\\S])*?${escapedLabel}(?:(?!</a>)[\\s\\S])*?</a>)`, "g"),
      `<a href="${href}"$1`
    );
  }
  return out;
}

function updateSeo(html, page) {
  const seo = page.seo || {};
  const title = (seo.title || "Center of Surgery").replaceAll("—", "–");
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(seo.description || "")}">`)
    .replace(/<meta name="keywords" content="[^"]*">/, `<meta name="keywords" content="${escapeHtml(seo.keywords || "")}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapeHtml(seo.canonical || page.url || "")}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(seo.og?.["og:title"] || seo.title || "")}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(seo.og?.["og:description"] || seo.description || "")}">`);
}

function socialIcon(name) {
  if (name === "whatsapp") {
    return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4l-2.6-1.3c-.4-.2-.8-.1-1 .2l-.7.9c-.2.3-.5.3-.8.2-.8-.4-1.9-1-2.7-2.6-.2-.3 0-.6.2-.8l.8-.9c.2-.2.2-.6.1-.8L9.6 6.6c-.2-.4-.7-.6-1.1-.4l-1.1.5c-.5.2-.9.7-.8 1.3.2 1.2.8 3.4 2.9 5.6 2.2 2.2 4.5 2.9 5.7 3.1.6.1 1.1-.3 1.3-.8l.5-1.1c.2-.4 0-.9-.5-1.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.5.8 3.1 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>`;
  }
  if (name === "instagram") {
    return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`;
  }
  return `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
}

function lightboxAssets() {
  return {
    style: `<style>
#imageLightbox {
  border: 0;
  padding: 0;
  background: transparent;
  max-width: min(96vw, 1400px);
  overflow: visible;
}
#imageLightbox::backdrop {
  background: rgba(12, 12, 24, 0.82);
  backdrop-filter: blur(4px);
}
#imageLightbox img {
  display: block;
  max-width: min(96vw, 1400px);
  max-height: 88vh;
  object-fit: contain;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
}
img[data-lightbox-image] {
  cursor: zoom-in;
}
.sensitive-media {
  position: relative;
  overflow: hidden;
  container-type: inline-size;
  background: #f8f5ef;
}
.sensitive-media > img {
  display: block;
  transition: filter 240ms ease, transform 240ms ease, opacity 240ms ease;
}
.sensitive-media[data-sensitive-media="locked"] > img {
  filter: blur(18px) saturate(0.68) contrast(0.9);
  transform: scale(1.03);
  opacity: 0.2;
}
.sensitive-media[data-sensitive-media="locked"] img[data-lightbox-image] {
  cursor: default;
}
.sensitive-media__cover {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  text-align: center;
  color: #151222;
  background:
    radial-gradient(circle at 34% 22%, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.72) 38%, transparent 68%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(248, 245, 239, 0.96));
  border: 0;
  cursor: pointer;
  transition: opacity 180ms ease, filter 180ms ease;
}
.sensitive-media__cover:hover {
  filter: brightness(1.01);
}
.sensitive-media__panel {
  display: inline-flex;
  width: min(76%, 360px);
  max-height: calc(100% - 24px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
}
.sensitive-media__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 999px;
  border: 1px solid rgba(218, 67, 169, 0.28);
  background: rgba(255, 255, 255, 0.52);
  padding: 6px 11px;
  font-size: 9px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #9c55d9;
  box-shadow: inset 0 0 0 1px rgba(84, 73, 205, 0.08);
}
.sensitive-media__badge svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}
.sensitive-media__title {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 24px;
  line-height: 1.02;
  font-weight: 700;
  letter-spacing: 0;
  text-wrap: balance;
}
.sensitive-media__text {
  max-width: 280px;
  font-size: 12px;
  line-height: 1.35;
  color: rgba(21, 18, 34, 0.46);
}
.sensitive-media__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
  border-radius: 999px;
  background: linear-gradient(135deg, #5044e6 0%, #d9419b 100%);
  color: #fff;
  padding: 9px 20px;
  font-size: 13px;
  line-height: 1;
  font-weight: 700;
  box-shadow: 0 14px 26px rgba(84, 73, 205, 0.22);
}
.sensitive-media__action svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}
@container (max-width: 340px) {
  .sensitive-media__cover {
    padding: 12px;
  }
  .sensitive-media__panel {
    width: min(82%, 300px);
    gap: 7px;
  }
  .sensitive-media__badge {
    padding: 5px 9px;
    font-size: 8px;
  }
  .sensitive-media__badge svg {
    width: 13px;
    height: 13px;
  }
  .sensitive-media__title {
    font-size: 21px;
  }
  .sensitive-media__text {
    font-size: 11px;
  }
  .sensitive-media__action {
    padding: 8px 16px;
    font-size: 12px;
  }
}
.sensitive-media[data-sensitive-media="revealed"] .sensitive-media__cover {
  opacity: 0;
  pointer-events: none;
}
</style>`,
    markup: `<dialog id="imageLightbox" closedby="any" aria-label="Просмотр изображения">
  <button type="button" data-lightbox-close aria-label="Закрыть" class="absolute -top-4 -right-4 w-11 h-11 rounded-full bg-white text-ink shadow-xl border border-ink/10 flex items-center justify-center text-2xl leading-none hover:bg-cream transition">×</button>
  <img alt="">
</dialog>
<script>
(() => {
  const dialog = document.getElementById("imageLightbox");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const image = dialog.querySelector("img");
  const closeButton = dialog.querySelector("[data-lightbox-close]");
  const revealSensitive = (frame) => {
    if (!frame) return;
    frame.dataset.sensitiveMedia = "revealed";
  };
  const isExcluded = (img) => {
    const src = img.getAttribute("src") || "";
    return img.closest("#imageLightbox, a, button") || /(^|\\/)(logo|favicon)\\.png$/i.test(src);
  };

  document.querySelectorAll("img").forEach((img) => {
    if (!isExcluded(img)) img.dataset.lightboxImage = "";
  });

  document.addEventListener("click", (event) => {
    const revealAllButton = event.target.closest("[data-sensitive-media-reveal-all]");
    if (revealAllButton) {
      event.preventDefault();
      const scope = revealAllButton.closest("section") || document;
      scope.querySelectorAll('[data-sensitive-media="locked"]').forEach(revealSensitive);
      return;
    }

    const revealButton = event.target.closest("[data-sensitive-media-reveal]");
    if (revealButton) {
      event.preventDefault();
      revealSensitive(revealButton.closest("[data-sensitive-media]"));
      return;
    }

    const target = event.target.closest("img[data-lightbox-image]");
    if (!target) return;

    const sensitiveFrame = target.closest("[data-sensitive-media]");
    if (sensitiveFrame?.dataset.sensitiveMedia === "locked") {
      event.preventDefault();
      revealSensitive(sensitiveFrame);
      return;
    }

    event.preventDefault();
    image.src = target.currentSrc || target.src;
    image.alt = target.alt || "Изображение";
    if (!dialog.open) dialog.showModal();
  });

  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => image.removeAttribute("src"));

  if (!("closedBy" in HTMLDialogElement.prototype)) {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const insideDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!insideDialog) dialog.close();
    });
  }
})();
</script>`,
  };
}

function applyGlobalEnhancements(html) {
  const lightbox = lightboxAssets();
  return html
    .replace(/<title>([\s\S]*?)<\/title>/, (_, title) => `<title>${title.replaceAll("—", "–")}</title>`)
    .replace("</head>", `<link rel="icon" type="image/png" href="favicon.png">\n<link rel="apple-touch-icon" href="logo.png">\n${lightbox.style}\n</head>`)
    .replace(
      /<a href="https:\/\/wa\.me\/79263329369" class="hover:text-pinklight">WhatsApp<\/a>/g,
      `<a href="https://wa.me/79263329369" class="inline-flex items-center gap-1.5 hover:text-pinklight" aria-label="WhatsApp">${socialIcon("whatsapp")}<span>WhatsApp</span></a>`
    )
    .replace(
      /<a href="https:\/\/www\.instagram\.com\/dmitriikravchenko992" class="hover:text-pinklight">Instagram<\/a>/g,
      `<a href="https://www.instagram.com/dmitriikravchenko992" class="inline-flex items-center gap-1.5 hover:text-pinklight" aria-label="Instagram">${socialIcon("instagram")}<span>Instagram</span></a>`
    )
    .replace(
      /<a href="mailto:surgery79@mail\.ru" class="hidden md:inline hover:text-pinklight">surgery79@mail\.ru<\/a>/g,
      `<a href="mailto:surgery79@mail.ru" class="hidden md:inline-flex items-center gap-1.5 hover:text-pinklight" aria-label="Email">${socialIcon("email")}<span>surgery79@mail.ru</span></a>`
    )
    .replace(
      /<a href="([^"]+)" class="flex items-center gap-3 shrink-0">[\s\S]*?<div class="leading-\[1\.55\]">[\s\S]*?<\/div>\s*<\/a>/g,
      `<a href="$1" class="flex items-center gap-3 shrink-0" aria-label="Center of Surgery"><img src="logo.png" alt="Center of Surgery" class="h-11 w-auto"></a>`
    )
    .replace(
      /<a href="([^"]+)" class="flex items-center gap-3">\s*<div class="relative w-10 h-10">[\s\S]*?<div class="leading-\[1\.55\]">[\s\S]*?<\/div>\s*<\/a>/g,
      `<a href="$1" class="flex items-center gap-3" aria-label="Center of Surgery"><img src="logo.png" alt="Center of Surgery" class="h-12 w-auto"></a>`
    )
    .replace("</body>", `${lightbox.markup}\n</body>`);
}

const homeServiceCards = [
  ["exo", "Экзопротезирование лица<br>протезирование ушей,<br>носа, пальцев", "assets/images/tild3266-6533-4838-b264-646436623035_exo.png"],
  ["nose_surgery", "Операции на нос", "assets/images/tild3762-3030-4335-a465-313065346635_01.png"],
  ["free", "Бесплатное лечение<br>по квоте ВМП", "assets/images/tild6365-3836-4263-b739-613331393930_02-00.png"],
  ["tmj_treatment", "Артрогнатология<br>(Лечение ВНЧС)", "assets/images/tild3537-6239-4336-b132-623837333566_tmj_treatment1_copy.png"],
  ["implantology", "Имплантология", "assets/images/tild6431-6535-4237-a433-343335376137_04-01_copy.png"],
  ["nasal_surgery", "Хирургия<br>восстановления<br>носового дыхания", "assets/images/tild3861-3861-4561-b464-383933643661_05-01_copy.png"],
  ["microsurgical", "Микрохирургическая<br>реконструкция<br>отсутствующих частей<br>лица", "assets/images/tild3966-6238-4532-b234-313232326362_06-01_copy.png"],
  ["scars", "Лечение<br>пациентов с<br>рубцами", "assets/images/tild3861-3331-4738-b433-653836353163_07-01_copy.png"],
  ["cleft", "Лечение пациентов<br>с расщелинами<br>губы, неба, лица", "assets/images/tild3630-3937-4636-a162-396332326666_08-01_copy.png"],
  ["tmj_dysfunction", "Лечение пациентов<br>с дисфункцией<br>ВНЧС", "assets/images/tild3036-3939-4532-b530-643161343134_09-01_copy.png"],
  ["tmj", "Лечение ВНЧС", "assets/images/tild3462-6236-4839-a364-613566643166_10_01_copy.png"],
  ["orthognathic_surgery", "Ортодонтическая<br>амбулаторная<br>хирургия", "assets/images/tild6137-6366-4334-b837-636339386337_00-11_copy.png"],
  ["ilizarov_method", "Использование систем<br>челюстных дистракторов<br>по методу Илизарова", "assets/images/tild6637-6233-4834-b266-663536323466_02_copy.png"],
  ["plastic_surgeries", "Пластические<br>операции: живот,<br>грудь, ягодицы, икры,<br>руки, ноги", "assets/images/tild3264-6432-4034-a230-393862393431_13-01_copy.png"],
  ["alveolar", "Восстановительные<br>операции альвеолярного<br>отростка верхней и<br>нижней челюсти", "assets/images/tild3063-6630-4538-b936-636533623038_14-01_copy.png"],
  ["face_surgery", "Эстетическая -<br>пластическая<br>хирургия лица", "assets/images/tild6537-3166-4930-b536-373661633937_15-01_copy.png"],
  ["restoration", "Восстановление<br>мягких тканей лица и<br>костей лицевого<br>скелета", "assets/images/tild6566-3439-4530-b065-633637613463_16-01_copy.png"],
  ["surgical_dentistry", "Хирургическая<br>стоматология", "assets/images/tild6238-6232-4838-a232-386436383066_17-01_copy.png"],
  ["bite_restoration", "Восстановления прикуса<br>и устранение челюстно<br>лицевых деформаций", "assets/images/tild3461-3031-4333-b962-373735343466_18-01_copy.png"],
  ["mouthguards", "Спортивные защитные<br>индивидуальные капы", "assets/images/tild3064-6136-4263-b538-333366663538_19-01_copy.png"],
  ["endolifting", "Эндолифтинг лица,<br>удаление комков<br>Биша", "assets/images/tild3039-6463-4363-a231-636136663431_20-5_copy.png"],
];

function renderHomeServicesSection() {
  const cardClass = (index) => {
    if (index === 0) return "card-hover relative block bg-ink text-white rounded-xl p-5 h-full";
    if (index === 2) return "card-hover block bg-gradient-to-br from-mint/15 to-indigo2/10 rounded-xl p-5 h-full";
    if (index === 11) return "card-hover block bg-gradient-to-br from-pink2/10 to-violet2/10 rounded-xl p-5 h-full";
    if (index === 20) return "card-hover relative block bg-gradient-to-br from-pink2 to-violet2 text-white rounded-xl p-5 h-full overflow-hidden";
    return "card-hover block bg-white rounded-xl border border-ink/5 p-5 h-full";
  };
  const numberClass = (index) => {
    if (index === 0) return "text-mint";
    if (index === 2) return "text-emerald-700";
    if (index === 20) return "text-white/80";
    return ["text-indigo2", "text-violet2", "text-pink2"][index % 3];
  };

  return `<!-- ============ SERVICES ============ -->
<section id="services" class="py-14 sm:py-16 lg:py-28">
  <div class="max-w-[1400px] mx-auto px-5 lg:px-10">
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
      <div>
        <div class="text-[13px] uppercase tracking-[0.2em] text-indigo2 font-semibold mb-4">— Наши услуги</div>
        <h2 class="font-display text-[34px] sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.98] sm:leading-[0.95] tracking-tight">
          21 направление<br>
          <span class="italic font-normal">лечения.</span>
        </h2>
      </div>
      <p class="max-w-md text-ink/60 text-[15px] leading-relaxed">
        От челюстно-лицевой хирургии и экзопротезирования до пластики тела и эндолифтинга. Полный спектр услуг под одной крышей.
      </p>
    </div>

    <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      ${homeServiceCards
        .map(
          ([slug, title, image], index) => `<li>
        <a href="${pageHref(slug)}" class="${cardClass(index)}">
          <div class="flex items-start gap-4">
            <span class="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0 bg-white/90">
              <img src="${image}" alt="${escapeHtml(title.replace(/<br>/g, " "))}" class="w-full h-full object-cover">
            </span>
            <span class="min-w-0 flex-1">
              <span class="text-[12px] font-mono ${numberClass(index)}">${String(index + 1).padStart(2, "0")}</span>
              ${index === 0 ? '<span class="ml-2 text-[10px] px-2 py-1 rounded-full bg-pink2 text-white uppercase tracking-wider font-semibold">Флагман</span>' : ""}
              ${index === 20 ? '<span class="ml-2 text-[10px] px-2 py-1 rounded-full bg-white text-pink2 uppercase tracking-wider font-bold">Новинка</span>' : ""}
              <h3 class="font-display text-[17px] font-bold mt-3 leading-snug">${title}</h3>
            </span>
          </div>
          ${index === 0 ? '<span class="absolute bottom-5 right-5 w-7 h-7 rounded-full bg-white/10 text-sm flex items-center justify-center">→</span>' : ""}
        </a>
      </li>`
        )
        .join("\n")}
    </ul>
  </div>
</section>`;
}

function renderHomeDoctorsSection() {
  return `<!-- ============ DOCTORS ============ -->
<section id="doctors" class="py-14 sm:py-16 lg:py-28 bg-white border-y border-ink/5">
  <div class="max-w-[1400px] mx-auto px-5 lg:px-10">
    <div class="mb-12">
      <div class="text-[13px] uppercase tracking-[0.2em] text-pink2 font-semibold mb-4">— Наши специалисты</div>
      <h2 class="font-display text-[34px] sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.98] sm:leading-[0.95] tracking-tight">
        Команда,<br>
        <span class="italic font-normal">которой доверяют.</span>
      </h2>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <article class="card-hover rounded-3xl bg-cream p-5 sm:p-7 border border-ink/5 flex flex-col sm:flex-row gap-5 sm:gap-6">
        <div class="w-full h-48 sm:w-40 sm:h-48 rounded-2xl bg-gradient-to-br from-indigo2 via-violet2 to-pink2 shrink-0 relative overflow-hidden">
          <img src="assets/images/tild6234-3261-4666-b363-653862623830_doc1.jpg" alt="Трофимов Евгений Иванович" class="w-full h-full object-cover">
        </div>
        <div>
          <div class="text-[12px] text-indigo2 uppercase tracking-wider font-semibold">Ведущий сотрудник</div>
          <h3 class="font-display text-2xl font-bold mt-1.5 leading-tight">Трофимов<br>Евгений Иванович</h3>
          <p class="text-ink/70 text-[14px] mt-3">Доктор медицинских наук, профессор</p>
          <a href="trofimov.html" class="inline-flex items-center gap-1.5 mt-5 text-[13px] font-semibold text-indigo2 arrow-cta">
            Подробнее <span class="arrow">→</span>
          </a>
        </div>
      </article>

      <article class="card-hover rounded-3xl bg-cream p-5 sm:p-7 border border-ink/5 flex flex-col sm:flex-row gap-5 sm:gap-6">
        <div class="w-full h-48 sm:w-40 sm:h-48 rounded-2xl bg-gradient-to-br from-pink2 via-violet2 to-indigo2 shrink-0 relative overflow-hidden">
          <img src="assets/images/tild6135-6432-4364-a139-663734393963_doc2.jpg" alt="Кравченко Дмитрий Валерьевич" class="w-full h-full object-cover">
        </div>
        <div>
          <div class="text-[12px] text-pink2 uppercase tracking-wider font-semibold">Челюстно-лицевой хирург</div>
          <h3 class="font-display text-2xl font-bold mt-1.5 leading-tight">Кравченко<br>Дмитрий Валерьевич</h3>
          <p class="text-ink/70 text-[14px] mt-3">Кандидат медицинских наук</p>
          <a href="kravchenko.html" class="inline-flex items-center gap-1.5 mt-5 text-[13px] font-semibold text-pink2 arrow-cta">
            Подробнее <span class="arrow">→</span>
          </a>
        </div>
      </article>
    </div>
  </div>
</section>`;
}

function renderHomeTrustSection() {
  const items = [
    ["01", "Авторитетность", "Лучшие врачи пластической хирургии", "assets/images/tild6436-3163-4763-b134-643166623162_banner1.jpg"],
    ["02", "Опыт", "Более 20 лет опыта в хирургии", "assets/images/tild3633-3731-4664-b664-646663363265_banner2.jpg"],
    ["03", "Многопрофильность", "Более 30 направлений лечения", "assets/images/tild6138-6439-4131-b561-333635353330_banner3.jpg"],
    ["04", "База", "Новейшее оборудование западных брендов", "assets/images/tild3366-3632-4335-a139-666566316436_banner4.jpg"],
  ];

  return `<!-- ============ TRUST ============ -->
<section id="trust" class="py-14 sm:py-16 lg:py-28">
  <div class="max-w-[1400px] mx-auto px-5 lg:px-10">
    <div class="mb-12">
      <div class="text-[13px] uppercase tracking-[0.2em] text-indigo2 font-semibold mb-4">— Почему нам доверяют</div>
      <h2 class="font-display text-[34px] sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.98] sm:leading-[0.95] tracking-tight">
        Четыре причины<br>
        <span class="italic font-normal">выбрать нас.</span>
      </h2>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${items
        .map(
          ([num, title, text, image]) => `<div class="rounded-2xl bg-white border border-ink/5 p-6 card-hover">
        <div class="w-full aspect-[4/3] rounded-2xl bg-cream overflow-hidden mb-5">
          <img src="${image}" alt="${escapeHtml(title)}" class="w-full h-full object-cover">
        </div>
        <div class="font-display text-5xl font-bold gradient-text">${num}</div>
        <h3 class="font-bold text-[15px] mt-5 uppercase tracking-wider">${title}</h3>
        <p class="text-ink/60 text-[14px] mt-2 leading-relaxed">${text}</p>
      </div>`
        )
        .join("\n")}
    </div>
  </div>
</section>`;
}

function templateParts() {
  const exo = fs.readFileSync(path.join(originalRoot, "exo.html"), "utf8");
  const headEnd = exo.indexOf("</head>") + "</head>".length;
  const bodyStart = exo.indexOf("<body");
  const breadcrumbStart = exo.indexOf("<!-- ============ BREADCRUMB ============ -->");
  const ctaStart = exo.indexOf("<!-- ============ CTA / BOOK ============ -->");
  return {
    head: exo.slice(0, headEnd),
    nav: updateKnownLinks(exo.slice(bodyStart, breadcrumbStart)),
    ctaFooter: updateKnownLinks(exo.slice(ctaStart)),
  };
}

function splitLongText(text) {
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const paragraphs = [];
  const bullets = [];
  for (const line of lines) {
    if (/^[•\-–]/.test(line)) bullets.push(line.replace(/^[•\-–]\s*/, ""));
    else if (line.length > 18) paragraphs.push(line);
  }
  if (!paragraphs.length && text.length > 40) paragraphs.push(text.replace(/\n+/g, " "));
  return { paragraphs, bullets };
}

function renderGenericPage(slug, number = "—") {
  const parts = templateParts();
  const page = readJson(slug);
  const atoms = extractAtoms(slug);
  const title = firstHeading(page, atoms);
  const displayTitle = slug === "microsurgical" ? title.replace(/\s+и$/i, "") : title;
  const h2 = [...(page.headings?.h2 || []), ...atoms.filter((a) => a.tag === "h2").map((a) => a.text)]
    .map((text) => text.replace(/^[\s•\-–—]+/, "").replace(/:$/, "").trim())
    .filter((text) => text && text.length > 3 && text.length < 95)
    .filter((text) => !/записаться|консультац/i.test(text))
    .filter((text, i, arr) => arr.findIndex((item) => item.toLowerCase() === text.toLowerCase()) === i)
    .slice(0, 8);
  const isServicePolish = serviceSlugs.has(slug);
  const images = usefulImages(page);
  const hero = heroImage(page, images);
  const galleryImages = images
    .filter((image) => !hero || image.src !== hero.src)
    .filter((image) => slug !== "nose_surgery" || !/procedures-nose/i.test(image.src))
    .filter((image) => slug !== "tmj_treatment" || !/_tmj_treatment1/i.test(image.src))
    .filter((image) => slug !== "implantology" || !/04-01/i.test(image.src))
    .filter((image) => slug !== "nasal_surgery" || !/05-01/i.test(image.src));
  const textSections = collectTextSections(atoms);
  const usedText = new Set([normalizeContentKey(title)]);
  const seoLeadRaw = compactLead(page.seo?.description || "");
  const seoLead = sameContent(title, seoLeadRaw) || isBulletRun(seoLeadRaw) ? "" : seoLeadRaw;
  const allParagraphs = uniqueTexts(textSections.flatMap((section) => section.paragraphs).filter((text) => !isBulletRun(text)), usedText);
  const allBullets = uniqueTexts(textSections.flatMap((section) => section.bullets), usedText);
  const rawLead = seoLead || allParagraphs[0] || "На консультации врач оценивает клиническую ситуацию и подбирает индивидуальный план лечения по этому направлению.";
  const lead = cleanHeroLead(rawLead) || rawLead;
  const paragraphsAfterLead = allParagraphs.filter((text) => !sameContent(text, lead));
  const introParagraphs = paragraphsAfterLead.slice(0, 2);
  const detailParagraphs = paragraphsAfterLead.slice(2, 8);
  let remainingParagraphs = paragraphsAfterLead.slice(8);

  const cardPool = (allBullets.length ? allBullets : h2).filter((item) => !/^симптомы$/i.test(item));
  const cards = cardPool.slice(0, 4);
  const steps = cardPool.slice(cards.length, cards.length + 6);
  const usedShortItems = new Set([...cards, ...steps].map(normalizeContentKey));
  const tags = h2
    .filter((item) => !/^симптомы$/i.test(item))
    .filter((item) => !usedShortItems.has(normalizeContentKey(item)))
    .slice(0, 8);
  if (slug === "tmj_treatment") remainingParagraphs = stripTmjTreatmentExtra(remainingParagraphs);
  const treatmentCards =
    slug === "tmj_treatment"
      ? tmjTreatmentCards
      : slug === "microsurgical"
        ? microsurgicalTreatmentCards
        : cards.map((card) => ({ title: card.replace(/[.;]$/, ""), text: "" }));
  const showTreatmentLabel = slug === "tmj_treatment" || slug === "implantology" || slug === "microsurgical";
  const implantologyTreatmentNoteHtml =
    slug === "implantology"
      ? `    <div class="mb-5 rounded-2xl bg-gradient-to-br from-indigo2/5 via-violet2/5 to-pink2/5 border border-indigo2/10 px-5 py-4 sm:px-6 shadow-sm">
      <p class="text-[16px] sm:text-[17px] leading-relaxed text-ink/75"><span class="font-semibold text-indigo2">Костная инженерия bone engineering</span> – направленная регенерации, изменение биотипа кости – направленная остеоконденсация при остеопорозе.</p>
    </div>
`
      : "";
  const treatmentGridClass = slug === "tmj_treatment" ? "grid sm:grid-cols-2 lg:grid-cols-5 gap-4" : "grid sm:grid-cols-2 lg:grid-cols-4 gap-4";
  let sectionSummary = introParagraphs[0] || "Ниже собраны основные задачи и варианты помощи по этому направлению.";
  if (slug === "implantology") {
    sectionSummary = "Имплантология в Center of Surgery объединяет восстановление костной ткани, цифровое планирование и индивидуальный подбор системы имплантации под клиническую ситуацию пациента.";
  }
  const detailCopy = (detailParagraphs.length ? detailParagraphs : introParagraphs.slice(1)).filter(
    (text) => !sameContent(text, lead) && !sameContent(text, sectionSummary)
  );
  const visibleDetailCopy = slug === "tmj_treatment" ? stripTmjTreatmentExtra(detailCopy) : detailCopy;
  const detailFallback = "Врач уточняет показания, противопоказания и оптимальный объем лечения после очной консультации и диагностики.";
  const sectionLabel = (text, textClass = "text-indigo2", dotClass = "bg-indigo2", marginClass = "mb-4") =>
    isServicePolish
      ? `<div class="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/80 border border-ink/10 shadow-sm ${textClass} text-[12px] uppercase tracking-[0.18em] font-semibold ${marginClass}"><span class="w-2 h-2 rounded-full ${dotClass}"></span><span>${text}</span></div>`
      : `<div class="text-[13px] uppercase tracking-[0.2em] ${textClass} font-semibold ${marginClass}">— ${text}</div>`;
  const aboutSectionClass = isServicePolish
    ? "py-8 sm:py-10 lg:py-16 bg-white border-y border-ink/5"
    : "py-12 sm:py-14 lg:py-24 bg-white border-y border-ink/5";
  const aboutHeaderAlignClass = slug === "implantology" ? "lg:items-start" : "lg:items-end";
  const detailColumnClass = slug === "microsurgical" ? "lg:col-span-10" : "lg:col-span-5";
  const heroSubtitleHtml =
    slug === "microsurgical"
      ? `<p class="mt-4 max-w-4xl text-[18px] sm:text-[22px] lg:text-[26px] leading-snug text-ink/70 text-balance">${escapeHtml(microsurgicalHeroSubtitle)}</p>`
      : "";
  const detailsSectionClass = isServicePolish ? "py-10 sm:py-12 lg:py-16" : "py-12 sm:py-14 lg:py-24";
  const imageSectionClass = isServicePolish
    ? "py-10 sm:py-12 lg:py-16 bg-white border-y border-ink/5"
    : "py-12 sm:py-14 lg:py-24";
  const hasSensitiveGalleryImages = galleryImages.some((image) => isSensitiveGalleryImage(slug, image));
  const imageGrid = galleryImages.length
    ? slug === "implantology"
      ? renderImplantologyImageGrid(galleryImages, sectionLabel, imageSectionClass)
      : `<section class="${imageSectionClass}">
  <div class="max-w-[1400px] mx-auto px-5 lg:px-10">
    ${sectionLabel("Материалы", "text-indigo2", "bg-indigo2")}
    <h2 class="font-display text-[26px] sm:text-[30px] lg:text-[42px] font-bold leading-[1.12] sm:leading-[1.08] tracking-tight text-balance mb-8 sm:mb-10">${isServicePolish ? "Наши работы" : "Изображения<br><span class=\"italic font-normal\">из исходной страницы.</span>"}</h2>
${hasSensitiveGalleryImages ? renderSensitiveGalleryNotice() : ""}
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${galleryImages
        .map(
          (image) => `<figure class="card-hover overflow-hidden rounded-2xl bg-white border border-ink/5">
        ${renderGalleryImage(image, galleryImageClass(image), image.alt, isSensitiveGalleryImage(slug, image))}
      </figure>`
        )
        .join("\n")}
    </div>
  </div>
</section>`
    : "";
  const extraBodyHtml = slug === "tmj_treatment" ? renderTmjExtraContent() : slug === "implantology" ? renderImplantologyExtraContent() : renderParagraphs(remainingParagraphs);
  const extraTextHtml = slug === "tmj_treatment" || slug === "implantology" || remainingParagraphs.length
    ? `<section class="py-8 sm:py-10 lg:py-14 bg-cream border-y border-ink/5">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10">
    <div class="text-[13px] uppercase tracking-[0.2em] text-indigo2 font-semibold mb-4">— Подробнее</div>
    <h2 class="font-display text-[26px] sm:text-[30px] lg:text-[42px] font-bold leading-[1.12] sm:leading-[1.08] tracking-tight text-balance mb-8">Дополнительная<br><span class="italic font-normal">информация</span></h2>
    <div class="space-y-4 text-[16px] leading-relaxed text-ink/70">
      ${extraBodyHtml}
    </div>
  </div>
</section>`
    : "";
  const ctaFooter = isServicePolish
    ? parts.ctaFooter
        .replace(
          '<section id="book" class="py-12 sm:py-14 lg:py-24 bg-ink text-white relative overflow-hidden">',
          '<section id="book" class="py-8 sm:py-10 lg:py-16 bg-ink text-white relative overflow-hidden">'
        )
        .replace(
          '<div class="text-[13px] uppercase tracking-[0.2em] text-mint font-semibold mb-4">— Запись</div>',
          `<div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/8 border border-mint/60 text-mint text-[12px] uppercase tracking-[0.18em] font-semibold mb-4 shadow-sm"><span class="w-2 h-2 rounded-full bg-mint"></span><span>Запись</span></div>`
        )
        .replace("на бесплатную<br>консультацию.</span>", "на бесплатную<br>консультацию</span>")
        .replace(
          "Опишите цель вашего обращения. Мы свяжемся в течение 15 минут в рабочее время.",
          "Опишите цель вашего обращения.<br>Мы свяжемся с вами в течение рабочего дня"
        )
        .replace(
          '<footer class="bg-ink text-white border-t border-white/10">',
          '<footer class="bg-[#080617] text-white border-t border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">'
        )
        .replace('class="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-7 lg:p-9"', 'class="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 lg:p-8"')
        .replace('class="max-w-[1400px] mx-auto px-5 lg:px-10 py-14"', 'class="max-w-[1400px] mx-auto px-5 lg:px-10 py-10 lg:py-12"')
        .replace('class="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[12px] text-white/40"', 'class="mt-8 pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[12px] text-white/40"')
    : parts.ctaFooter;
  const detailStepsHtml =
    slug === "implantology"
      ? renderImplantologyStepCopy()
      : slug === "tmj_treatment"
      ? `<div class="lg:col-span-7">
      <h3 class="font-display text-[22px] leading-snug font-bold mb-4">Артроскопическая артропластика</h3>
      <p class="text-[16px] leading-relaxed text-ink/70 mb-6">${escapeHtml(tmjArthroplastyIntro.replace(/^Артроскопическая артропластика\.\s*/, ""))}</p>
      <ol class="space-y-1">
        ${tmjArthroplastyItems.map((item, i) => `<li class="step-line relative pl-16 py-5">
          <span class="absolute left-0 top-5 w-10 h-10 rounded-full bg-white border border-ink/10 flex items-center justify-center font-display font-bold text-indigo2">${i + 1}</span>
          <h3 class="font-display text-xl font-bold">${escapeHtml(item)}</h3>
        </li>`).join("\n")}
      </ol>
    </div>`
      : steps.length
        ? `<div class="lg:col-span-7">
      <ol class="space-y-1">
        ${steps.map((item, i) => `<li class="step-line relative pl-16 py-5">
          <span class="absolute left-0 top-5 w-10 h-10 rounded-full bg-white border border-ink/10 flex items-center justify-center font-display font-bold text-indigo2">${i + 1}</span>
          <h3 class="font-display text-xl font-bold">${escapeHtml(item.replace(/[.;]$/, ""))}</h3>
        </li>`).join("\n")}
      </ol>
    </div>`
        : "";
  const videoSectionHtml = slug === "tmj_treatment" ? renderTmjVideoSection(sectionLabel) : "";

  const head = updateSeo(parts.head, page);
  return `${head}
${parts.nav}
<!-- ============ BREADCRUMB ============ -->
<nav aria-label="breadcrumb" class="max-w-[1400px] mx-auto px-5 lg:px-10 pt-6 text-[13px] text-ink/50">
  <ol class="flex items-center gap-2 flex-wrap">
    <li><a href="index.html" class="hover:text-indigo2">Главная</a></li>
    <li>/</li>
    <li><a href="index.html#services" class="hover:text-indigo2">Наши услуги</a></li>
    <li>/</li>
    <li class="text-ink/80">${escapeHtml(displayTitle)}</li>
  </ol>
</nav>

<!-- ============ HERO ============ -->
<section class="relative pt-6 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 overflow-hidden">
  <div aria-hidden="true" class="absolute -top-20 right-0 w-[460px] h-[460px] rounded-full opacity-25 blur-3xl gradient-bg pointer-events-none"></div>
  <div class="relative max-w-[1400px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-10 items-start">
    <div class="lg:col-span-7">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-ink/10 mb-6">
        <span class="text-[11px] font-mono text-pink2">№ ${number}</span>
        <span class="text-[12px] text-ink/60">в списке направлений</span>
      </div>
      <h1 class="font-display text-[26px] sm:text-[42px] md:text-[52px] lg:text-[68px] leading-[1.12] sm:leading-[1.06] tracking-tight font-bold text-balance">
        ${escapeHtml(displayTitle)}
      </h1>
${heroSubtitleHtml}
      <p class="font-display text-lg sm:text-2xl lg:text-3xl text-ink/60 mt-3 sm:mt-4 italic">
        <span class="gradient-text not-italic font-semibold">Center of Surgery</span> <br class="hidden sm:block">Москва · Одинцово.
      </p>
      <p class="mt-6 max-w-2xl text-[15px] sm:text-[17px] leading-relaxed text-ink/75">${escapeHtml(lead)}</p>
      <div class="mt-8 flex flex-wrap items-center gap-3">
        <a href="#book" class="btn-primary px-7 py-4 rounded-full font-semibold text-[15px] inline-flex items-center gap-2 arrow-cta">Записаться на консультацию <span class="arrow">→</span></a>
        <a href="tel:+79263329369" class="px-7 py-4 rounded-full font-semibold text-[15px] border border-ink/15 hover:border-ink/40 transition">+7 (926) 332-93-69</a>
      </div>
    </div>
    <aside class="lg:col-span-5">
      <div class="relative aspect-[16/10] max-w-2xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-indigo2 via-violet2 to-pink2 shadow-2xl shadow-indigo2/10">
        ${hero ? `<img src="${hero.src}" alt="${escapeHtml(hero.alt)}" class="absolute inset-0 w-full h-full object-cover opacity-85" fetchpriority="high" loading="eager">` : ""}
        <div class="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent"></div>
        <div class="absolute inset-0 grain opacity-30"></div>
        <div class="absolute bottom-6 left-6 right-6 text-white">
          <div class="text-[11px] font-mono text-white/70 uppercase tracking-widest">[ направление лечения ]</div>
          <div class="font-display text-2xl italic mt-2">${escapeHtml(displayTitle.slice(0, 42))}</div>
        </div>
      </div>
    </aside>
  </div>
</section>

<section class="${aboutSectionClass}">
  <div class="max-w-[1400px] mx-auto px-5 lg:px-10">
    <div class="flex flex-col lg:flex-row ${aboutHeaderAlignClass} justify-between gap-6 mb-12">
      <div>
        ${sectionLabel("О направлении", "text-indigo2", "bg-indigo2")}
        <h2 class="font-display text-[26px] sm:text-[30px] md:text-[42px] lg:text-[54px] font-bold leading-[1.12] sm:leading-[1.08] tracking-tight text-balance">Что важно<br><span class="italic font-normal">знать пациенту</span></h2>
      </div>
      ${isServicePolish
        ? `<blockquote class="max-w-xl rounded-2xl bg-cream/70 border border-ink/10 px-6 py-5 shadow-sm">
        <p class="text-ink/70 text-[17px] sm:text-[18px] leading-relaxed text-pretty">${escapeHtml(sectionSummary)}</p>
      </blockquote>`
        : `<p class="max-w-md text-ink/60 text-[15px] leading-relaxed">${escapeHtml(sectionSummary)}</p>`}
    </div>
${showTreatmentLabel ? `    ${sectionLabel("Виды лечения", "text-indigo2", "bg-indigo2", "mb-5")}\n` : ""}${implantologyTreatmentNoteHtml}    <ul class="${treatmentGridClass}">
      ${treatmentCards
        .map(
          (card, i) => `<li class="${isServicePolish ? "card-hover rounded-2xl bg-cream border border-ink/5 p-6 sm:p-7 min-h-[220px]" : "card-hover rounded-2xl bg-cream border border-ink/5 p-6"}">
        <div class="${isServicePolish ? "w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white mb-7 font-display font-bold text-2xl shadow-lg shadow-indigo2/15" : "w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white mb-5 font-display font-bold"}">${i + 1}</div>
        <h3 class="font-display ${isServicePolish ? "text-[20px] leading-snug" : "text-xl"} font-bold">${escapeHtml(card.title)}</h3>${card.text ? `\n        <p class="mt-3 text-[14px] leading-relaxed text-ink/65">${escapeHtml(card.text)}</p>` : ""}
      </li>`
        )
        .join("\n")}
    </ul>
${tags.length ? `    <div class="${isServicePolish ? "mt-8 rounded-3xl bg-white p-6 lg:p-8 border border-ink/10 shadow-sm" : "mt-12 rounded-3xl bg-gradient-to-br from-indigo2/5 via-violet2/5 to-pink2/5 p-7 lg:p-10 border border-ink/5"}">
      ${sectionLabel("С чем обращаются", "text-violet2", "bg-violet2", "mb-5")}
      <ul class="${isServicePolish ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[15px] text-ink/80" : "grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-[15px] text-ink/80"}">
        ${tags.map((tag) => isServicePolish
          ? `<li class="min-h-[70px] rounded-2xl bg-cream/80 border border-ink/5 px-4 py-3 flex items-center justify-center gap-3 text-center"><span class="w-1.5 h-1.5 rounded-full bg-pink2 shrink-0"></span><span class="[text-box:trim-both_cap_alphabetic]">${escapeHtml(capitalizeFirst(tag))}</span></li>`
          : `<li class="flex items-center gap-2"><span class="text-pink2">•</span> ${escapeHtml(tag)}</li>`).join("\n")}
      </ul>
    </div>` : ""}
  </div>
</section>

<section class="${detailsSectionClass}">
  <div class="max-w-[1400px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-8 lg:gap-12">
    <div class="${detailColumnClass}">
      ${sectionLabel("Подробности", "text-pink2", "bg-pink2")}
      <h2 class="font-display text-[26px] sm:text-[30px] lg:text-[42px] font-bold leading-[1.12] sm:leading-[1.08] tracking-tight text-balance">
        <span class="gradient-text">Индивидуальный</span><br>
        <span class="italic font-normal">план лечения</span>
      </h2>
      <div class="text-ink/65 mt-6 leading-relaxed text-[16px] space-y-4">
        ${slug === "tmj_treatment" ? renderTmjDetailCopy() : slug === "implantology" ? renderImplantologyDetailCopy() : slug === "microsurgical" ? renderMicrosurgicalDetailCopy() : renderParagraphs(visibleDetailCopy.length ? visibleDetailCopy : [detailFallback])}
      </div>
    </div>
${detailStepsHtml}
  </div>
</section>

${extraTextHtml}
${videoSectionHtml}
${imageGrid}
${ctaFooter}`;
}

function build() {
  const files = {};
  files["index.html"] = updateKnownLinks(fs.readFileSync(path.join(originalRoot, "index.html"), "utf8"))
    .replace(/<!-- ============ SERVICES ============ -->[\s\S]*?<!-- ============ DOCTORS ============ -->/, `${renderHomeServicesSection()}\n\n<!-- ============ DOCTORS ============ -->`)
    .replace(/<!-- ============ DOCTORS ============ -->[\s\S]*?<!-- ============ TRUST ============ -->/, `${renderHomeDoctorsSection()}\n\n<!-- ============ TRUST ============ -->`)
    .replace(/<!-- ============ TRUST ============ -->[\s\S]*?<!-- ============ CTA \/ CONTACT ============ -->/, `${renderHomeTrustSection()}\n\n<!-- ============ CTA / CONTACT ============ -->`);

  for (const [index, [slug]] of services.entries()) {
    files[`${slug}.html`] = renderGenericPage(slug, String(index + 1).padStart(2, "0"));
  }
  for (const [slug] of secondary) {
    if (fs.existsSync(path.join(pagesRoot, `${slug}.json`))) files[`${slug}.html`] = renderGenericPage(slug);
  }

  for (const outRoot of outRoots) {
    fs.mkdirSync(outRoot, { recursive: true });
    fs.cpSync(path.join(originalRoot, "uploads"), path.join(outRoot, "uploads"), { recursive: true });
    fs.cpSync(imageRoot, path.join(outRoot, "assets", "images"), { recursive: true });
    if (fs.existsSync(sourceLogo)) {
      fs.copyFileSync(sourceLogo, path.join(outRoot, "logo.png"));
      fs.copyFileSync(sourceLogo, path.join(outRoot, "favicon.png"));
    }

    for (const [name, html] of Object.entries(files)) {
      fs.writeFileSync(path.join(outRoot, name), applyGlobalEnhancements(html), "utf8");
    }

    fs.copyFileSync(path.join(scrapeRoot, "robots.txt"), path.join(outRoot, "robots.txt"));
    fs.copyFileSync(path.join(scrapeRoot, "sitemap.xml"), path.join(outRoot, "sitemap.xml"));
    fs.writeFileSync(
      path.join(outRoot, "_redirects"),
      ["/home / 301", ...Object.keys(files).filter((name) => name !== "index.html").map((name) => `/${name.replace(/\.html$/, "")} /${name} 200`), "/* /index.html 200", ""].join("\n"),
      "utf8"
    );
  }

  console.log(`Built ${Object.keys(files).length} pages with original design.`);
}

build();
