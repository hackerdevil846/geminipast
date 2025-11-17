const axios = require("axios");

// Comprehensive backup quiz database
const backupQuizzes = {
  bangla: [
    { question: "ইসলামের পাঁচটি স্তম্ভের মধ্যে প্রথমটি কী?", options: { a: "নামাজ", b: "রোজা", c: "কালিমা", d: "হজ্জ" }, correctAnswer: "c" },
    { question: "কুরআন শরীফ কত বছরে নাজিল হয়?", options: { a: "২০", b: "২৩", c: "২৫", d: "৩০" }, correctAnswer: "b" },
    { question: "ইসলামের শেষ নবী কে?", options: { a: "হযরত ঈসা (আ)", b: "হযরত মুসা (আ)", c: "হযরত মুহাম্মদ (সা)", d: "হযরত ইব্রাহিম (আ)" }, correctAnswer: "c" },
    { question: "কাবা শরীফ কোথায় অবস্থিত?", options: { a: "মদিনা", b: "মক্কা", c: "জেরুজালেম", d: "বাগদাদ" }, correctAnswer: "b" },
    { question: "রমজান মাস কত নম্বর মাস?", options: { a: "৮ম", b: "৯ম", c: "১০ম", d: "১১তম" }, correctAnswer: "b" },
    { question: "ইসলামে কয়টি ফরজ নামাজ আছে?", options: { a: "৩টি", b: "৪টি", c: "৫টি", d: "৬টি" }, correctAnswer: "c" },
    { question: "হজ্জের সময় কোন মাসে যেতে হয়?", options: { a: "রমজান", b: "শাবান", c: "জিলহজ্জ", d: "মহররম" }, correctAnswer: "c" },
    { question: "কুরআনে কতটি সূরা আছে?", options: { a: "১১০", b: "১১৪", c: "১২০", d: "১৩০" }, correctAnswer: "b" },
    { question: "জাকাত কাদের উপর ফরজ?", options: { a: "সকলের", b: "ধনীদের", c: "নিসাব পরিমাণ সম্পদের মালিক", d: "বয়স্কদের" }, correctAnswer: "c" },
    { question: "ঈদুল ফিতর কখন পালিত হয়?", options: { a: "রমজানের শেষে", b: "হজ্জের পরে", c: "মহররমে", d: "রবিউল আউয়ালে" }, correctAnswer: "a" },
    { question: "ইসলামের পবিত্র গ্রন্থের নাম কী?", options: { a: "তাওরাত", b: "ইঞ্জিল", c: "কুরআন", d: "যাবুর" }, correctAnswer: "c" },
    { question: "মুসলমানদের কিবলা কোনটি?", options: { a: "কাবা", b: "মসজিদে নববী", c: "আল-আকসা", d: "তাজমহল" }, correctAnswer: "a" },
    { question: "শবে কদর কোন মাসে?", options: { a: "শাবান", b: "রমজান", c: "জিলহজ্জ", d: "মহররম" }, correctAnswer: "b" },
    { question: "হযরত মুহাম্মদ (সা) কত বছর বয়সে নবুয়ত প্রাপ্ত হন?", options: { a: "৩৫", b: "৪০", c: "৪৫", d: "৫০" }, correctAnswer: "b" },
    { question: "ইসলামের প্রথম মসজিদ কোনটি?", options: { a: "মসজিদে নববী", b: "মসজিদে হারাম", c: "মসজিদে কুবা", d: "মসজিদে আকসা" }, correctAnswer: "c" },
    { question: "হিজরত কোথা থেকে কোথায় করা হয়?", options: { a: "মদিনা থেকে মক্কা", b: "মক্কা থেকে মদিনা", c: "মক্কা থেকে তায়েফ", d: "ইয়েমেন থেকে মক্কা" }, correctAnswer: "b" },
    { question: "সাহাবীদের সংখ্যা প্রায় কত ছিল?", options: { a: "৫০,০০০", b: "৮০,০০০", c: "১,০০,০০০", d: "১,২৪,০০০" }, correctAnswer: "d" },
    { question: "ইসলামে প্রথম মুয়াজ্জিন কে ছিলেন?", options: { a: "হযরত আবু বকর (রা)", b: "হযরত উমর (রা)", c: "হযরত বিলাল (রা)", d: "হযরত আলী (রা)" }, correctAnswer: "c" },
    { question: "কোন নবী আগুনে নিক্ষিপ্ত হয়েছিলেন?", options: { a: "হযরত ইব্রাহিম (আ)", b: "হযরত মুসা (আ)", c: "হযরত ঈসা (আ)", d: "হযরত নূহ (আ)" }, correctAnswer: "a" },
    { question: "হজ্জের কোন দিন আরাফাতের ময়দানে অবস্থান করতে হয়?", options: { a: "৮ জিলহজ্জ", b: "৯ জিলহজ্জ", c: "১০ জিলহজ্জ", d: "১১ জিলহজ্জ" }, correctAnswer: "b" },
    { question: "কুরআনে কতজন নবীর নাম উল্লেখ আছে?", options: { a: "২৫", b: "৩০", c: "৩৫", d: "৪০" }, correctAnswer: "a" },
    { question: "ইসলামে প্রথম খলিফা কে ছিলেন?", options: { a: "হযরত উমর (রা)", b: "হযরত আবু বকর (রা)", c: "হযরত উসমান (রা)", d: "হযরত আলী (রা)" }, correctAnswer: "b" },
    { question: "মদিনার পূর্ব নাম কী ছিল?", options: { a: "ইয়াসরিব", b: "তায়েফ", c: "খায়বার", d: "তাবুক" }, correctAnswer: "a" },
    { question: "কুরআন নাজিল শুরু হয় কোন মাসে?", options: { a: "শাবান", b: "রমজান", c: "রজব", d: "মহররম" }, correctAnswer: "b" },
    { question: "ফজরের নামাজে কয়টি ফরজ রাকাত?", options: { a: "২", b: "৩", c: "৪", d: "৫" }, correctAnswer: "a" },
    { question: "জুমার নামাজে কয়টি ফরজ রাকাত?", options: { a: "২", b: "৩", c: "৪", d: "৬" }, correctAnswer: "a" },
    { question: "তারাবীহ নামাজ কোন মাসে পড়া হয়?", options: { a: "শাবান", b: "রমজান", c: "শাওয়াল", d: "জিলহজ্জ" }, correctAnswer: "b" },
    { question: "কাবা শরীফ কে প্রথম নির্মাণ করেন?", options: { a: "হযরত ইব্রাহিম (আ)", b: "হযরত আদম (আ)", c: "হযরত নূহ (আ)", d: "হযরত ইসমাইল (আ)" }, correctAnswer: "a" },
    { question: "সাফা ও মারওয়া পাহাড় কোথায়?", options: { a: "মদিনা", b: "মক্কা", c: "জেরুজালেম", d: "তায়েফ" }, correctAnswer: "b" },
    { question: "হযরত মুহাম্মদ (সা) এর পিতার নাম কী?", options: { a: "আবু তালিব", b: "আব্দুল্লাহ", c: "আব্দুল মুত্তালিব", d: "আবু বকর" }, correctAnswer: "b" },
    { question: "হযরত মুহাম্মদ (সা) এর মাতার নাম কী?", options: { a: "খাদিজা", b: "আয়েশা", c: "আমিনা", d: "ফাতিমা" }, correctAnswer: "c" },
    { question: "মিরাজ কী?", options: { a: "হিজরত", b: "রাসূলের (সা) ঊর্ধ্বারোহণ", c: "যুদ্ধ", d: "হজ্জ" }, correctAnswer: "b" },
    { question: "বদরের যুদ্ধ কত হিজরিতে হয়?", options: { a: "১ম", b: "২য়", c: "৩য়", d: "৪র্থ" }, correctAnswer: "b" },
    { question: "উহুদের যুদ্ধ কত হিজরিতে হয়?", options: { a: "২য়", b: "৩য়", c: "৪র্থ", d: "৫ম" }, correctAnswer: "b" },
    { question: "মক্কা বিজয় কত হিজরিতে হয়?", options: { a: "৬ষ্ঠ", b: "৭ম", c: "৮ম", d: "৯ম" }, correctAnswer: "c" },
    { question: "হযরত মুহাম্মদ (সা) কত বছর বয়সে ইন্তেকাল করেন?", options: { a: "৬০", b: "৬৩", c: "৬৫", d: "৭০" }, correctAnswer: "b" },
    { question: "ইসলামে কুরবানি কখন করা হয়?", options: { a: "ঈদুল ফিতরে", b: "ঈদুল আযহায়", c: "শবে বরাতে", d: "শবে কদরে" }, correctAnswer: "b" },
    { question: "সাহরি খাওয়া কোন ইবাদতের অংশ?", options: { a: "নামাজ", b: "হজ্জ", c: "রোজা", d: "জাকাত" }, correctAnswer: "c" },
    { question: "ইফতার কী?", options: { a: "রোজা শুরু", b: "রোজা ভাঙা", c: "নামাজ", d: "দোয়া" }, correctAnswer: "b" },
    { question: "তাহাজ্জুদ নামাজ কখন পড়া হয়?", options: { a: "ফজরের আগে", b: "জোহরের পরে", c: "মাগরিবের পরে", d: "এশার পরে মধ্যরাতে" }, correctAnswer: "d" },
    { question: "কুরআনের প্রথম সূরা কোনটি?", options: { a: "আল-বাকারা", b: "আল-ফাতিহা", c: "আন-নাস", d: "আল-ইখলাস" }, correctAnswer: "b" },
    { question: "কুরআনের শেষ সূরা কোনটি?", options: { a: "আন-নাস", b: "আল-ফালাক", c: "আল-ইখলাস", d: "আল-কাউসার" }, correctAnswer: "a" },
    { question: "সূরা ইয়াসিনকে কুরআনের কী বলা হয়?", options: { a: "চোখ", b: "হৃদয়", c: "রূহ", d: "প্রাণ" }, correctAnswer: "b" },
    { question: "আয়াতুল কুরসি কোন সূরায় আছে?", options: { a: "আল-ফাতিহা", b: "আল-বাকারা", c: "আলে-ইমরান", d: "আন-নিসা" }, correctAnswer: "b" },
    { question: "ইসলামে সবচেয়ে বড় গুনাহ কোনটি?", options: { a: "মিথ্যা বলা", b: "চুরি করা", c: "শিরক করা", d: "হত্যা করা" }, correctAnswer: "c" },
    { question: "হালাল খাবার কাকে বলে?", options: { a: "মাছ", b: "শাকসবজি", c: "ইসলাম অনুমোদিত খাবার", d: "ফলমূল" }, correctAnswer: "c" },
    { question: "হারাম কী?", options: { a: "নিষিদ্ধ বস্তু", b: "পবিত্র স্থান", c: "ইবাদত", d: "খাবার" }, correctAnswer: "a" },
    { question: "ওযু কী?", options: { a: "গোসল", b: "পবিত্রতা অর্জন", c: "নামাজের পূর্বপ্রস্তুতি", d: "সবগুলো" }, correctAnswer: "d" },
    { question: "নামাজে কতবার সিজদা করা হয়?", options: { a: "প্রতি রাকাতে ১ বার", b: "প্রতি রাকাতে ২ বার", c: "প্রতি নামাজে ১ বার", d: "প্রতি নামাজে ৪ বার" }, correctAnswer: "b" },
    { question: "আজানের অর্থ কী?", options: { a: "নামাজের আহ্বান", b: "ইবাদত", c: "দোয়া", d: "প্রার্থনা" }, correctAnswer: "a" },
    { question: "হযরত খাদিজা (রা) কে ছিলেন?", options: { a: "রাসূলের (সা) মাতা", b: "রাসূলের (সা) প্রথম স্ত্রী", c: "রাসূলের (সা) কন্যা", d: "রাসূলের (সা) বোন" }, correctAnswer: "b" },
    { question: "হযরত আয়েশা (রা) কার কন্যা?", options: { a: "হযরত উমর (রা)", b: "হযরত উসমান (রা)", c: "হযরত আবু বকর (রা)", d: "হযরত আলী (রা)" }, correctAnswer: "c" },
    { question: "হযরত ফাতিমা (রা) কে ছিলেন?", options: { a: "রাসূলের (সা) কন্যা", b: "রাসূলের (সা) স্ত্রী", c: "রাসূলের (সা) মাতা", d: "সাহাবী" }, correctAnswer: "a" },
    { question: "হযরত হাসান ও হুসাইন (রা) কার সন্তান?", options: { a: "হযরত আবু বকর (রা)", b: "হযরত উমর (রা)", c: "হযরত আলী (রা)", d: "হযরত উসমান (রা)" }, correctAnswer: "c" },
    { question: "ইসলামে সালাম দেওয়ার পদ্ধতি কী?", options: { a: "আসসালামু আলাইকুম", b: "হ্যালো", c: "নমস্কার", d: "প্রণাম" }, correctAnswer: "a" },
    { question: "দুরুদ শরীফ কার উপর পাঠ করা হয়?", options: { a: "সাহাবীদের", b: "রাসূলের (সা)", c: "খলিফাদের", d: "আলেমদের" }, correctAnswer: "b" },
    { question: "ইস্তিগফার কী?", options: { a: "ক্ষমা প্রার্থনা", b: "শুকরিয়া", c: "প্রশংসা", d: "দোয়া" }, correctAnswer: "a" },
    { question: "সুবহানাল্লাহ এর অর্থ কী?", options: { a: "আলহামদুলিল্লাহ", b: "আল্লাহ পবিত্র", c: "আল্লাহু আকবর", d: "লা ইলাহা ইল্লাল্লাহ" }, correctAnswer: "b" },
    { question: "আলহামদুলিল্লাহ এর অর্থ কী?", options: { a: "আল্লাহর প্রশংসা", b: "আল্লাহ মহান", c: "আল্লাহ ছাড়া কেউ নেই", d: "আল্লাহ পবিত্র" }, correctAnswer: "a" },
    { question: "আল্লাহু আকবর এর অর্থ কী?", options: { a: "আল্লাহ পবিত্র", b: "আল্লাহ সর্বশ্রেষ্ঠ", c: "আল্লাহর প্রশংসা", d: "আল্লাহ এক" }, correctAnswer: "b" },
    { question: "লা ইলাহা ইল্লাল্লাহ এর অর্থ কী?", options: { a: "আল্লাহ ছাড়া কোনো মাবুদ নেই", b: "আল্লাহ মহান", c: "আল্লাহর প্রশংসা", d: "আল্লাহ পবিত্র" }, correctAnswer: "a" },
    { question: "ইসলামে দাড়ি রাখা কী?", options: { a: "ফরজ", b: "সুন্নত", c: "মুস্তাহাব", d: "নফল" }, correctAnswer: "b" },
    { question: "মিসওয়াক ব্যবহার করা কী?", options: { a: "ফরজ", b: "সুন্নত", c: "ওয়াজিব", d: "হারাম" }, correctAnswer: "b" },
    { question: "ইসলামে কতজন ফেরেশতার কথা জানা ফরজ?", options: { a: "২", b: "৪", c: "৬", d: "১০" }, correctAnswer: "d" },
    { question: "জিবরাইল (আ) কোন ফেরেশতা?", options: { a: "মৃত্যু", b: "রিজিক", c: "ওহী নিয়ে আসা", d: "বৃষ্টি" }, correctAnswer: "c" },
    { question: "মিকাইল (আ) কোন দায়িত্বে নিয়োজিত?", options: { a: "মৃত্যু", b: "রিজিক ও বৃষ্টি", c: "ওহী", d: "হিসাব" }, correctAnswer: "b" },
    { question: "ইসরাফিল (আ) কী বাজাবেন?", options: { a: "বাঁশি", b: "সিঙ্গা", c: "ঢোল", d: "বাদ্যযন্ত্র" }, correctAnswer: "b" },
    { question: "আজরাইল (আ) কোন দায়িত্বে নিয়োজিত?", options: { a: "ওহী", b: "রিজিক", c: "মৃত্যু", d: "হিসাব" }, correctAnswer: "c" },
    { question: "মুনকার ও নাকির কারা?", options: { a: "সাহাবী", b: "কবরের ফেরেশতা", c: "নবী", d: "খলিফা" }, correctAnswer: "b" },
    { question: "কিয়ামত কী?", options: { a: "হজ্জের দিন", b: "রমজান", c: "পৃথিবীর শেষ দিন", d: "নতুন বছর" }, correctAnswer: "c" },
    { question: "জান্নাত কী?", options: { a: "দোজখ", b: "স্বর্গ", c: "পৃথিবী", d: "মসজিদ" }, correctAnswer: "b" },
    { question: "জাহান্নাম কী?", options: { a: "স্বর্গ", b: "পৃথিবী", c: "নরক", d: "কবর" }, correctAnswer: "c" },
    { question: "হাশরের ময়দান কী?", options: { a: "যুদ্ধক্ষেত্র", b: "কিয়ামতের বিচারস্থল", c: "মসজিদ", d: "হজ্জের স্থান" }, correctAnswer: "b" },
    { question: "পুলসিরাত কী?", options: { a: "একটি সেতু", b: "একটি পাহাড়", c: "একটি নদী", d: "একটি মসজিদ" }, correctAnswer: "a" },
    { question: "মিজান কী?", options: { a: "আমলের পরিমাপক", b: "তলোয়ার", c: "বই", d: "পতাকা" }, correctAnswer: "a" },
    { question: "হাউজে কাউসার কী?", options: { a: "নদী", b: "হ্রদ", c: "ঝর্ণা", d: "জান্নাতের হ্রদ" }, correctAnswer: "d" },
    { question: "শাফায়াত কী?", options: { a: "সুপারিশ", b: "দান", c: "প্রার্থনা", d: "রোজা" }, correctAnswer: "a" },
    { question: "তাকদীর কী?", options: { a: "ভাগ্য", b: "রোজা", c: "নামাজ", d: "হজ্জ" }, correctAnswer: "a" },
    { question: "ইমান কী?", options: { a: "বিশ্বাস", b: "কর্ম", c: "দান", d: "ইবাদত" }, correctAnswer: "a" },
    { question: "ইমানের কতটি রুকন আছে?", options: { a: "৫", b: "৬", c: "৭", d: "৮" }, correctAnswer: "c" },
    { question: "ইসলামে ফেরেশতাদের প্রতি বিশ্বাস করা কী?", options: { a: "ফরজ", b: "সুন্নত", c: "মুস্তাহাব", d: "নফল" }, correctAnswer: "a" },
    { question: "হযরত নূহ (আ) কত বছর তাঁর জাতিকে দাওয়াত দেন?", options: { a: "৫০০", b: "৭৫০", c: "৯৫০", d: "১০০০" }, correctAnswer: "c" },
    { question: "তুফানের সময় হযরত নূহ (আ) কী তৈরি করেন?", options: { a: "ঘর", b: "নৌকা", c: "মসজিদ", d: "দুর্গ" }, correctAnswer: "b" },
    { question: "হযরত ইব্রাহিম (আ) কোথায় জন্মগ্রহণ করেন?", options: { a: "মিসর", b: "ইরাক", c: "সিরিয়া", d: "ফিলিস্তিন" }, correctAnswer: "b" },
    { question: "হযরত ইসমাইল (আ) কার পুত্র?", options: { a: "হযরত নূহ (আ)", b: "হযরত ইব্রাহিম (আ)", c: "হযরত মুসা (আ)", d: "হযরত ঈসা (আ)" }, correctAnswer: "b" },
    { question: "হযরত ইসহাক (আ) কার পুত্র?", options: { a: "হযরত ইব্রাহিম (আ)", b: "হযরত নূহ (আ)", c: "হযরত লূত (আ)", d: "হযরত ইয়াকুব (আ)" }, correctAnswer: "a" },
    { question: "হযরত ইউসুফ (আ) কার পুত্র?", options: { a: "হযরত ইব্রাহিম (আ)", b: "হযরত ইসহাক (আ)", c: "হযরত ইয়াকুব (আ)", d: "হযরত ইসমাইল (আ)" }, correctAnswer: "c" },
    { question: "হযরত ইউসুফ (আ) কোথায় বিক্রি হন?", options: { a: "সিরিয়া", b: "মিসর", c: "ইরাক", d: "ইয়েমেন" }, correctAnswer: "b" },
    { question: "হযরত মুসা (আ) কোন নদীতে ভাসিয়ে দেওয়া হয়?", options: { a: "ফোরাত", b: "নীল", c: "জর্ডান", d: "দজলা" }, correctAnswer: "b" },
    { question: "হযরত মুসা (আ) কাকে পরাজিত করেন?", options: { a: "নমরুদ", b: "ফেরাউন", c: "হামান", d: "কারুন" }, correctAnswer: "b" },
    { question: "হযরত মুসা (আ) কোন পাহাড়ে আল্লাহর সাথে কথা বলেন?", options: { a: "জুদী", b: "সিনাই", c: "তুর", d: "আরাফাত" }, correctAnswer: "c" },
    { question: "হযরত দাউদ (আ) কে ছিলেন?", options: { a: "নবী ও বাদশাহ", b: "শুধু নবী", c: "সাহাবী", d: "ফেরেশতা" }, correctAnswer: "a" },
    { question: "হযরত সুলাইমান (আ) কার পুত্র?", options: { a: "হযরত মুসা (আ)", b: "হযরত দাউদ (আ)", c: "হযরত ইব্রাহিম (আ)", d: "হযরত ইউসুফ (আ)" }, correctAnswer: "b" },
    { question: "হযরত সুলাইমান (আ) কাদের ভাষা বুঝতেন?", options: { a: "পশু-পাখি", b: "শুধু মানুষ", c: "ফেরেশতা", d: "জিন" }, correctAnswer: "a" },
    { question: "হযরত ঈসা (আ) কোথায় জন্মগ্রহণ করেন?", options: { a: "জেরুজালেম", b: "নাজারেথ", c: "বেথলেহেম", d: "দামেস্ক" }, correctAnswer: "c" },
    { question: "হযরত ঈসা (আ) এর মাতার নাম কী?", options: { a: "হাওয়া", b: "মারিয়াম", c: "আসিয়া", d: "সারা" }, correctAnswer: "b" },
    { question: "হযরত ঈসা (আ) কে আকাশে তুলে নেওয়া হয়?", options: { a: "হ্যাঁ", b: "না", c: "জানা নেই", d: "সম্ভবত" }, correctAnswer: "a" },
    { question: "হযরত ইউনুস (আ) মাছের পেটে কতদিন ছিলেন?", options: { a: "১ দিন", b: "৩ দিন", c: "৭ দিন", d: "৪০ দিন" }, correctAnswer: "b" },
    { question: "হযরত আইয়ুব (আ) কিসের জন্য বিখ্যাত?", options: { a: "ধৈর্য", b: "জ্ঞান", c: "শক্তি", d: "সম্পদ" }, correctAnswer: "a" },
    { question: "হযরত ইয়াহইয়া (আ) কে ছিলেন?", options: { a: "হযরত ঈসা (আ) এর চাচাতো ভাই", b: "হযরত মুসা (আ) এর ভাই", c: "হযরত ইব্রাহিম (আ) এর পুত্র", d: "হযরত নূহ (আ) এর পুত্র" }, correctAnswer: "a" },
    { question: "আশুরার দিন কী ঘটেছিল?", options: { a: "হযরত মুসা (আ) সাগর পার হন", b: "হযরত নূহ (আ) এর নৌকা স্থির হয়", c: "উভয়টি", d: "কোনটিই নয়" }, correctAnswer: "c" },
    { question: "আশুরার রোজা কী?", options: { a: "ফরজ", b: "সুন্নত", c: "নফল", d: "ওয়াজিব" }, correctAnswer: "c" },
    { question: "শবে বরাত কোন মাসে?", options: { a: "রজব", b: "শাবান", c: "রমজান", d: "জিলহজ্জ" }, correctAnswer: "b" },
    { question: "লাইলাতুল কদর কোন রাতকে বলে?", options: { a: "শবে বরাত", b: "শবে মেরাজ", c: "শবে কদর", d: "আশুরা" }, correctAnswer: "c" },
    { question: "শবে কদরের মর্যাদা কত হাজার মাসের?", options: { a: "এক হাজার", b: "দশ হাজার", c: "একশ হাজার", d: "উত্তর নেই" }, correctAnswer: "a" },
    { question: "শবে মেরাজ কোন মাসে?", options: { a: "রজব", b: "শাবান", c: "রমজান", d: "জিলহজ্জ" }, correctAnswer: "a" },
    { question: "রাসূল (সা) মেরাজে কার সাথে দেখা করেন?", options: { a: "সাহাবীদের", b: "পূর্ববর্তী নবীদের", c: "ফেরেশতাদের", d: "খলিফাদের" }, correctAnswer: "b" },
    { question: "মেরাজে নামাজ কতটি নির্ধারণ করা হয়?", options: { a: "৩টি", b: "৫টি", c: "৭টি", d: "৯টি" }, correctAnswer: "b" },
    { question: "প্রথমে কতটি নামাজ ফরজ করা হয়েছিল?", options: { a: "৫টি", b: "২৫টি", c: "৫০টি", d: "১০০টি" }, correctAnswer: "c" },
    { question: "হযরত মুসা (আ) কতবার ফিরে যেতে বলেন?", options: { a: "৫ বার", b: "৭ বার", c: "৯ বার", d: "১০ বার" }, correctAnswer: "c" },
    { question: "ঈদ মানে কী?", options: { a: "খুশির দিন", b: "উৎসবের দিন", c: "ফিরে আসা", d: "সবগুলো" }, correctAnswer: "d" },
    { question: "ইসলামে কয়টি ঈদ আছে?", options: { a: "১টি", b: "২টি", c: "৩টি", d: "৪টি" }, correctAnswer: "b" },
    { question: "ঈদুল আযহা কেন পালিত হয়?", options: { a: "রোজার শেষে", b: "হযরত ইব্রাহিম (আ) এর কুরবানির স্মরণে", c: "হজ্জের শুরুতে", d: "নববর্ষে" }, correctAnswer: "b" },
    { question: "কুরবানির পশু কয়ভাগে ভাগ করা হয়?", options: { a: "২ ভাগ", b: "৩ ভাগ", c: "৪ ভাগ", d: "৫ ভাগ" }, correctAnswer: "b" },
    { question: "কুরবানির মাংস কাদের দেওয়া হয়?", options: { a: "শুধু নিজের পরিবার", b: "গরিব, আত্মীয় ও নিজেদের", c: "শুধু গরিব", d: "শুধু আত্মীয়" }, correctAnswer: "b" },
    { question: "হযরত ইব্রাহিম (আ) কাকে কুরবানি দিতে চেয়েছিলেন?", options: { a: "হযরত ইসহাক (আ)", b: "হযরত ইসমাইল (আ)", c: "হযরত ইয়াকুব (আ)", d: "হযরত ইউসুফ (আ)" }, correctAnswer: "b" },
    { question: "আল্লাহ কুরবানির পরিবর্তে কী পাঠান?", options: { a: "উট", b: "গরু", c: "দুম্বা", d: "ছাগল" }, correctAnswer: "c" },
    { question: "হজ্জের ফরজ কয়টি?", options: { a: "২টি", b: "৩টি", c: "৪টি", d: "৫টি" }, correctAnswer: "b" },
    { question: "উমরা কী?", options: { a: "বড় হজ্জ", b: "ছোট হজ্জ", c: "রোজা", d: "নামাজ" }, correctAnswer: "b" },
    { question: "হজ্জের সময় কী পরিধান করতে হয়?", options: { a: "সাধারণ কাপড়", b: "ইহরাম", c: "সাদা জামা", d: "যেকোনো কাপড়" }, correctAnswer: "b" },
    { question: "তাওয়াফ কী?", options: { a: "কাবা প্রদক্ষিণ", b: "দৌড়ানো", c: "দোয়া পড়া", d: "নামাজ পড়া" }, correctAnswer: "a" },
    { question: "তাওয়াফে কতবার কাবা ঘুরতে হয়?", options: { a: "৫ বার", b: "৭ বার", c: "৯ বার", d: "১১ বার" }, correctAnswer: "b" },
    { question: "সায়ী কী?", options: { a: "সাফা মারওয়ায় দৌড়ানো", b: "তাওয়াফ", c: "নামাজ", d: "দোয়া" }, correctAnswer: "a" },
    { question: "জামরায় কী নিক্ষেপ করা হয়?", options: { a: "ফুল", b: "কঙ্কর", c: "পানি", d: "মাটি" }, correctAnswer: "b" },
    { question: "জামরায় কংকর নিক্ষেপ কিসের প্রতীক?", options: { a: "শয়তানকে প্রত্যাখ্যান", b: "গুনাহ মাফ", c: "খুশি প্রকাশ", d: "কোনটিই নয়" }, correctAnswer: "a" },
    { question: "হাজরে আসওয়াদ কী?", options: { a: "কালো পাথর", b: "সাদা পাথর", c: "লাল পাথর", d: "সবুজ পাথর" }, correctAnswer: "a" },
    { question: "জমজম কূপ কোথায় অবস্থিত?", options: { a: "মদিনা", b: "মক্কা", c: "জেরুজালেম", d: "তায়েফ" }, correctAnswer: "b" },
    { question: "জমজম কূপ কে আবিষ্কার করেন?", options: { a: "হযরত ইব্রাহিম (আ)", b: "হযরত ইসমাইল (আ)", c: "হযরত হাজেরা (আ)", d: "আব্দুল মুত্তালিব" }, correctAnswer: "d" },
    { question: "জাকাত কখন ফরজ হয়?", options: { a: "যখন নিসাব পরিমাণ সম্পদ হয়", b: "প্রতি মাসে", c: "বছরে একবার", d: "জীবনে একবার" }, correctAnswer: "a" },
    { question: "জাকাতের হার কত শতাংশ?", options: { a: "১%", b: "২.৫%", c: "৫%", d: "১০%" }, correctAnswer: "b" },
    { question: "সদকা কী?", options: { a: "ফরজ দান", b: "স্বেচ্ছা দান", c: "জাকাত", d: "কুরবানি" }, correctAnswer: "b" },
    { question: "সদকায়ে ফিতর কখন দিতে হয়?", options: { a: "ঈদুল ফিতরের আগে", b: "ঈদুল আযহার আগে", c: "যেকোনো সময়", d: "বছরে একবার" }, correctAnswer: "a" },
    { question: "ফিতরা কাদের দিতে হয়?", options: { a: "শুধু ধনীদের", b: "যার কাছে ঈদের দিন খাবার আছে", c: "শুধু গরিবদের", d: "কারো না" }, correctAnswer: "b" },
    { question: "ইসলামে যাকাত কাদের দেওয়া যায়?", options: { a: "৮ শ্রেণীর মানুষ", b: "যে কাউকে", c: "শুধু গরিব", d: "শুধু আত্মীয়" }, correctAnswer: "a" },
    { question: "নফল ইবাদত কী?", options: { a: "ফরজ", b: "ওয়াজিব", c: "অতিরিক্ত", d: "সুন্নত" }, correctAnswer: "c" },
    { question: "সুন্নত কী?", options: { a: "ফরজ", b: "রাসূলের (সা) আদর্শ", c: "হারাম", d: "মাকরুহ" }, correctAnswer: "b" },
    { question: "ওয়াজিব কী?", options: { a: "ফরজের কাছাকাছি", b: "সুন্নত", c: "নফল", d: "হারাম" }, correctAnswer: "a" },
    { question: "মাকরুহ কী?", options: { a: "নিষিদ্ধ", b: "অপছন্দনীয়", c: "ফরজ", d: "সুন্নত" }, correctAnswer: "b" },
    { question: "মুবাহ কী?", options: { a: "হারাম", b: "ফরজ", c: "বৈধ", d: "মাকরুহ" }, correctAnswer: "c" },
    { question: "হাদিস কী?", options: { a: "কুরআন", b: "রাসূলের (সা) বাণী ও কর্ম", c: "তাফসীর", d: "ফিকহ" }, correctAnswer: "b" },
    { question: "সবচেয়ে নির্ভরযোগ্য হাদিসের বই কোনটি?", options: { a: "সহিহ বুখারী", b: "সহিহ মুসলিম", c: "উভয়টি", d: "তিরমিজি" }, correctAnswer: "c" },
    { question: "ছয়টি প্রধান হাদিস গ্রন্থকে কী বলে?", options: { a: "কুতুবুস সিত্তাহ", b: "সহিহ", c: "মুসনাদ", d: "সুনান" }, correctAnswer: "a" },
    { question: "তাফসীর কী?", options: { a: "হাদিস", b: "কুরআনের ব্যাখ্যা", c: "ফিকহ", d: "সীরাত" }, correctAnswer: "b" },
    { question: "সীরাত কী?", options: { a: "রাসূলের (সা) জীবনী", b: "হাদিস", c: "কুরআন", d: "তাফসীর" }, correctAnswer: "a" },
    { question: "ফিকহ কী?", options: { a: "ইসলামী আইন", b: "হাদিস", c: "কুরআন", d: "সীরাত" }, correctAnswer: "a" },
    { question: "মুজতাহিদ কে?", options: { a: "হাদিস বিশারদ", b: "ফিকহ বিশেষজ্ঞ", c: "কুরআন তেলাওয়াতকারী", d: "মুফতি" }, correctAnswer: "b" },
    { question: "মুফতি কে?", options: { a: "ফতোয়া প্রদানকারী", b: "ইমাম", c: "খতিব", d: "মুয়াজ্জিন" }, correctAnswer: "a" },
    { question: "খতিব কে?", options: { a: "নামাজের ইমাম", b: "জুমার খুতবা প্রদানকারী", c: "মুয়াজ্জিন", d: "হাফেজ" }, correctAnswer: "b" },
    { question: "হাফেজ কে?", options: { a: "কুরআন মুখস্থকারী", b: "ইমাম", c: "মুফতি", d: "আলেম" }, correctAnswer: "a" },
    { question: "কারী কে?", options: { a: "সুন্দর তেলাওয়াতকারী", b: "ইমাম", c: "হাফেজ", d: "মুফতি" }, correctAnswer: "a" },
    { question: "ইমাম কে?", options: { a: "নামাজে নেতৃত্বদানকারী", b: "মুয়াজ্জিন", c: "খতিব", d: "হাফেজ" }, correctAnswer: "a" },
    { question: "মুয়াজ্জিন কে?", options: { a: "আজান প্রদানকারী", b: "ইমাম", c: "খতিব", d: "হাফেজ" }, correctAnswer: "a" },
    { question: "খুতবা কী?", options: { a: "জুমার ভাষণ", b: "নামাজ", c: "দোয়া", d: "তেলাওয়াত" }, correctAnswer: "a" },
    { question: "তিলাওয়াত কী?", options: { a: "কুরআন পাঠ", b: "নামাজ", c: "দোয়া", d: "জিকির" }, correctAnswer: "a" },
    { question: "জিকির কী?", options: { a: "আল্লাহর স্মরণ", b: "নামাজ", c: "রোজা", d: "দান" }, correctAnswer: "a" },
    { question: "তাসবীহ কী?", options: { a: "সুবহানাল্লাহ বলা", b: "নামাজের মালা", c: "উভয়টি", d: "কোনটিই নয়" }, correctAnswer: "c" },
    { question: "তাহমীদ কী?", options: { a: "আলহামদুলিল্লাহ বলা", b: "সুবহানাল্লাহ বলা", c: "আল্লাহু আকবর বলা", d: "দুরুদ পাঠ" }, correctAnswer: "a" },
    { question: "তাকবীর কী?", options: { a: "আল্লাহু আকবর বলা", b: "সুবহানাল্লাহ বলা", c: "আলহামদুলিল্লাহ বলা", d: "দুরুদ পাঠ" }, correctAnswer: "a" },
    { question: "তাহলীল কী?", options: { a: "লা ইলাহা ইল্লাল্লাহ বলা", b: "আল্লাহু আকবর বলা", c: "সুবহানাল্লাহ বলা", d: "আলহামদুলিল্লাহ বলা" }, correctAnswer: "a" },
    { question: "ইসলামে প্রথম মহিলা শহীদ কে?", options: { a: "হযরত খাদিজা (রা)", b: "হযরত ফাতিমা (রা)", c: "হযরত সুমাইয়া (রা)", d: "হযরত আয়েশা (রা)" }, correctAnswer: "c" },
    { question: "ইসলামে প্রথম পুরুষ শহীদ কে?", options: { a: "হযরত হামজা (রা)", b: "হযরত ইয়াসির (রা)", c: "হযরত উমর (রা)", d: "হযরত আলী (রা)" }, correctAnswer: "b" },
    { question: "আশারায়ে মুবাশশারা কারা?", options: { a: "১০ জন জান্নাতি সাহাবী", b: "প্রথম মুসলিম", c: "শহীদ সাহাবী", d: "খলিফা" }, correctAnswer: "a" },
    { question: "হযরত উমর (রা) কত বছর খিলাফত করেন?", options: { a: "৮ বছর", b: "১০ বছর", c: "১২ বছর", d: "১৫ বছর" }, correctAnswer: "b" },
    { question: "হযরত উসমান (রা) কত বছর খিলাফত করেন?", options: { a: "৮ বছর", b: "১০ বছর", c: "১২ বছর", d: "১৫ বছর" }, correctAnswer: "c" },
    { question: "হযরত আলী (রা) কত বছর খিলাফত করেন?", options: { a: "৩ বছর", b: "৫ বছর", c: "৭ বছর", d: "১০ বছর" }, correctAnswer: "b" },
    { question: "খুলাফায়ে রাশেদীন কাদের বলা হয়?", options: { a: "প্রথম ৪ খলিফা", b: "সকল খলিফা", c: "সাহাবীরা", d: "আলেমরা" }, correctAnswer: "a" },
    { question: "উমাইয়া খিলাফতের প্রতিষ্ঠাতা কে?", options: { a: "হযরত উমর (রা)", b: "মুয়াবিয়া (রা)", c: "আবু সুফিয়ান (রা)", d: "ইয়াজিদ" }, correctAnswer: "b" },
    { question: "আব্বাসীয় খিলাফতের রাজধানী কোথায় ছিল?", options: { a: "মক্কা", b: "মদিনা", c: "দামেস্ক", d: "বাগদাদ" }, correctAnswer: "d" },
    { question: "উসমানীয় খিলাফতের রাজধানী কোথায় ছিল?", options: { a: "ইস্তাম্বুল", b: "কায়রো", c: "দামেস্ক", d: "বাগদাদ" }, correctAnswer: "a" },
    { question: "শেষ উসমানীয় খলিফা কে ছিলেন?", options: { a: "সুলতান মুহাম্মদ ফাতিহ", b: "সুলতান সুলাইমান", c: "দ্বিতীয় আব্দুল হামিদ", d: "ষষ্ঠ মেহমেদ ওয়াহিদুদ্দিন" }, correctAnswer: "d" },
    { question: "উসমানীয় খিলাফত কত সালে শেষ হয়?", options: { a: "১৯১৮", b: "১৯২২", c: "১৯২৪", d: "১৯৩০" }, correctAnswer: "c" },
    { question: "সুলতান সালাহউদ্দিন আইয়ুবী কোথা থেকে জেরুজালেম মুক্ত করেন?", options: { a: "রোমান", b: "পারসিক", c: "ক্রুসেডার", d: "মঙ্গোল" }, correctAnswer: "c" },
    { question: "সুলতান মুহাম্মদ ফাতিহ কোন শহর জয় করেন?", options: { a: "জেরুজালেম", b: "কনস্টান্টিনোপল", c: "কায়রো", d: "দামেস্ক" }, correctAnswer: "b" },
    { question: "কনস্টান্টিনোপল জয় হয় কত সালে?", options: { a: "১৪৫০", b: "১৪৫২", c: "১৪৫৩", d: "১৪৫৫" }, correctAnswer: "c" },
    { question: "ইসলাম কোন শতাব্দীতে আরব থেকে ছড়িয়ে পড়ে?", options: { a: "৬ষ্ঠ", b: "৭ম", c: "৮ম", d: "৯ম" }, correctAnswer: "b" },
    { question: "আন্দালুসিয়া কোথায় অবস্থিত ছিল?", options: { a: "স্পেন", b: "মরক্কো", c: "তিউনিসিয়া", d: "আলজেরিয়া" }, correctAnswer: "a" },
    { question: "মুসলিমরা স্পেনে কত বছর শাসন করেন?", options: { a: "৫০০ বছর", b: "৬০০ বছর", c: "৭০০ বছর", d: "৮০০ বছর" }, correctAnswer: "d" },
    { question: "কর্ডোভা কোথায় অবস্থিত?", options: { a: "মরক্কো", b: "স্পেন", c: "পর্তুগাল", d: "ফ্রান্স" }, correctAnswer: "b" },
    { question: "আলহাম্বরা প্রাসাদ কোথায়?", options: { a: "মরক্কো", b: "স্পেন", c: "তুরস্ক", d: "মিসর" }, correctAnswer: "b" },
    { question: "তাজমহল কে নির্মাণ করেন?", options: { a: "আকবর", b: "শাহজাহান", c: "হুমায়ুন", d: "জাহাঙ্গীর" }, correctAnswer: "b" },
    { question: "তাজমহল কোথায় অবস্থিত?", options: { a: "দিল্লি", b: "আগ্রা", c: "লাহোর", d: "জয়পুর" }, correctAnswer: "b" },
    { question: "ইসলামে জ্ঞান অর্জন করা কী?", options: { a: "ফরজ", b: "সুন্নত", c: "নফল", d: "মুস্তাহাব" }, correctAnswer: "a" },
    { question: "প্রথম মুসলিম বিশ্ববিদ্যালয় কোথায় স্থাপিত হয়?", options: { a: "মক্কা", b: "মদিনা", c: "বাগদাদ", d: "মরক্কো" }, correctAnswer: "d" },
    { question: "আল-কারাউইন বিশ্ববিদ্যালয় কে প্রতিষ্ঠা করেন?", options: { a: "একজন মহিলা", b: "একজন খলিফা", c: "একজন আলেম", d: "একজন সুলতান" }, correctAnswer: "a" },
    { question: "ইবনে সিনা কে ছিলেন?", options: { a: "চিকিৎসক ও দার্শনিক", b: "শুধু আলেম", c: "শুধু কবি", d: "শুধু বিজ্ঞানী" }, correctAnswer: "a" },
    { question: "আল-খাওয়ারিজমি কিসের জনক?", options: { a: "রসায়ন", b: "বীজগণিত", c: "জ্যোতির্বিজ্ঞান", d: "চিকিৎসা" }, correctAnswer: "b" },
    { question: "ইবনে খালদুন কে ছিলেন?", options: { a: "ঐতিহাসিক ও সমাজবিজ্ঞানী", b: "চিকিৎসক", c: "গণিতবিদ", d: "জ্যোতির্বিদ" }, correctAnswer: "a" },
    { question: "আল-রাজি কে ছিলেন?", options: { a: "চিকিৎসক", b: "গণিতবিদ", c: "দার্শনিক", d: "কবি" }, correctAnswer: "a" },
    { question: "আল-বিরুনি কিসে অবদান রাখেন?", options: { a: "গণিত ও জ্যোতির্বিজ্ঞান", b: "শুধু কবিতা", c: "শুধু ইতিহাস", d: "শুধু ভূগোল" }, correctAnswer: "a" },
    { question: "বায়তুল হিকমাহ কী ছিল?", options: { a: "জ্ঞানের ঘর/গ্রন্থাগার", b: "মসজিদ", c: "প্রাসাদ", d: "দুর্গ" }, correctAnswer: "a" },
    { question: "বায়তুল হিকমাহ কোথায় ছিল?", options: { a: "মক্কা", b: "মদিনা", c: "বাগদাদ", d: "কায়রো" }, correctAnswer: "c" },
    { question: "আল-আজহার বিশ্ববিদ্যালয় কোথায়?", options: { a: "মক্কা", b: "মদিনা", c: "বাগদাদ", d: "কায়রো" }, correctAnswer: "d" },
    { question: "ইসলামে মদ্যপান কী?", options: { a: "মাকরুহ", b: "হারাম", c: "মুবাহ", d: "জায়েজ" }, correctAnswer: "b" },
    { question: "ইসলামে জুয়া খেলা কী?", options: { a: "মাকরুহ", b: "হালাল", c: "হারাম", d: "মুবাহ" }, correctAnswer: "c" },
    { question: "ইসলামে সুদ কী?", options: { a: "জায়েজ", b: "হারাম", c: "মাকরুহ", d: "মুবাহ" }, correctAnswer: "b" },
    { question: "ইসলামে শূকরের মাংস খাওয়া কী?", options: { a: "হালাল", b: "মাকরুহ", c: "হারাম", d: "মুবাহ" }, correctAnswer: "c" },
    { question: "ইসলামে মিথ্যা বলা কী?", options: { a: "জায়েজ", b: "হারাম", c: "মাকরুহ", d: "মুবাহ" }, correctAnswer: "b" },
    { question: "ইসলামে চুরি করা কী?", options: { a: "মাকরুহ", b: "হালাল", c: "হারাম", d: "মুবাহ" }, correctAnswer: "c" },
    { question: "ইসলামে পিতামাতার সেবা করা কী?", options: { a: "ফরজ", b: "সুন্নত", c: "নফল", d: "মুবাহ" }, correctAnswer: "a" },
    { question: "ইসলামে প্রতিবেশীর সাথে ভালো ব্যবহার কী?", options: { a: "ফরজ", b: "সুন্নত", c: "নফল", d: "মুবাহ" }, correctAnswer: "b" },
    { question: "ইসলামে এতিমদের দেখাশোনা কী?", options: { a: "ফরজ", b: "সুন্নত", c: "সওয়াবের কাজ", d: "মুবাহ" }, correctAnswer: "c" },
    { question: "ইসলামে বিধবাদের সাহায্য করা কী?", options: { a: "ফরজ", b: "সুন্নত", c: "সওয়াবের কাজ", d: "মুবাহ" }, correctAnswer: "c" },
    { question: "ইসলামে পর্দা করা কার জন্য ফরজ?", options: { a: "শুধু মহিলা", b: "শুধু পুরুষ", c: "উভয়ের জন্য", d: "কারো জন্য নয়" }, correctAnswer: "c" },
    { question: "হিজাব কী?", options: { a: "মহিলাদের পর্দা", b: "পুরুষদের পর্দা", c: "উভয়ের পর্দা", d: "কোনটিই নয়" }, correctAnswer: "a" },
    { question: "ইসলামে বিয়ে করা কী?", options: { a: "ফরজ", b: "সুন্নত", c: "মুস্তাহাব", d: "মুবাহ" }, correctAnswer: "b" },
    { question: "ইসলামে কতজন স্ত্রী রাখা যায়?", options: { a: "১ জন", b: "২ জন", c: "৩ জন", d: "৪ জন পর্যন্ত" }, correctAnswer: "d" },
    { question: "বিয়েতে মোহর কী?", options: { a: "স্ত্রীর প্রাপ্য সম্পদ", b: "স্বামীর প্রাপ্য", c: "পিতার প্রাপ্য", d: "কোনটিই নয়" }, correctAnswer: "a" },
    { question: "ইসলামে তালাক দেওয়া কী?", options: { a: "হারাম", b: "জায়েজ কিন্তু অপছন্দনীয়", c: "সুন্নত", d: "মুস্তাহাব" }, correctAnswer: "b" },
    { question: "ইদ্দত কী?", options: { a: "তালাকের পর অপেক্ষার সময়", b: "বিয়ের আগে সময়", c: "রোজার সময়", d: "হজ্জের সময়" }, correctAnswer: "a" },
    { question: "খুলা কী?", options: { a: "স্ত্রী কর্তৃক তালাক", b: "স্বামী কর্তৃক তালাক", c: "বিয়ে", d: "মোহর" }, correctAnswer: "a" },
    { question: "ইসলামে সন্তানের অধিকার কী?", options: { a: "ভালো নাম", b: "শিক্ষা", c: "ভরণপোষণ", d: "সবগুলো" }, correctAnswer: "d" },
    { question: "ইসলামে ছেলে ও মেয়ের অধিকার কেমন?", options: { a: "সমান", b: "ছেলের বেশি", c: "মেয়ের বেশি", d: "ভিন্ন ভিন্ন" }, correctAnswer: "d" },
    { question: "ইসলামে মিরাস কী?", options: { a: "উত্তরাধিকার", b: "দান", c: "ঋণ", d: "কোনটিই নয়" }, correctAnswer: "a" },
    { question: "ইসলামে ওসিয়ত কী?", options: { a: "উইল", b: "দান", c: "জাকাত", d: "সদকা" }, correctAnswer: "a" },
    { question: "ইসলামে আমানত কী?", options: { a: "গচ্ছিত সম্পদ", b: "ঋণ", c: "দান", d: "কোনটিই নয়" }, correctAnswer: "a" },
    { question: "ইসলামে ব্যবসা করা কী?", options: { a: "হালাল", b: "হারাম", c: "মাকরুহ", d: "জায়েজ নয়" }, correctAnswer: "a" },
    { question: "ইসলামে সততা কী?", options: { a: "ফরজ", b: "সুন্নত", c: "নফল", d: "মুবাহ" }, correctAnswer: "a" },
    { question: "ইসলামে প্রতারণা কী?", options: { a: "হালাল", b: "হারাম", c: "মাকরুহ", d: "জায়েজ" }, correctAnswer: "b" },
    { question: "ইসলামে পরিষ্কার-পরিচ্ছন্নতা কী?", options: { a: "ঈমানের অংশ", b: "শুধু সুন্নত", c: "নফল", d: "মুবাহ" }, correctAnswer: "a" },
    { question: "ইসলামে মিসকিন কে?", options: { a: "অভাবী ব্যক্তি", b: "ধনী ব্যক্তি", c: "সাহাবী", d: "আলেম" }, correctAnswer: "a" },
    { question: "ইসলামে ইয়াতিম কে?", options: { a: "এতিম", b: "বিধবা", c: "গরিব", d: "মুসাফির" }, correctAnswer: "a" },
    { question: "ইসলামে মুসাফির কে?", options: { a: "পথিক", b: "এতিম", c: "গরিব", d: "বিধবা" }, correctAnswer: "a" },
    { question: "ইসলামে কিসাস কী?", options: { a: "প্রতিশোধ", b: "ক্ষমা", c: "দান", d: "সদকা" }, correctAnswer: "a" },
    { question: "ইসলামে দিয়াত কী?", options: { a: "রক্তমূল্য", b: "জাকাত", c: "সদকা", d: "দান" }, correctAnswer: "a" },
    { question: "ইসলামে হুদুদ কী?", options: { a: "শরিয়া নির্ধারিত শাস্তি", b: "জাকাত", c: "সদকা", d: "দান" }, correctAnswer: "a" },
    { question: "ইসলামে তাযির কী?", options: { a: "বিচারকের বিবেচনা অনুযায়ী শাস্তি", b: "নির্ধারিত শাস্তি", c: "ক্ষমা", d: "দান" }, correctAnswer: "a" },
    { question: "ইসলামে শাহাদাত কী?", options: { a: "সাক্ষ্য", b: "শহীদ হওয়া", c: "উভয়টি", d: "কোনটিই নয়" }, correctAnswer: "c" },
    { question: "ইসলামে শাহিদ কে?", options: { a: "শহীদ", b: "সাক্ষী", c: "আলেম", d: "সাহাবী" }, correctAnswer: "a" },
    { question: "ইসলামে জিহাদ কী?", options: { a: "সংগ্রাম", b: "শুধু যুদ্ধ", c: "দান", d: "রোজা" }, correctAnswer: "a" },
    { question: "সবচেয়ে বড় জিহাদ কোনটি?", options: { a: "নফসের বিরুদ্ধে জিহাদ", b: "যুদ্ধ", c: "দান", d: "রোজা" }, correctAnswer: "a" },
    { question: "ইসলামে রিবা কী?", options: { a: "সুদ", b: "দান", c: "ব্যবসা", d: "জাকাত" }, correctAnswer: "a" },
    { question: "ইসলামে ঘুষ কী?", options: { a: "হারাম", b: "হালাল", c: "মাকরুহ", d: "জায়েজ" }, correctAnswer: "a" },
    { question: "ইসলামে গিবত কী?", options: { a: "পরনিন্দা", b: "প্রশংসা", c: "দোয়া", d: "জিকির" }, correctAnswer: "a" },
    { question: "ইসলামে নামিমা কী?", options: { a: "চোগলখোরি", b: "দান", c: "দোয়া", d: "প্রশংসা" }, correctAnswer: "a" },
    { question: "ইসলামে বুহতান কী?", options: { a: "মিথ্যা অপবাদ", b: "সত্য কথা", c: "প্রশংসা", d: "দোয়া" }, correctAnswer: "a" },
    { question: "ইসলামে হাসাদ কী?", options: { a: "হিংসা", b: "ভালোবাসা", c: "ক্ষমা", d: "দয়া" }, correctAnswer: "a" },
    { question: "ইসলামে রিয়া কী?", options: { a: "লোক দেখানো ইবাদত", b: "খালেস ইবাদত", c: "নফল ইবাদত", d: "ফরজ ইবাদত" }, correctAnswer: "a" },
    { question: "ইসলামে তাকওয়া কী?", options: { a: "আল্লাহভীতি", b: "ভয়", c: "দান", d: "রোজা" }, correctAnswer: "a" },
    { question: "ইসলামে ইহসান কী?", options: { a: "উত্তম আচরণ", b: "দান", c: "রোজা", d: "হজ্জ" }, correctAnswer: "a" },
    { question: "ইসলামে সবর কী?", options: { a: "ধৈর্য", b: "শোকর", c: "দান", d: "রোজা" }, correctAnswer: "a" },
    { question: "ইসলামে শোকর কী?", options: { a: "কৃতজ্ঞতা", b: "ধৈর্য", c: "দান", d: "রোজা" }, correctAnswer: "a" },
    { question: "ইসলামে তাওয়াক্কুল কী?", options: { a: "আল্লাহর উপর ভরসা", b: "ভয়", c: "দান", d: "রোজা" }, correctAnswer: "a" },
    { question: "ইসলামে ইখলাস কী?", options: { a: "আন্তরিকতা", b: "দান", c: "রোজা", d: "নামাজ" }, correctAnswer: "a" },
    { question: "ইসলামে তাওবা কী?", options: { a: "অনুশোচনা", b: "দান", c: "রোজা", d: "নামাজ" }, correctAnswer: "a" },
    { question: "ইসলামে ইস্তিগফার কিসের জন্য?", options: { a: "ক্ষমা চাওয়া", b: "শোকর করা", c: "দান করা", d: "রোজা রাখা" }, correctAnswer: "a" },
    { question: "ইসলামে দোয়া কী?", options: { a: "প্রার্থনা", b: "নামাজ", c: "রোজা", d: "হজ্জ" }, correctAnswer: "a" },
    { question: "দোয়া করার সর্বোত্তম সময় কখন?", options: { a: "সিজদায়", b: "দাঁড়িয়ে", c: "বসে", d: "শুয়ে" }, correctAnswer: "a" },
    { question: "দোয়া কবুলের শর্ত কী?", options: { a: "হালাল খাওয়া", b: "ধনী হওয়া", c: "সুন্দর হওয়া", d: "শক্তিশালী হওয়া" }, correctAnswer: "a" },
    { question: "ইসলামে মুনাজাত কী?", options: { a: "আল্লাহর সাথে কথা বলা", b: "নামাজ", c: "রোজা", d: "হজ্জ" }, correctAnswer: "a" }
  ],
  english: [
    { question: "What is the first pillar of Islam?", options: { a: "Prayer", b: "Fasting", c: "Shahada", d: "Hajj" }, correctAnswer: "c" },
    { question: "How many years was the Quran revealed?", options: { a: "20", b: "23", c: "25", d: "30" }, correctAnswer: "b" },
    { question: "Who is the last Prophet of Islam?", options: { a: "Prophet Isa", b: "Prophet Musa", c: "Prophet Muhammad", d: "Prophet Ibrahim" }, correctAnswer: "c" },
    { question: "Where is the Kaaba located?", options: { a: "Medina", b: "Mecca", c: "Jerusalem", d: "Baghdad" }, correctAnswer: "b" },
    { question: "Which month is Ramadan?", options: { a: "8th", b: "9th", c: "10th", d: "11th" }, correctAnswer: "b" },
    { question: "How many obligatory prayers are there in Islam?", options: { a: "3", b: "4", c: "5", d: "6" }, correctAnswer: "c" },
    { question: "In which month is Hajj performed?", options: { a: "Ramadan", b: "Shaban", c: "Dhul Hijjah", d: "Muharram" }, correctAnswer: "c" },
    { question: "How many Surahs are in the Quran?", options: { a: "110", b: "114", c: "120", d: "130" }, correctAnswer: "b" },
    { question: "Who must pay Zakat?", options: { a: "Everyone", b: "The wealthy", c: "Those with nisab amount", d: "The elderly" }, correctAnswer: "c" },
    { question: "When is Eid al-Fitr celebrated?", options: { a: "End of Ramadan", b: "After Hajj", c: "In Muharram", d: "In Rabi al-Awwal" }, correctAnswer: "a" },
    { question: "What is Islam's holy book called?", options: { a: "Torah", b: "Gospel", c: "Quran", d: "Psalms" }, correctAnswer: "c" },
    { question: "What is the Qibla for Muslims?", options: { a: "Kaaba", b: "Prophet's Mosque", c: "Al-Aqsa", d: "Taj Mahal" }, correctAnswer: "a" },
    { question: "In which month is Laylatul Qadr?", options: { a: "Shaban", b: "Ramadan", c: "Dhul Hijjah", d: "Muharram" }, correctAnswer: "b" },
    { question: "At what age did Prophet Muhammad receive prophethood?", options: { a: "35", b: "40", c: "45", d: "50" }, correctAnswer: "b" },
    { question: "What was the first mosque in Islam?", options: { a: "Prophet's Mosque", b: "Masjid al-Haram", c: "Masjid Quba", d: "Al-Aqsa Mosque" }, correctAnswer: "c" },
    { question: "Where was the Hijra from and to?", options: { a: "Medina to Mecca", b: "Mecca to Medina", c: "Mecca to Taif", d: "Yemen to Mecca" }, correctAnswer: "b" },
    { question: "Approximately how many Companions were there?", options: { a: "50,000", b: "80,000", c: "100,000", d: "124,000" }, correctAnswer: "d" },
    { question: "Who was the first Muezzin in Islam?", options: { a: "Abu Bakr", b: "Umar", c: "Bilal", d: "Ali" }, correctAnswer: "c" },
    { question: "Which Prophet was thrown into fire?", options: { a: "Prophet Ibrahim", b: "Prophet Musa", c: "Prophet Isa", d: "Prophet Nuh" }, correctAnswer: "a" },
    { question: "On which day of Hajj is the standing at Arafat?", options: { a: "8th Dhul Hijjah", b: "9th Dhul Hijjah", c: "10th Dhul Hijjah", d: "11th Dhul Hijjah" }, correctAnswer: "b" },
    { question: "How many Prophets are mentioned in the Quran?", options: { a: "25", b: "30", c: "35", d: "40" }, correctAnswer: "a" },
    { question: "Who was the first Caliph?", options: { a: "Umar", b: "Abu Bakr", c: "Uthman", d: "Ali" }, correctAnswer: "b" },
    { question: "What was Medina's previous name?", options: { a: "Yathrib", b: "Taif", c: "Khaybar", d: "Tabuk" }, correctAnswer: "a" },
    { question: "In which month did revelation begin?", options: { a: "Shaban", b: "Ramadan", c: "Rajab", d: "Muharram" }, correctAnswer: "b" },
    { question: "How many Fard rakats in Fajr prayer?", options: { a: "2", b: "3", c: "4", d: "5" }, correctAnswer: "a" },
    { question: "How many Fard rakats in Jumu'ah prayer?", options: { a: "2", b: "3", c: "4", d: "6" }, correctAnswer: "a" },
    { question: "In which month is Taraweeh prayed?", options: { a: "Shaban", b: "Ramadan", c: "Shawwal", d: "Dhul Hijjah" }, correctAnswer: "b" },
    { question: "Who first built the Kaaba?", options: { a: "Prophet Ibrahim", b: "Prophet Adam", c: "Prophet Nuh", d: "Prophet Ismail" }, correctAnswer: "a" },
    { question: "Where are Safa and Marwah hills?", options: { a: "Medina", b: "Mecca", c: "Jerusalem", d: "Taif" }, correctAnswer: "b" },
    { question: "What was Prophet Muhammad's father's name?", options: { a: "Abu Talib", b: "Abdullah", c: "Abdul Muttalib", d: "Abu Bakr" }, correctAnswer: "b" },
    { question: "What was Prophet Muhammad's mother's name?", options: { a: "Khadijah", b: "Aisha", c: "Aminah", d: "Fatimah" }, correctAnswer: "c" },
    { question: "What is Miraj?", options: { a: "Migration", b: "Prophet's ascension", c: "Battle", d: "Pilgrimage" }, correctAnswer: "b" },
    { question: "In which Hijri year was Battle of Badr?", options: { a: "1st", b: "2nd", c: "3rd", d: "4th" }, correctAnswer: "b" },
    { question: "In which Hijri year was Battle of Uhud?", options: { a: "2nd", b: "3rd", c: "4th", d: "5th" }, correctAnswer: "b" },
    { question: "In which Hijri year was Conquest of Mecca?", options: { a: "6th", b: "7th", c: "8th", d: "9th" }, correctAnswer: "c" },
    { question: "At what age did Prophet Muhammad pass away?", options: { a: "60", b: "63", c: "65", d: "70" }, correctAnswer: "b" },
    { question: "When is Qurbani performed?", options: { a: "Eid al-Fitr", b: "Eid al-Adha", c: "Laylatul Bara'ah", d: "Laylatul Qadr" }, correctAnswer: "b" },
    { question: "Suhoor is part of which worship?", options: { a: "Prayer", b: "Hajj", c: "Fasting", d: "Zakat" }, correctAnswer: "c" },
    { question: "What is Iftar?", options: { a: "Starting fast", b: "Breaking fast", c: "Prayer", d: "Supplication" }, correctAnswer: "b" },
    { question: "When is Tahajjud prayer performed?", options: { a: "Before Fajr", b: "After Dhuhr", c: "After Maghrib", d: "After Isha at night" }, correctAnswer: "d" },
    { question: "What is the first Surah of Quran?", options: { a: "Al-Baqarah", b: "Al-Fatihah", c: "An-Nas", d: "Al-Ikhlas" }, correctAnswer: "b" },
    { question: "What is the last Surah of Quran?", options: { a: "An-Nas", b: "Al-Falaq", c: "Al-Ikhlas", d: "Al-Kawthar" }, correctAnswer: "a" },
    { question: "Surah Yaseen is called what of the Quran?", options: { a: "Eye", b: "Heart", c: "Soul", d: "Life" }, correctAnswer: "b" },
    { question: "Which Surah contains Ayatul Kursi?", options: { a: "Al-Fatihah", b: "Al-Baqarah", c: "Al-Imran", d: "An-Nisa" }, correctAnswer: "b" },
    { question: "What is the greatest sin in Islam?", options: { a: "Lying", b: "Stealing", c: "Shirk", d: "Murder" }, correctAnswer: "c" },
    { question: "What is Halal food?", options: { a: "Fish", b: "Vegetables", c: "Islamically permissible food", d: "Fruits" }, correctAnswer: "c" },
    { question: "What is Haram?", options: { a: "Forbidden", b: "Sacred place", c: "Worship", d: "Food" }, correctAnswer: "a" },
    { question: "What is Wudu?", options: { a: "Bath", b: "Purification", c: "Pre-prayer preparation", d: "All of these" }, correctAnswer: "d" },
    { question: "How many Sajdas in each Rakat?", options: { a: "1 per Rakat", b: "2 per Rakat", c: "1 per prayer", d: "4 per prayer" }, correctAnswer: "b" },
    { question: "What does Adhan mean?", options: { a: "Call to prayer", b: "Worship", c: "Supplication", d: "Prayer" }, correctAnswer: "a" },
    { question: "Who was Khadijah (RA)?", options: { a: "Prophet's mother", b: "Prophet's first wife", c: "Prophet's daughter", d: "Prophet's sister" }, correctAnswer: "b" },
    { question: "Whose daughter was Aisha (RA)?", options: { a: "Umar", b: "Uthman", c: "Abu Bakr", d: "Ali" }, correctAnswer: "c" },
    { question: "Who was Fatimah (RA)?", options: { a: "Prophet's daughter", b: "Prophet's wife", c: "Prophet's mother", d: "Companion" }, correctAnswer: "a" },
    { question: "Whose children were Hasan and Husayn?", options: { a: "Abu Bakr", b: "Umar", c: "Ali", d: "Uthman" }, correctAnswer: "c" },
    { question: "What is the Islamic greeting?", options: { a: "Assalamu Alaikum", b: "Hello", c: "Namaste", d: "Greetings" }, correctAnswer: "a" },
    { question: "Upon whom is Durood recited?", options: { a: "Companions", b: "Prophet", c: "Caliphs", d: "Scholars" }, correctAnswer: "b" },
    { question: "What is Istighfar?", options: { a: "Seeking forgiveness", b: "Gratitude", c: "Praise", d: "Supplication" }, correctAnswer: "a" },
    { question: "What does Subhanallah mean?", options: { a: "Alhamdulillah", b: "Allah is Pure", c: "Allahu Akbar", d: "La ilaha illallah" }, correctAnswer: "b" },
    { question: "What does Alhamdulillah mean?", options: { a: "Praise be to Allah", b: "Allah is Great", c: "No god but Allah", d: "Allah is Pure" }, correctAnswer: "a" },
    { question: "What does Allahu Akbar mean?", options: { a: "Allah is Pure", b: "Allah is Greatest", c: "Praise Allah", d: "Allah is One" }, correctAnswer: "b" },
    { question: "What does La ilaha illallah mean?", options: { a: "No god but Allah", b: "Allah is Great", c: "Praise Allah", d: "Allah is Pure" }, correctAnswer: "a" },
    { question: "Keeping beard in Islam is?", options: { a: "Fard", b: "Sunnah", c: "Mustahab", d: "Nafl" }, correctAnswer: "b" },
    { question: "Using Miswak is?", options: { a: "Fard", b: "Sunnah", c: "Wajib", d: "Haram" }, correctAnswer: "b" },
    { question: "How many angels must we know about?", options: { a: "2", b: "4", c: "6", d: "10" }, correctAnswer: "d" },
    { question: "Angel Jibreel is responsible for?", options: { a: "Death", b: "Sustenance", c: "Revelation", d: "Rain" }, correctAnswer: "c" },
    { question: "Angel Mikail is responsible for?", options: { a: "Death", b: "Sustenance and rain", c: "Revelation", d: "Judgment" }, correctAnswer: "b" },
    { question: "What will Israfil blow?", options: { a: "Flute", b: "Trumpet", c: "Drum", d: "Instrument" }, correctAnswer: "b" },
    { question: "Angel Azrael is responsible for?", options: { a: "Revelation", b: "Sustenance", c: "Death", d: "Judgment" }, correctAnswer: "c" },
    { question: "Who are Munkar and Nakir?", options: { a: "Companions", b: "Angels of the grave", c: "Prophets", d: "Caliphs" }, correctAnswer: "b" },
    { question: "What is Qiyamah?", options: { a: "Day of Hajj", b: "Ramadan", c: "Day of Judgment", d: "New Year" }, correctAnswer: "c" },
    { question: "What is Jannah?", options: { a: "Hell", b: "Paradise", c: "Earth", d: "Mosque" }, correctAnswer: "b" },
    { question: "What is Jahannam?", options: { a: "Paradise", b: "Earth", c: "Hell", d: "Grave" }, correctAnswer: "c" },
    { question: "What is Hashr?", options: { a: "Battlefield", b: "Day of Judgment gathering", c: "Mosque", d: "Hajj place" }, correctAnswer: "b" },
    { question: "What is Pul Sirat?", options: { a: "A bridge", b: "A mountain", c: "A river", d: "A mosque" }, correctAnswer: "a" },
    { question: "What is Mizan?", options: { a: "Scale of deeds", b: "Sword", c: "Book", d: "Flag" }, correctAnswer: "a" },
    { question: "What is Hawd al-Kawthar?", options: { a: "River", b: "Lake", c: "Spring", d: "Lake of Paradise" }, correctAnswer: "d" },
    { question: "What is Shafa'ah?", options: { a: "Intercession", b: "Charity", c: "Prayer", d: "Fasting" }, correctAnswer: "a" },
    { question: "What is Taqdeer?", options: { a: "Destiny", b: "Fasting", c: "Prayer", d: "Hajj" }, correctAnswer: "a" },
    { question: "What is Iman?", options: { a: "Faith", b: "Action", c: "Charity", d: "Worship" }, correctAnswer: "a" },
    { question: "How many pillars of Iman are there?", options: { a: "5", b: "6", c: "7", d: "8" }, correctAnswer: "c" },
    { question: "Belief in angels is?", options: { a: "Fard", b: "Sunnah", c: "Mustahab", d: "Nafl" }, correctAnswer: "a" },
    { question: "How long did Prophet Nuh call his people?", options: { a: "500 years", b: "750 years", c: "950 years", d: "1000 years" }, correctAnswer: "c" },
    { question: "What did Prophet Nuh build during the flood?", options: { a: "House", b: "Ark", c: "Mosque", d: "Fort" }, correctAnswer: "b" },
    { question: "Where was Prophet Ibrahim born?", options: { a: "Egypt", b: "Iraq", c: "Syria", d: "Palestine" }, correctAnswer: "b" },
    { question: "Whose son was Prophet Ismail?", options: { a: "Prophet Nuh", b: "Prophet Ibrahim", c: "Prophet Musa", d: "Prophet Isa" }, correctAnswer: "b" },
    { question: "Whose son was Prophet Ishaq?", options: { a: "Prophet Ibrahim", b: "Prophet Nuh", c: "Prophet Lut", d: "Prophet Yaqub" }, correctAnswer: "a" },
    { question: "Whose son was Prophet Yusuf?", options: { a: "Prophet Ibrahim", b: "Prophet Ishaq", c: "Prophet Yaqub", d: "Prophet Ismail" }, correctAnswer: "c" },
    { question: "Where was Prophet Yusuf sold?", options: { a: "Syria", b: "Egypt", c: "Iraq", d: "Yemen" }, correctAnswer: "b" },
    { question: "In which river was Prophet Musa placed?", options: { a: "Euphrates", b: "Nile", c: "Jordan", d: "Tigris" }, correctAnswer: "b" },
    { question: "Who did Prophet Musa defeat?", options: { a: "Nimrod", b: "Pharaoh", c: "Haman", d: "Qarun" }, correctAnswer: "b" },
    { question: "On which mountain did Prophet Musa speak to Allah?", options: { a: "Judi", b: "Sinai", c: "Tur", d: "Arafat" }, correctAnswer: "c" },
    { question: "Who was Prophet Dawud?", options: { a: "Prophet and King", b: "Only Prophet", c: "Companion", d: "Angel" }, correctAnswer: "a" },
    { question: "Whose son was Prophet Sulaiman?", options: { a: "Prophet Musa", b: "Prophet Dawud", c: "Prophet Ibrahim", d: "Prophet Yusuf" }, correctAnswer: "b" },
    { question: "Prophet Sulaiman understood the language of?", options: { a: "Animals and birds", b: "Only humans", c: "Angels", d: "Jinn" }, correctAnswer: "a" },
    { question: "Where was Prophet Isa born?", options: { a: "Jerusalem", b: "Nazareth", c: "Bethlehem", d: "Damascus" }, correctAnswer: "c" },
    { question: "What was Prophet Isa's mother's name?", options: { a: "Hawwa", b: "Maryam", c: "Asiya", d: "Sarah" }, correctAnswer: "b" },
    { question: "Was Prophet Isa raised to heaven?", options: { a: "Yes", b: "No", c: "Unknown", d: "Maybe" }, correctAnswer: "a" },
    { question: "How long was Prophet Yunus in the whale?", options: { a: "1 day", b: "3 days", c: "7 days", d: "40 days" }, correctAnswer: "b" },
    { question: "Prophet Ayyub is famous for?", options: { a: "Patience", b: "Knowledge", c: "Strength", d: "Wealth" }, correctAnswer: "a" },
    { question: "Who was Prophet Yahya?", options: { a: "Prophet Isa's cousin", b: "Prophet Musa's brother", c: "Prophet Ibrahim's son", d: "Prophet Nuh's son" }, correctAnswer: "a" },
    { question: "What happened on Day of Ashura?", options: { a: "Prophet Musa crossed sea", b: "Prophet Nuh's ark settled", c: "Both", d: "Neither" }, correctAnswer: "c" },
    { question: "Fasting on Ashura is?", options: { a: "Fard", b: "Sunnah", c: "Nafl", d: "Wajib" }, correctAnswer: "c" },
    { question: "In which month is Laylatul Bara'ah?", options: { a: "Rajab", b: "Shaban", c: "Ramadan", d: "Dhul Hijjah" }, correctAnswer: "b" },
    { question: "What is Laylatul Qadr also called?", options: { a: "Laylatul Bara'ah", b: "Laylatul Miraj", c: "Night of Power", d: "Ashura" }, correctAnswer: "c" },
    { question: "Laylatul Qadr is better than how many months?", options: { a: "One thousand", b: "Ten thousand", c: "One hundred thousand", d: "No answer" }, correctAnswer: "a" },
    { question: "In which month is Laylatul Miraj?", options: { a: "Rajab", b: "Shaban", c: "Ramadan", d: "Dhul Hijjah" }, correctAnswer: "a" },
    { question: "Who did the Prophet meet in Miraj?", options: { a: "Companions", b: "Previous Prophets", c: "Angels", d: "Caliphs" }, correctAnswer: "b" },
    { question: "How many prayers were prescribed in Miraj?", options: { a: "3", b: "5", c: "7", d: "9" }, correctAnswer: "b" },
    { question: "Initially how many prayers were obligatory?", options: { a: "5", b: "25", c: "50", d: "100" }, correctAnswer: "c" },
    { question: "How many times did Prophet Musa ask to reduce?", options: { a: "5 times", b: "7 times", c: "9 times", d: "10 times" }, correctAnswer: "c" },
    { question: "What does Eid mean?", options: { a: "Day of joy", b: "Festival", c: "Return", d: "All of these" }, correctAnswer: "d" },
    { question: "How many Eids in Islam?", options: { a: "1", b: "2", c: "3", d: "4" }, correctAnswer: "b" },
    { question: "Why is Eid al-Adha celebrated?", options: { a: "End of fasting", b: "Commemoration of Prophet Ibrahim's sacrifice", c: "Start of Hajj", d: "New Year" }, correctAnswer: "b" },
    { question: "Into how many parts is Qurbani meat divided?", options: { a: "2 parts", b: "3 parts", c: "4 parts", d: "5 parts" }, correctAnswer: "b" },
    { question: "Who receives Qurbani meat?", options: { a: "Only family", b: "Poor, relatives, and self", c: "Only poor", d: "Only relatives" }, correctAnswer: "b" },
    { question: "Who did Prophet Ibrahim intend to sacrifice?", options: { a: "Prophet Ishaq", b: "Prophet Ismail", c: "Prophet Yaqub", d: "Prophet Yusuf" }, correctAnswer: "b" },
    { question: "What did Allah send instead of sacrifice?", options: { a: "Camel", b: "Cow", c: "Ram", d: "Goat" }, correctAnswer: "c" },
    { question: "How many Fard in Hajj?", options: { a: "2", b: "3", c: "4", d: "5" }, correctAnswer: "b" },
    { question: "What is Umrah?", options: { a: "Major Hajj", b: "Minor Hajj", c: "Fasting", d: "Prayer" }, correctAnswer: "b" },
    { question: "What is worn during Hajj?", options: { a: "Normal clothes", b: "Ihram", c: "White robe", d: "Any clothes" }, correctAnswer: "b" },
    { question: "What is Tawaf?", options: { a: "Circling Kaaba", b: "Running", c: "Reciting prayers", d: "Praying" }, correctAnswer: "a" },
    { question: "How many times is Tawaf performed?", options: { a: "5 times", b: "7 times", c: "9 times", d: "11 times" }, correctAnswer: "b" },
    { question: "What is Sa'i?", options: { a: "Running between Safa and Marwah", b: "Tawaf", c: "Prayer", d: "Supplication" }, correctAnswer: "a" },
    { question: "What is thrown at Jamarat?", options: { a: "Flowers", b: "Pebbles", c: "Water", d: "Soil" }, correctAnswer: "b" },
    { question: "Stoning Jamarat symbolizes?", options: { a: "Rejecting Satan", b: "Forgiveness", c: "Joy", d: "None" }, correctAnswer: "a" },
    { question: "What is Hajar al-Aswad?", options: { a: "Black Stone", b: "White Stone", c: "Red Stone", d: "Green Stone" }, correctAnswer: "a" },
    { question: "Where is Zamzam well located?", options: { a: "Medina", b: "Mecca", c: "Jerusalem", d: "Taif" }, correctAnswer: "b" },
    { question: "Who discovered Zamzam well?", options: { a: "Prophet Ibrahim", b: "Prophet Ismail", c: "Hajar", d: "Abdul Muttalib" }, correctAnswer: "d" },
    { question: "When is Zakat obligatory?", options: { a: "When nisab is reached", b: "Every month", c: "Once a year", d: "Once in lifetime" }, correctAnswer: "a" },
    { question: "What is the Zakat rate?", options: { a: "1%", b: "2.5%", c: "5%", d: "10%" }, correctAnswer: "b" },
    { question: "What is Sadaqah?", options: { a: "Obligatory charity", b: "Voluntary charity", c: "Zakat", d: "Qurbani" }, correctAnswer: "b" },
    { question: "When is Sadaqatul Fitr given?", options: { a: "Before Eid al-Fitr", b: "Before Eid al-Adha", c: "Anytime", d: "Once a year" }, correctAnswer: "a" },
    { question: "Who must give Fitrah?", options: { a: "Only wealthy", b: "Who has food on Eid", c: "Only poor", d: "No one" }, correctAnswer: "b" },
    { question: "Who can receive Zakat?", options: { a: "8 categories", b: "Anyone", c: "Only poor", d: "Only relatives" }, correctAnswer: "a" },
    { question: "What is Nafl worship?", options: { a: "Obligatory", b: "Wajib", c: "Voluntary", d: "Sunnah" }, correctAnswer: "c" },
    { question: "What is Sunnah?", options: { a: "Obligatory", b: "Prophet's tradition", c: "Haram", d: "Makruh" }, correctAnswer: "b" },
    { question: "What is Wajib?", options: { a: "Near to Fard", b: "Sunnah", c: "Nafl", d: "Haram" }, correctAnswer: "a" },
    { question: "What is Makruh?", options: { a: "Forbidden", b: "Disliked", c: "Obligatory", d: "Sunnah" }, correctAnswer: "b" },
    { question: "What is Mubah?", options: { a: "Haram", b: "Fard", c: "Permissible", d: "Makruh" }, correctAnswer: "c" },
    { question: "What is Hadith?", options: { a: "Quran", b: "Prophet's sayings and actions", c: "Tafsir", d: "Fiqh" }, correctAnswer: "b" },
    { question: "Most authentic Hadith book?", options: { a: "Sahih Bukhari", b: "Sahih Muslim", c: "Both", d: "Tirmidhi" }, correctAnswer: "c" },
    { question: "What are the six major Hadith books called?", options: { a: "Kutub al-Sittah", b: "Sahih", c: "Musnad", d: "Sunan" }, correctAnswer: "a" },
    { question: "What is Tafsir?", options: { a: "Hadith", b: "Quranic commentary", c: "Fiqh", d: "Sirah" }, correctAnswer: "b" },
    { question: "What is Sirah?", options: { a: "Prophet's biography", b: "Hadith", c: "Quran", d: "Tafsir" }, correctAnswer: "a" },
    { question: "What is Fiqh?", options: { a: "Islamic jurisprudence", b: "Hadith", c: "Quran", d: "Sirah" }, correctAnswer: "a" },
    { question: "Who is a Mujtahid?", options: { a: "Hadith scholar", b: "Fiqh expert", c: "Quran reciter", d: "Mufti" }, correctAnswer: "b" },
    { question: "Who is a Mufti?", options: { a: "Fatwa issuer", b: "Imam", c: "Khatib", d: "Muezzin" }, correctAnswer: "a" },
    { question: "Who is a Khatib?", options: { a: "Prayer Imam", b: "Friday sermon giver", c: "Muezzin", d: "Hafiz" }, correctAnswer: "b" },
    { question: "Who is a Hafiz?", options: { a: "Quran memorizer", b: "Imam", c: "Mufti", d: "Scholar" }, correctAnswer: "a" },
    { question: "Who is a Qari?", options: { a: "Beautiful reciter", b: "Imam", c: "Hafiz", d: "Mufti" }, correctAnswer: "a" }
  ]
};

// Working API URLs to try
const workingApis = [
  "https://islamic-api-zhiyon.vercel.app",
  "https://quran-api.santrikoding.com",
  "https://api.alquran.cloud"
];

const getRandomQuiz = (category) => {
  const quizArray = backupQuizzes[category] || backupQuizzes.bangla;
  const randomIndex = Math.floor(Math.random() * quizArray.length);
  return quizArray[randomIndex];
};

module.exports = {
  config: {
    name: "islamictrivia",
    aliases: [],
    version: "2.0",
    author: "Asif",
    countDown: 10,
    role: 0,
    category: "game",
    guide: {
      en: "{p}islamictrivia [bn|en] - Play Islamic trivia quiz"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    try {
      const input = args.join("").toLowerCase() || "bn";
      const category = input === "en" || input === "english" ? "english" : "bangla";

      console.log(`🎯 Fetching ${category} quiz...`);

      let quiz = null;
      let apiWorked = false;

      // Try working APIs first
      for (const apiUrl of workingApis) {
        try {
          const res = await axios.get(`${apiUrl}/quiz?category=${category}`, {
            timeout: 5000
          });
          
          if (res.data && res.data.question && res.data.correctAnswer && res.data.options) {
            quiz = res.data;
            apiWorked = true;
            console.log(`✅ API worked: ${apiUrl}`);
            break;
          }
        } catch (apiError) {
          console.log(`❌ API failed: ${apiUrl}`);
          continue;
        }
      }

      // Use backup if all APIs failed
      if (!apiWorked) {
        console.log(`📦 Using backup quiz database`);
        quiz = getRandomQuiz(category);
      }

      if (!quiz || !quiz.question || !quiz.correctAnswer || !quiz.options) {
        return message.reply("❌ Failed to load quiz. Please try again.");
      }

      const { question, correctAnswer, options } = quiz;
      const { a, b, c, d } = options;
      
      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ A) ${a}\n├‣ B) ${b}\n├‣ C) ${c}\n├‣ D) ${d}\n╰──────────────────‣\nReply with your answer (A, B, C, or D).`,
      };

      message.reply(quizMsg, (error, info) => {
        if (error) {
          console.error("❌ Failed to send quiz message:", error);
          return message.reply("❌ Failed to start quiz. Please try again.");
        }

        if (!global.client.handleReply) {
          global.client.handleReply = [];
        }

        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          correctAnswer: correctAnswer.toLowerCase(),
          timestamp: Date.now()
        });

        console.log(`✅ Quiz started for user ${event.senderID}, correct answer: ${correctAnswer}`);

        // Set timeout for quiz
        setTimeout(() => {
          const quizIndex = global.client.handleReply.findIndex(item => item.messageID === info.messageID);
          if (quizIndex !== -1) {
            message.reply(`⏰ Quiz timeout! The correct answer was: ${correctAnswer.toUpperCase()}`);
            global.client.handleReply.splice(quizIndex, 1);
            console.log(`⏰ Quiz timed out for message ID: ${info.messageID}`);
          }
        }, 40000);

      });

    } catch (error) {
      console.error("💥 Islamic Trivia Error:", error);
      message.reply("❌ An error occurred. Please try again later.");
    }
  },

  onReply: async function ({ event, message, Reply, usersData }) {
    try {
      const { correctAnswer, author, timestamp } = Reply;
      
      // Check if quiz is expired (more than 45 seconds)
      if (Date.now() - timestamp > 45000) {
        return message.reply("⏰ This quiz has expired. Please start a new one.");
      }

      if (event.senderID !== author) {
        return message.reply("❌ This is not your quiz.");
      }

      const userReply = event.body.trim().toLowerCase();
      const validAnswers = ['a', 'b', 'c', 'd'];

      if (!validAnswers.includes(userReply)) {
        return message.reply("❌ Please reply with A, B, C, or D only.");
      }

      if (userReply === correctAnswer) {
        const rewardCoins = 500;
        const rewardExp = 121;
        
        try {
          const userData = await usersData.get(author);
          
          await usersData.set(author, {
            money: (userData.money || 0) + rewardCoins,
            exp: (userData.exp || 0) + rewardExp,
            data: userData.data || {}
          });
          
          console.log(`✅ User ${author} answered correctly, rewarded ${rewardCoins} coins & ${rewardExp} exp`);
          
          message.reply(`✅ | Correct answer!\nYou earned ${rewardCoins} coins & ${rewardExp} exp.`);
        } catch (userError) {
          console.error("❌ Error updating user data:", userError);
          message.reply(`✅ | Correct answer! (Rewards not applied due to error)`);
        }
      } else {
        console.log(`❌ User ${author} answered incorrectly: ${userReply}, correct: ${correctAnswer}`);
        message.reply(`❌ | Wrong answer!\nThe correct answer was: ${correctAnswer.toUpperCase()}`);
      }

      // Remove the reply handler
      const replyIndex = global.client.handleReply.findIndex(item => item.messageID === Reply.messageID);
      if (replyIndex !== -1) {
        global.client.handleReply.splice(replyIndex, 1);
        console.log(`🧹 Cleaned up quiz handler for message ID: ${Reply.messageID}`);
      }

    } catch (error) {
      console.error("💥 Reply Error:", error);
      message.reply("❌ An error occurred while processing your answer.");
    }
  }
};
