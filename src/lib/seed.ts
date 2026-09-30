import { db } from "@/db";
import { categories, craftsmen, reviews } from "@/db/schema";
import { CATEGORY_DEFS } from "./constants";
import { count, eq, inArray } from "drizzle-orm";

const SEED_CRAFTSMEN = [
  { name: "الأسطى محمد الجمال", profession: "كهربائي منازل", cat: "كهربائي", phone: "01012345678", location: "جنزور - شارع المحطة", rating: 4.8, ratingsCount: 124, verified: true, featured: true, exp: 15, desc: "تأسيس وتشطيب كهرباء الشقق، تركيب نجف وإنارة، إصلاح أعطال ولوحات توزيع. خدمة سريعة داخل جنزور.", emoji: "👷" },
  { name: "سيد عبد العزيز", profession: "سباك صحي", cat: "سباك", phone: "01123456789", location: "جنزور - الجامع الكبير", rating: 4.6, ratingsCount: 89, verified: true, featured: true, exp: 12, desc: "تأسيس حمامات ومطابخ، كشف وإصلاح تسريبات، تركيب سخانات ومواسير بلاستيك.", emoji: "🧑‍🔧" },
  { name: "الحاج رمضان النجار", profession: "نجار موبيليا ومطابخ", cat: "نجار", phone: "01234567890", location: "جنزور - السوق", rating: 4.7, ratingsCount: 76, verified: true, featured: true, exp: 22, desc: "غرف نوم وأطقم صالون ومطابخ خشب وHPL، تفصيل حسب الطلب وتركيب أبواب.", emoji: "👨‍🔧" },
  { name: "أحمد فتحي شلبي", profession: "نقاش ومحارة", cat: "نقاش ودهانات", phone: "01098765432", location: "جنزور - الناحية الشرقية", rating: 4.5, ratingsCount: 63, verified: true, featured: false, exp: 10, desc: "محارة وتجليخ، دهانات بلاستيك وزيت، ورق حائط وديكورات مودرن.", emoji: "🧑‍🎨" },
  { name: "مهندس خالد الشناوي", profession: "مقاول تشطيبات", cat: "بناء ومقاولات", phone: "01155667788", location: "جنزور - شارع المدرسة", rating: 4.9, ratingsCount: 54, verified: true, featured: true, exp: 18, desc: "مقاولات عمومية، بناء وتشطيب مفتاح، إشراف هندسي وحصر كميات.", emoji: "👷" },
  { name: "مصطفى البنا", profession: "فني سيراميك ورخام", cat: "سيراميك وبلاط", phone: "01266778899", location: "جنزور - الناحية الغربية", rating: 4.4, ratingsCount: 47, verified: false, featured: false, exp: 9, desc: "تركيب سيراميك وبورسلين ورخام، أرضيات وحوائط بأدق المقاسات.", emoji: "🧑‍🏭" },
  { name: "وليد سمير", profession: "جبس بورد وديكور", cat: "جبس بورد وديكور", phone: "01011223344", location: "جنزور - الوحدة الصحية", rating: 4.6, ratingsCount: 38, verified: true, featured: false, exp: 8, desc: "أسقف معلقة، بارتشن، ديكورات جبس وإضاءة مخفية.", emoji: "🏛️" },
  { name: "عماد الألوميتال", profession: "فني ألوميتال", cat: "ألوميتال", phone: "01144556677", location: "بركة السبع - المدينة", rating: 4.5, ratingsCount: 52, verified: true, featured: false, exp: 14, desc: "شبابيك وأبواب ألوميتال، قواطيع حمامات، مطابخ ألوميتال وصيانة.", emoji: "🪟" },
  { name: "الأسطى جمعة الحداد", profession: "حداد ولحام", cat: "حداد ولحام", phone: "01222334455", location: "جنزور - الناحية القبلية", rating: 4.3, ratingsCount: 31, verified: false, featured: false, exp: 20, desc: "أبواب ومظلات وسلالم حديد، أشغال لحام متنقلة داخل القرية.", emoji: "👨‍🏭" },
  { name: "محمود عبد الحليم", profession: "فني تكييفات", cat: "تكييف وتبريد", phone: "01033445566", location: "جنزور - شارع المحطة", rating: 4.9, ratingsCount: 148, verified: true, featured: true, exp: 11, desc: "تركيب وفك وغسيل تكييفات، شحن فريون، صيانة جميع الماركات بضمان.", emoji: "❄️" },
  { name: "هاني صيانة", profession: "صيانة غسالات وثلاجات", cat: "صيانة أجهزة منزلية", phone: "01277889900", location: "جنزور - السوق", rating: 4.5, ratingsCount: 82, verified: true, featured: false, exp: 13, desc: "إصلاح غسالات أوتوماتيك وثلاجات وبوتاجازات، قطع غيار أصلية.", emoji: "🔌" },
  { name: "كريم موبايل", profession: "صيانة موبايل", cat: "صيانة موبايل", phone: "01099887766", location: "جنزور - السوق", rating: 4.7, ratingsCount: 110, verified: true, featured: false, exp: 7, desc: "تغيير شاشات وبطاريات، حل مشاكل السوفت وير، فك شفرة وفلاشة.", emoji: "📱" },
  { name: "م. أشرف عبد الله", profession: "فني كمبيوتر وشبكات", cat: "كمبيوتر وشبكات", phone: "01166554433", location: "جنزور - الناحية البحرية", rating: 4.6, ratingsCount: 44, verified: false, featured: false, exp: 10, desc: "صيانة لاب توب، تركيب ويندوز وبرامج، مد شبكات وراوتر.", emoji: "💻" },
  { name: "علاء الدش", profession: "فني دش وستالايت", cat: "دش وستالايت", phone: "01211224466", location: "جنزور - الناحية الشرقية", rating: 4.4, ratingsCount: 57, verified: false, featured: false, exp: 12, desc: "تركيب أطباق وبرمجة رسيفرات، ضبط قنوات وصيانة.", emoji: "📡" },
  { name: "شركة أمان للكاميرات", profession: "تركيب كاميرات مراقبة", cat: "كاميرات مراقبة", phone: "01000112233", location: "بركة السبع - المدينة", rating: 4.8, ratingsCount: 39, verified: true, featured: true, exp: 6, desc: "كاميرات مراقبة داخلية وخارجية، متابعة من الموبايل، أنظمة إنذار.", emoji: "🎥" },
  { name: "الأسطى صبري", profession: "ميكانيكي سيارات", cat: "ميكانيكي سيارات", phone: "01133557799", location: "جنزور - شارع المحطة", rating: 4.5, ratingsCount: 95, verified: true, featured: false, exp: 19, desc: "ميكانيكا عام، كشف بالكمبيوتر، عمرات موتور وفحص قبل الشراء.", emoji: "🔧" },
  { name: "طارق الكهربائي", profession: "كهربائي سيارات", cat: "كهربائي سيارات", phone: "01244668800", location: "جنزور - الناحية الغربية", rating: 4.3, ratingsCount: 36, verified: false, featured: false, exp: 9, desc: "كهرباء سيارات، مارش ودينامو وبطاريات، تركيب شاشات وحساسات.", emoji: "🚗" },
  { name: "ورشة النصر للسمكرة", profession: "سمكرة ودوكو", cat: "سمكرة ودوكو", phone: "01077553311", location: "طوخ دلكة", rating: 4.2, ratingsCount: 28, verified: false, featured: false, exp: 15, desc: "سمكرة وفرد صاج، رش دوكو بالفرن، تجهيز السيارة بالكامل.", emoji: "🎯" },
  { name: "بنشر الإخلاص", profession: "كاوتش وبنشر", cat: "كاوتش وبنشر", phone: "01188990011", location: "جنزور - شارع المحطة", rating: 4.1, ratingsCount: 24, verified: false, featured: false, exp: 8, desc: "بنشر وترصيص وميزان، بيع كاوتش جديد ومستعمل، خدمة 24 ساعة.", emoji: "🛞" },
  { name: "عم رجب النقل", profession: "نقل عفش وونش", cat: "نقل عفش وونش", phone: "01255443322", location: "جنزور - السوق", rating: 4.6, ratingsCount: 61, verified: true, featured: false, exp: 16, desc: "نقل أثاث داخل وخارج المحافظة، ونش رفع للأدوار العالية، فك وتركيب.", emoji: "🚚" },
  { name: "استوديو الجمال للدعاية", profession: "دعاية وإعلان", cat: "دعاية وإعلان", phone: "01222355769", location: "جنزور - الجامع الكبير", rating: 4.9, ratingsCount: 87, verified: true, featured: true, exp: 14, desc: "لافتات ويافطات، بانرات وأستيكر، حروف بارزة وفليكس، تصميم وتنفيذ.", emoji: "📢" },
  { name: "مطبعة النور", profession: "طباعة ومطبوعات", cat: "طباعة ومطبوعات", phone: "01099001122", location: "بركة السبع - المدينة", rating: 4.5, ratingsCount: 42, verified: true, featured: false, exp: 17, desc: "طباعة كروت شخصية وفواتير ودفاتر، أكواب وتيشرتات، تغليف حراري.", emoji: "🖨️" },
  { name: "محمد ديزاين", profession: "مصمم جرافيك", cat: "تصميم جرافيك", phone: "01144332211", location: "جنزور - الناحية الشرقية", rating: 4.7, ratingsCount: 33, verified: false, featured: false, exp: 6, desc: "تصميم لوجو وهوية بصرية، منشورات سوشيال ميديا، مونتاج فيديو.", emoji: "🖌️" },
  { name: "استوديو الأصدقاء", profession: "مصور أفراح ومناسبات", cat: "تصوير فوتوغرافي", phone: "01266554433", location: "جنزور - شارع المدرسة", rating: 4.8, ratingsCount: 71, verified: true, featured: true, exp: 12, desc: "تصوير أفراح وخطوبة وطفولة، فيديو 4K وطباعة ألبومات فاخرة.", emoji: "📸" },
  { name: "أ/ إبراهيم حسن", profession: "محاسب قانوني", cat: "محاسب", phone: "01011335577", location: "بركة السبع - المدينة", rating: 4.6, ratingsCount: 26, verified: true, featured: false, exp: 15, desc: "مسك دفاتر، إقرارات ضريبية وقيمة مضافة، تأسيس شركات.", emoji: "🧾" },
  { name: "مكتب الأستاذ ياسر", profession: "محامي", cat: "محامي", phone: "01277446688", location: "شبين الكوم", rating: 4.7, ratingsCount: 34, verified: true, featured: false, exp: 20, desc: "قضايا مدني وأحوال شخصية وعمالية، توثيق عقود واستشارات.", emoji: "⚖️" },
  { name: "كوافير الفنان", profession: "حلاق رجالي", cat: "كوافير وحلاقة", phone: "01033557799", location: "جنزور - السوق", rating: 4.8, ratingsCount: 156, verified: true, featured: false, exp: 11, desc: "قصات مودرن وكلاسيك، تحضير عرسان، حلاقة أطفال ودقن.", emoji: "💈" },
  { name: "صالون ملكة", profession: "كوافير سيدات", cat: "تجميل سيدات", phone: "01155886644", location: "جنزور - الناحية الغربية", rating: 4.7, ratingsCount: 93, verified: true, featured: false, exp: 9, desc: "مكياج عرايس وسشوار وبروتين، عناية بالبشرة، حجز مسبق.", emoji: "💄" },
  { name: "أم أحمد للخياطة", profession: "خياطة وتفصيل", cat: "خياطة وتفصيل", phone: "01222998877", location: "جنزور - الناحية القبلية", rating: 4.9, ratingsCount: 64, verified: true, featured: false, exp: 25, desc: "تفصيل فساتين وملابس أطفال، تضييق وتعديل، شغل مضمون.", emoji: "🧵" },
  { name: "معرض الهنا للستائر", profession: "ستائر ومفروشات", cat: "مفروشات وستائر", phone: "01099663311", location: "بركة السبع - المدينة", rating: 4.4, ratingsCount: 29, verified: false, featured: false, exp: 10, desc: "ستائر بجميع الأنواع، مراتب ومفروشات، تركيب مجاني.", emoji: "🛋️" },
  { name: "شركة النظافة الشاملة", profession: "نظافة ومكافحة حشرات", cat: "نظافة ومبيدات", phone: "01144778899", location: "جنزور - الوحدة الصحية", rating: 4.5, ratingsCount: 48, verified: true, featured: false, exp: 7, desc: "تنظيف شقق بعد التشطيب، غسيل سجاد وكنب، رش مبيدات آمن.", emoji: "🧹" },
  { name: "شيف سعيد", profession: "طباخ وتموين حفلات", cat: "طباخ وتموين حفلات", phone: "01266887744", location: "جنزور - الجامع الكبير", rating: 4.8, ratingsCount: 102, verified: true, featured: true, exp: 18, desc: "طبخ أفراح وعزومات، بوفيه مفتوح، حمام محشي وفتة ومشويات.", emoji: "🍲" },
  { name: "حلواني الشرق", profession: "حلواني وجاتوه", cat: "حلواني وأفران", phone: "01011447788", location: "جنزور - السوق", rating: 4.6, ratingsCount: 88, verified: false, featured: false, exp: 13, desc: "تورتات أعياد ميلاد، بيتيفور وكحك المواسم، حلويات شرقية.", emoji: "🍰" },
  { name: "أ/ هدى عبد الرحمن", profession: "مدرسة لغة إنجليزية", cat: "مدرس خصوصي", phone: "01155334422", location: "جنزور - شارع المدرسة", rating: 4.9, ratingsCount: 118, verified: true, featured: true, exp: 14, desc: "دروس إنجليزي لجميع المراحل، مجموعات صغيرة وأونلاين.", emoji: "📚" },
  { name: "أ/ عبد الرحمن القارئ", profession: "محفظ قرآن كريم", cat: "تحفيظ قرآن", phone: "01222446688", location: "جنزور - الجامع الكبير", rating: 5.0, ratingsCount: 67, verified: true, featured: false, exp: 16, desc: "تحفيظ وتجويد للأطفال والكبار، حضوري وأونلاين، إجازة بالسند.", emoji: "🕌" },
  { name: "ممرض/ عادل شعبان", profession: "تمريض منزلي", cat: "تمريض منزلي", phone: "01099224466", location: "جنزور - الوحدة الصحية", rating: 4.7, ratingsCount: 45, verified: true, featured: false, exp: 12, desc: "حقن ومحاليل وتركيب قسطرة، رعاية كبار السن، متابعة السكر والضغط.", emoji: "💉" },
  { name: "د/ ماهر البيطري", profession: "طبيب بيطري", cat: "طبيب بيطري", phone: "01133446677", location: "جنزور - الناحية البحرية", rating: 4.8, ratingsCount: 52, verified: true, featured: false, exp: 17, desc: "علاج ماشية ودواجن، تحصينات وولادات، زيارات منزلية للعزب.", emoji: "🐄" },
  { name: "عم فتحي الجرار", profession: "معدات زراعية وحرث", cat: "معدات زراعية", phone: "01244557766", location: "جنزور - عزبة الجمال", rating: 4.4, ratingsCount: 30, verified: false, featured: false, exp: 24, desc: "جرار للحرث والتسوية، حصادة ونقل محاصيل، أسعار الموسم.", emoji: "🚜" },
  { name: "معمل الدلتا للتحاليل", profession: "معمل تحاليل طبية", cat: "معمل تحاليل", phone: "01022334411", location: "جنزور - السوق", rating: 4.6, ratingsCount: 78, verified: true, featured: false, exp: 10, desc: "تحاليل طبية شاملة، تحاليل أطفال ورضع، نتيجة خلال 24 ساعة، سحب عينات من المنزل.", emoji: "🔬" },
  { name: "معمل المعايير", profession: "معمل تحاليل وقياس", cat: "معمل تحاليل", phone: "01133552200", location: "بركة السبع - المدينة", rating: 4.4, ratingsCount: 41, verified: false, featured: false, exp: 7, desc: "تحاليل دم وبكتيريا، كشف سكر وضغط دوري، اشتراكات عائلات بأسعار مخفضة.", emoji: "🧪" },
  { name: "د/ محمد الشناوي", profession: "طبيب أطفال", cat: "طبيب أطفال", phone: "01266114477", location: "جنزور - الجامع الكبير", rating: 4.9, ratingsCount: 112, verified: true, featured: true, exp: 16, desc: "استشاري أطفال، تطعيمات ومتابعة نمو، مواعيد مسائية وحجز مسبق.", emoji: "🩺" },
  { name: "د/ هالة إبراهيم", profession: "طبيبة أسنان", cat: "طبيب أسنان", phone: "01099114422", location: "جنزور - الناحية الغربية", rating: 4.8, ratingsCount: 86, verified: true, featured: false, exp: 12, desc: "حشوات وتيجان وتبييض، تقويم أسنان أطفال، تركيبات زيركون بأحدث الأجهزة.", emoji: "🦷" },
  { name: "د/ سامي فتحي", profession: "طبيب عام", cat: "طبيب عام", phone: "01155224488", location: "جنزور - الوحدة الصحية", rating: 4.7, ratingsCount: 59, verified: true, featured: false, exp: 18, desc: "كشف عام وإحالة للتخصصات، متابعة ضغط وسكر، زيارات منزلية للمرضى.", emoji: "👨‍⚕️" },
];

let seedSyncDone = false;

export async function ensureSeeded() {
  if (seedSyncDone) return true;
  try {
    // مزامنة التصنيفات: إضافة أي تصنيف جديد ناسي
    const existingCats = await db.select().from(categories);
    const haveCats = new Set(existingCats.map((c) => c.name));
    const missingCats = CATEGORY_DEFS.filter((d) => !haveCats.has(d.name));
    if (missingCats.length > 0) {
      await db
        .insert(categories)
        .values(
          missingCats.map((c) => ({
            name: c.name,
            icon: c.icon,
            description: c.description,
            section: c.section,
          }))
        );
    }
    // توزيع التصنيفات الموجودة على الأقسام الرئيسية
    for (const d of CATEGORY_DEFS) {
      await db
        .update(categories)
        .set({ section: d.section })
        .where(eq(categories.name, d.name));
    }
    // هجرة: نقل المهنيين الطبيين من التصنيفين القديمين للحديثين
    const oldCats = await db
      .select()
      .from(categories)
      .where(inArray(categories.name, ["الدكاترة", "معامل التحليل"]));
    if (oldCats.length > 0) {
      const nameToCat: Record<string, string> = {
        "د/ محمد الشناوي": "طبيب أطفال",
        "د/ هالة إبراهيم": "طبيب أسنان",
        "د/ سامي فتحي": "طبيب عام",
        "معمل الدلتا للتحاليل": "معمل تحاليل",
        "معمل المعايير": "معمل تحاليل",
      };
      const med = await db
        .select()
        .from(craftsmen)
        .where(inArray(craftsmen.categoryId, oldCats.map((c) => c.id)));
      for (const m of med) {
        const target = nameToCat[m.name];
        if (target) {
          const [tc] = await db
            .select()
            .from(categories)
            .where(eq(categories.name, target));
          if (tc) {
            await db
              .update(craftsmen)
              .set({ categoryId: tc.id })
              .where(eq(craftsmen.id, m.id));
          }
        }
      }
      await db
        .delete(categories)
        .where(inArray(categories.name, ["الدكاترة", "معامل التحليل"]));
    }
    const allCats = await db.select().from(categories);
    const catMap = new Map(allCats.map((c) => [c.name, c.id]));

    const [{ value: craftCount }] = await db
      .select({ value: count() })
      .from(craftsmen);
    if (craftCount === 0) {
      await db.insert(craftsmen).values(
        SEED_CRAFTSMEN.map((s) => ({
          name: s.name,
          profession: s.profession,
          categoryId: catMap.get(s.cat) ?? null,
          phone: s.phone,
          whatsapp: s.phone,
          location: s.location,
          description: s.desc,
          experienceYears: s.exp,
          rating: s.rating,
          ratingsCount: s.ratingsCount,
          views: Math.floor(Math.random() * 400) + 40,
          verified: s.verified,
          available: true,
          featured: s.featured,
          avatarEmoji: s.emoji,
        }))
      );

      const created = await db.select().from(craftsmen).limit(5);
      const sample = [
        { n: "أبو يوسف", r: 5, c: "شغل ممتاز والتزام بالمواعيد، ربنا يبارك." },
        { n: "محمود سعد", r: 5, c: "سعر مناسب وشغل نضيف جدًا، أنصح بيه." },
        { n: "أم كريم", r: 4, c: "خدمة كويسة بس اتأخر شوية، لكن النتيجة حلوة." },
      ];
      for (const c of created) {
        for (const rv of sample.slice(0, 2)) {
          await db.insert(reviews).values({
            craftsmanId: c.id,
            reviewerName: rv.n,
            rating: rv.r,
            comment: rv.c,
          });
        }
      }
    } else {
      // إضافة أي مهني تاني في بيانات الزرع مش موجود لسه
      const existingNames = new Set(
        (
          await db
            .select({ name: craftsmen.name })
            .from(craftsmen)
        ).map((r) => r.name)
      );
      const toAdd = SEED_CRAFTSMEN.filter((s) => !existingNames.has(s.name));
      if (toAdd.length > 0) {
        await db.insert(craftsmen).values(
          toAdd.map((s) => ({
            name: s.name,
            profession: s.profession,
            categoryId: catMap.get(s.cat) ?? null,
            phone: s.phone,
            whatsapp: s.phone,
            location: s.location,
            description: s.desc,
            experienceYears: s.exp,
            rating: s.rating,
            ratingsCount: s.ratingsCount,
            views: Math.floor(Math.random() * 300) + 20,
            verified: s.verified,
            available: true,
            featured: s.featured,
            avatarEmoji: s.emoji,
          }))
        );
      }
    }
    seedSyncDone = true;
    return true;
  } catch (e) {
    console.error("seed error", e);
    return false;
  }
}
