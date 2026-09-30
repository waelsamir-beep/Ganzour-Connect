/** قرية جنزور - مركز بركة السبع - محافظة المنوفية - مصر */

export const VILLAGE = "جنزور";
export const CENTER = "بركة السبع";
export const GOVERNORATE = "المنوفية";
export const FULL_ADDRESS = "جنزور - مركز بركة السبع - محافظة المنوفية";

export const DESIGNER_NAME = "وائل الجمال";
export const DESIGNER_PHONE = "01222355769";

/** الأقسام الرئيسية (الأزرار الكبيرة) */
export const SECTIONS = [
  { name: "الحرفيين", icon: "🛠️" },
  { name: "الدكاترة", icon: "🩺" },
  { name: "معامل", icon: "🔬" },
  { name: "محلات", icon: "🏪" },
  { name: "مستشفيات", icon: "🏥" },
  { name: "دعاية واعلان", icon: "📢" },
];

/** مناطق ومعالم داخل جنزور والقرى المجاورة بمركز بركة السبع */
export const AREAS = [
  "جنزور - شارع المحطة",
  "جنزور - الجامع الكبير",
  "جنزور - السوق",
  "جنزور - شارع المدرسة",
  "جنزور - الوحدة الصحية",
  "جنزور - الناحية الشرقية",
  "جنزور - الناحية الغربية",
  "جنزور - الناحية البحرية",
  "جنزور - الناحية القبلية",
  "جنزور - عزبة الجمال",
  "بركة السبع - المدينة",
  "دنشواي",
  "كمشيش",
  "طوخ دلكة",
  "سبك الأحد",
  "كفر الشهاوي",
  "الرجعة الكبرى",
  "شبرا بخوم",
  "قويسنا",
  "شبين الكوم",
];

export type CategoryDef = {
  name: string;
  icon: string;
  description: string;
  section: string;
};

/** كل التصنيفات ومقسمة على الأقسام الرئيسية */
export const CATEGORY_DEFS: CategoryDef[] = [
  // 🛠️ الحرفيين
  { name: "كهربائي", icon: "⚡", description: "كهرباء منازل وتأسيس", section: "الحرفيين" },
  { name: "سباك", icon: "🚰", description: "سباكة وصرف صحي", section: "الحرفيين" },
  { name: "نجار", icon: "🪚", description: "نجارة موبيليا ومطابخ", section: "الحرفيين" },
  { name: "نقاش ودهانات", icon: "🎨", description: "محارة ودهانات وديكور", section: "الحرفيين" },
  { name: "بناء ومقاولات", icon: "🧱", description: "مباني ومقاولات عمومية", section: "الحرفيين" },
  { name: "سيراميك وبلاط", icon: "🔲", description: "تركيب سيراميك ورخام", section: "الحرفيين" },
  { name: "جبس بورد وديكور", icon: "🏛️", description: "أسقف معلقة وديكورات", section: "الحرفيين" },
  { name: "ألوميتال", icon: "🪟", description: "شبابيك وأبواب ألوميتال", section: "الحرفيين" },
  { name: "حداد ولحام", icon: "⚙️", description: "حدادة وأشغال معادن", section: "الحرفيين" },
  { name: "زجاج ومرايا", icon: "🪞", description: "تركيب زجاج وسكريت", section: "الحرفيين" },
  { name: "تشطيبات", icon: "🏠", description: "تشطيب شقق كامل", section: "الحرفيين" },
  { name: "تكييف وتبريد", icon: "❄️", description: "تركيب وصيانة تكييفات", section: "الحرفيين" },
  { name: "صيانة أجهزة منزلية", icon: "🔌", description: "غسالات وثلاجات وبوتاجاز", section: "الحرفيين" },
  { name: "صيانة موبايل", icon: "📱", description: "تصليح تليفونات وتابلت", section: "الحرفيين" },
  { name: "كمبيوتر وشبكات", icon: "💻", description: "صيانة كمبيوتر ولاب توب", section: "الحرفيين" },
  { name: "دش وستالايت", icon: "📡", description: "تركيب وبرمجة رسيفر", section: "الحرفيين" },
  { name: "كاميرات مراقبة", icon: "🎥", description: "تركيب كاميرات وأنظمة أمان", section: "الحرفيين" },
  { name: "طاقة شمسية", icon: "☀️", description: "ألواح وسخانات شمسية", section: "الحرفيين" },
  { name: "مصاعد وأسانسير", icon: "🛗", description: "تركيب وصيانة مصاعد", section: "الحرفيين" },
  { name: "ميكانيكي سيارات", icon: "🔧", description: "ميكانيكا وصيانة سيارات", section: "الحرفيين" },
  { name: "كهربائي سيارات", icon: "🚗", description: "كهرباء وبطاريات سيارات", section: "الحرفيين" },
  { name: "سمكرة ودوكو", icon: "🎯", description: "سمكرة ورش سيارات", section: "الحرفيين" },
  { name: "كاوتش وبنشر", icon: "🛞", description: "بنشر وميزان وترصيص", section: "الحرفيين" },
  { name: "توكتوك وموتوسيكل", icon: "🛵", description: "صيانة موتوسيكلات", section: "الحرفيين" },
  { name: "نقل عفش وونش", icon: "🚚", description: "نقل أثاث وونش رفع", section: "الحرفيين" },
  { name: "سائق وتوصيل", icon: "🚕", description: "سائق خاص وديليفري", section: "الحرفيين" },
  { name: "نظافة ومبيدات", icon: "🧹", description: "نظافة ومكافحة حشرات", section: "الحرفيين" },
  { name: "طباخ وتموين حفلات", icon: "🍲", description: "طبخ وبوفيهات مناسبات", section: "الحرفيين" },
  { name: "تنسيق حدائق", icon: "🌳", description: "زراعة وتنسيق حدائق", section: "الحرفيين" },
  { name: "طبيب بيطري", icon: "🐄", description: "علاج ماشية ودواجن", section: "الحرفيين" },
  { name: "معدات زراعية", icon: "🚜", description: "جرارات وحرث وحصاد", section: "الحرفيين" },
  { name: "مدرس خصوصي", icon: "📚", description: "دروس خصوصية لكل المراحل", section: "الحرفيين" },
  { name: "تحفيظ قرآن", icon: "🕌", description: "تحفيظ وتجويد", section: "الحرفيين" },
  { name: "تمريض منزلي", icon: "💉", description: "رعاية وتمريض بالمنزل", section: "الحرفيين" },
  { name: "محاسب", icon: "🧾", description: "محاسبة وضرائب", section: "الحرفيين" },
  { name: "محامي", icon: "⚖️", description: "استشارات وقضايا", section: "الحرفيين" },
  { name: "عقارات", icon: "🏘️", description: "بيع وشراء وإيجار", section: "الحرفيين" },

  // 🩺 الدكاترة
  { name: "طبيب عام", icon: "🩺", description: "كشف عام ومتابعة", section: "الدكاترة" },
  { name: "طبيب أطفال", icon: "👶", description: "أطفال ورضع", section: "الدكاترة" },
  { name: "طبيب باطنة", icon: "🫀", description: "باطنة وأمراض داخلية", section: "الدكاترة" },
  { name: "نساء وتوليد", icon: "🤰", description: "متابعة حمل وتوليد", section: "الدكاترة" },
  { name: "طبيب أسنان", icon: "🦷", description: "أسنان وتجميل", section: "الدكاترة" },
  { name: "طبيب عظام", icon: "🦴", description: "عظام ومفاصل", section: "الدكاترة" },
  { name: "طبيب جلدية", icon: "🧴", description: "جلدية وتجميل", section: "الدكاترة" },

  // 🔬 معامل
  { name: "معمل تحاليل", icon: "🔬", description: "تحاليل طبية وفحوصات", section: "معامل" },
  { name: "معمل أشعة", icon: "🩻", description: "أشعة وسونار", section: "معامل" },

  // 🏪 محلات
  { name: "حلواني وأفران", icon: "🍰", description: "حلويات وجاتوهات", section: "محلات" },
  { name: "خياطة وتفصيل", icon: "🧵", description: "خياطة وتعديل ملابس", section: "محلات" },
  { name: "مفروشات وستائر", icon: "🛋️", description: "ستائر ومراتب ومفروشات", section: "محلات" },
  { name: "كوافير وحلاقة", icon: "💈", description: "حلاقة رجالي وأطفال", section: "محلات" },
  { name: "تجميل سيدات", icon: "💄", description: "كوافير ومكياج سيدات", section: "محلات" },

  // 🏥 مستشفيات
  { name: "مستشفى", icon: "🏥", description: "مستشفيات وخاصة", section: "مستشفيات" },
  { name: "عيادة", icon: "🩺", description: "عيادات طبية", section: "مستشفيات" },
  { name: "صيدلية", icon: "💊", description: "أدوية ومستحضرات", section: "مستشفيات" },

  // 📢 دعاية واعلان
  { name: "دعاية وإعلان", icon: "📢", description: "لافتات وبانرات وأستيكر", section: "دعاية واعلان" },
  { name: "طباعة ومطبوعات", icon: "🖨️", description: "طباعة كروت وفواتير", section: "دعاية واعلان" },
  { name: "تصميم جرافيك", icon: "🖌️", description: "تصميم لوجو وسوشيال ميديا", section: "دعاية واعلان" },
  { name: "تصوير فوتوغرافي", icon: "📸", description: "تصوير أفراح ومناسبات", section: "دعاية واعلان" },
];

/** تحويل الرقم المصري لصيغة واتساب الدولية */
export function whatsappLink(phone: string, name: string) {
  let p = phone.replace(/[\s\-()+]/g, "");
  if (p.startsWith("0")) p = "20" + p.slice(1);
  if (!p.startsWith("20")) p = "20" + p;
  const msg = encodeURIComponent(
    `السلام عليكم ${name}، شفت رقم حضرتك في دليل مهن جنزور وعايز أستفسر عن الخدمة.`
  );
  return `https://wa.me/${p}?text=${msg}`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/[\s\-()]/g, "")}`;
}

/** التحقق من رقم موبايل مصري */
export function isValidEgyptPhone(phone: string) {
  const p = phone.replace(/[\s\-()+]/g, "").replace(/^20/, "0");
  return /^01[0125]\d{8}$/.test(p);
}

export function normalizePhone(phone: string) {
  let p = phone.replace(/[\s\-()+]/g, "");
  if (p.startsWith("20")) p = "0" + p.slice(2);
  return p;
}

/** رابط جوجل مابس للموقع */
export function mapsLink(location: string) {
  const q = encodeURIComponent(`${location}, بركة السبع, المنوفية, مصر`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
