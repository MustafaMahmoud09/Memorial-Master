/**
 * Islamic content library — Quran verses, Hadiths, Duas, Reminders, Dhikr
 * All content is categorized and authenticated from classical sources.
 * Daily rotation: index = (dayOfYear % array.length)
 */

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface QuranVerse {
  text: string;
  translation: string;
  surah: string;
  ayah: string;
  category?: string;
}

export interface Hadith {
  text: string;
  translation: string;
  source?: string;
}

export interface DuaItem {
  text: string;
  translation?: string;
  source?: string;
  category: string;
}

export interface DhikrItem {
  key: string;
  ar: string;
  en: string;
  transliteration?: string;
  virtue?: string;
  reference?: string;
  category: string;
}

/* ── Quran Verses ───────────────────────────────────────────────────────── */

export const QURAN_VERSES: QuranVerse[] = [
  // Mercy (الرحمة)
  { text: "إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", translation: "Indeed, Allah is Forgiving and Merciful.", surah: "البقرة", ayah: "173", category: "الرحمة" },
  { text: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ", translation: "My mercy encompasses all things.", surah: "الأعراف", ayah: "156", category: "الرحمة" },
  { text: "وَهُوَ الْغَفُورُ الرَّحِيمُ", translation: "And He is the Forgiving, the Merciful.", surah: "يونس", ayah: "107", category: "الرحمة" },
  { text: "إِنَّ رَبَّكَ وَاسِعُ الْمَغْفِرَةِ", translation: "Indeed, your Lord is vast in forgiveness.", surah: "النجم", ayah: "32", category: "الرحمة" },
  { text: "نَبِّئْ عِبَادِي أَنِّي أَنَا الْغَفُورُ الرَّحِيمُ", translation: "Inform My servants that it is I who am the Forgiving, the Merciful.", surah: "الحجر", ayah: "49", category: "الرحمة" },
  { text: "يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَّصُوحًا", translation: "O you who have believed, repent to Allah with sincere repentance.", surah: "التحريم", ayah: "8", category: "الرحمة" },

  // Patience (الصبر)
  { text: "وَبَشِّرِ الصَّابِرِينَ", translation: "And give good tidings to the patient.", surah: "البقرة", ayah: "155", category: "الصبر" },
  { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", translation: "Indeed, Allah is with the patient.", surah: "البقرة", ayah: "153", category: "الصبر" },
  { text: "فَاصْبِرْ صَبْرًا جَمِيلًا", translation: "So be patient with gracious patience.", surah: "المعارج", ayah: "5", category: "الصبر" },
  { text: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ", translation: "Indeed, the patient will be given their reward without account.", surah: "الزمر", ayah: "10", category: "الصبر" },
  { text: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ", translation: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits — but give good tidings to the patient.", surah: "البقرة", ayah: "155", category: "الصبر" },
  { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا * إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.", surah: "الشرح", ayah: "5-6", category: "الصبر" },

  // Forgiveness (المغفرة)
  { text: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", translation: "Say: O My servants who have transgressed against themselves — do not despair of the mercy of Allah. Indeed, Allah forgives all sins.", surah: "الزمر", ayah: "53", category: "المغفرة" },
  { text: "وَمَن يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَّحِيمًا", translation: "And whoever does a wrong or wrongs himself, then seeks forgiveness of Allah, will find Allah Forgiving and Merciful.", surah: "النساء", ayah: "110", category: "المغفرة" },
  { text: "وَاسْتَغْفِرُوا اللَّهَ ۖ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", translation: "And seek forgiveness of Allah. Indeed, Allah is Forgiving and Merciful.", surah: "المزمل", ayah: "20", category: "المغفرة" },
  { text: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", translation: "Our Lord, forgive us our sins and the excess [committed] in our affairs and plant firmly our feet and give us victory over the disbelieving people.", surah: "آل عمران", ayah: "147", category: "المغفرة" },

  // Hope (الرجاء)
  { text: "أَلَا إِنَّ نَصْرَ اللَّهِ قَرِيبٌ", translation: "Unquestionably, the help of Allah is near.", surah: "البقرة", ayah: "214", category: "الرجاء" },
  { text: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", translation: "Do not despair of the mercy of Allah.", surah: "الزمر", ayah: "53", category: "الرجاء" },
  { text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", translation: "And whoever relies upon Allah — then He is sufficient for him.", surah: "الطلاق", ayah: "3", category: "الرجاء" },
  { text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا * وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", translation: "Whoever fears Allah — He will make for him a way out and will provide for him from where he does not expect.", surah: "الطلاق", ayah: "2-3", category: "الرجاء" },
  { text: "إِنَّهُ كَانَ بِعِبَادِهِ خَبِيرًا بَصِيرًا", translation: "Indeed, He is Acquainted and Seeing of His servants.", surah: "الإسراء", ayah: "96", category: "الرجاء" },

  // Paradise (الجنة)
  { text: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ * ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً * فَادْخُلِي فِي عِبَادِي * وَادْخُلِي جَنَّتِي", translation: "O reassured soul, return to your Lord, well-pleased and pleasing [to Him], and enter among My servants and enter My Paradise.", surah: "الفجر", ayah: "27-30", category: "الجنة" },
  { text: "وَبَشِّرِ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أَنَّ لَهُمْ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ", translation: "Give good tidings to those who believe and do righteous deeds that they will have gardens beneath which rivers flow.", surah: "البقرة", ayah: "25", category: "الجنة" },
  { text: "سَلَامٌ عَلَيْكُم بِمَا صَبَرْتُمْ ۚ فَنِعْمَ عُقْبَى الدَّارِ", translation: "Peace be upon you for what you patiently endured. And excellent is the final home.", surah: "الرعد", ayah: "24", category: "الجنة" },
  { text: "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ نُزُلًا", translation: "Indeed, those who have believed and done righteous deeds — they will have the Gardens of Paradise as a lodging.", surah: "الكهف", ayah: "107", category: "الجنة" },
  { text: "فَلَا تَعْلَمُ نَفْسٌ مَّا أُخْفِيَ لَهُم مِّن قُرَّةِ أَعْيُنٍ جَزَاءً بِمَا كَانُوا يَعْمَلُونَ", translation: "No soul knows what has been hidden for them of comfort for eyes as reward for what they used to do.", surah: "السجدة", ayah: "17", category: "الجنة" },

  // Death (الموت)
  { text: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", translation: "Indeed we belong to Allah, and indeed to Him we will return.", surah: "البقرة", ayah: "156", category: "الموت" },
  { text: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ الْقِيَامَةِ", translation: "Every soul will taste death, and you will only be given your [full] compensation on the Day of Resurrection.", surah: "آل عمران", ayah: "185", category: "الموت" },
  { text: "يَوْمَ لَا يَنفَعُ مَالٌ وَلَا بَنُونَ * إِلَّا مَنْ أَتَى اللَّهَ بِقَلْبٍ سَلِيمٍ", translation: "The Day when there will not benefit [anyone] wealth or children, but only one who comes to Allah with a sound heart.", surah: "الشعراء", ayah: "88-89", category: "الموت" },
  { text: "تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينَ", translation: "Cause me to die a Muslim and join me with the righteous.", surah: "يوسف", ayah: "101", category: "الموت" },
  { text: "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ أَمْوَاتًا ۚ بَلْ أَحْيَاءٌ عِندَ رَبِّهِمْ يُرْزَقُونَ", translation: "And never think of those who have been killed in the cause of Allah as dead. Rather, they are alive with their Lord, receiving provision.", surah: "آل عمران", ayah: "169", category: "الموت" },

  // Faith (الإيمان)
  { text: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ", translation: "The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers.", surah: "البقرة", ayah: "285", category: "الإيمان" },
  { text: "إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ", translation: "The believers are only those who, when Allah is mentioned, their hearts become fearful.", surah: "الأنفال", ayah: "2", category: "الإيمان" },
  { text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Unquestionably, by the remembrance of Allah hearts are assured.", surah: "الرعد", ayah: "28", category: "الإيمان" },

  // Remembrance (الذكر)
  { text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.", surah: "البقرة", ayah: "152", category: "الذكر" },
  { text: "وَاذْكُر رَّبَّكَ كَثِيرًا وَسَبِّحْ بِالْعَشِيِّ وَالْإِبْكَارِ", translation: "And remember your Lord much and exalt [Him with praise] in the evening and the morning.", surah: "آل عمران", ayah: "41", category: "الذكر" },
  { text: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا", translation: "Indeed, Allah confers blessing upon the Prophet, and His angels [ask Him to do so]. O you who have believed, ask Allah to confer blessing upon him.", surah: "الأحزاب", ayah: "56", category: "الذكر" },
  { text: "وَاذْكُرِ اسْمَ رَبِّكَ وَتَبَتَّلْ إِلَيْهِ تَبْتِيلًا", translation: "And remember the name of your Lord and devote yourself to Him with [complete] devotion.", surah: "المزمل", ayah: "8", category: "الذكر" },

  // Gratitude (الشكر)
  { text: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", translation: "If you are grateful, I will surely increase you [in favor].", surah: "إبراهيم", ayah: "7", category: "الشكر" },
  { text: "وَقَلِيلٌ مِّنْ عِبَادِيَ الشَّكُورُ", translation: "And few of My servants are grateful.", surah: "سبأ", ayah: "13", category: "الشكر" },
  { text: "فَاذْكُرُوا آلَاءَ اللَّهِ لَعَلَّكُمْ تُفْلِحُونَ", translation: "So remember the favors of Allah that you might succeed.", surah: "الأعراف", ayah: "69", category: "الشكر" },

  // Parents (الوالدان)
  { text: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا", translation: "And your Lord has decreed that you not worship except Him, and to parents, good treatment.", surah: "الإسراء", ayah: "23", category: "الوالدان" },
  { text: "وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", translation: "And say: My Lord, have mercy upon them as they brought me up [when I was] small.", surah: "الإسراء", ayah: "24", category: "الوالدان" },
  { text: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ", translation: "My Lord, forgive me and my parents and whoever enters my house a believer and the believing men and believing women.", surah: "نوح", ayah: "28", category: "الوالدان" },

  // Good Deeds (الأعمال الصالحة)
  { text: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ", translation: "So whoever does an atom's weight of good will see it.", surah: "الزلزلة", ayah: "7", category: "الأعمال الصالحة" },
  { text: "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ إِنَّا لَا نُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا", translation: "Indeed, those who have believed and done righteous deeds — indeed, We will not allow to be lost the reward of any who did well in deeds.", surah: "الكهف", ayah: "30", category: "الأعمال الصالحة" },
  { text: "مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً", translation: "Whoever does righteousness, whether male or female, while he is a believer — We will surely cause him to live a good life.", surah: "النحل", ayah: "97", category: "الأعمال الصالحة" },

  // Repentance (التوبة)
  { text: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ", translation: "Indeed, Allah loves those who are constantly repentant and loves those who purify themselves.", surah: "البقرة", ayah: "222", category: "التوبة" },
  { text: "وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ", translation: "And turn to Allah in repentance, all of you, O believers, that you might succeed.", surah: "النور", ayah: "31", category: "التوبة" },

  // Supplication (الدعاء)
  { text: "ادْعُونِي أَسْتَجِبْ لَكُمْ", translation: "Call upon Me; I will respond to you.", surah: "غافر", ayah: "60", category: "الدعاء" },
  { text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ", translation: "And when My servants ask you about Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.", surah: "البقرة", ayah: "186", category: "الدعاء" },
  { text: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", translation: "And seek help through patience and prayer.", surah: "البقرة", ayah: "45", category: "الدعاء" },
];

/* ── Hadiths ────────────────────────────────────────────────────────────── */

export const AHADITH: Hadith[] = [
  { text: "إذا مات ابن آدم انقطع عمله إلا من ثلاث: صدقة جارية، أو علم ينتفع به، أو ولد صالح يدعو له.", translation: "When a human being dies, all his deeds end except three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.", source: "صحيح مسلم" },
  { text: "ما من مسلم يموت يوم الجمعة أو ليلة الجمعة إلا وقاه الله فتنة القبر.", translation: "No Muslim dies on Friday or the night of Friday except that Allah protects him from the trial of the grave.", source: "سنن الترمذي" },
  { text: "إن الله ليرفع الدرجة للعبد الصالح في الجنة، فيقول: يا رب أنى لي هذه؟ فيقول: باستغفار ولدك لك.", translation: "Allah elevates the rank of a righteous servant in Paradise, who asks: 'O Lord, how did I attain this?' He replies: 'Through your child's seeking forgiveness for you.'", source: "مسند أحمد" },
  { text: "الدعاء ينفع مما نزل ومما لم ينزل، فعليكم عباد الله بالدعاء.", translation: "Supplication benefits against what has occurred and what has not occurred, so O servants of Allah, you must supplicate.", source: "سنن الترمذي" },
  { text: "من دَلَّ على خيرٍ فله مثلُ أجرِ فاعله.", translation: "Whoever guides to something good has a reward similar to that of its doer.", source: "صحيح مسلم" },
  { text: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم.", translation: "Two words are light on the tongue, heavy on the Scale, and beloved to the Most Merciful: 'Subhan Allah wa bihamdihi, Subhan Allah al-Azeem.'", source: "متفق عليه" },
  { text: "إن الميت ليعرف من يحمله ومن يغسله ومن يدليه في قبره.", translation: "The deceased recognizes who carries him, who washes him, and who lowers him into his grave.", source: "المعجم الكبير للطبراني" },
  { text: "استغفروا لأخيكم وسلوا له التثبيت فإنه الآن يسأل.", translation: "Seek forgiveness for your brother and ask for his steadfastness, for he is being questioned now.", source: "سنن أبي داود" },
  { text: "ما من عبد مسلم يدعو لأخيه بظهر الغيب، إلا قال الملك: ولك بمثل.", translation: "No Muslim servant supplicates for his brother in his absence except that an angel says: 'And for you the same.'", source: "صحيح مسلم" },
  { text: "إن أثقل شيء يوضع في ميزان المؤمن يوم القيامة حسن الخلق.", translation: "The heaviest thing placed in the believer's scale on the Day of Resurrection will be good character.", source: "سنن الترمذي" },
  { text: "من صلى علي صلاة صلى الله عليه بها عشراً.", translation: "Whoever sends blessings upon me once, Allah sends blessings upon him ten times.", source: "صحيح مسلم" },
  { text: "أقرب ما يكون العبد من ربه وهو ساجد فأكثروا الدعاء.", translation: "The closest a servant comes to his Lord is when he is prostrating, so make much supplication.", source: "صحيح مسلم" },
  { text: "لا يزال لسانك رطباً من ذكر الله.", translation: "Keep your tongue moist with the remembrance of Allah.", source: "سنن الترمذي" },
  { text: "أفضل الذكر لا إله إلا الله، وأفضل الدعاء الحمد لله.", translation: "The best remembrance is 'La ilaha illallah', and the best supplication is 'Alhamdulillah'.", source: "سنن الترمذي" },
  { text: "من قال: سبحان الله العظيم وبحمده، غرست له نخلة في الجنة.", translation: "Whoever says 'Subhan Allah al-Azeem wa bihamdihi', a date-palm tree is planted for him in Paradise.", source: "سنن الترمذي" },
  { text: "الصدقة تطفئ الخطيئة كما يطفئ الماء النار.", translation: "Charity extinguishes sin as water extinguishes fire.", source: "سنن الترمذي" },
  { text: "صنائع المعروف تقي مصارع السوء.", translation: "Good deeds protect against a bad end.", source: "المستدرك للحاكم" },
  { text: "من لزم الاستغفار جعل الله له من كل هم فرجاً، ومن كل ضيق مخرجاً، ورزقه من حيث لا يحتسب.", translation: "Whoever persists in seeking forgiveness, Allah will grant him a way out from every worry, relief from every hardship, and provision from where he does not expect.", source: "سنن أبي داود" },
  { text: "تبسمك في وجه أخيك لك صدقة.", translation: "Your smiling in the face of your brother is charity.", source: "سنن الترمذي" },
  { text: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.", translation: "Deeds are but by intentions, and each person will have but what they intended.", source: "متفق عليه" },
  { text: "المؤمن للمؤمن كالبنيان يشد بعضه بعضاً.", translation: "The believer to the believer is like a building, each part strengthening the other.", source: "متفق عليه" },
  { text: "الراحمون يرحمهم الرحمن، ارحموا من في الأرض يرحمكم من في السماء.", translation: "The merciful are shown mercy by the Most Merciful. Show mercy to those on earth, the One in the heavens will show mercy to you.", source: "سنن الترمذي" },
  { text: "أحب الأعمال إلى الله أدومها وإن قل.", translation: "The most beloved deeds to Allah are those that are most consistent, even if they are few.", source: "متفق عليه" },
  { text: "يقول الله تعالى: أنا عند ظن عبدي بي، وأنا معه إذا ذكرني.", translation: "Allah says: 'I am as My servant thinks of Me, and I am with him when he remembers Me.'", source: "متفق عليه" },
  { text: "البر حسن الخلق، والإثم ما حاك في نفسك وكرهت أن يطلع عليه الناس.", translation: "Righteousness is good character, and sin is whatever gnaws at your soul that you dislike others to know.", source: "صحيح مسلم" },
  { text: "من سلك طريقاً يلتمس فيه علماً سهّل الله له به طريقاً إلى الجنة.", translation: "Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise.", source: "صحيح مسلم" },
  { text: "إن الله كتب الإحسان على كل شيء.", translation: "Indeed, Allah has prescribed excellence in all things.", source: "صحيح مسلم" },
  { text: "خيركم من تعلم القرآن وعلّمه.", translation: "The best of you are those who learn the Quran and teach it.", source: "صحيح البخاري" },
  { text: "من قرأ حرفاً من كتاب الله فله به حسنة، والحسنة بعشر أمثالها.", translation: "Whoever recites a letter from the Book of Allah will have one good deed, and one good deed is multiplied by ten.", source: "سنن الترمذي" },
  { text: "اللهم إني أسألك حسن الخاتمة.", translation: "O Allah, I ask You for a good ending.", source: "المعجم الكبير للطبراني" },
];

/* ── Categorized Duas ───────────────────────────────────────────────────── */

export const DUAS_CATEGORIZED: DuaItem[] = [
  // Morning (أذكار الصباح)
  { text: "اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور.", translation: "O Allah, by You we enter the morning, by You we enter the evening, by You we live, and by You we die, and to You is the resurrection.", category: "الصباح", source: "سنن الترمذي" },
  { text: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.", translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is due to Allah. None has the right to be worshipped but Allah, alone without any partner.", category: "الصباح", source: "صحيح مسلم" },
  { text: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي وأبوء بذنبي فاغفر لي فإنه لا يغفر الذنوب إلا أنت.", translation: "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant...", category: "الصباح", source: "صحيح البخاري" },
  { text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت.", translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. None has the right to be worshipped except You.", category: "الصباح", source: "سنن أبي داود" },
  { text: "اللهم إني أسألك علماً نافعاً ورزقاً طيباً وعملاً متقبلاً.", translation: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.", category: "الصباح", source: "سنن ابن ماجه" },
  { text: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم.", translation: "In the name of Allah, with whose name nothing in the earth or sky can cause harm, and He is the All-Hearing, All-Knowing.", category: "الصباح", source: "سنن أبي داود" },

  // Evening (أذكار المساء)
  { text: "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير.", translation: "O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the final return.", category: "المساء", source: "سنن الترمذي" },
  { text: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.", translation: "We have reached the evening and at this very time all sovereignty belongs to Allah.", category: "المساء", source: "صحيح مسلم" },
  { text: "اللهم إني أسألك العفو والعافية في الدنيا والآخرة.", translation: "O Allah, I ask You for pardon and well-being in this world and the Hereafter.", category: "المساء", source: "سنن ابن ماجه" },
  { text: "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والبخل والجبن، وضلع الدين وغلبة الرجال.", translation: "O Allah, I seek refuge in You from worry and grief, weakness and laziness, miserliness and cowardice, the burden of debt and the overpowering of men.", category: "المساء", source: "صحيح البخاري" },

  // Sleep (النوم)
  { text: "باسمك ربي وضعت جنبي، وبك أرفعه، فإن أمسكت نفسي فارحمها، وإن أرسلتها فاحفظها بما تحفظ به عبادك الصالحين.", translation: "In Your name, my Lord, I lay down my side, and with You I raise it. If You take my soul, have mercy on it, and if You release it, protect it as You protect Your righteous servants.", category: "النوم", source: "متفق عليه" },
  { text: "اللهم قني عذابك يوم تبعث عبادك.", translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.", category: "النوم", source: "سنن أبي داود" },
  { text: "اللهم أسلمت نفسي إليك، وفوضت أمري إليك، وألجأت ظهري إليك، رغبة ورهبة إليك، لا ملجأ ولا منجا منك إلا إليك.", translation: "O Allah, I submit myself to You, entrust my affairs to You, and turn my back to You in hope and fear of You. There is no refuge and no safety from You except with You.", category: "النوم", source: "متفق عليه" },

  // Waking Up (الاستيقاظ)
  { text: "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور.", translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.", category: "الاستيقاظ", source: "صحيح البخاري" },
  { text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، سبحان الله والحمد لله ولا إله إلا الله والله أكبر.", translation: "None has the right to be worshipped except Allah, alone, without any partner. To Him belongs the sovereignty and all praise.", category: "الاستيقاظ", source: "سنن الترمذي" },

  // Travel (السفر)
  { text: "اللهم إنا نسألك في سفرنا هذا البر والتقوى، ومن العمل ما ترضى.", translation: "O Allah, we ask You in this journey for righteousness and piety, and deeds that please You.", category: "السفر", source: "صحيح مسلم" },
  { text: "سبحان الذي سخّر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون.", translation: "Glory be to the One who has subjected this for us, and we would not have been capable of it, and indeed to our Lord we will return.", category: "السفر", source: "سنن الترمذي" },
  { text: "اللهم أنت الصاحب في السفر والخليفة في الأهل.", translation: "O Allah, You are the Companion in travel and the Successor over the family.", category: "السفر", source: "صحيح مسلم" },

  // Mosque (المسجد)
  { text: "أعوذ بالله العظيم وبوجهه الكريم وسلطانه القديم من الشيطان الرجيم.", translation: "I seek refuge in Allah the Magnificent, and in His noble Face, and in His eternal authority, from the accursed Satan.", category: "المسجد", source: "سنن أبي داود" },
  { text: "اللهم افتح لي أبواب رحمتك.", translation: "O Allah, open for me the gates of Your mercy.", category: "المسجد", source: "صحيح مسلم" },
  { text: "اللهم إني أسألك من فضلك.", translation: "O Allah, I ask You of Your bounty.", category: "المسجد", source: "سنن ابن ماجه" },

  // Food (الطعام)
  { text: "بسم الله.", translation: "In the name of Allah.", category: "الطعام", source: "سنن أبي داود" },
  { text: "اللهم بارك لنا فيه وأطعمنا خيراً منه.", translation: "O Allah, bless it for us and feed us better than it.", category: "الطعام", source: "سنن الترمذي" },
  { text: "الحمد لله الذي أطعمنا وسقانا وجعلنا مسلمين.", translation: "All praise is for Allah who fed us, gave us drink, and made us Muslims.", category: "الطعام", source: "سنن أبي داود" },

  // Parents (الوالدان)
  { text: "رب اغفر لي ولوالديّ وارحمهما كما ربياني صغيراً.", translation: "My Lord, forgive me and my parents and have mercy on them as they raised me when I was small.", category: "الوالدان", source: "القرآن الكريم - الإسراء 24" },
  { text: "اللهم اغفر لي ولوالديّ وللمؤمنين يوم يقوم الحساب.", translation: "O Allah, forgive me, my parents, and the believers on the Day of Reckoning.", category: "الوالدان", source: "القرآن الكريم - إبراهيم 41" },

  // Forgiveness (الاستغفار)
  { text: "أستغفر الله الذي لا إله إلا هو الحي القيوم وأتوب إليه.", translation: "I seek forgiveness from Allah, besides whom none is worthy of worship, the Ever-Living, the Sustainer, and I repent to Him.", category: "الاستغفار", source: "سنن أبي داود" },
  { text: "اللهم إنك عفو كريم تحب العفو فاعف عني.", translation: "O Allah, You are Pardoning and Generous, You love to pardon, so pardon me.", category: "الاستغفار", source: "سنن الترمذي" },
  { text: "رَّبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ.", translation: "My Lord, forgive and have mercy, for You are the best of the merciful.", category: "الاستغفار", source: "القرآن الكريم - المؤمنون 118" },

  // Mercy (الرحمة)
  { text: "اللهم إني أسألك رحمة من عندك تهدي بها قلبي وتجمع بها أمري وتصلح بها غائبي.", translation: "O Allah, I ask You for a mercy from You that will guide my heart, consolidate my affairs, and rectify my absent ones.", category: "الرحمة", source: "مسند أحمد" },
  { text: "ربنا وسعت كل شيء رحمة وعلماً فاغفر للذين تابوا واتبعوا سبيلك وقهم عذاب الجحيم.", translation: "Our Lord, You encompass all things in mercy and knowledge, so forgive those who have repented and followed Your way and protect them from the punishment of Hellfire.", category: "الرحمة", source: "القرآن الكريم - غافر 7" },

  // Relief from Anxiety (فرج الكرب)
  { text: "لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم، لا إله إلا الله رب السماوات ورب الأرض ورب العرش الكريم.", translation: "None has the right to be worshipped except Allah, the Mighty, the Forbearing. None has the right to be worshipped except Allah, Lord of the Magnificent Throne...", category: "فرج الكرب", source: "متفق عليه" },
  { text: "اللهم رحمتك أرجو فلا تكلني إلى نفسي طرفة عين وأصلح لي شأني كله لا إله إلا أنت.", translation: "O Allah, it is Your mercy that I hope for; do not leave me in charge of my affairs even for the blink of an eye, and rectify all my affairs. None has the right to be worshipped except You.", category: "فرج الكرب", source: "سنن أبي داود" },
  { text: "اللهم إني عبدك ابن عبدك ابن أمتك ناصيتي بيدك، ماضٍ في حكمك، عدل في قضاؤك أسألك بكل اسم هو لك سميت به نفسك.", translation: "O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand, Your command over me is forever executed, Your decree over me is just...", category: "فرج الكرب", source: "مسند أحمد" },

  // Provision (الرزق)
  { text: "اللهم اكفني بحلالك عن حرامك، وأغنني بفضلك عمن سواك.", translation: "O Allah, suffice me with what You have made lawful so I have no need of what You have made unlawful, and enrich me with Your bounty so I have no need of anyone other than You.", category: "الرزق", source: "سنن الترمذي" },
  { text: "اللهم ارزقني رزقاً حلالاً طيباً.", translation: "O Allah, provide me with lawful and good sustenance.", category: "الرزق" },

  // Death and Mercy (الميت)
  { text: "اللهم اغفر له وارحمه، وعافه واعفُ عنه، وأكرم نُزُله، ووسِّع مُدخله، واجعل هذا العمل صدقةً جاريةً له.", translation: "O Allah, forgive him and have mercy on him, grant him well-being and pardon him, honor his reception and widen his entrance.", category: "الميت" },
  { text: "اللهم أكرم نزله ووسع مدخله، واغسله بالماء والثلج والبرد.", translation: "O Allah, honor his reception and widen his entrance, and cleanse him with water, snow and hail.", category: "الميت", source: "صحيح مسلم" },
  { text: "اللهم نقه من الذنوب والخطايا كما ينقى الثوب الأبيض من الدنس.", translation: "O Allah, purify him from sins and faults as a white garment is purified from filth.", category: "الميت", source: "متفق عليه" },
  { text: "اللهم أبدله داراً خيراً من داره، وأهلاً خيراً من أهله.", translation: "O Allah, replace for him his home with a better home, and his family with a better family.", category: "الميت", source: "صحيح مسلم" },
  { text: "اللهم أدخله الجنة بغير حساب ولا سابقة عذاب.", translation: "O Allah, admit him to Paradise without reckoning and before any punishment.", category: "الميت" },
  { text: "اللهم قه فتنة القبر وعذاب النار.", translation: "O Allah, protect him from the trial of the grave and the punishment of the Fire.", category: "الميت" },
  { text: "اللهم اجعل قبره روضة من رياض الجنة ولا تجعله حفرة من حفر النار.", translation: "O Allah, make his grave a garden from the gardens of Paradise, and do not make it a pit from the pits of the Fire.", category: "الميت" },
  { text: "اللهم انزل على قبره الضياء والنور والفسحة والسرور.", translation: "O Allah, send down upon his grave light, brightness, spaciousness and joy.", category: "الميت" },
  { text: "اللهم افسح له في قبره مد بصره.", translation: "O Allah, expand his grave as far as his eyes can see.", category: "الميت" },
  { text: "اللهم أسكنه في أعلى الجنات بجوار حبيبك ومصطفاك ﷺ.", translation: "O Allah, settle him in the highest of Paradises, in the company of Your beloved and chosen one ﷺ.", category: "الميت" },
  { text: "اللهم احشره مع النبيين والصديقين والشهداء والصالحين.", translation: "O Allah, gather him with the prophets, the truthful, the martyrs and the righteous.", category: "الميت" },
  { text: "اللهم اجعله في بطن القبر مطمئناً وعند قيام الأشهاد آمناً.", translation: "O Allah, make him at peace in the grave and safe when the witnesses rise.", category: "الميت" },
  { text: "اللهم ارزقه شفاعة نبيك محمد ﷺ وأورده حوضه.", translation: "O Allah, grant him the intercession of Your Prophet Muhammad ﷺ and bring him to his fountain.", category: "الميت" },
  { text: "اللهم اسقه من يد النبي الكريم شربة هنيئة لا يظمأ بعدها أبداً.", translation: "O Allah, give him a drink from the hand of the noble Prophet, a wholesome drink after which he will never thirst again.", category: "الميت" },
  { text: "اللهم يمن كتابه ويسر حسابه وثقل بالحسنات ميزانه.", translation: "O Allah, make his book be given to his right hand, make his reckoning easy, and make the scale of his good deeds heavy.", category: "الميت" },
  { text: "اللهم اجعل هذه المنصة نوراً له في قبره، وصدقة جارية لا تنقطع.", translation: "O Allah, make this memorial a light for him in his grave, and an ongoing charity that never ceases.", category: "الميت" },

  // General (عام)
  { text: "اللهم إني أسألك الجنة وما قرب إليها من قول أو عمل، وأعوذ بك من النار وما قرب إليها من قول أو عمل.", translation: "O Allah, I ask You for Paradise and for whatever brings one closer to it, and I seek refuge in You from the Fire and from whatever brings one closer to it.", category: "عام", source: "سنن ابن ماجه" },
  { text: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.", translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.", category: "عام", source: "القرآن الكريم - البقرة 201" },
  { text: "اللهم اهدني وسددني.", translation: "O Allah, guide me and set me right.", category: "عام", source: "صحيح مسلم" },
  { text: "اللهم إني أسألك الثبات في الأمر والعزيمة على الرشد.", translation: "O Allah, I ask You for steadfastness in all affairs and determination to follow the right path.", category: "عام", source: "سنن النسائي" },
];

/* ── DUAS as flat string array for backward compatibility ───────────────── */
export const DUAS: string[] = DUAS_CATEGORIZED.map(d => d.text);

/* ── Reminders ──────────────────────────────────────────────────────────── */

export const REMINDERS: string[] = [
  "الحياة محطة عبور، والآخرة هي المستقر. اجعل زادك التقوى.",
  "كل نفس ستذوق الموت، فماذا أعددنا للقاء الله؟",
  "الدعاء للميت هو أعظم هدية تصل إليه في قبره.",
  "لا تنسوا المهندس أيمن من صالح دعائكم، فإنه في أمس الحاجة إليه الآن.",
  "الصدقة الجارية هي العمر الثاني للإنسان.",
  "اذكروا الله يذكركم، واشكروه على نعمه يزدكم.",
  "الاستغفار يفتح الأقفال ويجلب الرزق ويرفع الدرجات.",
  "الصلاة على النبي ﷺ تذهب الهم وتغفر الذنب.",
  "قراءة القرآن نور للقلب وشفاء للروح.",
  "بر الوالدين بعد موتهما يكون بالدعاء لهما والصدقة عنهما.",
  "الموت لا يستأذن أحداً، فلنكن دائماً على استعداد.",
  "حسن الخاتمة هو غاية كل مؤمن، فاسألوا الله الثبات.",
  "من أصلح سريرته أصلح الله علانيته.",
  "الكلمة الطيبة صدقة، فلا تحرموا أنفسكم الأجر.",
  "الرضا بقضاء الله وقدره من أعلى مراتب الإيمان.",
  "الدنيا سجن المؤمن وجنة الكافر.",
  "الجنة محفوفة بالمكاره، والنار محفوفة بالشهوات.",
  "من عرف الله هانت عليه المصائب.",
  "الوقت كالسيف، إن لم تقطعه قطعك، فاغتنموه في الطاعات.",
  "تذكروا دائماً: إن مع العسر يسراً.",
  "الحزن على الميت لا ينبغي أن يغلب على الرجاء في رحمة الله.",
  "ما أجمل أن تعيش كل يوم وكأنه يومك الأخير، فتودع الدنيا بحسن العمل.",
  "الصبر الجميل هو الذي لا شكوى فيه إلا لله.",
  "من زار قبر أخيه ودعا له أجرى الله له من الأجر ما يليق بكرمه.",
  "كثرة ذكر الله طمأنينة للقلب وراحة للروح.",
  "التفكر في الموت يزهد في الدنيا ويرغب في الآخرة.",
  "أحسن الظن بالله، فإن الله عند ظن عبده به.",
  "القلب الحي هو الذي يتأثر بذكر الله وتلاوة القرآن.",
  "لكل مسلم جار في الجنة ينتظره — فلنستعد للقائه.",
  "المؤمن لا يخشى الموت بل يتهيأ له، فهو لقاء بالله.",
  "الدعاء سلاح المؤمن، فلا تضع سلاحك في أحلك اللحظات.",
  "أفضل ما يعمله الولد لأبيه: الدعاء والاستغفار له، وقراءة القرآن عنه.",
  "تصدق عن روح أحبائك، فالصدقة تصل إليهم وتنير قبورهم.",
  "إن رحمة الله أوسع من كل ذنب وأعظم من كل ألم.",
  "لا تحزن، إن الله معنا.",
  "الصلوات الخمس تطهر القلب وتعينه على الصبر والرضا.",
  "الحياة مليئة بالاختبارات، فمن نجح في الصبر فاز بالجنة.",
  "أحسن إلى الناس في حياتهم كما تريد أن يحسن إليك بعد مماتك.",
  "اجعل الجنة هدفك، فإنها دار الكرامة والخلود.",
  "من أكثر من الصلاة على النبي ﷺ يوم الجمعة غفر له ما بين الجمعتين.",
];

/* ── Dhikr Types (backward compat for Tasbeeh component) ───────────────── */

export const DHIKR_TYPES = [
  { key: "SubhanAllah", ar: "سبحان الله", en: "Subhan Allah" },
  { key: "Alhamdulillah", ar: "الحمد لله", en: "Alhamdulillah" },
  { key: "AllahuAkbar", ar: "الله أكبر", en: "Allahu Akbar" },
  { key: "LaIlahaIllAllah", ar: "لا إله إلا الله", en: "La ilaha illallah" },
  { key: "LaHawla", ar: "لا حول ولا قوة إلا بالله", en: "La hawla wa la quwwata illa billah" },
  { key: "Astaghfirullah", ar: "أستغفر الله", en: "Astaghfirullah" },
  { key: "SubhanAllahWaBiHamdihi", ar: "سبحان الله وبحمده", en: "Subhan Allah wa bihamdihi" },
  { key: "SubhanAllahAlAzeem", ar: "سبحان الله العظيم", en: "Subhan Allah al-'Azeem" },
  { key: "Salawat", ar: "اللهم صل وسلم على نبينا محمد ﷺ", en: "Salawat" },
];

/* ── Expanded Dhikr Library ─────────────────────────────────────────────── */

export const DHIKR_LIBRARY: DhikrItem[] = [
  // Morning Adhkar
  { key: "morning_1", ar: "أصبحنا وأصبح الملك لله والحمد لله", en: "We have reached the morning and at this very time all sovereignty belongs to Allah", transliteration: "Asbahna wa asbahal-mulku lillah walhamdu lillah", reference: "صحيح مسلم", category: "أذكار الصباح" },
  { key: "morning_2", ar: "اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور", en: "O Allah, by You we enter the morning and evening, by You we live and die, and to You is the resurrection", transliteration: "Allahumma bika asbahna wa bika amsayna...", reference: "سنن الترمذي", category: "أذكار الصباح" },
  { key: "morning_3", ar: "اللهم إني أسألك علماً نافعاً ورزقاً طيباً وعملاً متقبلاً", en: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds", reference: "سنن ابن ماجه", category: "أذكار الصباح", virtue: "يقال في الصباح بعد الفجر" },
  { key: "morning_4", ar: "أعوذ بالله من الشيطان الرجيم", en: "I seek refuge in Allah from Satan the accursed", reference: "القرآن الكريم", category: "أذكار الصباح" },
  { key: "morning_5", ar: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم", en: "In the name of Allah, with whose name nothing in the earth or sky can cause harm", transliteration: "Bismillahil-lazi la yadurru ma'asmihi shay'un...", reference: "سنن أبي داود", virtue: "من قالها ثلاثاً حُفظ من كل شيء يؤذيه", category: "أذكار الصباح" },

  // Evening Adhkar
  { key: "evening_1", ar: "أمسينا وأمسى الملك لله والحمد لله", en: "We have reached the evening and at this very time all sovereignty belongs to Allah", reference: "صحيح مسلم", category: "أذكار المساء" },
  { key: "evening_2", ar: "اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير", en: "O Allah, by You we enter the evening, by You we enter the morning, by You we live and die, and to You is the final return", reference: "سنن الترمذي", category: "أذكار المساء" },
  { key: "evening_3", ar: "اللهم إني أسألك العفو والعافية في الدنيا والآخرة", en: "O Allah, I ask You for pardon and well-being in this world and the Hereafter", reference: "سنن ابن ماجه", category: "أذكار المساء" },
  { key: "evening_4", ar: "أعوذ بكلمات الله التامات من شر ما خلق", en: "I seek refuge in the perfect words of Allah from the evil of what He has created", transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq", reference: "صحيح مسلم", virtue: "من قالها ثلاثاً لم يضره سم ولا شيء", category: "أذكار المساء" },

  // After Prayer (بعد الصلاة)
  { key: "after_1", ar: "أستغفر الله، أستغفر الله، أستغفر الله", en: "I seek forgiveness from Allah (×3)", transliteration: "Astaghfirullah", reference: "صحيح مسلم", virtue: "سنة مؤكدة بعد كل صلاة", category: "بعد الصلاة" },
  { key: "after_2", ar: "اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام", en: "O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of glory and honor", reference: "صحيح مسلم", category: "بعد الصلاة" },
  { key: "after_3", ar: "سبحان الله (٣٣)، الحمد لله (٣٣)، الله أكبر (٣٣)", en: "Glory be to Allah (33×), All praise is for Allah (33×), Allah is the Greatest (33×)", virtue: "من قالها غُفرت خطاياه وإن كانت مثل زبد البحر", reference: "صحيح مسلم", category: "بعد الصلاة" },
  { key: "after_4", ar: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير", en: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs sovereignty and all praise.", transliteration: "La ilaha illallahu wahdahu la sharika lah...", reference: "صحيح مسلم", virtue: "كانت له بعدل عشر رقاب", category: "بعد الصلاة" },
  { key: "after_5", ar: "آية الكرسي", en: "Ayat al-Kursi (Al-Baqarah 2:255)", virtue: "من قرأها دبر كل صلاة مكتوبة لم يحل بينه وبين دخول الجنة إلا الموت", reference: "المعجم الكبير للطبراني", category: "بعد الصلاة" },

  // Before Sleep
  { key: "sleep_1", ar: "باسمك ربي وضعت جنبي وبك أرفعه", en: "In Your name my Lord, I lay down my side and by You I raise it", reference: "متفق عليه", category: "قبل النوم" },
  { key: "sleep_2", ar: "اللهم قني عذابك يوم تبعث عبادك", en: "O Allah, protect me from Your punishment on the Day You resurrect Your servants", reference: "سنن أبي داود", category: "قبل النوم" },
  { key: "sleep_3", ar: "سبحان الله (٣٣)، الحمد لله (٣٣)، الله أكبر (٣٤)", en: "Subhanallah 33×, Alhamdulillah 33×, Allahu Akbar 34×", virtue: "خير لك من خادم", reference: "متفق عليه", category: "قبل النوم" },
  { key: "sleep_4", ar: "اللهم أسلمت نفسي إليك وفوضت أمري إليك وألجأت ظهري إليك", en: "O Allah, I submit myself to You, entrust my affairs to You, and lean on You", reference: "متفق عليه", category: "قبل النوم" },

  // After Waking
  { key: "wake_1", ar: "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور", en: "All praise is for Allah who gave us life after having taken it from us, and to Him is the resurrection", reference: "صحيح البخاري", category: "الاستيقاظ" },
  { key: "wake_2", ar: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير", en: "None has the right to be worshipped except Allah, alone, without partner", reference: "سنن الترمذي", category: "الاستيقاظ" },

  // Home (البيت)
  { key: "home_1", ar: "بسم الله ولجنا وبسم الله خرجنا وعلى الله ربنا توكلنا", en: "In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we put our trust", reference: "سنن أبي داود", category: "البيت" },
  { key: "home_2", ar: "اللهم إني أسألك خير المولج وخير المخرج", en: "O Allah, I ask You for the best entry and the best exit", reference: "سنن أبي داود", category: "البيت" },

  // Rain (المطر)
  { key: "rain_1", ar: "اللهم صيباً نافعاً", en: "O Allah, [make it] a beneficial rain", transliteration: "Allahumma sayyiban nafi'an", reference: "صحيح البخاري", category: "المطر" },
  { key: "rain_2", ar: "مُطرنا بفضل الله ورحمته", en: "We have been given rain by the grace and mercy of Allah", reference: "متفق عليه", category: "المطر" },

  // Illness (المرض)
  { key: "illness_1", ar: "بسم الله أرقيك من كل شيء يؤذيك، من شر كل نفس أو عين حاسد الله يشفيك", en: "In the name of Allah I perform ruqyah for you, from everything that harms you, from the evil of every soul or envious eye, may Allah cure you", reference: "صحيح مسلم", category: "المرض" },
  { key: "illness_2", ar: "اللهم اشفِ شافياً لا يغادر سقماً", en: "O Allah, cure a cure that leaves no illness", reference: "متفق عليه", category: "المرض" },
  { key: "illness_3", ar: "اللهم رب الناس أذهب البأس واشفِ أنت الشافي لا شفاء إلا شفاؤك", en: "O Allah, Lord of mankind, remove the difficulty and grant cure, You are the Healer, there is no cure except Your cure", reference: "متفق عليه", category: "المرض" },

  // Istighfar (الاستغفار)
  { key: "istighfar_1", ar: "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه", en: "I seek forgiveness from Allah the Magnificent besides whom none is worthy of worship, the Ever-Living, the Sustainer, and I repent to Him", transliteration: "Astaghfirullah al-'Azim alladhi la ilaha illa huwal-Hayyul-Qayyum wa atubu ilayh", virtue: "غُفرت ذنوبه وإن كانت مثل زبد البحر", reference: "سنن الترمذي", category: "الاستغفار" },
  { key: "istighfar_2", ar: "أستغفر الله وأتوب إليه (١٠٠ مرة)", en: "I seek forgiveness from Allah and repent to Him (100×)", virtue: "من لزمه غفر الله له ورزقه من حيث لا يحتسب", reference: "صحيح البخاري", category: "الاستغفار" },

  // Salawat (الصلاة على النبي)
  { key: "salawat_1", ar: "اللهم صل على محمد وعلى آل محمد كما صليت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد", en: "O Allah, send Your blessings upon Muhammad and the family of Muhammad, as You sent Your blessings upon Ibrahim and the family of Ibrahim, You are worthy of praise, full of glory", transliteration: "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad...", reference: "صحيح البخاري", virtue: "كُتبت له عشر حسنات", category: "الصلاة على النبي ﷺ" },
  { key: "salawat_2", ar: "اللهم صل وسلم على نبينا محمد", en: "O Allah, send peace and blessings upon our Prophet Muhammad", reference: "سنن الترمذي", virtue: "صلى الله عليه بها عشراً", category: "الصلاة على النبي ﷺ" },

  // Tasbeeh
  { key: "tasbeeh_1", ar: "سبحان الله وبحمده سبحان الله العظيم", en: "Glory be to Allah and with His praise, glory be to Allah the Magnificent", transliteration: "Subhanallahi wa bihamdihi, Subhanallahil-'Azim", virtue: "خفيفتان على اللسان ثقيلتان في الميزان حبيبتان إلى الرحمن", reference: "متفق عليه", category: "التسبيح والتهليل" },
  { key: "tasbeeh_2", ar: "سبحان الله (٣٣)، الحمد لله (٣٣)، الله أكبر (٣٣)، لا إله إلا الله وحده لا شريك له", en: "Subhanallah 33×, Alhamdulillah 33×, Allahu Akbar 33×, then La ilaha illallah...", virtue: "غُفرت خطاياه وإن كانت مثل زبد البحر", reference: "صحيح مسلم", category: "التسبيح والتهليل" },
  { key: "tahleel_1", ar: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير", en: "None has the right to be worshipped except Allah, alone, without partner", transliteration: "La ilaha illallahu wahdahu la sharika lahu...", virtue: "عدلت عشر رقاب وكتبت له مائة حسنة", reference: "متفق عليه", category: "التسبيح والتهليل" },
  { key: "takbeer_1", ar: "الله أكبر كبيراً والحمد لله كثيراً وسبحان الله بكرة وأصيلاً", en: "Allah is the Greatest greatly, and all praise is abundantly for Allah, and glory be to Allah morning and evening", reference: "صحيح مسلم", virtue: "تاجرت ربي ورجوت ربحها", category: "التسبيح والتهليل" },

  // General
  { key: "general_1", ar: "لا حول ولا قوة إلا بالله", en: "There is no power and no strength except with Allah", transliteration: "La hawla wa la quwwata illa billah", virtue: "كنز من كنوز الجنة", reference: "متفق عليه", category: "عام" },
  { key: "general_2", ar: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم", en: "Allah is sufficient for me; none has the right to be worshipped but Him; in Him I put my trust; He is the Lord of the Mighty Throne", reference: "سنن أبي داود", virtue: "كفاه الله ما أهمه", category: "عام" },
  { key: "general_3", ar: "بسم الله الرحمن الرحيم", en: "In the name of Allah, the Most Gracious, the Most Merciful", reference: "القرآن الكريم", category: "عام" },
];
