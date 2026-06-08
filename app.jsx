import { useState, useMemo, useEffect } from "react";

// ─── BRAND ────────────────────────────────────────────────────────────────────
// Magna Foodservice brand colours — see Drive: "Magna Brand Reference — Stock App.md"
const B = {
  teal:      "#00A29E",  // PMS 326C — primary brand
  tealLight: "#89CCCA",  // PMS 564C — light teal
  navy:      "#213B87",  // PMS 7687C — deep navy
  navyDark:  "#11284B",  // PMS 2767C — darkest navy
  charcoal:  "#222A31",  // PMS 433C — dark charcoal
  offWhite:  "#F4F4F4",  // PMS 663C — off white
  amber:     "#F59E19",  // PMS 1375C — accent
  orange:    "#EC672C",  // PMS 7579C — warning
  red:       "#E63312",  // PMS 485C — danger
  yellow:    "#FFCC00",  // PMS 116C — highlight
  // App surfaces
  bg:        "#0b1420",  // deep navy-black background
  surface:   "#11284B",  // navy card surface
  surfaceHi: "#1a3460",  // lighter navy for hover/selected
  border:    "#1e3a5f",  // navy border
  borderHi:  "#00A29E",  // teal border on active
  text:      "#F4F4F4",  // off-white text
  muted:     "#89CCCA",  // light teal for secondary text
  dimmed:    "#4a7a8a",  // dim text
};

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// ─── STAFF ROSTER ────────────────────────────────────────────────────────────
// Add/remove staff here. PIN must be unique per person.
const STAFF = [
  { pin:"1984", name:"Manager",    role:"Admin",    lang:"en" },
  { pin:"2201", name:"Ali",        role:"Warehouse", lang:"pa" },
  { pin:"3345", name:"Ben",        role:"Warehouse", lang:"ro" },
  { pin:"4412", name:"Carlos",     role:"Warehouse", lang:"en" },
  { pin:"5567", name:"Dana",       role:"Warehouse", lang:"el" },
  { pin:"6623", name:"Emma",       role:"Warehouse", lang:"ur" },
];
function findStaff(pin){ return STAFF.find(s=>s.pin===pin)||null; }

// ─── LANGUAGES ────────────────────────────────────────────────────────────────
const LANGS = {
  en: {
    code:"en", name:"English", dir:"ltr",
    // PIN screen
    pinTitle:"Container Stock Control",
    pinSubtitle:"Authorised Access Only",
    pinWrong:"Incorrect PIN — Try Again",
    pinWelcome:(name)=>`Welcome, ${name}`,
    // Nav
    navFind:"Find",
    navContainer:"Container",
    navUpdate:"Update",
    navDashboard:"Dashboard",
    navLog:"Log",
    // Find
    findTitle:"Find Product",
    findPlaceholder:"Search by product code or name…",
    findEmpty:(n)=>`Start typing to search all ${n} stock records`,
    findNoResults:(q)=>`No results found for "${q}"`,
    findHint:"Hover a result to preview · tap to pin location",
    findTapHint:"Tap to select",
    findLocated:"Pinned",
    findPreview:"PREVIEW",
    findYardHint:"Search above",
    findYardResults:"Hover a result to preview · tap to pin location",
    // Container
    containerTitle:"View Container",
    containerTap:"Tap a container to view its contents",
    containerNoStock:(c)=>`No stock in ${c}`,
    containerSelectHint:"Select a container above to view its contents",
    // Update
    updateTitle:"Add / Remove Stock",
    updateExisting:"Update Existing",
    updateNew:"New Location",
    // Existing stock
    searchPlaceholder:"Code or name…",
    searchLocate:"Search to locate",
    searchFoundIn:(locs)=>`Found in: ${locs}`,
    searchUpdating:(c)=>`Updating: ${c}`,
    searchNotFound:"Not found — use New Location tab to add",
    searchTapRecord:"Tap a record",
    searchHoverHint:"Hover or tap to preview · tap to select",
    searchSelected:"Selected — tap to change",
    actionLabel:"Action",
    actionAdd:"+ Add",
    actionRemove:"− Remove",
    casesLabel:"Number of Cases",
    newQtyLabel:(n)=>`New quantity: ${n} cases`,
    confirmBtn:(a)=>`Confirm ${a}`,
    // New location
    catalogueSearch:"Type code or name to search catalogue…",
    autofilled:"Auto-filled",
    alreadyStocked:"Already stocked in:",
    alreadyDimHint:"These containers are dimmed — select a different one.",
    selectContainer:"Select Container",
    containerSelected:(c)=>`Container: ${c} selected — tap to change`,
    tapContainer:"Tap a container below",
    casesNum:"Number of Cases",
    addToStock:"Add to Stock",
    // Dashboard
    dashOverview:"Overview",
    dashProducts:"By Product",
    dashLocations:"By Location",
    dashActivity:"Activity",
    dashStockOverview:"Stock Overview",
    dashTotalCases:"Total Cases",
    dashStockLines:"Stock Lines",
    dashUniqueSKUs:"Unique SKUs",
    dashContainers:"Containers",
    dashUtilisation:"Container Utilisation",
    dashTopProducts:"Top 5 Products by Quantity",
    dashNoActivity:"No activity recorded yet",
    dashActivityHint:"Every stock update appears here as a timeline entry",
    dashCasesChanged:"CASES CHANGED PER UPDATE",
    dashTimeline:"Chronological Timeline",
    dashAllProducts:(n)=>`All Products — ${n} SKUs`,
    dashSortedQty:"Sorted by total qty",
    dashAllContainers:"All 16 Containers — Full Product Lists",
    dashNoStock:"No stock",
    dashNoChanges:"No changes recorded yet in this session",
    // Log
    logTitle:"Change Log",
    logRecords:(n)=>`${n} record${n!==1?"s":""} this session`,
    logAdded:"Added",
    logRemoved:"Removed",
    logNew:"New",
    logEmpty:"No activity recorded yet. Updates made via the Update tab will appear here.",
    // Toasts
    toastAdded:(n,code,c)=>`+${n} cases · ${code} · ${c}`,
    toastRemoved:(n,code,c)=>`-${n} cases · ${code} · ${c}`,
    toastNewLoc:(code,c,n)=>`Added · ${code} · ${c} · ${n} cases`,
    toastSelectFirst:"Select a record first",
    toastEnterCases:"Enter number of cases",
    toastCannotRemove:"Cannot remove more than current qty",
    toastSelectProduct:"Select a product from catalogue",
    toastSelectContainer:"Select a container",
    toastAlreadyExists:(code,c)=>`${code} already in ${c} — use Update Existing`,
    // Misc
    cases:"cases",
    now:"now",
    total:"total",
    firstFloor:"First Floor",
    groundFloor:"Ground Floor",
    inUse:"In use",
    allContainers:"All containers",
    productLocations:"Product-locations",
    productCodes:"Product codes",
    across:"across",
  },
  pa: {
    code:"pa", name:"ਪੰਜਾਬੀ", dir:"ltr",
    pinTitle:"ਕੰਟੇਨਰ ਸਟਾਕ ਕੰਟਰੋਲ",
    pinSubtitle:"ਅਧਿਕਾਰਤ ਪਹੁੰਚ ਸਿਰਫ਼",
    pinWrong:"ਗਲਤ PIN — ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    pinWelcome:(name)=>`ਜੀ ਆਇਆਂ, ${name}`,
    navFind:"ਲੱਭੋ",
    navContainer:"ਕੰਟੇਨਰ",
    navUpdate:"ਅਪਡੇਟ",
    navDashboard:"ਡੈਸ਼ਬੋਰਡ",
    navLog:"ਲੌਗ",
    findTitle:"ਉਤਪਾਦ ਲੱਭੋ",
    findPlaceholder:"ਕੋਡ ਜਾਂ ਨਾਮ ਨਾਲ ਖੋਜੋ…",
    findEmpty:(n)=>`ਸਾਰੇ ${n} ਰਿਕਾਰਡ ਖੋਜਣ ਲਈ ਟਾਈਪ ਕਰੋ`,
    findNoResults:(q)=>`"${q}" ਲਈ ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ`,
    findHint:"ਪੂਰਵਦਰਸ਼ਨ ਲਈ ਹੋਵਰ ਕਰੋ · ਟੈਪ ਕਰਕੇ ਚੁਣੋ",
    findTapHint:"ਚੁਣਨ ਲਈ ਟੈਪ ਕਰੋ",
    findLocated:"ਪਿੰਨ ਕੀਤਾ",
    findPreview:"ਝਲਕ",
    findYardHint:"ਉੱਪਰ ਖੋਜੋ",
    findYardResults:"ਪੂਰਵਦਰਸ਼ਨ ਲਈ ਹੋਵਰ ਕਰੋ · ਟੈਪ ਕਰੋ",
    containerTitle:"ਕੰਟੇਨਰ ਦੇਖੋ",
    containerTap:"ਸਟਾਕ ਦੇਖਣ ਲਈ ਕੰਟੇਨਰ ਟੈਪ ਕਰੋ",
    containerNoStock:(c)=>`${c} ਵਿੱਚ ਕੋਈ ਸਟਾਕ ਨਹੀਂ`,
    containerSelectHint:"ਉੱਪਰ ਕੰਟੇਨਰ ਚੁਣੋ",
    updateTitle:"ਸਟਾਕ ਜੋੜੋ / ਹਟਾਓ",
    updateExisting:"ਮੌਜੂਦਾ ਅਪਡੇਟ",
    updateNew:"ਨਵੀਂ ਥਾਂ",
    searchPlaceholder:"ਕੋਡ ਜਾਂ ਨਾਮ…",
    searchLocate:"ਖੋਜਣ ਲਈ ਟਾਈਪ ਕਰੋ",
    searchFoundIn:(locs)=>`ਇੱਥੇ ਮਿਲਿਆ: ${locs}`,
    searchUpdating:(c)=>`ਅਪਡੇਟ: ${c}`,
    searchNotFound:"ਨਹੀਂ ਮਿਲਿਆ — ਨਵੀਂ ਥਾਂ ਵਰਤੋ",
    searchTapRecord:"ਰਿਕਾਰਡ ਟੈਪ ਕਰੋ",
    searchHoverHint:"ਹੋਵਰ ਜਾਂ ਟੈਪ ਕਰੋ",
    searchSelected:"ਚੁਣਿਆ — ਬਦਲਣ ਲਈ ਟੈਪ ਕਰੋ",
    actionLabel:"ਕਾਰਵਾਈ",
    actionAdd:"+ ਜੋੜੋ",
    actionRemove:"− ਹਟਾਓ",
    casesLabel:"ਕੇਸਾਂ ਦੀ ਗਿਣਤੀ",
    newQtyLabel:(n)=>`ਨਵੀਂ ਮਾਤਰਾ: ${n} ਕੇਸ`,
    confirmBtn:(a)=>`${a} ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ`,
    catalogueSearch:"ਕੋਡ ਜਾਂ ਨਾਮ ਟਾਈਪ ਕਰੋ…",
    autofilled:"ਆਟੋ-ਭਰਿਆ",
    alreadyStocked:"ਪਹਿਲਾਂ ਤੋਂ ਸਟੋਰ ਹੈ:",
    alreadyDimHint:"ਇਹ ਕੰਟੇਨਰ ਧੁੰਦਲੇ ਹਨ — ਵੱਖਰਾ ਚੁਣੋ।",
    selectContainer:"ਕੰਟੇਨਰ ਚੁਣੋ",
    containerSelected:(c)=>`ਚੁਣਿਆ: ${c} — ਬਦਲਣ ਲਈ ਟੈਪ ਕਰੋ`,
    tapContainer:"ਕੰਟੇਨਰ ਟੈਪ ਕਰੋ",
    casesNum:"ਕੇਸਾਂ ਦੀ ਗਿਣਤੀ",
    addToStock:"ਸਟਾਕ ਵਿੱਚ ਜੋੜੋ",
    dashOverview:"ਸੰਖੇਪ",
    dashProducts:"ਉਤਪਾਦ ਅਨੁਸਾਰ",
    dashLocations:"ਥਾਂ ਅਨੁਸਾਰ",
    dashActivity:"ਗਤੀਵਿਧੀ",
    dashStockOverview:"ਸਟਾਕ ਸੰਖੇਪ",
    dashTotalCases:"ਕੁੱਲ ਕੇਸ",
    dashStockLines:"ਸਟਾਕ ਲਾਈਨਾਂ",
    dashUniqueSKUs:"ਵੱਖਰੇ SKU",
    dashContainers:"ਕੰਟੇਨਰ",
    dashUtilisation:"ਕੰਟੇਨਰ ਵਰਤੋਂ",
    dashTopProducts:"ਚੋਟੀ ਦੇ 5 ਉਤਪਾਦ",
    dashNoActivity:"ਕੋਈ ਗਤੀਵਿਧੀ ਨਹੀਂ",
    dashActivityHint:"ਹਰ ਸਟਾਕ ਅਪਡੇਟ ਇੱਥੇ ਦਿਖੇਗਾ",
    dashCasesChanged:"ਪ੍ਰਤੀ ਅਪਡੇਟ ਕੇਸ",
    dashTimeline:"ਕ੍ਰਮਵਾਰ ਸਮਾਂਰੇਖਾ",
    dashAllProducts:(n)=>`ਸਾਰੇ ਉਤਪਾਦ — ${n} SKU`,
    dashSortedQty:"ਮਾਤਰਾ ਅਨੁਸਾਰ",
    dashAllContainers:"ਸਾਰੇ 16 ਕੰਟੇਨਰ",
    dashNoStock:"ਕੋਈ ਸਟਾਕ ਨਹੀਂ",
    dashNoChanges:"ਕੋਈ ਬਦਲਾਅ ਨਹੀਂ",
    logTitle:"ਬਦਲਾਅ ਲੌਗ",
    logRecords:(n)=>`${n} ਰਿਕਾਰਡ`,
    logAdded:"ਜੋੜਿਆ",
    logRemoved:"ਹਟਾਇਆ",
    logNew:"ਨਵਾਂ",
    logEmpty:"ਕੋਈ ਗਤੀਵਿਧੀ ਨਹੀਂ।",
    toastAdded:(n,code,c)=>`+${n} ਕੇਸ · ${code} · ${c}`,
    toastRemoved:(n,code,c)=>`-${n} ਕੇਸ · ${code} · ${c}`,
    toastNewLoc:(code,c,n)=>`ਜੋੜਿਆ · ${code} · ${c} · ${n} ਕੇਸ`,
    toastSelectFirst:"ਪਹਿਲਾਂ ਰਿਕਾਰਡ ਚੁਣੋ",
    toastEnterCases:"ਕੇਸਾਂ ਦੀ ਗਿਣਤੀ ਦਰਜ ਕਰੋ",
    toastCannotRemove:"ਮੌਜੂਦਾ ਮਾਤਰਾ ਤੋਂ ਵੱਧ ਨਹੀਂ ਹਟਾ ਸਕਦੇ",
    toastSelectProduct:"ਕੈਟਾਲਾਗ ਤੋਂ ਉਤਪਾਦ ਚੁਣੋ",
    toastSelectContainer:"ਕੰਟੇਨਰ ਚੁਣੋ",
    toastAlreadyExists:(code,c)=>`${code} ਪਹਿਲਾਂ ਤੋਂ ${c} ਵਿੱਚ ਹੈ`,
    cases:"ਕੇਸ", now:"ਹੁਣ", total:"ਕੁੱਲ",
    firstFloor:"ਪਹਿਲੀ ਮੰਜ਼ਿਲ", groundFloor:"ਭੂਮੀ ਮੰਜ਼ਿਲ", inUse:"ਵਰਤੋਂ ਵਿੱਚ",
    allContainers:"ਸਾਰੇ ਕੰਟੇਨਰ", productLocations:"ਉਤਪਾਦ-ਥਾਵਾਂ", productCodes:"ਉਤਪਾਦ ਕੋਡ", across:"ਵਿੱਚ",
  },
  ro: {
    code:"ro", name:"Română", dir:"ltr",
    pinTitle:"Control Stoc Containere",
    pinSubtitle:"Acces Autorizat",
    pinWrong:"PIN incorect — Încercați din nou",
    pinWelcome:(name)=>`Bun venit, ${name}`,
    navFind:"Caută",
    navContainer:"Container",
    navUpdate:"Actualizare",
    navDashboard:"Panou",
    navLog:"Jurnal",
    findTitle:"Găsiți Produs",
    findPlaceholder:"Căutați după cod sau nume…",
    findEmpty:(n)=>`Tastați pentru a căuta în cele ${n} înregistrări`,
    findNoResults:(q)=>`Niciun rezultat pentru "${q}"`,
    findHint:"Hover pentru previzualizare · tap pentru fixare",
    findTapHint:"Tap pentru selectare",
    findLocated:"Fixat",
    findPreview:"PREVIZUALIZARE",
    findYardHint:"Căutați mai sus",
    findYardResults:"Hover pentru previzualizare · tap pentru fixare",
    containerTitle:"Vizualizați Containerul",
    containerTap:"Tap pe un container pentru a vedea stocul",
    containerNoStock:(c)=>`Niciun stoc în ${c}`,
    containerSelectHint:"Selectați un container de mai sus",
    updateTitle:"Adăugați / Eliminați Stoc",
    updateExisting:"Actualizare Existentă",
    updateNew:"Locație Nouă",
    searchPlaceholder:"Cod sau nume…",
    searchLocate:"Căutați pentru localizare",
    searchFoundIn:(locs)=>`Găsit în: ${locs}`,
    searchUpdating:(c)=>`Actualizare: ${c}`,
    searchNotFound:"Negăsit — folosiți tab Locație Nouă",
    searchTapRecord:"Tap pe înregistrare",
    searchHoverHint:"Hover sau tap pentru previzualizare",
    searchSelected:"Selectat — tap pentru schimbare",
    actionLabel:"Acțiune",
    actionAdd:"+ Adaugă",
    actionRemove:"− Elimină",
    casesLabel:"Număr de Cutii",
    newQtyLabel:(n)=>`Cantitate nouă: ${n} cutii`,
    confirmBtn:(a)=>`Confirmați ${a}`,
    catalogueSearch:"Tastați cod sau nume pentru catalog…",
    autofilled:"Auto-completat",
    alreadyStocked:"Deja stocat în:",
    alreadyDimHint:"Aceste containere sunt estompate — selectați altul.",
    selectContainer:"Selectați Containerul",
    containerSelected:(c)=>`Selectat: ${c} — tap pentru schimbare`,
    tapContainer:"Tap pe un container",
    casesNum:"Număr de Cutii",
    addToStock:"Adaugă la Stoc",
    dashOverview:"Prezentare",
    dashProducts:"Pe Produs",
    dashLocations:"Pe Locație",
    dashActivity:"Activitate",
    dashStockOverview:"Prezentare Stoc",
    dashTotalCases:"Total Cutii",
    dashStockLines:"Linii Stoc",
    dashUniqueSKUs:"SKU Unice",
    dashContainers:"Containere",
    dashUtilisation:"Utilizare Containere",
    dashTopProducts:"Top 5 Produse",
    dashNoActivity:"Nicio activitate înregistrată",
    dashActivityHint:"Fiecare actualizare va apărea aici",
    dashCasesChanged:"CUTII MODIFICATE PER ACTUALIZARE",
    dashTimeline:"Cronologie",
    dashAllProducts:(n)=>`Toate Produsele — ${n} SKU`,
    dashSortedQty:"Sortate după cantitate",
    dashAllContainers:"Toate cele 16 Containere",
    dashNoStock:"Niciun stoc",
    dashNoChanges:"Nicio modificare înregistrată în această sesiune",
    logTitle:"Jurnal Modificări",
    logRecords:(n)=>`${n} înregistrare${n!==1?"i":""}`,
    logAdded:"Adăugat",
    logRemoved:"Eliminat",
    logNew:"Nou",
    logEmpty:"Nicio activitate. Actualizările din tab-ul Actualizare vor apărea aici.",
    toastAdded:(n,code,c)=>`+${n} cutii · ${code} · ${c}`,
    toastRemoved:(n,code,c)=>`-${n} cutii · ${code} · ${c}`,
    toastNewLoc:(code,c,n)=>`Adăugat · ${code} · ${c} · ${n} cutii`,
    toastSelectFirst:"Selectați mai întâi o înregistrare",
    toastEnterCases:"Introduceți numărul de cutii",
    toastCannotRemove:"Nu puteți elimina mai mult decât cantitatea curentă",
    toastSelectProduct:"Selectați un produs din catalog",
    toastSelectContainer:"Selectați un container",
    toastAlreadyExists:(code,c)=>`${code} există deja în ${c}`,
    cases:"cutii", now:"acum", total:"total",
    firstFloor:"Primul Etaj", groundFloor:"Parter", inUse:"În uz",
    allContainers:"Toate containerele", productLocations:"Locații-produs", productCodes:"Coduri produse", across:"în toate",
  },
  el: {
    code:"el", name:"Ελληνικά", dir:"ltr",
    pinTitle:"Έλεγχος Αποθέματος Κοντέινερ",
    pinSubtitle:"Εξουσιοδοτημένη Πρόσβαση",
    pinWrong:"Λάθος PIN — Δοκιμάστε ξανά",
    pinWelcome:(name)=>`Καλωσήρθατε, ${name}`,
    navFind:"Αναζήτηση",
    navContainer:"Κοντέινερ",
    navUpdate:"Ενημέρωση",
    navDashboard:"Πίνακας",
    navLog:"Αρχείο",
    findTitle:"Εύρεση Προϊόντος",
    findPlaceholder:"Αναζήτηση με κωδικό ή όνομα…",
    findEmpty:(n)=>`Πληκτρολογήστε για αναζήτηση σε ${n} εγγραφές`,
    findNoResults:(q)=>`Δεν βρέθηκε "${q}"`,
    findHint:"Hover για προεπισκόπηση · tap για καρφίτσωμα",
    findTapHint:"Tap για επιλογή",
    findLocated:"Καρφιτσωμένο",
    findPreview:"ΠΡΟΕΠΙΣΚΟΠΗΣΗ",
    findYardHint:"Αναζητήστε παραπάνω",
    findYardResults:"Hover για προεπισκόπηση · tap για καρφίτσωμα",
    containerTitle:"Προβολή Κοντέινερ",
    containerTap:"Tap σε κοντέινερ για προβολή αποθέματος",
    containerNoStock:(c)=>`Δεν υπάρχει απόθεμα στο ${c}`,
    containerSelectHint:"Επιλέξτε κοντέινερ παραπάνω",
    updateTitle:"Προσθήκη / Αφαίρεση Αποθέματος",
    updateExisting:"Ενημέρωση Υπάρχοντος",
    updateNew:"Νέα Τοποθεσία",
    searchPlaceholder:"Κωδικός ή όνομα…",
    searchLocate:"Αναζητήστε για εντοπισμό",
    searchFoundIn:(locs)=>`Βρέθηκε σε: ${locs}`,
    searchUpdating:(c)=>`Ενημέρωση: ${c}`,
    searchNotFound:"Δεν βρέθηκε — χρησιμοποιήστε Νέα Τοποθεσία",
    searchTapRecord:"Tap σε εγγραφή",
    searchHoverHint:"Hover ή tap για προεπισκόπηση",
    searchSelected:"Επιλεγμένο — tap για αλλαγή",
    actionLabel:"Ενέργεια",
    actionAdd:"+ Προσθήκη",
    actionRemove:"− Αφαίρεση",
    casesLabel:"Αριθμός Κιβωτίων",
    newQtyLabel:(n)=>`Νέα ποσότητα: ${n} κιβώτια`,
    confirmBtn:(a)=>`Επιβεβαίωση ${a}`,
    catalogueSearch:"Πληκτρολογήστε κωδικό ή όνομα…",
    autofilled:"Αυτόματη συμπλήρωση",
    alreadyStocked:"Ήδη αποθηκευμένο σε:",
    alreadyDimHint:"Αυτά τα κοντέινερ είναι αχνά — επιλέξτε άλλο.",
    selectContainer:"Επιλογή Κοντέινερ",
    containerSelected:(c)=>`Επιλεγμένο: ${c} — tap για αλλαγή`,
    tapContainer:"Tap σε κοντέινερ",
    casesNum:"Αριθμός Κιβωτίων",
    addToStock:"Προσθήκη στο Απόθεμα",
    dashOverview:"Επισκόπηση",
    dashProducts:"Ανά Προϊόν",
    dashLocations:"Ανά Τοποθεσία",
    dashActivity:"Δραστηριότητα",
    dashStockOverview:"Επισκόπηση Αποθέματος",
    dashTotalCases:"Σύνολο Κιβωτίων",
    dashStockLines:"Γραμμές Αποθέματος",
    dashUniqueSKUs:"Μοναδικά SKU",
    dashContainers:"Κοντέινερ",
    dashUtilisation:"Χρήση Κοντέινερ",
    dashTopProducts:"Κορυφαία 5 Προϊόντα",
    dashNoActivity:"Δεν καταγράφηκε δραστηριότητα",
    dashActivityHint:"Κάθε ενημέρωση θα εμφανίζεται εδώ",
    dashCasesChanged:"ΚΙΒΩΤΙΑ ΑΝΑ ΕΝΗΜΕΡΩΣΗ",
    dashTimeline:"Χρονολόγιο",
    dashAllProducts:(n)=>`Όλα τα Προϊόντα — ${n} SKU`,
    dashSortedQty:"Ταξινόμηση ανά ποσότητα",
    dashAllContainers:"Και τα 16 Κοντέινερ",
    dashNoStock:"Δεν υπάρχει απόθεμα",
    dashNoChanges:"Δεν καταγράφηκαν αλλαγές σε αυτή τη συνεδρία",
    logTitle:"Αρχείο Αλλαγών",
    logRecords:(n)=>`${n} εγγραφ${n!==1?"ές":"ή"}`,
    logAdded:"Προστέθηκε",
    logRemoved:"Αφαιρέθηκε",
    logNew:"Νέο",
    logEmpty:"Δεν υπάρχει δραστηριότητα.",
    toastAdded:(n,code,c)=>`+${n} κιβώτια · ${code} · ${c}`,
    toastRemoved:(n,code,c)=>`-${n} κιβώτια · ${code} · ${c}`,
    toastNewLoc:(code,c,n)=>`Προστέθηκε · ${code} · ${c} · ${n} κιβώτια`,
    toastSelectFirst:"Επιλέξτε πρώτα εγγραφή",
    toastEnterCases:"Εισάγετε αριθμό κιβωτίων",
    toastCannotRemove:"Δεν μπορείτε να αφαιρέσετε περισσότερα από την τρέχουσα ποσότητα",
    toastSelectProduct:"Επιλέξτε προϊόν από τον κατάλογο",
    toastSelectContainer:"Επιλέξτε κοντέινερ",
    toastAlreadyExists:(code,c)=>`${code} υπάρχει ήδη στο ${c}`,
    cases:"κιβώτια", now:"τώρα", total:"σύνολο",
    firstFloor:"Πρώτος Όροφος", groundFloor:"Ισόγειο", inUse:"Σε χρήση",
    allContainers:"Όλα τα κοντέινερ", productLocations:"Τοποθεσίες-προϊόντων", productCodes:"Κωδικοί προϊόντων", across:"σε όλα",
  },
  ur: {
    code:"ur", name:"اردو", dir:"rtl",
    pinTitle:"کنٹینر اسٹاک کنٹرول",
    pinSubtitle:"صرف مجاز رسائی",
    pinWrong:"غلط PIN — دوبارہ کوشش کریں",
    pinWelcome:(name)=>`خوش آمدید، ${name}`,
    navFind:"تلاش",
    navContainer:"کنٹینر",
    navUpdate:"اپڈیٹ",
    navDashboard:"ڈیش بورڈ",
    navLog:"لاگ",
    findTitle:"مصنوع تلاش کریں",
    findPlaceholder:"کوڈ یا نام سے تلاش کریں…",
    findEmpty:(n)=>`تمام ${n} ریکارڈ تلاش کرنے کے لیے ٹائپ کریں`,
    findNoResults:(q)=>`"${q}" کا کوئی نتیجہ نہیں`,
    findHint:"پیش نظارہ کے لیے ہوور کریں · منتخب کرنے کے لیے ٹیپ کریں",
    findTapHint:"منتخب کرنے کے لیے ٹیپ کریں",
    findLocated:"پن کیا گیا",
    findPreview:"پیش نظارہ",
    findYardHint:"اوپر تلاش کریں",
    findYardResults:"پیش نظارہ کے لیے ہوور کریں · ٹیپ کریں",
    containerTitle:"کنٹینر دیکھیں",
    containerTap:"اسٹاک دیکھنے کے لیے کنٹینر ٹیپ کریں",
    containerNoStock:(c)=>`${c} میں کوئی اسٹاک نہیں`,
    containerSelectHint:"اوپر سے کنٹینر منتخب کریں",
    updateTitle:"اسٹاک شامل / ہٹائیں",
    updateExisting:"موجودہ اپڈیٹ",
    updateNew:"نئی جگہ",
    searchPlaceholder:"کوڈ یا نام…",
    searchLocate:"مقام کے لیے تلاش کریں",
    searchFoundIn:(locs)=>`یہاں ملا: ${locs}`,
    searchUpdating:(c)=>`اپڈیٹ: ${c}`,
    searchNotFound:"نہیں ملا — نئی جگہ استعمال کریں",
    searchTapRecord:"ریکارڈ ٹیپ کریں",
    searchHoverHint:"ہوور یا ٹیپ کریں",
    searchSelected:"منتخب — تبدیل کرنے کے لیے ٹیپ کریں",
    actionLabel:"عمل",
    actionAdd:"+ شامل کریں",
    actionRemove:"− ہٹائیں",
    casesLabel:"کیسز کی تعداد",
    newQtyLabel:(n)=>`نئی مقدار: ${n} کیسز`,
    confirmBtn:(a)=>`${a} کی تصدیق کریں`,
    catalogueSearch:"کوڈ یا نام ٹائپ کریں…",
    autofilled:"خودکار",
    alreadyStocked:"پہلے سے ذخیرہ:",
    alreadyDimHint:"یہ کنٹینرز دھندلے ہیں — دوسرا منتخب کریں۔",
    selectContainer:"کنٹینر منتخب کریں",
    containerSelected:(c)=>`منتخب: ${c} — تبدیل کریں`,
    tapContainer:"کنٹینر ٹیپ کریں",
    casesNum:"کیسز کی تعداد",
    addToStock:"اسٹاک میں شامل کریں",
    dashOverview:"جائزہ",
    dashProducts:"مصنوع کے مطابق",
    dashLocations:"مقام کے مطابق",
    dashActivity:"سرگرمی",
    dashStockOverview:"اسٹاک جائزہ",
    dashTotalCases:"کل کیسز",
    dashStockLines:"اسٹاک لائنیں",
    dashUniqueSKUs:"منفرد SKU",
    dashContainers:"کنٹینرز",
    dashUtilisation:"کنٹینر استعمال",
    dashTopProducts:"سرفہرست 5 مصنوعات",
    dashNoActivity:"کوئی سرگرمی نہیں",
    dashActivityHint:"ہر اپڈیٹ یہاں نظر آئے گی",
    dashCasesChanged:"فی اپڈیٹ کیسز",
    dashTimeline:"زمانی ترتیب",
    dashAllProducts:(n)=>`تمام مصنوعات — ${n} SKU`,
    dashSortedQty:"مقدار کے مطابق",
    dashAllContainers:"تمام 16 کنٹینرز",
    dashNoStock:"کوئی اسٹاک نہیں",
    dashNoChanges:"اس سیشن میں کوئی تبدیلی نہیں",
    logTitle:"تبدیلی لاگ",
    logRecords:(n)=>`${n} ریکارڈ`,
    logAdded:"شامل",
    logRemoved:"ہٹایا",
    logNew:"نیا",
    logEmpty:"کوئی سرگرمی نہیں۔",
    toastAdded:(n,code,c)=>`+${n} کیسز · ${code} · ${c}`,
    toastRemoved:(n,code,c)=>`-${n} کیسز · ${code} · ${c}`,
    toastNewLoc:(code,c,n)=>`شامل · ${code} · ${c} · ${n} کیسز`,
    toastSelectFirst:"پہلے ریکارڈ منتخب کریں",
    toastEnterCases:"کیسز کی تعداد درج کریں",
    toastCannotRemove:"موجودہ مقدار سے زیادہ نہیں ہٹا سکتے",
    toastSelectProduct:"کیٹالاگ سے مصنوع منتخب کریں",
    toastSelectContainer:"کنٹینر منتخب کریں",
    toastAlreadyExists:(code,c)=>`${code} پہلے سے ${c} میں ہے`,
    cases:"کیسز", now:"ابھی", total:"کل",
    firstFloor:"پہلی منزل", groundFloor:"گراؤنڈ فلور", inUse:"استعمال میں",
    allContainers:"تمام کنٹینرز", productLocations:"مصنوع-مقامات", productCodes:"مصنوع کوڈ", across:"میں",
  },
};
const LANG_LIST = Object.values(LANGS);

const API = "https://script.google.com/macros/s/AKfycbxyJZ7-4sIUqQU-l24LNY1tz8SHRIHuZOsYjxhrkcjAEYfBEgPIyqm0RpB95TDz8ddAGA/exec";

// ─── API HELPERS ──────────────────────────────────────────────────────────────
async function apiFetch(params) {
  const url = API + "?" + new URLSearchParams(params);
  const r = await fetch(url);
  return r.json();
}
async function apiPost(body) {
  const r = await fetch(API, {method:"POST",body:JSON.stringify(body)});
  return r.json();
}

const GROUND = ["AX1-001","AX1-002","AX1-003","AX1-004","AX1-005","AX1-006","AX1-007","AX1-008"];
const UPPER  = ["AX1-101","AX1-102","AX1-103","AX1-104","AX1-105","AX1-106","AX1-107","AX1-108"];

// ─── PRODUCT CATALOGUE ────────────────────────────────────────────────────────
// This will come from Google Sheets Products tab. For now — full demo list.
const PRODUCT_CATALOGUE = [
  { code:"FRZ001", name:"Straight Cut Frozen Chips 9mm Catering Pack" },
  { code:"FRZ002", name:"Crinkle Cut Frozen Chips 13mm Thick Catering Pack" },
  { code:"FRZ003", name:"Sweet Potato Fries Seasoned Skin-On Catering Pack" },
  { code:"FRZ004", name:"Onion Rings Battered Frozen Catering Bulk Value Pack" },
  { code:"FRZ005", name:"Curly Fries Seasoned Spiral Frozen Catering Bulk Pack" },
  { code:"FRZ006", name:"Halloumi Fries Breaded Frozen Vegetarian Catering Pack" },
  { code:"CHK001", name:"Southern Fried Chicken Breast Fillet Battered Frozen" },
  { code:"CHK002", name:"Crispy Chicken Tenders Breaded Halal Certified Frozen" },
  { code:"CHK003", name:"Spicy Buffalo Chicken Wings Marinated Frozen Catering" },
  { code:"CHK004", name:"Chicken Nuggets Formed Breaded 25g Each Frozen Bulk" },
  { code:"CHK005", name:"Popcorn Chicken Bite Size Breaded Frozen Catering Bulk" },
  { code:"BRG001", name:"Beef Burger Patty 4oz Frozen Quarter Pounder Catering" },
  { code:"BRG002", name:"Plant Based Vegan Burger Patty Frozen Catering Pack" },
  { code:"BRG003", name:"Brioche Burger Bun Sesame Seeded Individually Wrapped" },
  { code:"BRG004", name:"Beef Burger Patty 6oz Frozen Gourmet Blend Catering" },
  { code:"PIZ001", name:"Margherita Stone Baked Pizza Base 12 Inch Frozen" },
  { code:"PIZ002", name:"Pepperoni Deep Pan Pizza Frozen Individual Portion" },
  { code:"PIZ003", name:"BBQ Chicken Thin Crust Pizza Frozen Catering Pack" },
  { code:"SAU001", name:"Heinz Tomato Ketchup Catering Bulk Portion Sachets" },
  { code:"SAU002", name:"Hellmanns Real Mayonnaise Catering Bulk Portion Sachets" },
  { code:"SAU003", name:"Sriracha Hot Chilli Sauce Catering Portion Sachets 10ml" },
  { code:"SAU004", name:"Smoky BBQ Sauce Catering Bulk Portion Sachets 10ml Each" },
  { code:"CON001", name:"Catering Ketchup Sauce Dispensing Bottle 2 Litre Refill" },
  { code:"CON002", name:"Catering Mayonnaise Dispensing Bottle 2 Litre Refill" },
  { code:"CON003", name:"Garlic and Herb Dipping Sauce Catering Bulk 2 Litre" },
  { code:"CON004", name:"Sweet Chilli Dipping Sauce Catering Dispensing 2 Litre" },
  { code:"BEV001", name:"Coca Cola Original Taste 330ml Can Case of 24" },
  { code:"BEV002", name:"Diet Coke 330ml Can Catering Case of 24 Cans" },
  { code:"BEV003", name:"Sprite Lemon Lime Carbonated Soft Drink 330ml Can Case 24" },
  { code:"BEV004", name:"Fanta Orange Carbonated Fruit Drink 330ml Can Case of 24" },
  { code:"BEV005", name:"Still Mineral Water 500ml Plastic Bottle Case of 24" },
  { code:"BEV006", name:"Sparkling Mineral Water 500ml Plastic Bottle Case 24" },
  { code:"BEV007", name:"Tropical Fruit Juice Blend Carton 250ml Case of 27" },
  { code:"DES001", name:"Belgian Chocolate Brownie Individually Wrapped Frozen" },
  { code:"DES002", name:"New York Style Vanilla Cheesecake Portion Frozen Catering" },
  { code:"DES003", name:"Churros Frozen Straight Cinnamon Sugar Catering Bulk Pack" },
  { code:"DES004", name:"Warm Cookie Dough Portion Frozen Microwaveable Catering" },
  { code:"DES005", name:"Caramel Waffle Stroopwafel Individually Wrapped 72 Per Case" },
  { code:"HOT001", name:"Pork Frankfurter Hot Dog Sausage Frozen Catering Bulk" },
  { code:"HOT002", name:"Hot Dog Bun Finger Roll Soft White Individually Wrapped" },
  { code:"PKG001", name:"Kraft Paper Takeaway Bag Medium Brown 250 Per Case" },
  { code:"PKG002", name:"Cardboard Chip Box Regular Printed Catering 500 Per Case" },
  { code:"PKG003", name:"Biodegradable Clamshell Burger Box 6 Inch 250 Per Case" },
  { code:"PKG004", name:"Wooden Disposable Cutlery Fork and Knife Set 100 Per Pack" },
  { code:"PKG005", name:"Grease Proof Paper Liner Sheet 25x35cm 500 Per Ream" },
  { code:"PKG006", name:"Hot Drink Cup 12oz Single Wall Printed 50 Per Sleeve" },
  { code:"PKG007", name:"Cold Drink Cup 16oz Clear PET Plastic Lid 50 Per Sleeve" },
  { code:"PKG008", name:"Napkin 2 Ply White Tissue Catering Dispenser Refill 500 Sheet" },
  { code:"CLN001", name:"Antibacterial Surface Spray Trigger 750ml Catering Grade" },
  { code:"CLN002", name:"Commercial Degreaser Concentrate Kitchen Catering 5 Litre" },
  { code:"CLN003", name:"Blue Catering Grade Disposable Cleaning Cloths 50 Per Pack" },
  { code:"CLN004", name:"Nitrile Disposable Gloves Blue Medium Box of 100 Catering" },
];

// ─── INITIAL STOCK ────────────────────────────────────────────────────────────
const INITIAL_STOCK = [
  { id:101,  code:"FRZ001", name:"Straight Cut Frozen Chips 9mm Catering Pack",                    container:"AX1-001", qty:48 },
  { id:102,  code:"FRZ002", name:"Crinkle Cut Frozen Chips 13mm Thick Catering Pack",              container:"AX1-001", qty:24 },
  { id:103,  code:"FRZ003", name:"Sweet Potato Fries Seasoned Skin-On Catering Pack",              container:"AX1-001", qty:18 },
  { id:104,  code:"SAU001", name:"Heinz Tomato Ketchup Catering Bulk Portion Sachets",             container:"AX1-001", qty:60 },
  { id:201,  code:"CHK001", name:"Southern Fried Chicken Breast Fillet Battered Frozen",           container:"AX1-002", qty:36 },
  { id:202,  code:"CHK002", name:"Crispy Chicken Tenders Breaded Halal Certified Frozen",          container:"AX1-002", qty:30 },
  { id:203,  code:"CHK003", name:"Spicy Buffalo Chicken Wings Marinated Frozen Catering",          container:"AX1-002", qty:22 },
  { id:204,  code:"CHK004", name:"Chicken Nuggets Formed Breaded 25g Each Frozen Bulk",            container:"AX1-002", qty:55 },
  { id:301,  code:"BRG001", name:"Beef Burger Patty 4oz Frozen Quarter Pounder Catering",          container:"AX1-003", qty:40 },
  { id:302,  code:"BRG002", name:"Plant Based Vegan Burger Patty Frozen Catering Pack",            container:"AX1-003", qty:20 },
  { id:303,  code:"BRG003", name:"Brioche Burger Bun Sesame Seeded Individually Wrapped",          container:"AX1-003", qty:96 },
  { id:304,  code:"BRG004", name:"Beef Burger Patty 6oz Frozen Gourmet Blend Catering",            container:"AX1-003", qty:28 },
  { id:401,  code:"PIZ001", name:"Margherita Stone Baked Pizza Base 12 Inch Frozen",               container:"AX1-004", qty:24 },
  { id:402,  code:"PIZ002", name:"Pepperoni Deep Pan Pizza Frozen Individual Portion",              container:"AX1-004", qty:18 },
  { id:403,  code:"PIZ003", name:"BBQ Chicken Thin Crust Pizza Frozen Catering Pack",              container:"AX1-004", qty:15 },
  { id:501,  code:"FRZ001", name:"Straight Cut Frozen Chips 9mm Catering Pack",                    container:"AX1-005", qty:32 },
  { id:502,  code:"SAU002", name:"Hellmanns Real Mayonnaise Catering Bulk Portion Sachets",        container:"AX1-005", qty:48 },
  { id:503,  code:"SAU003", name:"Sriracha Hot Chilli Sauce Catering Portion Sachets 10ml",        container:"AX1-005", qty:72 },
  { id:504,  code:"SAU004", name:"Smoky BBQ Sauce Catering Bulk Portion Sachets 10ml Each",        container:"AX1-005", qty:60 },
  { id:601,  code:"BEV001", name:"Coca Cola Original Taste 330ml Can Case of 24",                  container:"AX1-006", qty:20 },
  { id:602,  code:"BEV002", name:"Diet Coke 330ml Can Catering Case of 24 Cans",                   container:"AX1-006", qty:18 },
  { id:603,  code:"BEV003", name:"Sprite Lemon Lime Carbonated Soft Drink 330ml Can Case 24",      container:"AX1-006", qty:15 },
  { id:604,  code:"BEV004", name:"Fanta Orange Carbonated Fruit Drink 330ml Can Case of 24",       container:"AX1-006", qty:12 },
  { id:701,  code:"DES001", name:"Belgian Chocolate Brownie Individually Wrapped Frozen",           container:"AX1-007", qty:48 },
  { id:702,  code:"DES002", name:"New York Style Vanilla Cheesecake Portion Frozen Catering",       container:"AX1-007", qty:24 },
  { id:703,  code:"DES003", name:"Churros Frozen Straight Cinnamon Sugar Catering Bulk Pack",      container:"AX1-007", qty:36 },
  { id:801,  code:"PKG001", name:"Kraft Paper Takeaway Bag Medium Brown 250 Per Case",              container:"AX1-008", qty:10 },
  { id:802,  code:"PKG002", name:"Cardboard Chip Box Regular Printed Catering 500 Per Case",       container:"AX1-008", qty:8  },
  { id:803,  code:"PKG003", name:"Biodegradable Clamshell Burger Box 6 Inch 250 Per Case",         container:"AX1-008", qty:12 },
  { id:804,  code:"PKG004", name:"Wooden Disposable Cutlery Fork and Knife Set 100 Per Pack",      container:"AX1-008", qty:15 },
  { id:901,  code:"CHK001", name:"Southern Fried Chicken Breast Fillet Battered Frozen",           container:"AX1-101", qty:44 },
  { id:902,  code:"CHK005", name:"Popcorn Chicken Bite Size Breaded Frozen Catering Bulk",         container:"AX1-101", qty:38 },
  { id:903,  code:"FRZ004", name:"Onion Rings Battered Frozen Catering Bulk Value Pack",           container:"AX1-101", qty:20 },
  { id:1001, code:"CON001", name:"Catering Ketchup Sauce Dispensing Bottle 2 Litre Refill",        container:"AX1-102", qty:16 },
  { id:1002, code:"CON002", name:"Catering Mayonnaise Dispensing Bottle 2 Litre Refill",           container:"AX1-102", qty:14 },
  { id:1003, code:"CON003", name:"Garlic and Herb Dipping Sauce Catering Bulk 2 Litre",            container:"AX1-102", qty:10 },
  { id:1004, code:"CON004", name:"Sweet Chilli Dipping Sauce Catering Dispensing 2 Litre",         container:"AX1-102", qty:12 },
  { id:1101, code:"FRZ001", name:"Straight Cut Frozen Chips 9mm Catering Pack",                    container:"AX1-103", qty:15 },
  { id:1102, code:"FRZ005", name:"Curly Fries Seasoned Spiral Frozen Catering Bulk Pack",          container:"AX1-103", qty:26 },
  { id:1103, code:"FRZ006", name:"Halloumi Fries Breaded Frozen Vegetarian Catering Pack",         container:"AX1-103", qty:18 },
  { id:1201, code:"BEV005", name:"Still Mineral Water 500ml Plastic Bottle Case of 24",            container:"AX1-104", qty:22 },
  { id:1202, code:"BEV006", name:"Sparkling Mineral Water 500ml Plastic Bottle Case 24",           container:"AX1-104", qty:18 },
  { id:1203, code:"BEV007", name:"Tropical Fruit Juice Blend Carton 250ml Case of 27",             container:"AX1-104", qty:15 },
  { id:1301, code:"CLN001", name:"Antibacterial Surface Spray Trigger 750ml Catering Grade",       container:"AX1-105", qty:24 },
  { id:1302, code:"CLN002", name:"Commercial Degreaser Concentrate Kitchen Catering 5 Litre",      container:"AX1-105", qty:10 },
  { id:1303, code:"CLN003", name:"Blue Catering Grade Disposable Cleaning Cloths 50 Per Pack",     container:"AX1-105", qty:20 },
  { id:1304, code:"CLN004", name:"Nitrile Disposable Gloves Blue Medium Box of 100 Catering",      container:"AX1-105", qty:30 },
  { id:1401, code:"BRG001", name:"Beef Burger Patty 4oz Frozen Quarter Pounder Catering",          container:"AX1-106", qty:50 },
  { id:1402, code:"HOT001", name:"Pork Frankfurter Hot Dog Sausage Frozen Catering Bulk",          container:"AX1-106", qty:40 },
  { id:1403, code:"HOT002", name:"Hot Dog Bun Finger Roll Soft White Individually Wrapped",        container:"AX1-106", qty:80 },
  { id:1501, code:"DES001", name:"Belgian Chocolate Brownie Individually Wrapped Frozen",           container:"AX1-107", qty:36 },
  { id:1502, code:"DES004", name:"Warm Cookie Dough Portion Frozen Microwaveable Catering",        container:"AX1-107", qty:24 },
  { id:1503, code:"DES005", name:"Caramel Waffle Stroopwafel Individually Wrapped 72 Per Case",    container:"AX1-107", qty:18 },
  { id:1601, code:"PKG005", name:"Grease Proof Paper Liner Sheet 25x35cm 500 Per Ream",            container:"AX1-108", qty:14 },
  { id:1602, code:"PKG006", name:"Hot Drink Cup 12oz Single Wall Printed 50 Per Sleeve",           container:"AX1-108", qty:20 },
  { id:1603, code:"PKG007", name:"Cold Drink Cup 16oz Clear PET Plastic Lid 50 Per Sleeve",        container:"AX1-108", qty:18 },
  { id:1604, code:"PKG008", name:"Napkin 2 Ply White Tissue Catering Dispenser Refill 500 Sheet",  container:"AX1-108", qty:25 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const Icon = ({ path, size=20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={path}/>
  </svg>
);
const IC = {
  search:    "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  box:       "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  plus:      "M12 5v14M5 12h14",
  minus:     "M5 12h14",
  back:      "M19 12H5M12 19l-7-7 7-7",
  lock:      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  log:       "M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
  pin:       "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7v.01",
  check:     "M20 6L9 17l-5-5",
  warn:      "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  trend:     "M23 6l-9.5 9.5-5-5L1 18",
  pkg:       "M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
};

const LOGO_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATMAAABkCAIAAABlxkDyAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAACISUlEQVR42uz9Z7dk15ElCG6zc86918UTES+0QgQioAlJUIEiSaZOMrMqS3fXVItaVd3zZf7LfJs1PWtV9azOnpopLbqykplkZlITBAlFaCAiEFq+eNL9inPMbD7c6/78vQiAiGAyK6sLd/kC4in3K44dM9u2bRs5BB0sGDmcPIKvfBrPPIDxJs5fwr/+M5y93q+5QJ3QpCBjUnhkYzBQA0aAMQAPAEgAGPAKAApKmAcU2GDAAYnJXAZOgBDgIlSDhzYQBnpAjX5ioUFd9LE0h9/+FZw8wnPzemMZ//6PcOYSVus+6qow1QoAIvahiNaMoA0+8kEMBBBAEaakYEDb6wgZJMCG8Iz79uDzz+DwPgxz/OwVvPgazqz1oxkq0ZIAARIzwKSOoQozSnAAAAHso58QOzgADiCIgxLai0OTTX5FAQUIUHbsvIjCx6KHwJibw8GDOH4Se/fj6EkKRR7yPO857xtJZTmSegPrN3HzCt4/h4uXsLyOzRK1kKQBucrKBCAzWANWMCOqS90DtcnVCAHTlwEGKDvAg2s45APM78ajn57/5HNuuFSuLlfvvYbvfwPNKmQES8gzjBMMi1lR1mMDK2Bw7ZUByjAgucm12tYnMpRhwQGEBAigDDBQIUc4jt4eNA1MQQYoCJARQolyFVBoBCITAqMRYLpiafLJ1n6KBwGmMCUDT65S4Q0E8Mx5AZSQAQkZ9Zo0j/5j+f1Ph6XDHHTj0st26WdYvwqMiWBW9YI0UfWulsPM4QFYU+Lxxw78jd/DQ/etFmjmB4u7l3ph/tK//Mb49YsABdcfxzVkQGyvafJhtPWxDhCbrKHJ1QgmXxp463cVBjBiBLU/rQEFikEdFQu9I3//7/SefHjF2zg180u7h3sPXvmT74z+j2/WSVWku12ExlS6e/yRj/ZhtCew02gdQEDCqYeP/q3frI/s6R08sLx+a3j/ifTQJ27+3//X8a0NIM0XfZGYYpy8g25783s6FBAYgAzgyVqAoLtlRJkPTVQEFiLxGfp9HDgweOSRQ0882Tt2dMzZzTomYzXHYGMIi2PKOdN8MNwzyE4c7T35KbexGS9fv/nOuxtvvmnXr2ymCOdhhliBFLJ1W2zmxHbevZ1fMXx25Ku/vuuhZ26KG6VmaWmp339iNB8uf/PfYaMCgLKCIc/yzXocXGgkAqzQyaKAAjz5zvZ3V4ABVYBnbjcBAD/w1V8NS8eRxCQ55wziCKhXL7/xw5vnRjBBEwGYQe9uidz+GHXbPwQAmsSL++7bc+oZt3R/6fvkZW//IewfXnjth83KFZOxY1fFiF/gcARni/2Fv/f14bOP18nqWix3jaWFQ/vm9+1Zf/6VMFjYbNbhEhgQmEEwWUFkgDHMwQjWPdiJuVK75hwAOCUHku7hGyA0MeDJw3HRM4bF3O9/bfj4Q8sBvDgvwa2NNvfs3b1/ceHqz35m4w2wgA2OIBCiaCZ3ZxAEEKw7czIYwdozEYf+EP3s1O//Tu+x+5v53kglJnGODu5eGs7Nr5x+D3XTxMYckhlgMDgQAEO7bd/DQQxSAgqFV5nZYMlDBcPevFTihJHPWU7Yt4SvfW3h67994uu/u/jE06v9waVxtWZAb8B5pt4JS+JknJSTcXLOqnKsSdl6oVjI9xycu/9k/6lH5z/1xDqNcfMiYhNIC7HC0OM5VVh3JWQwu+NKtS72YJhwhkefPPapL7je/MZozC5XFWEs7F4Yk8SrVxBriDiDJ41qEWIw69Y6zbyl2eQ53OmRGaAGtekXVOSHH6PeHsAbBaWQ1Kt5SGPV2tryZTQ1oEQGgGliWwSAuic2sxxABlPMxAQ22TVmrlmpdcsEhD5k4b4nv7T3vsc1DCoVH1yR5/NzAyRZv3QBiI5VLYF+Acu04HH80OG/+VtXA62v1y7Lsrl+bbKGuLB7CS7ffO01sMHUe9U0Mabp3m7gLhgDt25z5n52NmxwRgyaxGVKMAPIgQ1EIGPrz8EDX/jMfb/11VtFKPOwWY6iqOsXZVMWjm+dO4cb12AJam20odQ+q7uzTOruloAmf0oAGBaQZXjmsWO/9aUbOW8G3qibrNcT0/Hm5v59e6/+6EeoG4iq6yJ21y0m2+Zp7K72CaN2h/Da3ii1LihOCiA0jfp8vqHcPPV//av7fvfr2SOfGC0uLYutqFRZ7ofzFvImiZpBlEwJBlgyTapJZK6/6ChrkttMWDde8zQqXOr5/t5dux44WccmXl9Owh4hmqDbPam1T5oNimhHsAQC1BVHfuOvy9KB1bURiObn58sY18pSmPft23drcwPXrzjHXpIqskGWknSLu1v5NPmye3ebfAJtu5sG6qzCCAaA+/37nvLD/cQ5kBtCEgYXbGm0fHbzyvutLXlPprrzrHdYJmzHA6Tu5GatSgnK073ULbj9Dx984JPRzd8a1VGSD75KKUUZFv3r585BKrWKvdovEEk5DDwO7t3zxedWnMNgLjmOdfQhU4/1pjp46uTqu+9iecOHXhqPubsvmN1Q2OAn32s3t27RYSs5ISObeEsHY0AJTCCFQ1DKjBgnDi3+7m9s7l1cy3i4d28dI4iyxcVxtZ4R1RevyPnziA1Sa/GAI5DerSU4gNuUYnp67X3gDIEP/Ld/bWXfQlycHxGTzxQUshzMpcWRRbxz2vX71pRwcALX+k2Y3evtJ4DbP7et3TlYG1V7uIB8oAAeOvnYP/rvF59+Anv2K3qOC2LfGJJqFBVViGaJgiATCuYYHvACZxZQuiSh8j4WIRVO2sUq2LN0wPeH+x98yPbtGV+/HmOCD0nEYKCtzHISY+xYYUYwAyH0i898Nc7vc8zsWFXVM/eGVRTHfv+ePbcuXbT1W3nuY5JGhHoOYlueiibOs/uoduvcvsTIwIbZXBcADwYnnvFzBwi5mBMNSR0495aalfMbyxdgCoJjqCp9iGXu3HHQZUpb61sBoRZQaX/LCtDioSd/Lew6vpFcVO4NcnJekEVx84M5ERlfvwDU5iLs3i2TkTEGvdTEVCf1HsbYbFKZ4DL0+5e87f/v/xvsWkxVBWM/4+xvj8QJcOi2/C3XqoCyAAIF1E0uOvNkAgKEnGY95GHhd3/HHTs0LgKI1m6tcjFEb1CtrIIoBY6ekGKbkwWF0+kecLcXrHx7nkkEZhzcnx0/fCun1XJTmKSuYmw21jcwP78517v/176MXfNSjdpnRzMPcMcGe5fng9C6qtQBDQqOCOjNw+foZbt//3cf/cf/w+qhA8v94dVKSnCtaNRAzmVZyINnJYvsDE6NVExFhBQBLueiyOec7xtxkhRTLRIDZVmYuzmSm9q/ki3Mf/LzJ/67/xFPP5EYVgR4D2YQY+sSmSfeZTYyaPe2WnkjavROHK1VG1VTkwvGeZWCm9v7wHO/isUD40bFtz7Rtt2pNpkkncHn2CZWuWUftMOKGGCFE7hoLqqL5qOGZFkyr+DOyFVFpNt33QdvjjYbdXEXQM2Ab9PT6HwpDzA4MNxzX2mDEjn3BxRC1dTkCrj+KBWH738Cbg6UzQSQ94YApYSQuUSBuSkTF0PeVQiSxQoWIrvBkSPDr/3G5j/75y54Gq96QHTGH06gCp7d1AzTK2wvuwtCZoN3afchL3CY6+Opx/Y8/olrOZnPqV/YeqmjCs7BZVmRx5s3ERVCUFdA2/s80nu5YN0BXRkI3sgj+D1f/uJa7rEwh9UR2CMLoT8ndVorK8BuWsInn8S3vgMhVNWdMBK+I27y0TxnGx5DwU3rwJPi1MlDf/N3/KkTl7N8bK6pUn/X0lpdwbEDW2xQ1wZhMvaIqIzNmKAgJafMRmxWiQEckHIkJwI1KCcj+PlSm5A5Q8z38dHf+vqlAwf123+OqkGa4HST7AtgxgRmtKmpKAiDYiBwlaYQPLsiNsYxZRyyENY366MnHjn0uY3L3/5PKFfBCZXcIebv0kfCDJj44ZhMu5RMCUoAgRhMRmxGMcYWLAc6h8n0gXv4NuyVZnxmm3luj8isPTc3t+fYw8qD2jgRg6huxjEmJUHi2lzh58O+E/Hq8gT7vUe3ySBCSqq60B+iMV0fpyiWBMJI5Cm7Pq73PPuE/42viKSEnMEBk5RRO6sTdC/bFue26Dg7AKRgTP/IAFUYAmdDhIDFwanf//oK0LhcGrXNklwesr6jgGTNaNzL8owdtEVQ0Tre0Jr7XV72tr+YRjnssH/30c99sgreRnW2aw9W1xDyWFZKjNE4zC3GPF945CEsDCEyRd1nHjAD3CEjd3PIzDJUIMHBZ8gDHnv4+Nd/s3j84Wv9fFVSkxeDxT3jjRGIQCqmHtYHFgwLMS2OR0vj8d56fCBWB2J5IJZ7mo09443F8douGy/oaF7LgTRFSrloZuQtNLX1+rvU91drW+ee7Tu2/+nP9n/jd+GyznVseQ+eRng7QwOzemOj8I6Yx7EWYhc8S6Iomihx/2qJ3aee6D3xWbghwgDGLcTkJi+y2eiyu3ttZWXbA7OdD89UVbWDMpiZAaiZMDOcAzMA7z3RXcGzvM1FTxz8zGLPgMHBow+bOSZP7A0uwfUHc07VERe9xXGkw6c+AepRlpP9Ij5TCaEw5iZJoMx8nlovmCT3BdWpFBnv33X4175w7icvysXrnOAQe+Qbi8m6VNnlrqlk+uQIW7geAw4utTeOkQxkCAxHeSlo8hxOT/zP/3BjodfkeUrqyRkxlFQEgCPvEFyTOAJKSKmrqKHb0e/WLFuEhAHHlNT6/YXxqIH3ePyhS4iU99EINmr2fW0inEeMtLA7bo6Cyw48/uja8aNYXgdEoMRggnXA3r1skEagglOtRDAFfAYLCDkeOPngf/e3N5YW10RqDugtoJLReDPLe42I8yGHcFMWMe0y8WtrcvPm2oWLcW11tLJSlyOYIPOYG/jh/L5jx/PF3by4oMUgcpbMqYDV+t5X400LDJ81Smsl9cOBU48tjuv03p//MTY34T1FVRN3x6rGZDMZsDRNFVk9e4A1qVMlI0dMYbBZg0Pv+JNfenNtjLdeRDZEvdkLkKjTTTxBCRy3xR0yCwWZzcCmMx6TyRhqlkzV1EAOlJwnxNguxJTSz30gdDtEaO36UtdiAAYAPgRRNikOPvrMOFI29LWKilnm2WdVLAtikFVVFXxvcd8xPnBcr1wJhKRt5YvMZoJmZv15u4Vvk1slCEGmJQRD7rI4rvI8t17veqx3L84t/N5vrv2zfxOX13P0Gq3zUFgsRcG5a6KAIQaaZAkyg7gLBKJdRgVYRKMoQoABSPxbv1Hv27We++QYSRkMg0yQ7tbancJZ93UL791jak0wAnlYAxFzPhuXY4QeBsWuTz+FPYuNAsY9hIZSCYUmIFgTAwdiu9as9z/1qfFL78CbpSpaGwp0IBf4XgKX1GiLsbj+nDQJWcDRww/+nd9f3bu4kmcxGpoIywqfc65ITRFcWlnJUprTlK5df/dnr+L1N3DlCiQhRZgAOgXPE/Nl75DnOHIUpx7ae+LhuaWD5PqV6qis5ucWViV6EFtQAYf++trG4489Pj775uW330XTmLXMhw6Sv2Otz1nylry28RebKpuaWRIH8vBzI6kJg8OPfPJKXeqZN8C9JjYt4uABRQukYTtOAwBqW0gF2+zGoAYlGJlyF3caoQ1t5d6dVEdCmBgPdTdSAJCLwjCPbNjbfcgV82xwpo6ZQG1QzWQm0fsCxuNIS/tP3Lj6oljdmiURdWk2MPuPD7VM6mKwxFA2BEUUp8ogZS0dIeSo4sjziS9/fu3sGXzrB5tjAZwmAzxBsyyrYtkisyZdeXjqNtmFJLU3GE3MlQDiKgqKHk4eu+/XvrQ+36+JVdQ5T6oGFgLYABKD0/Y5dKtNtIP3rAu39K4rmtzRl5S4q44+dHJw8tiyIx1FQiAoJWUPdb7d9IKRCSrnDj/2yOm9e3DpOoJvHfhMDXyCPdx94jvoz43GDYoeTp7s/85XyoePb6hFMbgA5/I6OVVjclb118aHinz1woUzf/THePc9xAZqSA2QYAImOBDIRDmZMhATYsS7b+Pc+RtLL984evLQA4/vPn5yrr9weW2FQ5b3Bp5JUlVVmwcW5y6/9bPR5jq0xaMQfJBUt5ma7vAyxjAYEkG8OjKGkRiDVMnUKZIE37Oaoqa9Rx/0Gs9dvYTRWgIY5KGKBCAAEWnCJdt6SNaleW0srYytzVoMZMpdANRW36zF9tjumnsyqdFOCzcKaGCIgAliMM6hDMqzAyfyxX2Ji5SSA3IOAlMwswOiamKnqiiF9xw+efP9I7p6Gojd28+4zY9mmSCAhSAt4sUCUkIqmxT6RUwJLqA3rNdXby743b/6pVsXr+Gt90BFKseZyyBNNaombJWtrY8n6VMtCUABUjNpIxgi+AAKOLp/7vd+e7w0XDHVEJASsRlBoWAFdayh1ix1Gi66iTES34vrJFg0B3jO6iSYmwOw/3OfWmMqYw2fefiqiVGFzRNMTJlZRERtsLhQrWwsfv651X/77yEZTJCmQYZB7a4t0wBCkWfjUQnO4dzJr/3W+KmHLjQVwgASQ5b1yKe0YSkVWViguD+OXvhX/0xefAVR4T3qCpryIqsbAQkMSDDVFkZ0ShRCFDNLSKsoN3D54uVLl+sHHj/4xLPzWS8O59arsZIteNa1tdHNlXe+9U1cOzfDBehAcJ1dvjPeUwlmxmrUVmbF1LOwMXGMmpl555NxZZztPTh89vObP/4BxqvKQa0xSTSxSIYK6I4YN93hSzMzqDGTdfUvJbiPsuI/ymZJU2KegRDMPChHNn/g+EMSikbIJwG7QEZiwkrMpmDvrAXG2eWD3bsPPbS8dgNYN6snkTJ99DP0UAYoMSfu2INANFZ4NQfUCRagQF7cHJVHT9yHX//irXqM89fhfaPmwaQKIrPbfZdOamFqxDYFyFwAexS5+/Qnl5587Jw2JoY8BzsyKJlMmY3U/q0KaZfF7lj69xA/MpDad3IwhSMcXFp47NSGdyAfij4SqhQ5eDZoE13mJTaRmIITc2Ng71OPr37jGxgJzBGSY8Q2GzEl8nd9OgSJ6uDS/C7+3NPp6KFRr4+UYDmB83FibRylwcD7zXV5//0f/dN/SpsbiAlqqLQtK9YxgQyOW4SsLTcmIagV0TKkmiP6gCrqiLdfWz5zcfT+tce+/teuNCOwmlSpLOfXb77zb/4FVq7DDOwgCWYxxdZtmW73ll1YxAZu+VykZq6llrIAZuY9kzYkxs7Wyop979BjT59dW4vvvI5ytSFyxM607p6hTkPXWfTlw4tj1hY1zLMSgUn5Xgxxm/XrlDQ4cTQO5kE97D4yt/foJlyEI2JPzitUozEQKBpCnjcpiqZ+nsUoC4ceXT7zDqoSqKcG+dGNs3M7bCAoVCdhTMr6IVUlMXsljEo/WIDPVlLc/YmHe1/4NDJC5qDE8Az+MBo3AY5rVTFkLfM9GYjwyccPfe6Za1pbliF4qHrv1cSm1a3OH6rO7tMKCKitgd3b/qgAO4CjRGQ5UsTnninnesgyGCfTKA0C8SBjR6ziGEi1eqAIm5sjP5yvF4Z46hNwDnCzuB8BDna3VRNVREXKCuT85Nd/62Zwm0pwPUrUtyw0CHWaY87HGzdefPn8v/iXuLXsRuOsabIUvYmDkilUYIAoRCACTTAFC6ADKlx765qW14E+UhY3qvde/+kf/BO6fn6vjvfpONy89N4//wNcvwxLMIWmNmVlnhgH3aneYKwILYNJWI1MCAZvRilpHrxpHWXTBVhwJYIU88effBYHDsEHEKHIIyCAd7NFqG2PVrdBo9NyfxvuMsCmzgxmU/yY7ypk0Zm9ZptbtglHBgQEhMHCvmMa+uKcekbIiYMz9abOEkQjOQ15NAXUOaoayReO4sCD4Pw2jIk+omUyC3tFJoAazAgJpARFij0inxTkKFnGed3oRj8sPvEQHjmFXgYmA4W2kLudgbAVfLLBk3ko0BMULcHj8IH9n/+0HdhTisB7ZB5MIsl15Wul1ntrt2vM3khnyIEM2x/X3VimI+rQcfZYXNj31GO3nIoYolpKgCCj5CzGGNil1CB3YBMyAMZuI+PFz34agwHItdlwG+YxQDPbyF3kvb0MC85/9bOrc0W2b49u1hhrXpKvLRAPgg8rq1e+/0L9x3+Kq9dRZCmjxnEDJrgCWQ6XGXslNoYkaIImSMws5hxHtpEmQJwliKIhiFPEW7h5+tIf/C+LZ99ePHP60h/871hegRiqBq2pA8xghtEM5r7txBkgU28IidE41CyJYWCY88YmiakGl+JqC6YcNhsOu5aWHn4EBw8i8yJiDGu7SNrS2nYyztayoslrsrQMBGOYBxzMK7wiM7h7gOsNsyWirSKnJxiMyAMe83v2Hb6vTiTEyi5RFpWhlgHBYCqJQgWXQD6wNjWRa3hu77FH4XvOuXvwIAxLBAWYjEnBpmwgQxw3GdwwaV6OBsN+3FxtmhT6c+tgf+DA4b/+NfQLeK/QCNX2MU04QJOSNHdsPZN2m1POKgQsLSw899mFBx+8IY1f3NVGTSDi8agPc6Zs4Gmxy3beSHd7YY2285M/4KfTd5CoOWcCwBo8+gDt319lQcFExFmGzIMZZRXW1uZio1XpBgPEhDoWw4WVshwPi4VHTmD3Ivq9Fp/gSS+E7Sjo3nY2dzg9OKjh/vuO/tqvrOX5ymbtXC8kzp3XFEmbARo5d7b5s2/i2lXkBZoGLQ7snYISUguBAEamjrsar29NUSGk4gjM3aJ2UIZohDOkEcqNV/8/f/DyH/wB1lYhscedT3KeYZ3vJEPmd6T0bfKpIGubtoTYJvtwECqSLbCEapWo9BlqbaqoQCbo3RzT3lOP737sWeS7ANdiQUm2wlOYkCWCCli2KqsfVvXQdqe1230m/1zGwoT3o204N9nEkABxbbU0wPWL+b27lo6KBkrEao3FSpOCAllBZSabmQmiEBs7VzfGYX4caXH/UWRD8X3ijMAOkxJDV/3uLm3mEnn21KORJKaGnbEC6tQ7zfp+jku5/r3v7eMUy5vIgcKNRWrJx36uOXYEv/I5BG9gYdNcEICWrwkYOWSZ5+CNvcLVYBCc2yCHxQU89di+3/rVGy5YNkzrIxQ9xDqT8gDzxpnTzfJNmsBrRGSqRKRtOYYYE1ZDt8W2ROeZrY5nCEl3MFYDjB0QSOEMQ7/v176yzEFcT4gds442oYYqzifUr72++cbrRRakSaTeNawCKbLa2+ow7z33aaQIch7BmXogL3qy5UxmlsjMA9h5emAYwYWF3/jalTCoszmmvKfcJ1SpLhZzorGsXLz4L/433LyEOMbaLSRFUiSBRIUmaIQ2SIKWl9fRk8UQgQaIpIK41ZEYQQJnTE1CMqxtYn0d5RiSgFSlGiYwaFQ3aVRwgDTq0e2V0+KTsMKnxsdESWGslEUa1DRssBDr8z/6Y735DstGYzHB+TAchoVYusi7l8v+0rGnFp/8EqwPDf0sb4lvjnIH9dCs5XhygC86hGgmIut2D1OakFbMxExARmRtqtIuFeBOkNzkrSY/CYB3Bm9dR6ahJ5QnRgkIsQngBoeOPFQ23qQYWEF1yvqutJHr5Sk1b7/0TV45uzs12eZmz6GKyfX2j+si5FljsuuhZyB908zDeyCntnDHYAfujHOyJLYtG27zNiHuNp6uFu+qOu3qD/Gtb1Vn3y/KssgdmhIh6w8Xb43rlcwf/9qv4/EHNQOKAAEcgzsWDGBImlRyDq2tctvyOt/H/l0n/u7fuhDjBkF9hizD2rovMl5f72+M5A+/wWItp28Go+duQyRg+jTuXCfeZoM7+ZYAAZ4dgLE08MBTj/jjhxMHaDBD5jxiyhR98/mtNXzzT8ff+ONBlKAUohacNaIAwYdN1X2PPojdc/AuwTxlAMZV6ULY6au3n8Md/LkjHD/Oe/bFrF8JiL2HQcVlVI83XT1660//GJtrVCVoAhO0C/JbOLglJN+e5m8FadvuSEe1a6ObNhB0No0TzaCz7bX2AVy2mS1vK6Mgg1Ny2rrN1Gs2Lv/ZN7Km4qYK4KaqNabc5+Bc/TC6ucVDp/JTT4IG62MhYgKbpnYjYJ60kN8Glkw2XOMJJNviutt5kbz1X6OfT/rZuZsyyIOBwAgZ2A33H+v3d6cUgu9p1MKHpqmKQZ6kNFlLty7cOPdaLpvznpCEXQAFIVZVg9t14H7sOgLkCeRBYhrIwWiLvrptVdC2M6OZuNEIidE404yausTK2oV/+38cRshXR3mvQFNLlUyQ5b3xoDj5D/4ajixA4DWgVCRslXdIwVq3hUlA1DA3h2D7/t7fDMP5LBTwIVl03iGmrGqOFIN3v/nnePes13vIEnZ+Qz94jzQzASowgpv/7Ke1V8CARpDYyLu80Loa1vWN19/AlWu4cBWXlxcinBplDEsgBjKXiPbt9l/6LLLQgBoTFzLQFoX6ozTkAgzHyP3ik4/NL+4K7CQlIhKIQQD1lpbffhfPv4iyYb1XdsUsftL1z7U4mk5f1oWmE3L5JKnrgroJ77JrjLeZL4SDsleQwUBtthmdCaOuSqxtnPn2d5fIF03VZxEdm0sSx2zaiObz++57/LM4+hBc33zukDzEgIaopqBgWA2r8PPqk7OwJ911PVkBhel2kElhqeOLwYOyfYfvC71hFaMxWdu4KORBsJXV5fcwurlx8ezm5vWQa0rCzEZjchXUmIrh3J65fcfAmaHD7cVi1yo/80xn/r9zd+GtjI4BByXLvEOjOHPpzT/6s6Oc8cYmTMrReHFp33hzfD3VGwd3Lf39vw3nDIHMs7kIVK0WBRMISVLmcgFjMIA2+PLndn3i4Wujkc9yZQIgTT0Ifnct5Vtn8O3vo9Ggd4/q3MZv3Fl5s61IUi2BgTzgyOF9Dz94bXOVnUNShmvKJs9z39SLVYWfvow6QXj5hVf66yPPmjS2HAnfKMMtQ0/+ynPIPJxPICOQ92bpo+wkW+7IERYGCw+cIp97cxAVSJTGLLHUoW6qH76AShHhASaGyF3jGzv+O9sc3DU9Tv+r2AH2dD1gbOAu6+u2eSYDGUM5CJyyUwLaPR2Ng7IW3sEUZ86cfv7H+zMfmpH3qYprhERkTZRRMr90+NCjn8He40kcEU/VL1S7BhdvHwnrnjXOe+D+YCJxMgnVUxvSIxnEY9fB4e59iQLIiYI81anOXC+Nx8FWrp5/GSiRxlcvv22ySWpQanTDhYaIYKERv2vvUVCBUNQwmjYDTJpCt2l9zOwPXcrDkz72LV6xJYaiUdSG//it6s0z/XE59K436G82DXp9+Px6Uy4++VjvV74gzAFZn3MLHh4pRlLpogmxCGdQnDp+6vd/72y5iV0LIxOokimknnNucPXWpf/3P0fZIEVvem9mubXs6M4Q/9b3vEce5p77XD3smYnPvGPKXJAodV0t5BldvIy330UtWNvEj35CV68VZFUs4cyp6jiy+bLImj2LOHEYgwLBN00ySyDYR8KLJwCAYxw/mvbvqUWdAcwgVSix9J3dePsNvHcO4jrM8Z663mgHkDY1Qt5hlref3vQ1zSmmLVrc5klQ9spt1zfAwq1xqpD2AqMu0cTmxZ9e/tnLu7xps+J9zHJPRM65WrAhRf/QgwsPfBJhd+TMCME751qhCHiCsw9Df8zsF6QWELba0KZ7gIM4JGYCHCg/+uAT6C2OlX3RS6bqyAgZhQJSr1/AjTchm+B648o7VXkzCx6A6Nj5hgwqLkpvsHg4O3wC8EKhMXTXZ9pSOrfXMnSbz+z8dgvP2oRAmIfxeATnsDFCGd/7//2rhbKeMyOyVI0wXAAIi0tXy+bR3/lN3He4cbypAnZw3MJbbSmlgllviF7Y93f++q3Mp+FwBCTmEIKV1Xy/yMejd77xZ7hwDTEhJXdXPtO2JT92O/ppO83SCMgcFhYOPPX0rarG3HwjSRgiFkJuTT1UO/3d72F1DSkhKq7d2DhzNrMUnGTeOyIHBw5a9JZN5371ywjUbYX2c8PX7fkbAezx8KPlYFipkiFjx8xw8Gxz0ugPfwRVqivfdaUTh7Cj8vZR+sv4jj/4IMzTbmNWTVNKwkwnH7fZPxucEmu3kIShDGGLdQ1NkBqarvzwu2sXT89nkofIkKaumTnkvZG6JltcOPF4/8nPw8815usksAgTkDB/pOD9F4tmQTPsTgMDylAHkDEsQ7G4uP++GqFMbQeMNaIh5IjV0OmNC68D67AxqMb42try+UBKJo6UHVTV1Bn3EOYOH38Y6uGCEDi0C7IlSbhttETaDhnrxI+zwU1jX9Kil6Gq+iA0gnMXz37nu25ldVyuY36ItVUUQxpT1p+/udg7+He/jr2LLWGAfdFeYqbkwA08+gW+/pu4/8gKoFmeACNimNdUVM3FF1607/wo5wxlhZb/c5eUHprIKWzTd/uAlis4IDA++VTctSuqC65AauCt0ZRlYcBu8+KF9OMfo4lQyYoMTbr10iu2sZYzgiWT5Hp5YlZ1Jdzikw/jxGE4DhTI8Swfu9v/tp+MbnsGDKb+qQfGWaY+qMJEPYw9QZp45SrOnoWkAPWTMt09uQjG7VgxtvVttDFUF892ka5uvaY/hu6s/BMUZNStHNraNVStAVKAQDYg5fnvfZPHt7het1iJRII654zcWL3NH9z70Kfo6ONwQwM7NWeJ1GxKOf3oZka/SAe7B3jKdBIhIB8ee0j8oEZuPiubhsklJQCUxuXq5Y3Lp4GaECEldHzt8juxWkOqvfempCk556MG5bli/gCWDrU6fVW99VS6Kngbs9KdGtKE2ahtnJu0UTYxBAckBymQ0ET74z9tzl3cU/RQjZHnGNUWJZG/RrbwzCf8r34Oe+YAj2ht24UnL3Do5Xjg+JEvfX6j17M8hwp7z9B6vLGnyPXcJfmjbyFGHa2FLaDh7tuO7wiHznjULazSM/Jw6PPPrQL9wUJqBDBkHgEp1vNq6++dRl3NF95Bm/EIZnj77Xj9Wl5XsSpjrCn4VgAusr8B4FNPw/kEWPwwbj3d0bETz+/bFzlDyERVYyIDHChWo3Pn0SRUJSBGrTAZLKXZgOfeorcdWS9Zt2+H7qW+cxq3FZNp1j6h0CmvvIOZO/tsjaQVE2k8Iqp1VOtvfvebQ617iMPcOViM0cC1Yr3hJl+478kvYP/94Nx5bgs2dQLcXfe73oNFbu3wNLtlBbi5g0cfGiWP0Au9YUya5z0HZ7HJMb51+V2MVklROAIiUOP6+WZ8Q9PIs2fzqsrex0Rw/cT9PcceBIKbWwDB+x01TL49fuGpmlx7f11LBhKAXV3XCFyjARKSQNz1//UPwvUbc6CsiWiiz3sbImFp79lyfOS3v4ITB+EcR2I4QjZOguBxZN+hr/16PT9I3qNuAGZFiDLnuDcqb/7hn+DiNVhMiCEQOqbNPTfybPsqz3PukiKvLYDhGMHh4YeLAwdr9lFgUeA8NMJZyLm3tlF+53lIGpdNJ2phDYAbf/jH++AKgu9nZbUJFwgOcGnQO/D0Uxj0lT2R//Ad27EjnkgmZQVAOHDIcY/gKzNx5J3TOsbUFOyWX3qlVdlMjNqkkxNlvtv7oYDO0KimBundxJYm/BAGPNiBHFBwaL/Zyz12SMx0RBwVKEiFTVpSu1AQhGSsRi0KiGRIDonQoNzAjcunf/L9OR3TaM1URSnLclV4nwmCDfae+vRXkC+UiR3DE0BsLgfxh7jHNoggIma+K774TtNkt5XZAQIP9JaOP8r5osvnK7VKYlbkTdMUYRDLcc+NVi+9CUusiBKpVVhO4+sX382tkUqlocGgNy5HweejUaR8bu/hk1g8IKMEIOlWDKOdzNEdz8tYW+FdEBmzktdOQQ1kAjWIR0JZYqO88kd/sndU+o2NXi9PmpBnG2UVB4NrOfb9jd/F0q5kHLJhhJP+EEXo/9oX/ckjN8pxFMLcLtQNq7i6WUxy9tvfxRvvoY4gMUYd9a6SqJ+TOxlMdBLEmlHHm0HI5p/8ROm4ZiS1LBRgjxRBlbd4/ocv4Mp1KJSB4Lo30oSLV6vzl3Jt2FJLjDQBfBCf2WAQPv0MPFnXccr2gRRZnVk6BgLynoMHWMgStZ3ixOSCGZZXMBqDRKGRrFPuNbn7zYrttlAagMQOA+o6YOEJTgGHAEBUOgm/OpFNNoQZ5LazU9ZpT2+rVOC1a6Y1tGRFldYyrcbqspx9d/XM6/v6QFN775umGfZ7m6vLRI56wxgWH/j8b4GHpXIDgHMk/CUd00Z/bjWrAtAf7j5C2eK4hhExc0rJs0tVuasfblx4A+kWTLeSFxVQrK+8y2nNCTkEVfEeZkYuUxQRRW/vcVABzrTDCdU+2LXwVCwQE3YiA2zUto2CIaQJCiRqGqyP8b3n13700/3Oc2qQMVThPHxe+2zuxPFdX/0SelnVCFyO3OG5T+794qeueQvDBWyUIVnIh814Y9+wJ++dx59+HzdXkCIg6HsFQP5uxa7sA/izBNakE+YVwXl4B8c4cujI009tpuR8JuwUTGJQQ7CQRs2LL2F9DEADVKXDMGPErdGVF17pmVmqHYNMAWubnhp2J577NAoPIvvg0KvVljEzEIPahkf2g2EwZuUESSRE1roCp4xbq5TqloRuRNYx8OwX2rmmulqtpg2To1ais41DncJVsAQfweyLFi1moMj8NoWumU2wXTPtCmVjMvbKbAwzMNRpQmIPmEAarC1f/tmPVs68McxIRYLzzXg03wueYooa5vf2Dz80fPgz4EV1ww6L+ksxyQ4shZJjIw/uY/exwdIxCsMmWUucFxFHhlj2XTx/+iXEtTbK7Gge7ZIYXV+59n7GJlG6/JHUOSfkEhX7Dj2AYgmWmXEbdygmRoqdF7slHQgjBQuR0ISaIB3Pov3sAEWKWF9f/sYf8ZWrvbpCTCACOzXSZJvMR774OTx6CllAnmHX/AN/6/fW+1mdmt7CAoxlfTwwDIl4be3it/4MV65DpBUgBLPhnhjq20jJW3GX69o3J3h0eysC45PP6OLipkVXZBSyVEerZMA+V9k8cxqXLrtJJX4ConuoIUr1wstubaMn4lWTNPAOYlDXGGf3HcKjp0AEn9kHgxNdyaFFKUxB6PV6bEwtk8dBHSlgyVKMaCb8frcTHb3H9HKq4zk5xajWmAi4BpXQGtTAJ3ghJ3A1k4CjsQJlmVofT3cQh1bAjCATJg7NyvgQwBBL3oNMoUmvXXz/led1Y3neg+MolRtLc33EVDWNhd5yHY4+9ll35CFYD8hB/PNIPL+wZba6up3SrZoZKKBNC/MlQe5dgCosMUOlGfi0efMcVs6TjgGTdgdiIhBSDRvdOPOq00pSSSRqkUkNqghGRX9+X9h3AshBQTv+xmTuA2bKlrNdYC3RVlsCECMSkxCrdTIEviOCOCSKNS5eOP2Hfzhc2+yXdQgZygZGg8Hua7dube6de/gf/bfYtxv9fO8//AfLg3ylqbFr96is8l6/D4fV9QOheO9bf46fvIyq8U46LfdxQ5M27nuguNxewMzIUZfUcyfu4giLCwefeup6StTLYiuSqRbg88YWVzbK738fG5teUzdrozV3aTc1j5u3br3+zl7ykJoI7BmqWcjEubXcL3z58wgOrqUn6ocSwahTZCDns1zaDnNWOBhTIhKx2CSQdBGvtkg+3btypt25iGJt1SMEZBmcRwgY9pEX6M/De22LQ+RtBrrnncbJbf+DTRaPEAPExg4O5OEYBFNNKbEJaYQmLF8+/8rzg7jqy9WlfhhvbkYR9tlGlTSfT73dD336VzF/CNxDJ4L/S3SYXQORqUPygIqAAvqLe48+MpasidzL+9AEbTIfkOrCjS6ceRFWcdfQCAQGwRE7S8Ep1q+vLr/fy0Q0MbMj0djAGK4vPNx36CTQA4dJljFV92farj/dPaYOUmMkx+bYHIjIzTLCfLcpOiiswY9/euOFlw/5Ho1quAByo9HmwpFj5+vxyq7B/P/l9/G1r+qRg/VwgLwPgTQxqWXeLfhs9Y138N0foY6DzKUoU810gMDZ3SKzdifssV1ANMW8uMVrCKdO9fftXTPlYU9ihRgRQsgzjMvejVt47S1oBITArBnMQQyNwBhNDbG1H704GFWUhDPWGKHm4Mz569YsPXIKu3d9YChus1UzmyYRydTMaLLkhVWt00EGI7Uq92kirGL3JpG4tXfN7nkhy0DcRauOERgencCGCnwAAS6AiEKvLQjN3tvpum6zSiWNThOzToIyiQmqE7VvnvYhEQMSq3dfPvfSt/dkzTBYXdfwOYV+o85ng2gZil0HHn8W2QBtn8Qv9+jAezclFVPwB45lC/tLCVHI+4xNScU7No3lxuXxlXdgjeuaa7pk3VQ8lKUEyotnXsuyJqXKeyYITBRklNfih7sPYm4JFrbiIL7z6I1WvUfdRC5/UtdhIvZwSOamkbiDOSQHqGHcjP7ke+tvn/GjqnAZQHB+rS6lV9yg5J58YNfvfGm1lzUuDz7HZkXOS9M0pNXmxs3/8E1cX4emiKZdaoWRb3dZ5+/RJdBO+oG28intztQSvxbmHn76yYqc+JBa+R8Qk1cmJ7L6k9dxY7VVowqg3LwzcsYeaFMx+Axvnl5960wWSJAQa7CPURpYHbjqZ+HZp+A+cCF12E8nzdb9I8aoBGNzZICoqTI8B58VbUd6K0LrAALwi+WYvL1u0sSmJWUCwLCP40dx8iSOHsKx+3DkKI7fH46fKo4dA3lTazvztteQ28km7BUEbVPNxiF2RRRqZ5x1dMLgnSMAjpyZgymalZWXv1NeO1OvXsvyvoa5CO98XichH1ZHzeHjDw7vewD53C/dMrvIStrmAhAwXDhw9GSVPIehwUlMjtSRWpLg5eL51xFXXEt87axL2mdKAJsA0ZbPrqxdJBYxhaTgSJKpMbm+c8ND9z/SdvbuSFJ29Db6ne7HtFWsMN7qo8J2Si0a9IjLS9ev/4c/fPD/9j+9P1rFsEARMNrg4cDIrSQpej0pKxGFSDY/34zGhedeOb72wk/w1rtIApMmdrSumNpiqiE293Bjt/ckMACBehgBjom0Vb1lLO1a/MTDlzXCF2jGyAbBgmw2kLRg7r3vv4CRtM6bYAxpbZzhpM2EY4LajVdf3//px9abElYUvaIqS5DnYrC+vn7ss58+/ZOXcOkKhLtMSydOjrqpXhNZYu14/qluiwJeu2kiIHLssyxD1q1t55wpYYI0z4QFuv2/20PXLYx6i3rmZn9ikxap3mD40MMPPfPsYO+BzapxnDdlNcwylJvNzasvLC+j3IQkbCWP08YOf1svh05D3zzPJ6JsjCQiRtPVlXmq1yw17/z4Wyc+91uhv7tMzrsiKRG5OlE+3D2S8qFPfvGnG6u4sg5tRZmFJiLgQCJqGCrkzBx1+nv3ZpYt/qnoCocBg72L+48vj83nA0vjWI+KwDBJMsp93Lz8NnxCM7kZrkNYW1DPEWAJWt68fOb4w4dH1ShRL/hMa2GCy4q68vuOPnj55R/BKtgY3MZSCcRqnmdiHG7Lx0JqpFCltoNUVUwb13augXUSU03o2CY1Uok3XnvnD//93gVGWvdqcAXVbLXL8oVqvYQ5RwxVIeTe9kGy997Dv/o3gLlm3M1bo5bn0M5WiKBId4kCtXuF64AfD2M4NmaFenCjjeeAaHBh8Nu/dnYQYuEYCaGHmOLm6lyP5+rq/PMv4OoaJLTrPFGqqBZSJYpsRhTYh6pB05Q/+YlevjSAeKZqvMnsfehpzSXy8vBBPPtkp6Q87MOjH3iAGW0HGFRBBDHECO+bSxdSUxcu+NqySGAP55wLMSn27kHGcGhEmF0v78PgfetC296+ba/JN2fm9/CkTMmdeql1vzwZctFKWtdNWQzLpYPnMbzW23cpLC7PH7iQLd4sdqX53UgJqSFT6gaMwHg6QE1bBSkhMCGYZZqCCRGErUqx6z4VNxFegsGCC6ibzIE4Yu39y29+J4zPLbo1JyOYETLm4Ti6MforbvHEc7+JfcfhhuBBNlgIQAbM9wDUDhVTUlcI9c1CqzTO1On5fRhjhbYmwrXgivdB4aVVx3fDPfc9Vdkuyuca6yCcggNFmc+aGxdfw+g64mY3gVKBOBl7EdAwSga8wVL93ju8enmRkhmpKyApcxARdXlFi8XRp4HdHoPQcjcIYDUOgmBb/Zlt0yOpEbibFzIpA076Id2UF9qaaEeRMFQVXnrl8k9+um/Qk3KEGHuhaDddFD3yTiQhz2U8yss63Fy59K//HQzYXM3bmWe27TbR7LvfW8Iw84ZE1I4BiJrgA+6/P7///lvB1WTMjM0xDMX8XFxf2yVoXnp1QvSdSDPwhF7sHQgm4iA5BOsb57//w7kqOUuUO4WlJnnKjcNG4cNjD6GXo8hQV2CXoqZZdkDX9dKhOogNylGRu2o8KtgHeCQD+ygpkflDh5BlILjM1xrLpkJXzuRJyZS1k0TFHUI+uo2FR9t7cbrzMYCFXMVF6Qabfm4zDDZ8bzP0NkPesG8Rbu4mYdHOmJi60R9sIJibCkqhG2vQYmkT1h4rEFMJqIh6BizVl987//rz2LzaQ5lTFBFRkO9F1xtZUfHw8OOfwfx+hEFTNgDygFEJZNm0aVG6J2Ud6/ujU6AmGFaKKWdnYHCGXQeKhcO1ZKrQ1DDDOdfUqfCu2rxx/cKbmAjh6aRDq+UzJp0sm3ZyWRytXX5/wBJCUMAHmElSFQTOdi0dehB+tyDjNoS2rejmNsDwLo+akJxCFeev2p8+P7i0WjgGm8YmENDUFII5oBX5b9JSg9N//j2cu4SyAiHxhHAhdzuk+c4EcdlWslOYNrAEuLZ6kmHxk0/0d+0WJaN2Fplz7FmlAEbnLuCd92BJp5VRxQ7ii0DafkWI4YWfDUslSeYMDKQmsPPMteihU/fjgePwBGESF4GITp1zumi404wGkmBcJqnraqON5pGMwY2k6Nyxkw+hNihnLgOpIHnPqnfoq5x8uX0qxKTO62wqr9M2cyF1+iAT92oMYzIiIzJWsBEr8UTW+y8WbFFC8mQCjkrwGZKV77x58+ybRVofcB04CgTeETsy5L6/tP/+g488C5eBSR2qCAFQB1hOxoSGqSQqCY2BDdndV1kYMNHoyMHyvccezoe7FZQxnERHTOxrM98Lo9Wrdu3cdvuZgbq3ZFgNbJDq8oUz0mwGgsRIHupMYUZBEfbuO9xf2mPgBmxbqJ50QxLv0TIZxPCZt7ZM2gheP3vuG9+db2JeZOPxOighZKaplaNxVXmAs/U33sGffh8giIR+3qi05e2ubGgzjQ53C/+0i6xl0rXETtUuonHUwOAYg3zxkQdGYkwZXJZi8nkvA8a3Vhadv/TtH6AWmNhsE6uB2lQ7pQkPqCXgEK6vbr79fmZAakAG76AG4yaJDYd7P/8snHI+5Kg+z4QhCUxgkIM6QDvEkmFAjDcunXeekqJJybMjEbBZCAtHj8HlyAbVuIYHnKak2Oqr1B0NXLOMiykroBXL4+ljo22joqb3nIxbkgC2+GKTvhya9krdG0Xy9uUTs9y1Kl5QD2WkcvWtV9Yuve2b1V5IZElMk8KMnM9rKfYcfcgdPYViLgEV4MMQyGGhlQQlRIZ0AKbdddWtzS8UCu/h5vcdeSRaBg5sKXOqqlFVnSUpV6+dh1Y7pyFNx2rZtMFcITU4Yv3G8vULTitLFbEphJwn8nUNuGLx4FFwbgjtOGMGYIkp/QKWCTKDRaNOYZWwPNJvfnfjlTeXmMEiZH3vUUc4BtGcIp2/uPwf/wSbFcYRorEu25CuE7ww/gsg5WGn+AUI5nwCIXg8+4Qd2j8GgzNTQhKArI4DU7l6Ay++gqaV80yzQWCXjFnn4cTU2CCK0q5+6/u9pNAIp8hDTDURgd2apl2PPYjD+zWJAym7TrjMOoYqTUZugtpMD6O331ka9AA0aiHLtIk9OIDquXl84gk0ZMZdCYimMya3cw8mhmqk29owOzUzJvhuLDhtlyFqs0Ylp+xsqs1BBjJqNSNbdYMZz9D92p2tUG//Ns1233TfkFii7X4Ugg8wwfr1S6//eHT9XS8b3keDJBUVaxInFBsxPPjEc9mRh0FD80UVGZQZmLeCZwVUye6JlaDeewGaqPnBB1yxL2ogOI1VxtCoqsqBVleujC++A1RtwmVb02+JJ8ZpMpkAoA1IgPLC+28EqQJHsySmYAcKSbgSP7//CHbvB+dtuhM6CSK912i2Gz0AU8lABOWYMkSsj8bf/LaevTDvmUmCpEwM7BDTfNmc/5M/xbmLECDGwASZ/XimXySuptvLxhMzcFCJ8Iz5wZ4vfWG9CJYVKRngUQxT03CMB4u5yy+9gjJSq0y1XbNngpTo1Fm26ytwhrfeq69cc9ZFiBoTMyPPx9DxXD985lmoGTKJqUvGDJOBrTqFkhkEM5w+3a8aIrIQmNlSzIlFseLcoS99GVloQz60ggL8AXwD2lngnfR9tcVKmhna0fWmTYZwMVoyJmZ7FFshWdYPlq7bkdFt8Ufp5z+x1C4An0GBunZI0BI33r95/s1q9VJBVS9Y8EzkkiAiT25o+e4Dxx/HnvuhfSBH1puSdXkrvVQlU7q7/l6AUkrmArh39NSTm3UgzlXbAiZ554qQeaqvXz2NuMqTJHNnqjolPxGIDBBYBSrT9XP16HrhhFikrWMbu5ALXJhfmj90P9wAyJ15kk5++hfIM5VAzgEOlBHBGmmVTN88ffWb3wtrGyHVLjV9WKhib7O6+vyL+OnLiA3q2kFIErXg8g404vay5N1Tz7BVeYUlgDyCxyMPDO47siKqPoMywK7IoZI51qs34gsvAZYjEbZrbdA2JvoUYiLTgQJNWn3+xWFVszSQhhmtz4w+rJEdeepJLC3GPG8T2lbd1rbKGZ1tGAxJcOHa6L2zqokKX8WKTQMhmY5DUdx/Ak8+jl5oyyqd2dh2VZUdXFZs6Q/M9MvzJNfUaedX2/M1VcNviUbC7eCeHVyU2zo879hSRh/25SzpQQGoTK+EUsPWQMvy/FuX33s5bVzOUAUS5xzYV6bZ3K7lERcLJ48+8Fnk++ALSBRWJWVj0kAWYM4oGTd3C1owGQzKeXHoZH/XcdG+4xyi3vsUlZkdWz260Vw7DS3JmjulqdQNXyEgwaKCBFrDJaC8ev4NpDUiI+fNLKmEPBPnGtdfPHQS/T2gnJntNlO8S8s0hlAvHyi4rRkCEEpARJ3w/R/zhavzozoX6Zn210a7N6vxH34DZd0WbQgp8wjoqjhTAaitzZzugSbJU739mT0fZEBRIAsLTz6xyQwjZUYIiEJqYPSYr//sdZy/iGrkb9fo7gyolSvqgkNTOGjTbEIMP3lxbr30TY1Uc2CBIUZQqHzm9++nxx8FKYjhc1OdkciiWfcONaytb7x72jdN5lnqETszpkgkeb5M2PXlLyAwnMsdqbEIYWa295Ykr92B5T9h1KFTxDNtKSVeO2x+ourDwhCGkLY9ePzRxBnu7ZiMVleNVUZWEDGEYCEQmvXmzMujG2dofJPjBmsi58mHSigb7BlJsevAgwc+8RkgA7tJiz3xNBuie5697mH53hNPNOj5fJ7aeR0+lHWVUqP1xujW+7h13mUfsjYZQO69GchQ5A5IbBEoV8+/LvWKM/XsSC3GSCyNWq1ZsXAIvT1Az9oRs7Rtv7vbdBneEMfjBNQda7BNFgUqWB/f+P/++/kba3PQtL56KOLSv/4jXF9D3UBqOElAk5QnJW+bahjSL+AzmVverzc4BU/SDoZHFBw9sPjIqcSOip4mgxlCSBvrWa+QjY3NV99AnQjSIOmd6l0CxAkWN21ilBYPurl+9YWXBlFgws6aVCPLAFK4FdGDz30Scxl6A1Sx7cGY3D/bwn7btVRL9YPnd5nSaDNnyjK/mUrkuSjzcJ5OHcNXv4S8Xwn1hrtAjhA8sSeXgTIgmy3nztxAm8yHlU5tSgB1E1fZ9Um3EnUEc2zBqYORes8q0TG1c/bg6E4TDHaS9dv2yKmkwA5tgSn9YPqICfBIZBWsm94dm8b3M9TrN1/48+rG2cVM2GozMbMmaZmAMEhhuHDgvuz+R4EiwVd1ZGbHUEvEaFJqJO2YS2k/z1ZNAZdjcGC4/1SiXkom9TiwxSS+yKFxmKfVN1+ArHtKduc4oFuITUytOdVlavceoEa9vHrznFTjzLxJIiRBSqa1hIi5gw8+jd5Ck1Ruk8blu99eWpVewHX4excSecAM5y+f+ePvLMZ0pOid+/7zeO0t1JFkMo2Et0bHK9AJQPF2MONutz3dciOtzSshAepyuIDPPiuL88rOEtDUIAqOYBZis3buPM5eQJQutLpt4pRMyLxTMdKuZbGrRkp6/sW5uslFTKLLPJqG4IC8CXl+6jgePonUtED2LHY6OzONoU4U129d/+lLB4ACUsVR6BXRFD6s1nGzyA995cvYv1/6C2VZoxgYs5ETs1Z9LWffc55mHQZts09t+886JtSE6AdEoDSYy+CDEjabKiKRh0nqZTnDekXWxApJAHUf3LI9bQGbWuOHRT1dGzC22A4zqzttbgARWl589Ue3Lr6z2GeN436exaomIiGsjMp8YfeJh57EwgHyA+LczMwiINQ2E9vdB1wUYEV+3ycqN99YBqAXgocpIar0C7t1+T3EFdi4rmu9Q8HO7kjDnShCRGBz+fJ7QRorR70QCKKaXB7ge1HzwcJB9HeDgqCDX+zeLJNmbyhD/GRYgratuIQmNc//9OZPX63efnf8ve9idYUkhYlZgrFN54fu/KTv0jJtGsH6VkKaAPZCQK93+MnHNz2LciAGETmQNLnG3risX3wJq2sZkpGK29lE1ioh2aQmQVsAEIQUJGgE719Yff2tvc5JWXbUNGMoRxfqpQV86ikE30q/tPOxu8CyTXa3fJAgxc0//JNdy2suVXk/q8YlsytTg14R+nMjDs/843+M4RAhR1QQJwO5zIcegZKmKMnjQ5I6AQQE8sgIoZskS+J7iTOQx+Ki27OX8mAEqJApLJEJmWbeQxK8bwdd7qie2Ac/O6U7YLOTeYY781UBDOxDgMEhQWvcvHT1vVfjxtWhS/X6xlx/EDI0MrbMajD3lg4+9YUs3wtXKJm2Q14oGVg12N1JAbFZQG/34ZNPReurOVUNnqFiADvNfHXp/VcpbZIqaFKx3D5Fop3A07I+bosrFCj1+vvVyrXckktNHlxZj10ICiLKQ29h1+FT4NxclrbflrtWr7DZXa51dzJJFlNN3mM0OvOfvvH2N76JS5eQ6tDOj57ZztPkYdwuY3FP8Kx2PLEpp6Ul7mQBn3iEdu1ai40yERHyYBJTNZ4joqs38fJrUDCM+DZdVplxbduvvSPhkJJGNLL+599fMuYUU1ORDyoweOHsWl3ufvQU9u9GL0CkS62wbZLC5AM1yzNcunrxu99bVJ3zQZuamcFweTbaGGdzS7fmFx78v/5jDOaQZZgbwnE0GcVoE9lH/cAHqZ0rE1hCMkSgBEpyMSuQ5ej38chj+0+d5F7flJwhOIrlGCkipUGeARq855/3cGy7+X2YUpZ1gLB1g0QmS1mNWx9Tl7A6XXrv7Ks/zGUtaJWTkNbOW9bvjes0arDn4AnO580VCgEl4tZnckecuLNTuSPETOA8P3CiGO6vkyciM1WFmKpJ7mV064JeOe3SZmjPmN2d8Kx0mzz87BGh1fVzb88FsXrUz0Idk5iJiHOubPTI8YcRFuEHID8b0d51NNsAqWNdTuJbQ2Ytp0877s25y/rqm4g1NGpL+LWtelZD6BAuZQht6XIZ7lF+irSNYCcf4uE8FvpHv/orMcvgc/XcSB0CoS6hzVLwqy+/jpVxcGTQbaSOSco6YTNito4vW2K2yhAEj3fP1O9fXszydjI5zIhYOYiR27Ur/5XPwinQkty2sizdKohBAKlLNPWNb/2ZXbni1zf2zi3EukHBqSmDuLqx0fzu1b177/+f/xEO7oNGZB4hwLkKIJ/zNCq0OyBjjrZIKq0aXXIZBkMwYWkPffYzx579VLZ73zgqlAOYTb0z05gHt7Z6C6axabbDVjuxt9YOdaIr+fPMEm1zWwM0k6cGqKQU2Lepg/OMuFmf+emN91/aO8f15k1L4yzzdWyQFdlg7sZ6ySE359qhjno7I+ejJ2c83Hfs4bICiXPOEVkjohxg0VNz5fxrkBWkpouYxFrQe1akcfJS23qsvL3eUDdX34vrVzNKUMuzfpOUIUZNFM2HS/mRR5AKhMzM7rmeqQmIU6BdujalziP4AI0wJTHUNVICd8SxybruMgxzUxhgkrje82EAkdIMyY8IgXF4/9ypEzU4ZEUkQKJBwZoHTqtr8YVXUKZYjbmdoNbR65nADpwBYRv1tIVSpkl1N9gT4xFqfe+HP+4RZbmXVINIjFISLgYjlWOfego54Hibhgptn8vCkNQ41NhYO/uNP6NrtwK5RMoElONdC7uj+RsbYz5w2I4d2v83voZD+1F4eELwyMI4pQZG5O4ISxBgHeBKIQRGaBDaflocOOw///mjn/q0379/LWrZWOFyNIoUh72eh0mq3n3zDZgixcCuo87aHeAf3I3WK7WUaUyp+JjSTkwSwTk4aSpYDV2/8caPbl1+u59JP8vqslJhclkkUob5bmQc4ImCgY2UPnhnvx0KorYBdf9983uONbUFdgQlT7Uxscu9S+VKeeMMUHbsDKLtZaQ7Dp+7rchEBEtIq5fPvZZ7a6q635tXYe80Nps+KzardPj+J4AhOGzXm717wk3LIHVAJsilWwgZ4BoBE8jYUoaJUhNBCB7wMyLYrS22rQMZft4gtp+LF7etq10Vn+ECsgKfeuaWUwGZmJkg9yk1hXe5w+mXX8HZK3liglUaZy+NwR4cwGGWiNtSIbc/g+66hdNLr61cudrRb5gAhhopJQBLC3jiUXi/xXIibJdO7G6IkCIYXvjZyk/fuHnzJoqgG5u7Fnetrm9QVqC3eGOzXp3LF554+NF/8HeLz3wa/byTBSISgL3TOxkAd0QrFyioogFAGUKOvfv3/87vHHrqKdm1ew1uU5U4K1yPI5zCNEHlvXfetrNnOg0OFcIdCT78YfHtneZBhbaTixwoTOdh8XTuGGXEWdsCxTzG+MrZF/88lrcczBJlYS4JbZbjwXxP0AglM0dWQHOAQYn8Xah+EgEUjpx8rNYsc0XufEtOMvbKwZPeuHgGoxugboWYGT5kWj3NsjBoQvrykymVoxsX3y03Vx2cJGZ2jiMhes/jWocLR/yxhxGb7ZapbdecGCV1HYMeio5caxYmaTuZdQHnROadJ0tXgcBBNYJbwEODI8/QtMWn4dmAyD4QR2gVTFtgSxkAS6f+1KbZto2GojPJZRsdkkeWo1+c+pXPXrdoWZZSgip6PcSUiyyOa/zoeaSGEUFmhCLPZtPdLcRtKwHW7h7MjiUh+Dwglrh+c/Pd97P1Uc4OZt4ziGRc+t5whbD3C59Hr9/AybbkslO0mra2hJwwLhFl/J0f4vLFJdPduV+9cYVz0kDkWMiN4K9Gq3btf+p3//pD//B/wuNPoiiQ51b0SzVjPwOgdpNIGriGsshZZCcul2yA48f3/PbXH/0f/mH//lNVf341wfIi780RYCaZsz5FrF0fpBFefAHrq1Ad9gdpgl3NrntqU0VKmLA9haGk2n6nRXq6p6OTmQt3qpTOsJWjpaQCMqhYY9AaaxcuvPFCWr26e9DzRqYuy3vjJiqE1GAEC4SMzLOag7r240xBMlNY85NWpCnfmJRyUH/vgeOjcSqKHjM3TaOamNShtHp5/cJbaDYhqW32Ajz58BGIwtu5i9aSKmurrm/cOjcspB7dCmSq4oJXEHGhlp24/1Eg5yybGqeHIKgY13AZNCh5FwFSoYaphmiYZLjeoEDXRmyYnG7nCMdaG4CqAqkCY+nWdnvL42wJvLMvjZNcdSsXtZatomwqbWg5oWrmSZt2znnX3IxsJkbpVL7AjRHU5n/7N24GUnBlmue9SmtUTe6zYn114cw5vPseqClZAfVFUZWV815SamdCxU6icAfKpgRm8zBIp2eOpDUMiKw//dmRx5++OqBaKljqZ9mYsnFMjctPPvrEjSP3pbUxVOAUipDBKvhukmXrKVjL5AGLlVy/VP6bfz3H0R05sG/P0koqm2rMbhhc5iVPnN0YzK00zeDE4IHDJ8bnL1x6+SW89TpWbkENqYEqvIcBKZkxfIYQwA55jhPH5x5/aunUAzo3f82ohlc4CmiqCMBZKuNoqY+5OL555b0zL/4Ul06jqSFIkibPTWeXHEMFEVTCVarBLBPnRUHUECdzARaAmiyBCMSmRAgC0TblVZmmvzO5olgrFwDtci4ap9M/Xu0NDz2UV2lA2UC4aAUmA5N3zomxejLJSIKmpmn/vJ50FDJjYDCHaKjhJjr9QtD5w499sax4brg4KsuQF+yzwJbqWwPXbKy8i80rUCmKoq4qA7ssl9gAM+drH1TbnPXM3kwpwHTt2qVXDtx3X64DBzTEdaLAWVsgX5jfjXyPVjWgzMkUvsPwKYEVzDCHlhg8oSAaONKExbJ9k5M7xpY7Ivodw8d09icqd6QZTck8rVDN7Iz1GbmBVkA35KjqLlFBG40Wbv7hB64QkPWSsKZITFZHl4Ve0ve+831sjuEcHCNqqmsAJrrFvZyWMaf5Zxe3se/8NLesGnak0SCC0+euv/pG/yvPrTGciLaDLsmlLKw2zcLjn1g7fRZ1yd60MUlt3yJp2/MIQZL2/DPPG6nGmTPX/+2/e/Af/L0r481830HNspQqDllVi6m3wHA2ojCf9YYPD04dPWRfeI421q+efm9866beXMHmGDHCGP0+5hf7x4+Gpb0LBw+G3bvrrL8OHguicp73UiNZIK+KVPcHPdO0cu08bVy/8JMf4PRpCJz32tQJUrislGaWCmIT9WImIsCbSx0Xh9iUTScMQWNsaSDp7Nwru6PX0Z3uJ5ZhmK+8+Txn2dFHv3BjNGbqec8kZiZm1M7YJXNE4sl7mjQO8DaBXgaDEBWUwxKAHoZHF5ZOCvVFOYGYmL0TqfrBnGysXD6NcgWWZELznnAY9EMbb/S2vjcAaJ96XL108/I7i4efXI+lhZ5xFtVlWT9prSj23f/k9Tc3YLeITCEe7ISctVhMV2uySWWA4VwJNm8gM7Q6jvpLVAE1NmJtUSGagODESpzYgx2ch7VLG40AhFqBAA+kyIBDkeHTT8mBJVEGB6hTTeQ8tHaEzbX10cuvwADi7kLM2ptOHw1swowMoYlxG5iOxjdfeuWBL32mAAlxYwJ2MIPL1tEcfvaJtRd+iHObyg5Uq7WlYDcJOciZtiUEk0QGqxRvX3jn//kHD/79/0YX9aZPm56rcsUVQ1L2xpTlJmktxdK7YmkJi3NS14NHH+o1kYU8HBtrMgdHGY9QwbuasnGy2CCJeQqBfbk5HgwGsS7LWC30ixhHzWhjby979w+/i/ffRzIkBUmL1t0J3enmgjnJKPZMA1MAHFQZ2vWUGaydRNxit/eqTxnrdWhafuuHw727d+07eWN9VMwtNUrCADVJbcIwcAIfaQsPsLbpzlpHZ8lgHUTuYfPzex/szR1ZQVHDJWYyGLtU63zfbd5YX79yucuUVBgQqEm6JzxEPbtkCSA01cULZ/edeJqqxHBEISploahUYeHwqaevn30T5Vh0s829PYxZaUJnnjD3rRvVZh2GyhO7/eUqJpERtx80lZY0Yp1Og6cZ0vlkIESROWQGB9+DD3u/+iurDoRAiYgZRKzSYzfX6M033m2L9Yix7QUjZretSPXBWUM3zGOLmW6CzANJQcC590eXLveayO3WSgRjqCYmOrQXj38CLqCZSVbb5g8ih1apiBQQEwfkYNSG89fe+Sf/++Yrb+6r0mKTBoWXes351DSbUAGzeh6ZLMe4bLYawjUfbuT9a73e1V7/atG/VvQuZ/kVzjfD/Fr0N0dpswZcr8jnnS+S6WAw0FRlznIkWVtegoTl5ff+2T/D6dNoBAqIUooe5kEx1dugDpqUZ41hAZbBApkj822r54TIyjCyKe24S0fvrjAWApAUrkJ9/dwr327WLiwUilgytbImkpxErw1bYhfZJ3PbxoQw4JJCEpoOlBLALcLm9xx4MGIoXAhn8Fktba1aVeLlS+dQboCEyKCTRWdy90N32n1KqUWDjNLyjfWV65lrVXkdc9YoJXKlBR7uc3uPAzmMQYGhzqvLhJ10FLpuboxORri3zJ3Y8qzplyubPenibYnXLec9RGSCIG0R0UM8hJGYlEkZAowaRA0okgKHDgyOHE4hz9ijklydI08x7SIurqzg+Zcg4JB1/f7OdfJKH7rlkO1Qgt9aW5pApogJm5uXX/jpgkgQ8W3fATFqJRduQQ998kn05hB9pplXdsZe2inPqqYCMHMRMoIyxDRSSwtYL6/+v/63d/7lfzgyqg5IvZhbqlYcSUqNSfSO8pB79oHzIhsMfL/n85x8UPUimWmPdA7c36SlOHfA7dkVdgcUSdCQSeC18QpnFqzZ7fSY45WfvHjzX/5rnD2PBNQRsfGQApyBBKLbaRJb7WZEiV0il8gJvDEZSGkqnjoBCbf+8K7r1dJGFpLgKtw4886L3x5QnaUqmBGRMomjRJyYIryYN+e7TlaaltDFkAxg10596MEGfOSR/uJ9lRTRMmXHLqgqQ/OMmvF6efUCIHBEJDC4lj7c9QPe7SWoWOwGeXmHenzh/bczVlbRJMFlURQ+jz5frfy+Y48gGwIZyDOIhZi6+XxGHdqm3UiwtqXIAMOUP/3L9JgzJW1SNiNLDuLMtiHUyrAJUZa63q7KM3q89JXnxp6k1eZVU03OGyiFGNdffwtnLiCqxtRWQU3UzFRkh9v8kJ3DdrTlGQrnWsYMXnrZb46YonbZKCCRGcvNeP74ETz0ILyLhlYSTzX5lqnnnAGi0qRkkyHtDPEqWF2DGL7zg5f/H/9L9bM3d29u7g+0Z34uBCcSNabWCDQi1Tpa2Sw3G0QKFHIfMucJmmLT84VDSKKjuh7V4zLVRin3tjTo2cryfF0OV1Ze/0//8dq/+ze4epkZaGoy9TAPM8Q0UWb6oFBUmaKn5JFcUlI4BYuR6nSCNX04HfPnki8nK9EStMLls2de/UlhTZDkTInIyBnTtKLLzPA8bZPARIUdQJYVMA/KkPyho6fgigQGqWn0lDIkb3VBcf3WFWwswxpIaTotmd/jim7n2HYlNUtAPbr6Puq1oI1P0SM6S8TRZ2EzpqX9x/LdB9qKv0eAeFVWowQ2Y0oQUBSW5BRe4buWrTbt++XOgCFNrI1PbXsZWCAtS0iVFbM0OuvI8ZISwFrkQMLxpaXPPHLNq6ZUc7SCGi05mMusXl+9+dOfoIpQhSZiZpCITL2lfLDD3M5M3JqK2SoWOFNSsii4eu3Km69nX/qMUgnK4AKiKAgBmx73Pff0uddftY0YldUEJCAyVWUP5VbOZ0I5MpBRagZZrxqPBA7vnL104Z/guWfu//KXbwwl5UPyzsAKdj6QY1PKF4dQM00xNqJGBmLHgVetTmSJzAXvfShgVpVho5yXOGzS5Vd+cvoH38etW4AiNZaSgwamjHwjpdxOXJgJ8gkwtuRi8jXEASQE0hpUgyIo7YD7Wjd6ly0LzJSrpeAQq9jmkmtvvLrc27dw+BFn5BCIW6iJAArQ9WYDWndqrTYpeBsA1JXAHNRhfnFhYY6dWiozYomld5nnxqcR0saN829Dx7AaGnmCCmqnGUB3O0eSucM5GaSpBgnqlRuX395zeF5BmtBzkFiGzHk259zRo8feu/YutPRt0TIXGaRYJ3UOpAJKqrGX0kwJS/ELjW78qISeTKWXWkIlsxBS7BEKid5mWJZbpwQPStCoET1XfP7ZlKFISZQTkPV7m9U4KA2D0fotvP0WRNoZFgxqUR/HzlTa3FA/bG/nKT11KiGbIgIhqc1nYS0mRKz/9MUTX/zkci2mkjvJk/mYzGf1aP3Uo/efmy8wHndsQGo5AmYxOe+l7daaSjyp9LI8NaMAdkhNKUiMP//+mdfeyn/768Nj9y0u7U9M41ird+qyaFSrcTsGmidVdEWy5DN2qqpCWlJlIWlR1YO6vvLiK2dfew0XziFFaCJrHNqEwanGquteIEXbyjHTILNVNYGoeqthJRsBLIBZlVkKVjmLQIJtaUzeEz7BanCuSLEMbX4jEblcfvl7S/sP5jBQD8iAVseozjCOoxUgQmpM2OdsLaTpo1o+mK9L3X/0sPcpL5pyI3kfUrWap15AjPVqKm/Z1TOwEiRkSoBzSDIhsdgEbP7I/LR64sp6eTauNwCBbly/8Naxo48CXDdlb9Bb27zhufA+b6qNffv2nSlyHdceIovE2crqobyItWisGGQcEWR+3LxfRxBBWpNo1fJ+meYpelDd8soGB++JCWBVZ2mxkZXxGISuXldVBBQhi7Hx4A43y/IHjh2LG+Nhz9eiZYou6VBTZqDV9bPf/i6ayqm025926T5M2xKM6QejsTswcZ5qjQLR4IG6KQlsEXjzrc3X3z5w35HBQmFV40cpY2/ONKKRcvDpJ0bf+C5i3dYMxMw7mKimBKdb8jwKGFJTU1dZZcAQCQkor9X/9J/Ww0H18CMnn37m8LFjm3m+4X3s9TdAjaPUSpe6tmPavKrXErEaqA5clse0ce7ipZ++ijffwdoaosAahwiIILXNhaRpakKpHXC1QyCzkzFq56jHvV7WRjcz884FIWKIl7qfKhptcL+n69Usi4OJ1e5q/SigIk0rLehgQJL6Frh888VvHX7gqV37T5axJkGRZ02ztnr17Y2Lb8PitIelG7MLb6CC82pUZgtLR/Yv9Htya/10Lx9SpF3ceBkXzkbNjYvn3kBokEpY2d6HiVni3tSqJjrg1pklBCnJ9dNp43IWdoWsQLPu8jKlDbIi58SxOXHixPtn3yX4HPuXcHgPsoCGQAHMQAMdIy/w/KucoBq9Y0nq2InKLxEDygIeehC9HN51islt4JckLI/j+QuABO+1bhwQ2EUVD0qgxjMC8PQjSAnIgACXI3NoRkAEGc5ewPX1vqI2vb0vYKe01Pap1UDbkNLGYxOE1nVTPVrebwIaZhQOh/Zh924UPURBA3TT9SL6hOs3cf4Gl9GxquqEVggBC+uWO5aO2YXpOHQCjDOAoMHzpigc4AP27MHhI+7E8eHhI/19BzXLOMu9yxgOqpqEUhnXl+PG6uqV6+n9czh/CWubaAwxQdW3Is2QBBXamrS6rfVn1ltuWSa3RcPEAcdPIi/Qtpf5djNJiDVu3MDaKmnNUPNORciYp6ySu8AdGMYEcoCDGbQBQAE8yA8+cPyhTy7sPujA62u3zp97c+P919HcBEbTTIQBgmc4gD1nY23AYf7g0eR740q5mNNakMQRisDajMq1G4hrQO0Qp9uRdAIuLR0u3h0IxNP2GgalCeWz5+eOww/hc3WmqAEDCpjtKmS0fLXZXKYh5ZtsyAjs0UY0AFjhBZJ8lBxaAwhICb4IqYy/zDzTw+VwbjKczLquX02okEM6nmBbqQLStAXZhVIjBn2kCPKggMhwQGi7nCNiJNHcIcoH3le789pgtEKSW096ch4AFBngAQVqwBzDBbDf0rPv+NqGnsESSuR10/qh6VIXsE5002gGY5Md/moytt2ASLAc3egx8mhHWbeEYR8ARlLEBEloxoBB2hdgWrDLghvXI+vmN95mfh/UQ2tbDrO9DwkenIMddNIEzwASVBBTBqF2wJ1rB44ygxR3A29OzoraUXgtB3BLvLIHG4J6cAGI0E1oCakJOyTgHNA2sjmBplaqngjMMA91k0GdbXti9IiOREympDUjbHVe3K1lTrtSabtQrfWBHORAQBvrWOjo79KAxLPVuaBOHs4NkrKZQFWNOFSxHpJvrGnPGg6pFZj7pTlNMg1JkRBJDe0glxY1phyWAQJOED8xyykcFSTmRGlzLGCQwVKOYJEbMEy51gxaA5XOusPJtJGfd0GzwzlpsglO5A5YrOPyOEBEA7E1alAHYpBBraUXeAMz0qRZEwBvqQhO5Cd1Z8fZ9jUqrYhiOxivnrBA21HkRkAJrLdTCtqG8k4ONwkMBbjHjkxrLZt6Qsp3t7UzfVCyvd0sJ9xOZY3Q5MAJFGWiIG+aQSZsbrNuxCDdNrztoy5usxluYCvw6WCphCVQBfMwgYyBRDNjXmyrc1UNTrtE2rTrkFIkg4XJdicE9VAgidl2s/zQzfvn90LdBtGYEmoiMbAZd+QZakAMafch9Z1GliaoiBF3SqC+iiWgm9YYIG0XU+YQBb/MgwFuZc3NFNpWG6VTSYeQH7cDEWyyawZuV7GIZq14JKuZOiADRSjqtgkrKmChnciyFa21ePq2FgL7AEdK26ZQ0jQWJhaDmzTxMyCpduAAEFoxbNU2BBZGVBBSC9RAtWVwCJNxBvUTP9kKl3Vvr2CbtGszQJw0TPZ4hYLbWwV4ZoWJCZDAkwFm3Dk2KCpBUjDgiTm4FONWZkvbVL22PxCdls0mpfPZJaeM5LqOFiYgtmRyqAN5kGBbuWuHSM9H26y7ms3OJ9N2dlpEindsnrKu6KpiTBBHZN3wCTJLbKQQ6+jvsd3O2/YO6woDMzZp/CHM2J+/qA1b42unrEZEWCSwdqMnAKqhE9kbNe8cUUuCVDNY204pEIGB2kEb1J0wE37p4Gw7I0MVQgRvMIa4jrNemrZ1KiIymXhvbbFIU+raPr1DJnAqCoExpomlTeLOD+zf+dCYatuDZ9hEwcg645ypDnQsmESW0Kr2kVap0z1yASKq2g2wsi0nbJNO/8lMx+4TXLs9tSK1RR9CiA2EASXT0MbG2g1rkta7dOc2ITGzA2tKBqCBtnvELKKDraElkz4Bw1Y1+7aOr6mgUQvuO8AgCjIomGAwU5mtRRFtUdjvxix52nPXco86EUCYITCChxnUYERRnOkMr3Xr4SYDGlMHMAJgbKZRLE1VPXVLVJK4HXlpevuOrDsK2h/FLCdzyiY9GxMZLEctZV+pCwsNUCOdpkm+FkuTcCoBBmra/rJWA7JqyNirMYhEAdfgl4gAKdDK2LVeIdptvJu2HU3MgUW0m3UMKowqicgBRqrgDBEi3d1kZSZVn2Bphq3+EROED/j+1j8Z011CCCBTA5kCaCZZo4nNmTPDGKRq3kDwtaj3voWUYpdSciulNc0qpwbijElgUEkrU8K2b2UUJoY0ZZEr2MRaomqfc1VtIDIRet9W6JsMw5zUQbZ+Pl2Gk9/RHYFtu9FXpICr27KT6wTtzaxlc9iUY2v3uKm7remAk9lm5mAG1CapHc8paDOfAiBFMwmzJg1f7c6nasRtdtFWGds72/YY2kQdXU3Nbm+GbqMDxjQz/8g5Jk8HM3abZIsVpBaj5q0K1PRtte1CZ5lxBGJo2iGAnmCKuoaRiDHQ49wD/oM11P6CypkATRTDpySA6aweYg4B1u0qzvt266apSEM/gDvWRZpIv5iqmoKY75nANDEV21Eo74p1XfDT/aZjeG5nDU0Zx+3d7cbbmTLIwQV4SamLXWbi1TshLzzRRtPccTsWwZGpWdJuXL1ONHK1nWoBc+AAFo0G4alADm0BhrQ18G/GYW5tg7olu7vdLHX70gOZkmm7odvkTvGk4Y8nq9KQ3bG/8cPrmVvDBmfo3CCmMLV8x+2z/jASQEv1jRYNyl3HZjczsfsk5xy7LVmMyejeD2/y+mju5g6CeLbtTu5YVmbtiW2hc3rn1J+2N0n/Upmzd3ZYW0HFdF/XaTmhQ1+mE+u0s0C9E6IxM2f2o+E/2/94CjDYlDZtmLJKbceZz/go32XLbJg9PXXgLYB0e3ZLd8r5cBt6+nNT961b8WEfsWMJss1Mzt2RxthHodvZ9huOe549y9urWTwBtpV2Cvn5bfZDekfknbZuyYee0QfcK7un859xiV00u/2Wst275X98fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8/FU+dsi6tTL+fCdCxEdX+P/PfkX8yyV0fHz8F/Bc6C/helqKztQwzMzM/mIt8/Y3/KDv/1U7mHl6kn/1z/a/nuM/+3Ohv+SrxT01HPzivvTjRf/x8V+Yi/4/U7Ax6yenpvhfivP8+Pj4+MuOZrv5ijOukpn/wj3n1jTy/wKN8GMP//Fz+T9hPvBRJzf+lUSA/kvBpf4rtMn/vM/F/2V+mHOOiETkl7r3tLbaIk+q+ld8n9txei0ASEQppY/N47/m5+IBgAIwABxQT9QDu14VUGqHtbSytJO/UtrW1dKGxYqpQAP5Sb+8gyu6RtbMu55nZqkjqqoT6KA4ldeY9g3hdg07AOYxkY0nm3QCAeimeGUgBgd4p84xs4qaKaSdCqetRCNBW+2O7Z80vdhtU+hmmpg8rADxTCdaN02wE6ag1E2e2NL0/kjvbx127YAA8nAOIWPPzrm0ujFp3krdR2x9um67gqkGVNfLz0Cvk1EhgNxMKxhancruTs7++7b2Ncw0xgIOlAN+RgmctwRRILDU9o3blrT/1h2YvBsTmNvO+PZ6zXWKRltXt+PhMHgyPaW78ASKsxom2/ddnnkLB8sABbXKtx+4k2/dnK0rYpDvtJzAcLlz3gdzjtLaxtQKsNW8ajtHtmxfyt0IWGhna8SwBmTbtCKolSiSqZAywL0Hv/o/RhQYX5rrZ6Vk4MKSmsasp6lZ3ZW7amPl1R//ALEBQEiMuutRhANAsII0GhK1ah8DREOjQA+0e99Dj9134ljIrJZNYsCcJLpxefnimXfRLEOWgeQ9pIanrhtZwUazclrMXKjGLKSYpJ3sLILM55oECMpzbvfBgyce3LX3ADOYuZf1bq7cMrONW7euvv4y4kYRNMa1EIo6VUQgmtpRABgUd4i1THUu3GDXM1/828ur9dC7EMK4Zg5FTVUz3tDNzVvXLoxvnUEWURhGGwRvqSGC91CByoe9fzewgnK4PQdPPnbg2PEqya5dC1VVsbibVy+9/9YrqG/5IqW4BlUfQmq6DYm7rtSuK99REG0/ImD++Cef+0rcWPUhX6MsUWiHSTkTZ8lbdJag9Ss/+h6aUd4PTbkOk+AgE8lj7oRLptvQYOHhLxw/+Whz89pCUagAFG6NY39+bmO8XI1vXnn7p6jX54pio1oDs7VicJMFP+k+DA6cIRW9+Vs1Dj/53NKuw6/++Z/A3YJuTuMq6qbTdvqecADy+f2PfuKhJ176yffL9cvAmg/dvJPtou/t8Nx2gJPbc/zhE/c/88K3/gR8C5p2Not2T4ENjonMGh8crBdThI8whvXhB2H3wSOHTu5dOl7kTrEsWmV+bjyurl6+eOHcGZRrYAUidDquU0FTJdTOJglgY4KPSODB0ef+Dmgw8OuMmCgXeICUIMTe4m6LzfrK+vq6d0ziehJ2b5Yyvrm6wnWpPaLcqVdrOG+a8tZqzi6WSGCfaYpbV9fuLuYYqoYid5tJQIxIsIx7xX3HHjr+8KeWN8rzF6/cuHVFmzUEDv35Xhge3HPsS7/+0JULb7z7sx8gRSEhzynZVO1q+67IpiBwjJIFNALvYMZN4izMwxdHTz129OQjm006ffbcxq2bMEEd/cKufQcOHTl24ujBQ+feefP6mTeBYWpnbjN4Il1HCAbA0owA+9YnO1+4fCG5Xbc2r9+qbjrTcSSXFxpkcWFuaWnfkYMHKnnw7dOvlVfPISxYXbWLRCYelJFpG3fc9v4AwAG9Xaceeq4/3Le6Nr5y7cLbMtIo/f7S/cdPfuZXDr/zxvMrl14FNMu4aeKWosisJgZBRNCOIPMBfr7C8NbK1XF5U7JeYiYomTkkZ8mrOTRIFVICEGM0MwKYMdHH3uGLCOR4sHss4caNlRVtVMG+WK01H69nOY4eue++/Qfef/PVqxffBBhOu6GsprObUXvmDhiVI7i5S1duHDryKdp7vy2vzCh32kzARJ2WAxV79993a6MuywRzIKS0TZfoNs9JIFaXK88BA9D61HBl+6LqpP5MjRCTwCJnfU1jkEdv/tQnPrX3wH1XLq2+9OrbomUW1pOMJWWHDh47euzkkWPHz51+6/LpNwF2eV/qzTuO4Ji4RQYIpCBONlTur18+61EmytupQkJQIoaMUqPlRlmWnsSgycdKVpdH515BWoF5uAIJgCI3xPJGKzRkwqmdHx1nFleCdfFSNwPUeaQcgz0P3ndkz+Lut1/7wdWbN3R9BZTgGKoRPppbf+f1lVMP7d+z9PSnvnLm3dfWrl00J0AjEN7qpsfWTOlJqMAeJq2MRQ/ab/zSJ774lczhJz/5QXXzKupNmMAxJKV1d/nCq5d7C/c/9vSRBx6V3q7ld19DswxEuDgxS2JCmi6I7eNWFd5SAZmPNa/euI4br8PWACAQnIyTXW7yYn7vk88++8zjX3gt7F07+w6UQck4tgKgAJhabZk7vL+RB+e7jpw8cOD4O2+8d/3Sm8Ay7BaIxzd3v3bh9MnHn33s8Wfe5o0bF34mtRYBVdSdU8tsS6OkzZDAzIaN9fXNS+9C1oDmtqViPg/QElCNBlIDuikJ1moI6LaQFUZWlaNrqxdfQbMGRAQPtWo5Q0qrl4+ePPbsgSNP3lhfluYGmhHIIwUggWqibq81SwaG8yIJFnH9Wj1qTt7/8HsrL0+DwVa3SaBEIDKwwgrM79l/YM87b7yFuAE05L393GSPiJk/CmWni9Joqk1B0Pli975Pf/4zN1dWf/by85tXl1EL2CqsAwL0L63euHpl/v7jR48d3T8/pLNn3qk3VjEzkNto5k4TFKTmOmkGazItCenaW88DGxOgJ02j3rHLIICZbyPrgiy3BtXK/7+1L22OIzmyfO4RmVkHbhAgAIIg2SDZt47u0Uq2s9o1mzWbL/tD9zdobGdle9ioR5rpU91s3iRIgMQN1JVHRLjvh8isKoBsqVu2tPoAwoBAVWREuPvzF+8RekrAOHRFlXSxhATgxNgQ3EQ64YKKkXXeIwHIQNrb7316pUM7j7/be3YfFEAebEApouE6GRAOHn55sLv06Se/2d7+9MuByGgfCanL6/xkLJ47qcoEgI+iTAIEg/mrmx//euD1+ddf6MEz6Miy1+BSGA+vyh6MUfnk3/5l4xe/Wd16J9jk7N5ncLmGca2iqkpjaTMaP64oAkJAkthWkhhIDukDZyCNesJQJNmVorf/r7///bW7H23f/DC/euPeZ78DSoiLMYMAUYnSmW+ODxBsa255rdfrHTy7B5wBfdgSBshyjKrH9/+l39/o907iUeUdplRH3iyYSIDaUiniiqEwyBPkqM3JansRIYQyN8YACOLrIB8aLTnFZVEsodSkCRFcAS1Bee3GHQDAHcmDav6TT//+5nu/ePzdH1BVkGAa7T6hiYOAIIyCFwBSgcPukye337/7aH4J570oOxSd/QJShUAriAeyq2tbwVVHxy+BAuSYWQhvsayO4mYwPx601+jFFqRJ31UqSWe2Pnjv5ycnZ/fvfx1OzwGgZVCNAIckAwUUVTgbPvxmX+5ur1xZuLa++qR/dKFkvSRyozyu3lWD0QpeQC7VCnDRBjMK/HnA+TJaDFoBoMqkhgQoU8AYqNQqiqJwgGUPJVUOEqZq5caGLURnQBvidyrlKzdWrmzu3PvjzrOHxjpCqZDgAa0AAyKT2uArtGYw7H3x+Ve/+vV/vvPep/e/+B8gj9oh5lJKK7XKGbFzAga4hdC9dfvDxdWVz//5d+i/ti3lysPnxiRVKGOKN9fqKJv+qL/31WcDF67feMed3hi+KiBFI4wNQAw0vKGJ1jzvErYgU4ByIE+th6gobAdFH+rOLGa98u79b5zQ1Y312Y0b/QMXx2cTNX6V3qa5VkvXhKQ7Ozc6PgB6WULeAZ5VRfQEFgiHB88fxeTQoBVqgfNw4R1eAPpjPqjEyhxXuQn1wUwX4motKOdilhNF6OqdSfWZ0kiMJUCbXWbbXUiHUFkVUQkqYIFhGMjo8KC/351ZRdGCtA1yi4qi8eZYio68NjCRgYq4471nmzeuXb1+Z7/3KvqIEGztBRnFkdXCdjdWr796vYPhPqgEXKgkBjl5C4ojjT7dj+09KhxYJJ4y1sIlN7c+6LZXP//f/xPcR6JgBz9qpEcdpETaQhCIf/z42/75UnAVG2pMRS76sGrUTgsEZhADgUhrgVlyMPGgNM25oipEgUij3jeA4EPwoRbdlDDRDvceUHiBFycITsd5EV/63AFKMAgAJXfuvt/v5TuPHgAivlQv8LAKC58gWC1DMYBUcD2kIsOzly9fzi7Mp2vrdZTCZWRvrKrIbAHAJKAWL26srV9/9O3nyA+gQy3OxecCqLEBVikN4FExykenaRIgw96DL4rz/evXb5m5q0BWww21XBI4grzTfttgUACVPvSDHyDkUAevUSi+7MMCFtIhaiUE5Ae794IbbN26nSysA1kjKs6AJLA/MD6gMtvJWlkCSOkqAQgU9ZzHGuMmI2ZyUIpve0qkWC8C/ZHTAUbsGNVoDtcSeVS/KH4h4i4jm1Olm05DnYD3nmpd7qAIElx9mlUBISAMBsWpzTJoAk4BEBxP1yPjAGLi/lNGAd97tfdk/epNJEsgFoCRUFRMr+03k+Wr251s/mB/F1TClhONy7/W9Hj715f/Sa1GXEuKZnMrm1dWNp8/fwF4aA7fhxvVSsUMiIeWcAOEEbRCNTx4vXt8sC+heoPAQz9E46l548QEJhgiRlxKbIjjk4N4MKUGCaPdQWsW6Dgkwc5X6HrMV5hRsrAMQ7BMKSmJTmew+kZSoaa7urmwsPT02WMg2DRhJIaNofowiZapFlieyxA8qj6Q7756EKi4/cH2RDV8aluaenMqQVzwtZiy2I2b71WVH+w9hDsm7ZGU3W6LkqRwgiQTStCaUZMAaBklDFAdnO3cm5+fb81dAbUAO26gKMIlpeNmYgVcZkmRJM5YArPhBI0vfPxEXofizoAeilff3//j7PxCNrv8o8f30P756+ftdDab2wRSBUtb1SCxaCeWBagQigByZMQjnxh6XuoTABrjBDOYVYOIBwTiqHlp/fIqFTSM+xnSqFCPv2geazSpKIEyyYJpBVAOKkBeGbWjSzqLkADV6vKMhcAwxAl8Uzm+4eXNcXUSIQAnR68fkrS7q++CjBoALYUBHMjBtpDOb11/9/T4vBicgMr614ne8AefNEsaZHTq4sRfJQxQ05jxZnNrW6A7zx/C55ASkNo1pqrtn4gE8DBiUoJRSAXyadq09Bopz2mB7Qs9FiKQqAaoF3iF09p+Mj4aYbIW1sKy9wECJ1SpAXUFXaczwILHrGIW1IHpAgkUIuHiKcBTbq/eklEAprO2tlmW+WjnCTL2VRHATljqfhQCggKWcH5W1v1MHqI4POsftNpd1A2GZsZ0IlHMYB4/AGFocmX12snRifQPrRYpA0BvWDjvkDCCB4tWeQhBQKNiZOBTlKd7zw1Za2dgs2gtRdCmadVM4xtJZ/A+OC8iUJRBAmwAm5ScQKEpkaAAStsSGZ55YeYOkta4n0RQRfiB8QNM/vDP/2rg/u4//Hrj7i9B81K1kSZOkedeAtqttiEjAaIVWN5SZMa8M5pn6iREECvYAB3lGaUZpQ64DWoDGSiLnt1sDDenTBrrVGWobQ78xsyBXBlyLyVIQOrH9kRi4RKgjbmVtjEHO99Bz4ERSPwE1pALPmK+6UURQ85ksJ/3hlsbd4A2OAuwCgVKQGDaSBfn55ZfvdxFOUTTSCH6y2mq/KjdOO7SjKUw0y60PTd3ZZSfwp2CSxiQhVZoPjcsNULtPoSqosbmp6qqiztz+jV+ShzFvgNZRwmoBWSgNtAJ6AaaAc+AO0GNB0lNCaDYcclg2ggBIYNtQeJ5AGgFCiA0sAdjHNpi958UGmoFakdp0s2LHpIKbggDBFakvja2q6v8uHisSX0IoBLQ4fBoplhEughfTB2E04KiIeIpIIOg6M6WDv1BASgTnALMhtl7T1UeLZWMgRoTApSYIrob/Nlpf+vG9jdP/hDfgboQ4M246at1e3BylAZOpGvRJaRKRghQDwOvQILgtNCiNsYaFUi7pye9rRvbf3762Xh8hViY8NbxSRAQRgf//qd/urb1y5s3fnZ96+P7D784e/EVshNobrIsLzxC2srSojwHTWgSMhG2jntSDTGMBFEUI4Jsrq/7tatnTsVa8Y7VdbPEIBy82sl3n0Ed4IK4KAZvFBSQAA6sk15uw45gTwkHBkwKnwEWRAgMymBnYWc//uA/2qI6e3UPYTea6QVtAwByohoKgib1WSwIoKAlWa9h+PTed7/57X99sHwrHL8ITBZKClhoxe+8//FgMDx9tQMWpECAyRCKvxD6oFAQxYgZIS78VYa2Akka2+9pe2Zn71twH3BjYwsSJqQKr6FGJw1xUNEw4dZeLGtlmq7BBG6U9KHGmW5rYWX1l//JUO6RBbKxPHGMdsgPv/w/FEaiYhO2TqBerywuLX7yyeKsCdQuKjHKSaqclOenuy8fPyiP96EwZKO19sTDSg3gAPEKIAGSrDVzXhSgClRBq9pATmorK6NjOeNEgwEEFGBCr3d+651FThdk+Boqb8qp17rfdY5LSNJWq1WWJWrpewZYpH4Ttc2wolABGY3m6PCiwTlnJrE32ntcxGZ0OkVkIDGSkSSCtO5LTdX5sd89+fVKaOyRQQ0LRyVc9EWfUhyvR3Ojo2f3//34MN+89f6duz93t2/df/yHfPdBKMCtjgwKCfWMvN3ySRkKgWgArEGn0+12w7mt8sHS3JJjFlepL5gE3mXW5J02hvGtE108AbluHVxWjs7LaiHtzmzcXsiYFZ6oDFZanfb8cifrpJLuPX0wPHlJPCYjGYBBeUN+gUYgKhoEkQLChIAyFL3Tw8Nr1+7uHJ9Ahx45RS+82SuLS+uHL/aAsvYuivYv//+uQhAasxUXoAZJB2ScDGEriIcgKEwAoc3IgDKgMiAlvdREnWxLevvGn9KCR4CG4FqtlkXwlAaKNpBICWn0u4sWPDaQA2dEgyo/P9mv+oVDUjqxZA0Hk4YyP9N8SIoMlpSqenFIHTNpOl4TwEw2hBLiwQp1da8ghhogRPdgBSGR2BchgIzLpWUWKXSbB8tvJChjh7faPSmziXMOdRyLjhdCFHjsCBILLzIwFuKjgYv64MoCqYWTZufUcPsFXwAlQKCxkZtALdQ0Mv5jfKL+OFMcFIWqr0okBs5DJcKz06ZxF8YH2rOLeX8AVdhR//TP904edFe3Nm+99/4H/5jf/i/PHn2fv/geVDntpUCWolf9UFZmxSupaHCoyl7v/MXOs97eU4Tzpv8sBkyMIGEsED42UAoXpvoC+y/mt610fra7JivbV2dnRVA4eGqn8wu7Z0d7+4ePXz7R3lMLsMJkyAuAQ30G6ZRRdx0/BBaQulPli6OD3Sc3Pvz5TusBinOgggKhfWV1y1r76tVjYFSf6409ijEk4dICkb/RO0BA0ZCTCDYVBK85tKhDQF2KZ0Cm8AATSNXXRmtEdTFL+gY3Jq6syB9NBabmdqpPfG4LevrZ76CDZpoDILWLam0xqlYQAFjosHd6/Pg+6AyU1I0sdeAS6hE0RTQMDhePhQvJtDXWBx4M8nZ3DuCY9dU5MPgSWaOeSE4AhefFhVVXaBjmbxYNPMkLQpNmeeR9Ca7b7hRKQQE2IIZA42Sh7sXW0c1YiCgsKGu1WoPhObxDUyQoAtdOumNAkibYHVRIp3AvusCC0LE5UG3al2XZMI4f2w9ad8+nbDcuwFx5fwS1ZAHJVXIgG75y9/df2Y13P/jZJ5s3P9pVGr2+py5XKqsfdhW+cKsuSay1IoKQpygs/Dg8RwuyOv+fOA/xhWl+W0uGDU6ODp598fnjkEcsL12+fvXm7cWVq/sP76F3AA7Rz8fUv+walzCZ3vANn66ZHCLV4fHhzjv4ZHnjxvHTx2BS1wLPrK1dOzrYq3p7wBBU8531wll9ifUa/88/yUnS1BzJCDyNSp+32+1TMMgA0aUpJokhtqxknLVcKGXND2UzoPondey4pqU4QArCCABDYu83hNraTicsW6j3TnwJlNAcGEGG9csEmECNi2wsJccm5SAHdrhgM8jHR6eL86toz18Ab3WylJvZ9YADAYEQ0s3Nm+e9E/hhbaiFSTN5DHXVYCIBCMgH5bC/fnUFdZ2uTZfcOEIJlPXoBiCIQhkwttWen5vN++cIFRo3KFy2f5lmIgtQChfCrk6ohBEMQhJ55tHXWuPGJkaWzs208/45IoW1dp4Ck9G3+mzEUtMA4lQCwRokYA+c+f0/ff2//vvp0Yuf/+xXMwu3IQuawE1B8UrT/mgTL0IwMyO1nKYWbCiZCdzylHiTVsQVUAGF1tjOFJIoGpMM0BvGPQJ4586dOwGOYE6AXdDz6vSPL77/p05Srm1dRSeAS8czHtaV8V15aOQSJo0/bKi3a3Myq4DYAs4Vx6cHL7eurSA1oAw0N7/x/tLC4ssX90FnMAXqMrXGEaU+e1nH3bu/yXWEAUMRURKwR+iNysHC4jqkA0kRmAAiC7iAkaJS9qjtnXSKYBRNZ/lyI2uy2qOLSeM2Bg4qMAk4AWXCWSDriYOBmCZ5A1gtI2GxQeGgHioIHhpIK0JAqGIZFmIGSnQh0SE/vd6iU1uvN4Bm82vvXIipY/rV+KhmByoRHMDozs/OzB8evQSXQDUFtLNeZPU3bWQP6Mnx/tzcHM0ug7JJCaoC4hC9fYhrNNA7gJB0uwurzDzonwMeVHPa4l0JmQQ0vnDgsQQThD3IQwNUoFKv6xCfiVUYUIqs011aIUW/d1bbyzZQTbTYuzR+ZNXDpAhQ9daKZREMID0kJToVqsOj599pWSzOrgBtB66ZNXQ5z2+44EQEiEhVFUVRlCOIlM6VEiqFCxJglIwyaW1L9lb3LJ1MuE5A+IXubCcz0BKhBwyAAfgEOP7zv/3zxnJ39eYtaAJNwZn3aCfG6tg/nRtLKw/yNc+7NudloRhEq93n32Xs7cISkAJzi6vv5MNRebQHGpKtIAKk0ETFTHUo+Q1fz59easZ8KF554fz09LDbWcqWb0IyIAliRUVRKEYgB66zJyUNwSnClFXXlHfYxWk1pAzhybdiAiEqogqVukeswjpNz3cQUBVSUgOwEGCIE5gOtUxkDkTwhiQnX6rT6VyMLyyUgADADYcvXxxuXtvOFlfQuLkbhYE1aDPaQNJgKwA7dDpbN7aHw+HB/iPYHsi91YY8guWTDMLi1Yvnw7xcv/UB2ldACVRIvYGMuy6kMPBcI2g2Wbp25frtg4PD4dE+SJoKqK6QteE3T266NZQqzxCq7eetVilcoo4UJkQEzAAJkNnZtWvXbx8fH49ODqd5hTHVfHP8eLcKzhhuE7MXcchtu+SkhBugfw4E9A9Hxy+XllrIOpD2GxgDXzJZrne8ta1Wq91uw3L9MlRf1yKZCtfjV+MqH0MHi46ZBpoQMmh7cFKFnCCZQZqRyWL6VpxWB9/0T5+vr99JNj5C2o2Oea4IKWyKxEI45i4NX6RO1YShtvkmA753/LR38nLz2k1gDstbrYWVZ8+eQUegaBOudTu+sc3TNy3J/qY6U+srKgotkYW9V8/ynDavfYjWfGQjKVTJwci4sTYxwCZKWi1OkguPQy3q+25cQypE9XwrIu7Fk3jqY0SdBNVY3NZWczSuUogBUhVIiNbZxkSvUgCRhzWNDIybVEoAIhG0RHn6cuf+ytLMwtIq2EJZYAErIAEHGI2ELwXYAp3FpfWtrZunJwfov0IYvjG/4wjT/GFfT6c/fXF2+mpja5vmN4AuqK1IAuKVmpjCBgELEiBDMtuZX19Zu7639wjuLKbGU3+ELgYhnVrtSR0NYGOSHVPkWAZ4GI8U6IBmZuauXV27ebT/HNUpxI3vU0U+5qXxm4+TffzRb9uzmyodGCCDCxBEFg0QDGDmum2EEcpefUlSp6dfpsAPqbMWVQTRIFUEekIFdUBVbz/GBQ9U+jGCMwxwkmRZ0gJHYCzUd55YIcXDr/+gLr+zfRvZLLQFkwWw1L1blWkmEE3CHUUSoI4fRH5+dnRtcxszK7NX19ud9HDvKSbFpRqmca/+MhZxARnlizct/TjjfGMPN/gIN8mNNTg5HJydLC8tdmYX0ZoF2gGZGJ5U4hQfjwUlnM1155bbM/P1XVOtZzPSagRcs5Try831PBhSy039SW89UiIZUwFJN+78psqL/ss/M8rmirQqRFQuBGG9GJF1sjklNm4soBXKM4di9epqd27p9PUxYBTgJI2m4WALOweZQ1icWXvvow8/7Z+f3//qTwhDwEN9BFZ0UmPGPyUXNo53QHV+sDezdnNlfdsl3fJsCAWMkVAmXJ8XajrgDuz82se/Xlu7sbfz9OTJ50AfUo3tVpvBp4vgpuokC+mms9dW1997/XIX5ZFSGTHyUCcvHdUOWsvv/eK369feffzgwdHTL4BzqIuTo3qp5piMrwrR1vXbv51ZunWY56hypGUNSgmQrcLPzK7dvXJl9WT/+dnpDjBCKvCxcW+nLieODaDFJKxqk+6V9Y0br4/OfO8EGCAmXWPnXE1ANpJRYGEtGoKanVzLjmU7javjZP76HTJy+vxroGCAiJW0vngQ/MHrZ+/evmHbq6d7x4ADfEAQeA8B2MCyNhdudfo2tUCEmhXaL8Lc8q20u7S+uvj80VfF0Q5QQl3zjFx9ifwiJfGS0S7F/WCT+dWNTnfx1YvHkAEQuAbh4l+2UI5YhrFwASJgamkhUM7dqNXmO+/dOR8VZa8EtZG0IQLyMAl0BnYemsHObG6/v337fdLk9OAgsrsNlJuKHVAQR8IHiFS9AZR4ZuUWGXu29xgsMASOl+aknv6YH0IMAaDW2vavhoP+YO87RllXZ2CZgo2hoLE9OY0xCKbmoDCWRQM0ICWEqn944DjZ2rq9sLzh1eaDkQpBCZyBMkgGnVl//5ObN7b752cP738VRkecOJX8TUr5D1M9HAjHZ6OFxZWl1ZWBwg9LBAVYFCbrilhQp33tzs2PP52fX3i18/jw+y+BHpD/xcGnEyUDWElmFlZuHB0ew/WgpNIStLg7p8Ggs3L17gd33/1gptt9ubPz+sGXwBkw+tHjtw7PwtrNW7NXlk5658iH0IAkg28hzKO7tvnONoXq9cvvyuIYFOqLNvUbi/f96r5hak1QhWUVK3ZuaWXz8OxchjlCBF0iU7wFdIEuNEXSRgiQEBl5pLCcERnVEJ8sxnibMiib37xjUnP64luDEmAirpu0ymmWhrLvfFhauYvO/PDoBYyHunEISZDWzYAJOG9iXt1gdKxsoBzs0srKRpr4pw+/Rn4alSimEDp5Y1vqG5RHVjA47S5dnZ1ffP38KbQPCVz3l2OfzMTVT82dUAZBk7iyQzU4G53OLi6srF/vrGyeDj2GHrBgi2DRvoqS0J6/+8u/W1u79vDR490HD2KGM05Ktd44BFAT4hUqDMC0rlz7gNPZ0xfPQQwy0CzWtCABG2AWaAEty4yg6pxzzk3yRqK/lrXzpd50cwcHCBKbdSe7Lx9Ksn7t9tad9WvbvxgOe/1RH+BWu5O2O5trW3kxfP74/v6Te/DnoKFl735qsaAlek8e/elw+eZH77/7YfKzX75+dXB+dACpLJt2tzO3vJq1ktOjvYcPvixOXoJzhPKn4AMOVjrtsjtrr92+Q2E1I8pcZkzSc/3WbGtuaZG1fP3s4fNH3yI/h/GQ4qd8htwPH3z3fXn9nff//h/+WznovXj6pCqctZ3VG3fTdssPj5/c/3xwtgc4a433P9gRKL2rUUBCK+t0OjPXN29Uy+tdsqSiHAJFM26GskGlrrf/4kH/9BkjZ4iqivwltrhzzqQGU+LIDRWhVlp69fx5a/Fn169f33/WghT4Sb0LCMQDcrK3t3XrTn9wjPNTkELC3wjsqIYQvPdNPvCD6zlozO6tSNx+gJSh5775v79f2v7oxtZHP//kN4Pz3ijviRuUvnQeW5/eWl5cODs5/uabbwa7O6CQttNqlL8F4G+YVCCN94AUiWibaGbrV//IcEIwgpYzDKmS3DMC2kFYg9g41WVZRj5NBI2gf6H6ePv9wOCQtpKq8ggeNgNblNXxs53jvby9url6dak9c2Vtcd0YqrzL8/yzP/2xPNiDGyDxpmsQYhr7Y93Zx1cgrGFfnR8/+vZ4d5+WbqxubF1/5xfGGFcWpS/29o9Pj3bQP8DoNeScpjp7P3rNhMHg4PzkRCRlbouaSjoGSRWodzK4/+gbnL5AOIf2QEOw/2kMFQowA3f0+MnR6YuN21fn15aX7izNLRbevzw+7Q1ejPbuI38N+CRpTt+/+O5VAjQry7Lf74sgbc36MmWwqAgJlCVmPuqyNBFkCFYQ7zEqgRgafuD5FkXBCUfWG2Gy2tkYVxXGmBDw9MGDztz8ysbG4c7J37KdmDEajEaj3d1dQJAkKIu/eWc657z3CKEhB9LbKbYKZUiIPyDWkAdBPZLWyZMnJ6+G86s3FxaWZmZX5mc25xa6R0dHJ+cn977+BmfHgIchOFSj4fi6uUwzNOpwJaQN29ejrIQMWWoJWQETOFCiKgEtR/BoV0Si1f8D0KqqigjJx54AAAAASUVORK5CYII=";

function ts() {
  const n = new Date();
  return n.toLocaleDateString("en-GB") + " " + n.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{height:100%;width:100%;}
  :root{
    --teal:${B.teal};--teal-light:${B.tealLight};
    --navy:${B.navy};--navy-dark:${B.navyDark};
    --charcoal:${B.charcoal};--off-white:${B.offWhite};
    --amber:${B.amber};--orange:${B.orange};--red:${B.red};
    --bg:${B.bg};--surface:${B.surface};--surface-hi:${B.surfaceHi};
    --border:${B.border};--border-hi:${B.borderHi};
    --text:${B.text};--muted:${B.muted};--dimmed:${B.dimmed};
    --radius:10px;--radius-lg:16px;
  }
  body{background:var(--bg);color:var(--text);font-family:'Barlow',sans-serif;
    -webkit-font-smoothing:antialiased;}
  .app{width:100%;height:100%;display:flex;flex-direction:column;overflow:visible;
    background: radial-gradient(ellipse at 20% 0%, rgba(0,162,158,0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 100%, rgba(33,59,135,0.12) 0%, transparent 50%),
                linear-gradient(160deg,#080f1a 0%,#0a1628 60%,#091522 100%);}

  /* HEADER */
  .hdr{background:linear-gradient(90deg,#061020 0%,#0e2040 50%,#061528 100%);
    border-bottom:1px solid rgba(0,162,158,0.4);
    box-shadow:0 1px 30px rgba(0,162,158,0.1), 0 0 0 1px rgba(0,0,0,0.4);
    padding:0 16px;height:58px;
    display:flex;align-items:center;gap:12px;flex-shrink:0;position:relative;}
  .hdr-logo{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;
    letter-spacing:3px;text-transform:uppercase;color:var(--teal-light);line-height:1;}
  .hdr-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;
    color:var(--text);flex:1;letter-spacing:0.5px;}
  .hdr-back{background:none;border:none;color:var(--teal);cursor:pointer;
    padding:6px;display:flex;align-items:center;border-radius:8px;
    transition:background 0.15s;}
  .hdr-back:active{background:rgba(0,162,158,0.15);}
  .hdr-accent{position:absolute;bottom:-2px;left:0;width:80px;height:2px;
    background:linear-gradient(90deg,var(--amber),transparent);}

  /* PIN */
  .pin-screen{flex:1;display:flex;flex-direction:column;align-items:center;
    justify-content:center;padding:28px 24px;gap:20px;overflow-y:auto;min-height:0;
    position:relative;}
  .pin-screen::before{content:"";position:absolute;inset:0;
    background:radial-gradient(ellipse at 50% 20%, rgba(0,162,158,0.12) 0%, transparent 60%);
    pointer-events:none;}
  .pin-brand{text-align:center;position:relative;}
  .pin-brand-name{font-family:'Barlow Condensed',sans-serif;font-size:48px;font-weight:900;
    letter-spacing:6px;text-transform:uppercase;
    background:linear-gradient(135deg,var(--teal) 0%,var(--teal-light) 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .pin-brand-sub{font-size:10px;letter-spacing:4px;text-transform:uppercase;
    color:var(--muted);margin-top:6px;font-weight:600;}
  .pin-tagline{font-size:11px;color:var(--dimmed);letter-spacing:1.5px;
    text-transform:uppercase;font-weight:500;}
  .pin-dots{display:flex;gap:16px;}
  .pin-dot{width:14px;height:14px;border-radius:50%;
    border:2px solid rgba(40,80,140,0.6);background:rgba(12,24,50,0.5);transition:all 0.2s;}
  .pin-dot.on{background:radial-gradient(circle,#00d4cf,#00A29E);
    border-color:var(--teal);transform:scale(1.2);
    box-shadow:0 0 14px rgba(0,162,158,0.7), 0 0 28px rgba(0,162,158,0.3);}
  .pin-dot.err{background:var(--red);border-color:var(--red);
    box-shadow:0 0 14px rgba(230,51,18,0.6);}
  .pin-keypad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:280px;}
  .pin-key{
    background:linear-gradient(135deg,rgba(18,40,80,0.9) 0%,rgba(12,28,60,0.95) 100%);
    border:1px solid rgba(40,80,140,0.5);border-radius:14px;
    color:var(--text);font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:700;
    padding:18px;cursor:pointer;transition:all 0.12s;text-align:center;
    -webkit-tap-highlight-color:transparent;
    box-shadow:0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);}
  .pin-key:active{background:linear-gradient(135deg,#00c4bf,#00A29E);
    color:white;transform:scale(0.94);
    box-shadow:0 0 24px rgba(0,162,158,0.5), 0 2px 8px rgba(0,0,0,0.3);}
  .pin-key.clr{color:var(--red);font-size:13px;font-weight:700;letter-spacing:1px;}
  .pin-key.zero{grid-column:2;}
  .pin-err{color:var(--red);font-size:12px;font-weight:700;letter-spacing:1px;
    text-transform:uppercase;height:16px;text-align:center;}

  /* NAV TABS */
  .nav{display:flex;
    position:fixed;bottom:0;left:0;right:0;
    background:linear-gradient(180deg,rgba(8,15,30,0.97) 0%,rgba(4,8,18,1) 100%);
    border-top:1px solid rgba(0,162,158,0.3);
    box-shadow:0 -4px 24px rgba(0,0,0,0.6);
    z-index:100;
    height:56px;}
  .nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;
    padding:10px 4px 8px;background:none;border:none;cursor:pointer;
    color:var(--dimmed);transition:all 0.15s;-webkit-tap-highlight-color:transparent;
    font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:700;
    letter-spacing:1px;text-transform:uppercase;}
  .nav-btn.active{color:var(--teal);}
  .nav-btn.active svg{filter:drop-shadow(0 0 4px var(--teal));}

  /* PAGE */
  .page{flex:1;overflow-y:auto;min-height:0;padding:16px;padding-bottom:72px;}
  .page-gap{display:flex;flex-direction:column;gap:12px;}

  /* SECTION LABEL */
  .slabel{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;
    color:var(--dimmed);letter-spacing:2px;text-transform:uppercase;}

  /* CARDS */
  .card{background:linear-gradient(135deg,rgba(15,32,65,0.9) 0%,rgba(10,22,48,0.95) 100%);
    border:1px solid rgba(30,60,100,0.6);
    box-shadow:0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);
    border-radius:var(--radius);backdrop-filter:blur(8px);}
  .card-teal{border-color:rgba(0,162,158,0.35);
    background:linear-gradient(135deg,rgba(0,162,158,0.1) 0%,rgba(10,22,48,0.95) 100%);
    box-shadow:0 4px 24px rgba(0,162,158,0.08), inset 0 1px 0 rgba(0,162,158,0.1);}

  /* STOCK ROW */
  .srow{display:flex;align-items:flex-start;gap:12px;padding:13px 14px;
    background:linear-gradient(135deg,rgba(14,28,58,0.9) 0%,rgba(9,18,40,0.95) 100%);
    border:1px solid rgba(30,58,100,0.5);
    border-radius:var(--radius);cursor:pointer;transition:all 0.15s;
    -webkit-tap-highlight-color:transparent;
    box-shadow:0 2px 12px rgba(0,0,0,0.2);}
  .srow:active,.srow.hov{border-color:rgba(0,162,158,0.6);
    background:linear-gradient(135deg,rgba(0,162,158,0.1) 0%,rgba(9,18,40,0.95) 100%);
    box-shadow:0 2px 16px rgba(0,162,158,0.12);}
  .srow.sel{border-color:var(--teal);
    background:linear-gradient(135deg,rgba(0,162,158,0.15) 0%,rgba(9,18,40,0.95) 100%);
    box-shadow:0 0 0 1px rgba(0,162,158,0.4), 0 4px 20px rgba(0,162,158,0.15);}
  .srow-left{flex:1;min-width:0;}
  .srow-code{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;
    color:var(--teal);letter-spacing:1.5px;text-transform:uppercase;}
  .srow-name{font-size:14px;font-weight:500;line-height:1.35;word-break:break-word;
    color:var(--text);margin-top:1px;}
  .srow-loc{font-size:12px;color:var(--muted);margin-top:4px;display:flex;
    align-items:center;gap:4px;}
  .srow-right{flex-shrink:0;text-align:right;padding-top:2px;}
  .srow-qty{font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:900;
    color:var(--teal);line-height:1;letter-spacing:-1px;}
  .srow-unit{font-size:10px;color:var(--dimmed);text-transform:uppercase;letter-spacing:1px;}

  /* INPUTS */
  .inp-wrap{position:relative;}
  .inp-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);
    color:var(--dimmed);pointer-events:none;}
  input[type=text],input[type=number],select,textarea{
    background:rgba(17,40,75,0.8);border:1px solid var(--border);
    border-radius:var(--radius);color:var(--text);font-family:'Barlow',sans-serif;
    font-size:16px;padding:13px 14px 13px 42px;width:100%;outline:none;
    transition:border-color 0.15s;-webkit-appearance:none;}
  input[type=number]{padding-left:14px;}
  input:focus,select:focus,textarea:focus{border-color:var(--teal);
    box-shadow:0 0 0 3px rgba(0,162,158,0.15);}
  input::placeholder{color:var(--dimmed);}
  .inp-plain{padding-left:14px !important;}

  /* BUTTONS */
  .btn-primary{background:linear-gradient(135deg,#00c4bf 0%,#00A29E 50%,#007a78 100%);
    border:none;border-radius:var(--radius);color:white;cursor:pointer;
    font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;
    letter-spacing:1.5px;padding:15px;text-transform:uppercase;width:100%;
    transition:all 0.2s;-webkit-tap-highlight-color:transparent;
    box-shadow:0 4px 20px rgba(0,162,158,0.35), 0 1px 0 rgba(255,255,255,0.1) inset;
    position:relative;overflow:hidden;}
  .btn-primary::after{content:"";position:absolute;inset:0;
    background:linear-gradient(180deg,rgba(255,255,255,0.08) 0%,transparent 50%);
    pointer-events:none;}
  .btn-primary:active{transform:scale(0.98);
    box-shadow:0 2px 10px rgba(0,162,158,0.3);}
  .btn-primary:disabled{background:rgba(30,58,100,0.5);color:var(--dimmed);
    cursor:not-allowed;box-shadow:none;}
  .btn-danger{background:linear-gradient(135deg,var(--red) 0%,#b02000 100%);}

  /* TOGGLE */
  .toggle-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .toggle-btn{border-radius:var(--radius);border:1px solid var(--border);
    cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:17px;
    font-weight:800;letter-spacing:1px;padding:13px;text-align:center;
    transition:all 0.15s;background:rgba(17,40,75,0.5);color:var(--dimmed);
    -webkit-tap-highlight-color:transparent;}
  .toggle-btn.add.on{background:rgba(0,162,158,0.15);border-color:var(--teal);color:var(--teal);}
  .toggle-btn.rem.on{background:rgba(230,51,18,0.15);border-color:var(--red);color:var(--red);}

  /* PILL TABS */
  .pill-tabs{display:flex;background:rgba(17,40,75,0.6);border:1px solid var(--border);
    border-radius:12px;padding:4px;gap:4px;}
  .pill-tab{flex:1;padding:10px;text-align:center;font-family:'Barlow Condensed',sans-serif;
    font-size:14px;font-weight:700;letter-spacing:0.5px;border:none;cursor:pointer;
    transition:all 0.15s;background:transparent;color:var(--dimmed);border-radius:9px;
    -webkit-tap-highlight-color:transparent;}
  .pill-tab.on{background:var(--teal);color:white;
    box-shadow:0 2px 10px rgba(0,162,158,0.35);}

  /* YARD PANEL */
  .yard-wrap{
    background:linear-gradient(180deg,rgba(6,12,26,0.95) 0%,rgba(8,16,34,0.98) 100%);
    border:1px solid rgba(25,50,90,0.7);
    border-radius:var(--radius-lg);padding:14px;backdrop-filter:blur(8px);
    box-shadow:0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03);}
  .yard-label{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;
    color:var(--dimmed);letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;
    transition:color 0.2s;}
  .yard-label.active{color:var(--teal);}

  /* DASHBOARD STATS */
  .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .stat-card{
    background:linear-gradient(135deg,rgba(15,32,70,0.95) 0%,rgba(8,18,42,0.98) 100%);
    border:1px solid rgba(30,60,110,0.5);
    border-radius:var(--radius);padding:14px 16px;
    box-shadow:0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04);}
  .stat-val{font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;
    line-height:1;letter-spacing:-1px;}
  .stat-label{font-size:11px;color:var(--muted);text-transform:uppercase;
    letter-spacing:1px;margin-top:4px;}
  .stat-sub{font-size:10px;color:var(--dimmed);margin-top:2px;}

  /* LOG TABLE */
  .log-row{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;
    border-bottom:1px solid rgba(30,58,95,0.5);}
  .log-row:last-child{border-bottom:none;}
  .log-badge{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;
    padding:3px 8px;border-radius:4px;flex-shrink:0;letter-spacing:0.5px;margin-top:1px;}
  .log-badge.add{background:rgba(0,162,158,0.2);color:var(--teal);}
  .log-badge.rem{background:rgba(230,51,18,0.2);color:var(--red);}
  .log-badge.new{background:rgba(245,158,25,0.2);color:var(--amber);}
  .log-info{flex:1;min-width:0;}
  .log-name{font-size:13px;font-weight:500;color:var(--text);word-break:break-word;line-height:1.3;}
  .log-meta{font-size:11px;color:var(--dimmed);margin-top:3px;}
  .log-ts{font-size:10px;color:var(--dimmed);flex-shrink:0;margin-top:2px;text-align:right;}

  /* AUTOCOMPLETE */
  .ac-list{background:rgba(11,28,55,0.98);border:1px solid var(--teal);
    border-radius:var(--radius);overflow:hidden;max-height:220px;overflow-y:auto;}
  .ac-item{padding:11px 14px;cursor:pointer;border-bottom:1px solid var(--border);
    transition:background 0.1s;-webkit-tap-highlight-color:transparent;}
  .ac-item:last-child{border-bottom:none;}
  .ac-item:active,.ac-item:hover{background:rgba(0,162,158,0.12);}
  .ac-code{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;
    color:var(--teal);letter-spacing:1px;}
  .ac-name{font-size:13px;color:var(--text);margin-top:1px;line-height:1.3;}

  /* TOAST */
  .toast{position:fixed;bottom:68px;left:50%;transform:translateX(-50%);
    font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;
    letter-spacing:0.5px;padding:12px 22px;border-radius:50px;z-index:999;
    animation:tin 0.2s ease;white-space:nowrap;
    background:linear-gradient(135deg,var(--teal),#007a78);color:white;
    box-shadow:0 4px 20px rgba(0,162,158,0.4);}
  .toast.err{background:linear-gradient(135deg,var(--red),#900);
    box-shadow:0 4px 20px rgba(230,51,18,0.4);}
  @keyframes tin{from{opacity:0;transform:translateX(-50%) translateY(8px);}
    to{opacity:1;transform:translateX(-50%) translateY(0);}}

  /* MISC */
  .empty{color:var(--dimmed);font-size:13px;text-align:center;padding:28px 0;}
  .divider{border:none;border-top:1px solid var(--border);}
  .tag{font-family:'Barlow Condensed',sans-serif;font-size:9px;font-weight:800;
    padding:2px 7px;border-radius:3px;text-transform:uppercase;letter-spacing:0.5px;}
  .tag-teal{background:rgba(0,162,158,0.2);color:var(--teal);}
  .tag-amber{background:rgba(245,158,25,0.2);color:var(--amber);}

  @keyframes pulse{0%,100%{opacity:0.5;}50%{opacity:1;}}
`;

// ─── YARD ─────────────────────────────────────────────────────────────────────
function Yard({ highlighted=[], selected, blocked=[], onSelect, compact=false }) {
  function Cell({ code }) {
    const lit  = highlighted.includes(code);
    const sel  = selected === code;
    const blk  = blocked.includes(code);
    const num  = code.slice(-3);

    const bc = lit ? B.teal : sel ? B.navy : blk ? "#0d1e32" : "#1a3055";
    const bg = lit ? "rgba(0,162,158,0.22)" : sel ? "rgba(33,59,135,0.4)" : blk ? "rgba(11,20,32,0.6)" : "rgba(17,40,75,0.5)";
    const lc = lit ? B.teal : sel ? B.tealLight : blk ? "#1e3a5f" : B.offWhite;
    const so = lit ? 0.7 : sel ? 0.5 : blk ? 0.08 : 0.28;
    const ss = lit ? B.teal : sel ? B.tealLight : blk ? "#1e3a5f" : "#3a5f80";
    const bw = lit || sel ? 2 : 1;

    return (
      <div onClick={() => onSelect && !blk && onSelect(code)} style={{
        position:"relative", flex:"1 1 0",
        aspectRatio: compact ? "1/1" : "1/1.25",
        borderRadius:6, border:`${bw}px solid ${bc}`, background:bg,
        cursor: blk ? "not-allowed" : onSelect ? "pointer" : "default",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end",
        paddingBottom: compact ? 2 : 4,
        transition:"all 0.15s",
        boxShadow: lit ? `0 0 16px rgba(0,162,158,0.5)` : sel ? `0 0 12px rgba(33,59,135,0.6)` : "none",
        overflow:"hidden", opacity: blk ? 0.35 : 1,
        WebkitTapHighlightColor:"transparent",
      }}>
        {/* Container face SVG */}
        <svg viewBox="0 0 30 44" style={{
          position:"absolute",top:0,left:0,width:"100%",height:"78%",opacity:so
        }} preserveAspectRatio="none">
          {[5,10,15,20,25,30,35,40].map(y=>(
            <line key={y} x1="0" y1={y} x2="30" y2={y} stroke={ss} strokeWidth="0.7"/>
          ))}
          <line x1="15" y1="0" x2="15" y2="44" stroke={ss} strokeWidth="1.2"/>
          <circle cx="11" cy="33" r="1.6" fill={ss}/>
          <circle cx="19" cy="33" r="1.6" fill={ss}/>
          <rect x="0"  y="0"  width="4" height="4" rx="0.5" fill={ss}/>
          <rect x="26" y="0"  width="4" height="4" rx="0.5" fill={ss}/>
          <rect x="0"  y="40" width="4" height="4" rx="0.5" fill={ss}/>
          <rect x="26" y="40" width="4" height="4" rx="0.5" fill={ss}/>
        </svg>
        {lit && (
          <div style={{position:"absolute",inset:0,borderRadius:6,
            background:"radial-gradient(ellipse at 50% 40%,rgba(0,162,158,0.2) 0%,transparent 70%)",
            animation:"pulse 1.5s ease-in-out infinite"}}/>
        )}
        {/* Location number only — large and bold, no prefix */}
        <div style={{
          position:"relative",zIndex:2,
          fontFamily:"'Barlow Condensed',sans-serif",
          fontSize: compact ? 14 : 18,
          fontWeight:900, color:lc, lineHeight:1,
          letterSpacing:"0.5px", textAlign:"center",
          paddingBottom:2,
          textShadow: (lit||sel) ? `0 0 12px ${lc}` : "none",
        }}>{num}</div>
      </div>
    );
  }

  const floorLabelStyle = {
    fontFamily:"'Barlow Condensed',sans-serif",
    fontSize:10,fontWeight:700,color:B.dimmed,
    letterSpacing:"2px",textTransform:"uppercase",
    marginBottom: compact ? 3 : 5,
  };

  return (
    <div style={{width:"100%",userSelect:"none"}}>
      {/* AX1 prefix — shown once above both rows with position numbers */}
      <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:compact?4:6}}>
        <div style={{
          fontFamily:"'Barlow Condensed',sans-serif",fontSize:compact?9:11,fontWeight:800,
          color:B.teal,letterSpacing:"2px",textTransform:"uppercase",
          background:"rgba(0,162,158,0.1)",border:"1px solid rgba(0,162,158,0.25)",
          borderRadius:4,padding:"2px 8px",flexShrink:0,
        }}>AX1</div>
        <div style={{flex:1,height:1,background:"rgba(0,162,158,0.15)"}}/>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:compact?8:9,
          color:"#2a4060",letterSpacing:"0.5px"}}>← 1 – 8 →</div>
      </div>

      <div style={{
        fontFamily:"'Barlow Condensed',sans-serif",fontSize:compact?8:10,fontWeight:700,
        color:B.dimmed,letterSpacing:"2px",textTransform:"uppercase",
        marginBottom:compact?3:4,
      }}>First Floor</div>
      <div style={{display:"flex",gap:compact?3:4,marginBottom:compact?3:4}}>
        {UPPER.map(c=><Cell key={c} code={c}/>)}
      </div>

      <div style={{
        fontFamily:"'Barlow Condensed',sans-serif",fontSize:compact?8:10,fontWeight:700,
        color:B.dimmed,letterSpacing:"2px",textTransform:"uppercase",
        marginBottom:compact?3:4,marginTop:compact?2:4,
      }}>Ground Floor</div>
      <div style={{display:"flex",gap:compact?3:4,marginBottom:compact?4:6}}>
        {GROUND.map(c=><Cell key={c} code={c}/>)}
      </div>
    </div>
  );
}

// ─── AUTOCOMPLETE INPUT ───────────────────────────────────────────────────────
function CatalogueInput({ value, onChange, placeholder="", catalogue=PRODUCT_CATALOGUE }) {
  const [open, setOpen] = useState(false);

  const matches = useMemo(()=>{
    const s = value.trim().toLowerCase();
    if(!s || s.length < 2) return [];
    return catalogue.filter(p=>
      p.code.toLowerCase().includes(s) ||
      p.name.toLowerCase().includes(s)
    ).slice(0,12);
  },[value]);

  function pick(p) {
    onChange(p);
    setOpen(false);
  }

  return (
    <div style={{position:"relative"}}>
      <div className="inp-wrap">
        <span className="inp-icon"><Icon path={IC.search} size={17}/></span>
        <input type="text" placeholder={placeholder||T?.catalogueSearch||"Search…"} value={value}
          onChange={e=>{onChange({code:e.target.value.toUpperCase(),name:""});setOpen(true);}}
          onFocus={()=>setOpen(true)}
          onBlur={()=>setTimeout(()=>setOpen(false),150)}
        />
      </div>
      {open && matches.length>0 && (
        <div className="ac-list" style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,marginTop:4}}>
          {matches.map(p=>(
            <div key={p.code} className="ac-item" onMouseDown={()=>pick(p)}>
              <div className="ac-code">{p.code}</div>
              <div className="ac-name">{p.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const SESSION_KEY = "magna_session";

function restoreSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    // Validate it's still a known staff member
    const user = findStaff(s.pin);
    if (!user) { localStorage.removeItem(SESSION_KEY); return null; }
    return s;
  } catch(e) { return null; }
}

export default function App() {
  const saved = restoreSession();
  const [screen,      setScreen]      = useState(saved ? "main" : "pin");
  const [tab,         setTab]         = useState("find");
  const [stock,       setStock]       = useState(INITIAL_STOCK);
  const [catalogue,   setCatalogue]   = useState(PRODUCT_CATALOGUE);
  const [log,         setLog]         = useState([]);
  const [currentUser, setCurrentUser] = useState(saved || null);
  const [langCode,    setLangCode]    = useState(saved?.lang || "en");
  const T = LANGS[langCode] || LANGS.en;
  const [toast,       setToast]       = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [synced,      setSynced]      = useState(false);

  // Auto-load sheet on first render if already logged in
  const { useEffect } = React;
  useEffect(() => {
    if (saved) loadFromSheet();
  }, []); // eslint-disable-line

  // Load stock and catalogue from sheet when app unlocks
  async function loadFromSheet() {
    setLoading(true);
    try {
      const [stockData, prodData] = await Promise.all([
        apiFetch({action:"getStock"}),
        apiFetch({action:"getProducts"}),
      ]);
      if (Array.isArray(stockData) && stockData.length > 0) {
        setStock(stockData.map(r=>({...r, qty:Number(r.qty), id:String(r.id)})));
      }
      if (Array.isArray(prodData) && prodData.length > 0) {
        setCatalogue(prodData.map(r=>({code:r.code, name:r.name})));
      }
      setSynced(true);
    } catch(e) {
      console.warn("Sheet load failed, using local data:", e);
    }
    setLoading(false);
  }

  function showToast(msg, type="ok") {
    setToast({msg,type});
    setTimeout(()=>setToast(null),2400);
  }

  function addLog(entry) {
    setLog(prev=>[{
      ...entry,
      id:     Date.now(),
      ts:     ts(),
      device: navigator.platform||"Mobile",
      staff:  currentUser?.name || "Unknown",
      role:   currentUser?.role || "",
    }, ...prev].slice(0,200));
  }

  function updateQty(id, delta, note) {
    setStock(prev=>{
      const next = prev.map(r=> r.id===id ? {...r, qty:Math.max(0,r.qty+delta)} : r);
      const updated = next.find(r=>r.id===id);
      if(updated) apiPost({action:"updateQty", id:String(id), qty:updated.qty}).catch(()=>{});
      return next;
    });
    addLog(note);
    if(note) apiPost({action:"addLog", ...note, ts:ts(),
      staff:currentUser?.name||"Unknown", role:currentUser?.role||""}).catch(()=>{});
  }

  function addNewRow(code, name, container, qty) {
    const newId = Date.now();
    setStock(prev=>[...prev,{id:String(newId),code,name,container,qty}]);
    apiPost({action:"addRow", id:String(newId), code, name, container, qty}).catch(()=>{});
    const logEntry = {type:"new", code, name, container, delta:qty};
    addLog(logEntry);
    apiPost({action:"addLog", ...logEntry, ts:ts(),
      staff:currentUser?.name||"Unknown", role:currentUser?.role||""}).catch(()=>{});
  }

  const tabs = [
    { id:"find",      icon:IC.search,    label:T.navFind      },
    { id:"container", icon:IC.box,       label:T.navContainer },
    { id:"update",    icon:IC.plus,      label:T.navUpdate    },
    { id:"dashboard", icon:IC.dashboard, label:T.navDashboard },
    { id:"log",       icon:IC.log,       label:T.navLog       },
  ];

  if(screen==="pin") return (
    <>
      <style>{css}</style>
      <div className="app" dir={T.dir||"ltr"}>
        <PinScreen T={T} langCode={langCode} setLangCode={setLangCode} onUnlock={(user)=>{
                setCurrentUser(user);
                setLangCode(user.lang||"en");
                setScreen("main");
                loadFromSheet();
                try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch(e) {}
              }}/>
      </div>
      {toast && <div className={`toast${toast.type==="err"?" err":""}`}>{toast.msg}</div>}
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app" dir={T.dir||"ltr"}>
        {/* Header */}
        <div className="hdr">
          <img
            src={LOGO_B64}
            alt="Magna"
            style={{
              height: 30,
              width: "auto",
              mixBlendMode: "screen",
              filter: "brightness(1.1)",
              flexShrink: 0,
            }}
          />
          <div>
            <div className="hdr-logo">Magna Foodservice</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:600,
              color:B.tealLight,letterSpacing:"1px",marginTop:1}}>
              Container Stock Control
            </div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
            <div style={{textAlign:"right",cursor:"pointer"}}
              onClick={()=>{
                if(window.confirm("Log out?")) {
                  try { localStorage.removeItem(SESSION_KEY); } catch(e) {}
                  setScreen("pin");
                  setCurrentUser(null);
                  setSynced(false);
                }
              }}
              title="Tap to log out"
            >
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,
                fontWeight:700,color:B.teal,letterSpacing:"0.5px"}}>
                {currentUser?.name||""}
              </div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,
                color:B.dimmed,letterSpacing:"1px"}}>
                {new Date().toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}
              </div>
            </div>
            {/* Language picker */}
            <select
              value={langCode}
              onChange={e=>setLangCode(e.target.value)}
              style={{
                background:"rgba(0,162,158,0.1)",border:"1px solid rgba(0,162,158,0.3)",
                borderRadius:6,color:B.teal,fontSize:11,fontWeight:700,
                padding:"3px 6px",fontFamily:"'Barlow Condensed',sans-serif",
                cursor:"pointer",WebkitAppearance:"none",letterSpacing:"0.5px",
              }}
            >
              {LANG_LIST.map(l=>(
                <option key={l.code} value={l.code}
                  style={{background:"#080f1a",color:B.text}}>
                  {l.name}
                </option>
              ))}
            </select>
            {/* Sync status dot */}
            <div title={loading?"Syncing…":synced?"Live — synced with sheet":"Local only"} style={{
              width:9,height:9,borderRadius:"50%",flexShrink:0,
              background: loading ? B.amber : synced ? B.teal : "#3a4060",
              boxShadow: loading ? `0 0 6px ${B.amber}` : synced ? `0 0 6px ${B.teal}` : "none",
              transition:"all 0.4s",
            }}/>
          </div>
          <div className="hdr-accent"/>
        </div>

        {/* Screen content — fills space above fixed nav */}
        <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column"}}>
          {tab==="find"      && <FindProduct stock={stock} T={T}/>}
          {tab==="container" && <ViewContainer stock={stock} T={T}/>}
          {tab==="update"    && <UpdateStock stock={stock} catalogue={catalogue} onUpdate={updateQty} onAddNew={addNewRow} showToast={showToast} T={T}/>}
          {tab==="dashboard" && <Dashboard stock={stock} log={log} T={T}/>}
          {tab==="log"       && <ChangeLog log={log} T={T}/>}
        </div>

        {/* Bottom nav */}
        <nav className="nav">
          {tabs.map(t=>(
            <button key={t.id} className={`nav-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
              <Icon path={t.icon} size={18}/>
              {t.label}
            </button>
          ))}
        </nav>
      </div>
      {toast && <div className={`toast${toast.type==="err"?" err":""}`}>{toast.msg}</div>}
    </>
  );
}

// ─── PIN ──────────────────────────────────────────────────────────────────────
function PinScreen({onUnlock,T=LANGS.en,langCode="en",setLangCode=()=>{}}){
  const [entry,setEntry]=useState("");
  const [err,setErr]=useState(false);
  function press(d){
    if(entry.length>=4)return;
    const n=entry+d; setEntry(n); setErr(false);
    if(n.length===4){
      const user = findStaff(n);
      if(user) setTimeout(()=>onUnlock(user),300);
      else{setErr(true);setTimeout(()=>{setEntry("");setErr(false);},700);}
    }
  }
  return(
    <div className="pin-screen">
      {/* Premium top accent */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${B.teal},${B.tealLight},${B.teal},transparent)`,
        boxShadow:`0 0 20px rgba(0,162,158,0.6)`}}/>
      {/* Corner accent marks */}
      <div style={{position:"absolute",top:0,left:0,width:40,height:40,
        borderTop:`2px solid ${B.teal}`,borderLeft:`2px solid ${B.teal}`,opacity:0.4}}/>
      <div style={{position:"absolute",top:0,right:0,width:40,height:40,
        borderTop:`2px solid ${B.teal}`,borderRight:`2px solid ${B.teal}`,opacity:0.4}}/>
      <div style={{position:"absolute",bottom:0,left:0,width:40,height:40,
        borderBottom:`2px solid ${B.teal}`,borderLeft:`2px solid ${B.teal}`,opacity:0.4}}/>
      <div style={{position:"absolute",bottom:0,right:0,width:40,height:40,
        borderBottom:`2px solid ${B.teal}`,borderRight:`2px solid ${B.teal}`,opacity:0.4}}/>

      <div className="pin-brand">
        <img
          src={LOGO_B64}
          alt="Magna Foodservice"
          style={{
            width: 240,
            height: "auto",
            display: "block",
            margin: "0 auto 4px",
            mixBlendMode: "screen",
            filter: "brightness(1.1) drop-shadow(0 0 12px rgba(0,162,158,0.2))",
          }}
        />
        <div className="pin-tagline" style={{marginTop:8}}>Container Stock Control System</div>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:8,color:B.dimmed}}>
        <Icon path={IC.lock} size={14}/>
        <span style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",fontWeight:600}}>
          {T.pinSubtitle}
        </span>
      </div>

      <div className="pin-dots">
        {[0,1,2,3].map(i=>(
          <div key={i} className={`pin-dot${entry.length>i?(err?" err":" on"):""}`}/>
        ))}
      </div>

      <div className="pin-err">{err?T.pinWrong:""}</div>
      {entry.length>0&&!err&&(
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,
          color:findStaff(entry)?B.teal:B.dimmed,
          letterSpacing:"1px",height:18,transition:"color 0.2s",textAlign:"center"}}>
          {findStaff(entry)?T.pinWelcome(findStaff(entry).name):""}
        </div>
      )}

      <div className="pin-keypad">
        {["1","2","3","4","5","6","7","8","9"].map(k=>(
          <button key={k} className="pin-key" onClick={()=>press(k)}>{k}</button>
        ))}
        <button className="pin-key clr" onClick={()=>setEntry("")}>CLR</button>
        <button className="pin-key zero" onClick={()=>press("0")}>0</button>
      </div>

      {/* Language selector on PIN screen */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
        {LANG_LIST.map(l=>(
          <button key={l.code} onClick={()=>setLangCode(l.code)} style={{
            background: langCode===l.code ? "rgba(0,162,158,0.2)" : "transparent",
            border: `1px solid ${langCode===l.code ? B.teal : "rgba(0,162,158,0.2)"}`,
            borderRadius:6, color: langCode===l.code ? B.teal : B.dimmed,
            fontSize:11, fontWeight:700, padding:"4px 10px",
            fontFamily:"'Barlow Condensed',sans-serif", cursor:"pointer",
            letterSpacing:"0.5px", WebkitTapHighlightColor:"transparent",
          }}>{l.name}</button>
        ))}
      </div>
      <div style={{fontSize:9,color:"rgba(137,204,202,0.3)",letterSpacing:"2px",
        textAlign:"center",textTransform:"uppercase",fontWeight:600,fontFamily:"'Barlow Condensed',sans-serif"}}>
        Magna Foodservice · Stock Control · © {new Date().getFullYear()}
      </div>
    </div>
  );
}

// ─── FIND PRODUCT ─────────────────────────────────────────────────────────────
function FindProduct({stock,T=LANGS.en}){
  const [q,setQ]           = useState("");
  const [pinned,setPinned] = useState(null);
  const [hovered,setHov]   = useState(null); // hover preview

  const results = useMemo(()=>{
    const s=q.trim().toLowerCase();
    if(!s) return [];
    return stock.filter(r=>r.code.toLowerCase().includes(s)||r.name.toLowerCase().includes(s));
  },[q,stock]);

  function handleSearch(val){setQ(val);setPinned(null);setHov(null);}

  // Priority: pinned (clicked) > hovered (preview)
  const active     = pinned || hovered;
  const activeLive = active ? (stock.find(r=>r.id===active.id)||active) : null;
  const highlighted = activeLive ? [activeLive.container] : [];

  // Yard border: teal when pinned, dimmed blue when just hovering
  const yardBorder = pinned ? B.teal : hovered ? "rgba(0,162,158,0.35)" : B.border;

  const yardLabel = pinned
    ? `${activeLive?.container} · ${activeLive?.qty} cases — tap row to deselect`
    : hovered
      ? `Preview: ${activeLive?.container} · ${activeLive?.qty} cases`
      : results.length>0 ? "Hover a result to preview · tap to pin location" : "Search above";

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Search */}
      <div style={{padding:"12px 16px 0",flexShrink:0}}>
        <div className="inp-wrap">
          <span className="inp-icon"><Icon path={IC.search} size={17}/></span>
          <input type="text" placeholder={T.findPlaceholder}
            value={q} onChange={e=>handleSearch(e.target.value)} autoFocus/>
        </div>
      </div>

      {/* Results */}
      <div style={{flex:1,overflowY:"auto",padding:"10px 16px",display:"flex",flexDirection:"column",gap:8}}>
        {!q && <div className="empty">Start typing to search all {stock.length} stock records</div>}
        {q && results.length===0 && <div className="empty">No results found for "{q}"</div>}
        {results.map(r=>{
          const live=stock.find(s=>s.id===r.id)||r;
          const isPinned = pinned?.id===r.id;
          const isHov    = hovered?.id===r.id && !isPinned;
          return(
            <div key={r.id}
              className={`srow${isPinned?" sel":isHov?" hov":""}`}
              onClick={()=>{setPinned(prev=>prev?.id===r.id?null:r);setHov(null);}}
              onMouseEnter={()=>!isPinned&&setHov(live)}
              onMouseLeave={()=>setHov(null)}
              onTouchStart={()=>!isPinned&&setHov(live)}
              onTouchEnd={()=>setHov(null)}>
              <div className="srow-left">
                <div className="srow-code">{live.code}</div>
                <div className="srow-name">{live.name}</div>
                <div className="srow-loc">
                  <Icon path={IC.pin} size={11}/>
                  <span style={{
                    color: isPinned?B.teal : isHov?"rgba(0,162,158,0.7)" : B.muted,
                    fontWeight: (isPinned||isHov)?600:400,
                    transition:"color 0.15s",
                  }}>{live.container}</span>
                  {isPinned && <span className="tag tag-teal" style={{marginLeft:6}}>Pinned</span>}
                  {isHov    && <span style={{marginLeft:6,fontSize:10,color:"rgba(0,162,158,0.6)",
                    fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1}}>
                    PREVIEW
                  </span>}
                </div>
              </div>
              <div className="srow-right">
                <div className="srow-qty">{live.qty}</div>
                <div className="srow-unit">{T.cases}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Yard — pinned to bottom, above fixed nav */}
      <div style={{flexShrink:0,background:"rgba(8,14,28,0.95)",
        borderTop:`2px solid ${yardBorder}`,
        padding:"10px 16px 12px",transition:"border-color 0.2s",maxHeight:"38vh",
        marginBottom:0}}>
        <div className={`yard-label${activeLive?" active":""}`}>{yardLabel}</div>
        <Yard highlighted={highlighted}/>
      </div>
    </div>
  );
}

// ─── VIEW CONTAINER ───────────────────────────────────────────────────────────
function ViewContainer({stock,T=LANGS.en}){
  const [sel,setSel]=useState(null);
  const contents=useMemo(()=>sel?stock.filter(r=>r.container===sel):[],[sel,stock]);
  const total=contents.reduce((s,r)=>s+r.qty,0);
  return(
    <div className="page page-gap">
      <div className="yard-wrap">
        {sel ? (
          <div style={{marginBottom:10,display:"flex",alignItems:"baseline",gap:10}}>
            <div style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:32,fontWeight:900,color:B.teal,lineHeight:1,
              letterSpacing:1,
              textShadow:`0 0 20px rgba(0,162,158,0.5)`,
            }}>{sel}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,
              fontWeight:600,color:B.dimmed,letterSpacing:"1px"}}>
              {contents.length} products · {total} cases
            </div>
          </div>
        ) : (
          <div className="yard-label">{T.containerTap}</div>
        )}
        <Yard selected={sel} onSelect={c=>setSel(c===sel?null:c)}/>
      </div>
      {sel&&contents.length===0&&<div className="empty">{T.containerNoStock(sel)}</div>}
      {contents.map(r=>(
        <div key={r.id} className="srow" style={{cursor:"default"}}>
          <div className="srow-left">
            <div className="srow-code">{r.code}</div>
            <div className="srow-name">{r.name}</div>
            <div className="srow-loc" style={{marginTop:3,color:B.dimmed,fontSize:11}}>
              <Icon path={IC.pin} size={11}/> {r.container}
            </div>
          </div>
          <div className="srow-right">
            <div className="srow-qty">{r.qty}</div>
            <div className="srow-unit">{T.cases}</div>
          </div>
        </div>
      ))}
      {!sel&&<div className="empty">{T.containerSelectHint}</div>}
    </div>
  );
}

// ─── UPDATE STOCK ─────────────────────────────────────────────────────────────
function UpdateStock({stock,catalogue=PRODUCT_CATALOGUE,onUpdate,onAddNew,showToast,T=LANGS.en}){
  const [mode,setMode]=useState("existing");
  return(
    <div className="page page-gap">
      <div className="pill-tabs">
        <button className={`pill-tab${mode==="existing"?" on":""}`} onClick={()=>setMode("existing")}>
          {T.updateExisting}
        </button>
        <button className={`pill-tab${mode==="new"?" on":""}`} onClick={()=>setMode("new")}>
          {T.updateNew}
        </button>
      </div>
      {mode==="existing"
        ? <ExistingStock stock={stock} onUpdate={onUpdate} showToast={showToast} T={T}/>
        : <NewLocation   stock={stock} catalogue={catalogue} onAddNew={onAddNew} showToast={showToast} T={T}/>}
    </div>
  );
}

function ExistingStock({stock,onUpdate,showToast,T=LANGS.en}){
  const [q,setQ]         =useState("");
  const [sel,setSel]     =useState(null);
  const [hov,setHov]     =useState(null);
  const [action,setAction]=useState("Add");
  const [cases,setCases] =useState("");

  const live=useMemo(()=>sel?stock.find(r=>r.id===sel.id)||sel:null,[sel,stock]);

  const results=useMemo(()=>{
    const s=q.trim().toLowerCase();
    if(!s)return[];
    return stock.filter(r=>r.code.toLowerCase().includes(s)||r.name.toLowerCase().includes(s));
  },[q,stock]);

  const highlighted = live?[live.container]:hov?[hov.container]:results.map(r=>r.container);
  const yardLabel   = live?`Updating: ${live.container}`
    :hov?`Preview: ${hov.container} · ${hov.qty} cases`
    :highlighted.length>0?`Found in: ${highlighted.join(", ")}`:T.searchLocate;

  function submit(){
    const n=parseInt(cases,10);
    if(!live){showToast(T.toastSelectFirst,"err");return;}
    if(!n||n<=0){showToast(T.toastEnterCases,"err");return;}
    if(action==="Remove"&&n>live.qty){showToast(T.toastCannotRemove,"err");return;}
    onUpdate(live.id,action==="Add"?n:-n,{
      type:action==="Add"?"add":"rem",
      code:live.code,name:live.name,container:live.container,delta:n
    });
    showToast(action==="Add"?T.toastAdded(n,live.code,live.container):T.toastRemoved(n,live.code,live.container));
    setSel(null);setQ("");setCases("");setAction("Add");setHov(null);
  }

  return(
    <>
      <div className="inp-wrap">
        <span className="inp-icon"><Icon path={IC.search} size={17}/></span>
        <input type="text" placeholder={T.searchPlaceholder} value={q}
          onChange={e=>{setQ(e.target.value);setSel(null);setHov(null);}}/>
      </div>

      <div className="yard-wrap">
        <div className={`yard-label${live||hov?" active":""}`}>{yardLabel}</div>
        <Yard
          highlighted={highlighted}
          selected={!live&&hov?hov.container:undefined}
          compact
        />
      </div>

      {q.trim()&&results.length===0&&(
        <div className="empty">Not found — use New Location tab to add</div>
      )}

      {results.length>0&&!live&&(
        <>
          <div className="slabel">{results.length>1?T.searchHoverHint:T.findTapHint}</div>
          {results.map(r=>{
            const lv=stock.find(s=>s.id===r.id)||r;
            const isH=hov?.id===r.id;
            return(
              <div key={r.id} className={`srow${isH?" hov":""}`}
                onClick={()=>{setSel(r);setHov(null);}}
                onMouseEnter={()=>setHov(lv)} onMouseLeave={()=>setHov(null)}
                onTouchStart={()=>setHov(lv)} onTouchEnd={()=>setHov(null)}>
                <div className="srow-left">
                  <div className="srow-code">{lv.code}</div>
                  <div className="srow-name">{lv.name}</div>
                  <div className="srow-loc" style={{color:isH?B.teal:B.muted,fontWeight:isH?600:400}}>
                    <Icon path={IC.pin} size={11}/> {lv.container}
                  </div>
                </div>
                <div className="srow-right">
                  <div className="srow-qty">{lv.qty}</div>
                  <div className="srow-unit">{T.cases}</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {live&&(
        <>
          <div className="slabel">{T.searchSelected}</div>
          <div className="srow sel" onClick={()=>setSel(null)} style={{cursor:"pointer"}}>
            <div className="srow-left">
              <div className="srow-code">{live.code}</div>
              <div className="srow-name">{live.name}</div>
              <div className="srow-loc"><Icon path={IC.pin} size={11}/> {live.container}</div>
            </div>
            <div className="srow-right">
              <div className="srow-qty">{live.qty}</div>
              <div className="srow-unit">{T.now}</div>
            </div>
          </div>

          <div className="card" style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <div className="slabel" style={{marginBottom:8}}>Action</div>
              <div className="toggle-row">
                <button className={`toggle-btn add${action==="Add"?" on":""}`} onClick={()=>setAction("Add")}>{T.actionAdd}</button>
                <button className={`toggle-btn rem${action==="Remove"?" on":""}`} onClick={()=>setAction("Remove")}>{T.actionRemove}</button>
              </div>
            </div>
            <div>
              <div className="slabel" style={{marginBottom:8}}>{T.casesLabel}</div>
              <input type="number" className="inp-plain" placeholder="0" min="1"
                value={cases} onChange={e=>setCases(e.target.value)} inputMode="numeric"/>
            </div>
            {cases&&parseInt(cases)>0&&(
              <div style={{fontSize:13,color:B.muted,padding:"10px 12px",
                background:"rgba(0,162,158,0.05)",borderRadius:8,border:`1px solid rgba(0,162,158,0.15)`}}>
                New quantity:{" "}
                <strong style={{color:B.teal,fontSize:16}}>
                  {action==="Add"?live.qty+parseInt(cases):Math.max(0,live.qty-parseInt(cases))} cases
                </strong>
              </div>
            )}
            <button className="btn-primary" onClick={submit}
              disabled={!cases||parseInt(cases)<=0}>
              {T.confirmBtn(action)}
            </button>
          </div>
        </>
      )}
    </>
  );
}

function NewLocation({stock,catalogue=PRODUCT_CATALOGUE,onAddNew,showToast,T=LANGS.en}){
  const [product,setProduct]=useState({code:"",name:""});
  const [container,setContainer]=useState("");
  const [cases,setCases]=useState("");

  const existing=useMemo(()=>{
    const c=product.code.trim().toUpperCase();
    if(!c)return[];
    return stock.filter(r=>r.code.toUpperCase()===c);
  },[product.code,stock]);

  const blocked=existing.map(r=>r.container);

  function toggleContainer(c){
    if(blocked.includes(c)){
      showToast(`${product.code} already in ${c} — use Update Existing`,"err");return;
    }
    setContainer(prev=>prev===c?"":c);
  }

  function submit(){
    const n=parseInt(cases,10);
    if(!product.code.trim()){showToast(T.toastSelectProduct,"err");return;}
    if(!container){showToast(T.toastSelectContainer,"err");return;}
    if(!n||n<=0){showToast(T.toastEnterCases,"err");return;}
    const name=product.name||product.code;
    onAddNew(product.code.trim().toUpperCase(),name,container,n);
    showToast(T.toastNewLoc(product.code.toUpperCase(),container,n));
    setProduct({code:"",name:""});setContainer("");setCases("");
  }

  const ready=product.code.trim()&&container&&cases&&parseInt(cases)>0;

  return(
    <>
      <div className="slabel">Search Product Catalogue</div>
      <CatalogueInput value={product.code} onChange={setProduct} placeholder={T.catalogueSearch} catalogue={catalogue}
        placeholder={T.catalogueSearch}/>

      {product.name&&(
        <div style={{background:"rgba(0,162,158,0.08)",border:"1px solid rgba(0,162,158,0.25)",
          borderRadius:"var(--radius)",padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
              color:B.teal,letterSpacing:1}}>{product.code}</div>
            <div style={{fontSize:13,color:B.text,marginTop:2,lineHeight:1.3}}>{product.name}</div>
          </div>
          <span className="tag tag-teal">From Catalogue</span>
        </div>
      )}

      {existing.length>0&&(
        <div style={{background:"rgba(245,158,25,0.06)",border:"1px solid rgba(245,158,25,0.25)",
          borderRadius:"var(--radius)",padding:"10px 14px",fontSize:12,color:B.muted}}>
          <span style={{color:B.amber,fontWeight:700}}>{T.alreadyStocked} </span>
          {blocked.join(" · ")}
          <div style={{marginTop:3,fontSize:11}}>These containers are dimmed — select a different one.</div>
        </div>
      )}

      <div className="slabel">{container?`${T.containerSelected(container)}`:T.selectContainer}</div>
      <div className="yard-wrap">
        <Yard highlighted={container?[container]:[]} selected={container}
          blocked={blocked} onSelect={toggleContainer}/>
      </div>

      <div className="slabel">{T.casesNum}</div>
      <input type="number" className="inp-plain" placeholder="0" min="1"
        value={cases} onChange={e=>setCases(e.target.value)} inputMode="numeric"/>

      {ready&&(
        <div style={{background:"rgba(0,162,158,0.08)",border:`1px solid ${B.teal}`,
          borderRadius:"var(--radius)",padding:"12px 14px",
          fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:B.muted,lineHeight:1.7}}>
          <strong style={{color:B.teal}}>{parseInt(cases)} cases</strong>
          {" · "}<strong style={{color:B.text}}>{product.code}</strong>
          {product.name&&<span> · {product.name}</span>}
          {" → "}<strong style={{color:B.teal}}>{container}</strong>
        </div>
      )}

      <button className="btn-primary" onClick={submit} disabled={!ready}>
        Add to Stock
      </button>
    </>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({stock,log,T=LANGS.en}){
  const [view,setView] = useState("overview"); // overview | products | locations | activity

  const totalCases = stock.reduce((s,r)=>s+r.qty,0);
  const totalLines = stock.length;
  const totalSKUs  = new Set(stock.map(r=>r.code)).size;
  const activeCont = new Set(stock.map(r=>r.container)).size;

  const contData = [...GROUND,...UPPER].map(c=>{
    const rows=stock.filter(r=>r.container===c);
    return {c, lines:rows.length, cases:rows.reduce((s,r)=>s+r.qty,0), rows};
  });
  const maxCases = Math.max(...contData.map(d=>d.cases),1);

  const bySKU={};
  stock.forEach(r=>{
    if(!bySKU[r.code]) bySKU[r.code]={code:r.code,name:r.name,qty:0,locations:[]};
    bySKU[r.code].qty+=r.qty;
    bySKU[r.code].locations.push(r.container);
  });
  const allSKUs=Object.values(bySKU).sort((a,b)=>b.qty-a.qty);

  // Activity timeline — group log entries by hour bucket
  const activityBuckets = useMemo(()=>{
    if(log.length===0) return [];
    // last 10 entries as a simple timeline
    return log.slice(0,20).reverse();
  },[log]);

  const tabStyle = (t) => ({
    flex:1, padding:"12px 4px", textAlign:"center",
    fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700,
    letterSpacing:"0.5px", border:"none", cursor:"pointer",
    minHeight:44, // accessible tap target
    background: view===t ? "rgba(0,162,158,0.12)" : "transparent",
    color: view===t ? B.teal : B.muted,
    borderBottom: view===t ? `2px solid ${B.teal}` : "2px solid transparent",
    transition:"all 0.15s", WebkitTapHighlightColor:"transparent",
  });

  return(
    <div style={{width:"100%",height:"100%",overflowY:"auto",overflowX:"hidden",
      WebkitOverflowScrolling:"touch"}}>

      {/* Sticky sub-tabs */}
      <div style={{
        position:"sticky",top:0,zIndex:10,
        display:"flex",
        background:"rgba(6,10,22,0.99)",
        borderBottom:"1px solid rgba(0,162,158,0.25)",
        boxShadow:"0 2px 12px rgba(0,0,0,0.8)",
      }}>
        {[["overview",T.dashOverview],["products",T.dashProducts],
          ["locations",T.dashLocations],["activity",T.dashActivity]].map(([t,l])=>(
          <button key={t} style={tabStyle(t)} onClick={()=>setView(t)}>{l}</button>
        ))}
      </div>

      <div style={{padding:16,paddingBottom:72,display:"flex",flexDirection:"column",gap:12}}>

        {/* ── OVERVIEW ── */}
        {view==="overview"&&(
          <>
            {/* Brand header strip */}
            <div style={{background:`linear-gradient(135deg,${B.navyDark} 0%,${B.navy} 100%)`,
              borderRadius:"var(--radius-lg)",padding:"14px 16px",
              border:`1px solid rgba(0,162,158,0.3)`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,
                background:`radial-gradient(circle,rgba(0,162,158,0.18) 0%,transparent 70%)`}}/>
              <img
                src={LOGO_B64}
                alt="Magna Foodservice"
                style={{
                  height:36,
                  width:"auto",
                  maxWidth:180,
                  display:"block",
                  marginBottom:8,
                  mixBlendMode:"screen",
                  filter:"brightness(1.15)",
                  objectFit:"contain",
                }}
              />
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,
                fontWeight:900,color:B.text,letterSpacing:1}}>Stock Overview</div>
              <div style={{fontSize:11,color:B.dimmed,marginTop:3}}>
                Front Yard · {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
              </div>
            </div>

            {/* Stats grid */}
            <div className="stat-grid">
              {[
                {val:totalCases.toLocaleString(),label:"Total Cases",sub:T.allContainers,color:B.teal},
                {val:totalLines,label:"Stock Lines",sub:T.productLocations,color:B.tealLight},
                {val:totalSKUs,label:"Unique SKUs",sub:"Product codes",color:B.amber},
                {val:`${activeCont}/16`,label:"Containers",sub:T.inUse,color:B.orange},
              ].map((s,i)=>(
                <div key={i} className="stat-card">
                  <div className="stat-val" style={{color:s.color}}>{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Container bars */}
            <div className="slabel">Container Utilisation</div>
            <div className="card" style={{padding:"12px 14px"}}>
              {contData.map(d=>(
                <div key={d.c} style={{marginBottom:9}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,
                      fontWeight:800,color:d.cases>0?B.text:B.dimmed,letterSpacing:"0.5px"}}>
                      {d.c}
                    </span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,
                      color:d.cases>0?B.teal:B.dimmed}}>
                      {d.cases} {T.cases} · {d.lines} SKUs
                    </span>
                  </div>
                  <div style={{height:7,background:"rgba(30,58,95,0.8)",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:4,
                      width:`${(d.cases/maxCases)*100}%`,
                      background:d.cases>0?`linear-gradient(90deg,${B.teal},${B.tealLight})`:"transparent",
                      transition:"width 0.4s ease"}}/>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── BY PRODUCT ── */}
        {view==="products"&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div className="slabel">{T.dashAllProducts(allSKUs.length)}</div>
              <div style={{fontSize:10,color:B.dimmed}}>{T.dashSortedQty}</div>
            </div>
            {allSKUs.map((p,i)=>(
              <div key={p.code} style={{background:"rgba(17,40,75,0.7)",border:"1px solid var(--border)",
                borderRadius:"var(--radius)",padding:"12px 14px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:900,
                    color:i<3?B.amber:B.dimmed,width:22,flexShrink:0,paddingTop:1}}>
                    {i+1}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,
                        fontWeight:800,color:B.teal,letterSpacing:1}}>{p.code}</span>
                    </div>
                    <div style={{fontSize:13,color:B.text,lineHeight:1.35,wordBreak:"break-word",
                      marginBottom:6}}>{p.name}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {p.locations.map(l=>(
                        <span key={l} style={{fontFamily:"'Barlow Condensed',sans-serif",
                          fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:3,
                          background:"rgba(0,162,158,0.12)",color:B.teal,letterSpacing:"0.5px"}}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,
                      fontWeight:900,color:B.teal,lineHeight:1}}>{p.qty}</div>
                    <div style={{fontSize:10,color:B.dimmed,textTransform:"uppercase",
                      letterSpacing:1}}>total</div>
                  </div>
                </div>
                {/* Per-location breakdown */}
                {p.locations.length>1&&(
                  <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid rgba(30,58,95,0.5)"}}>
                    {stock.filter(r=>r.code===p.code).map(r=>(
                      <div key={r.id} style={{display:"flex",justifyContent:"space-between",
                        marginBottom:3,fontSize:12}}>
                        <span style={{color:B.muted,fontFamily:"'Barlow Condensed',sans-serif",
                          fontWeight:600}}>{r.container}</span>
                        <span style={{color:B.text}}>{r.qty} cases</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── BY LOCATION ── */}
        {view==="locations"&&(
          <>
            <div className="slabel">{T.dashAllContainers}</div>
            {contData.map(d=>(
              <div key={d.c} style={{background:"rgba(17,40,75,0.7)",
                border:`1px solid ${d.cases>0?"rgba(0,162,158,0.25)":"var(--border)"}`,
                borderRadius:"var(--radius)",overflow:"hidden"}}>
                {/* Container header */}
                <div style={{display:"flex",alignItems:"center",gap:10,
                  padding:"10px 14px",
                  background:d.cases>0?"rgba(0,162,158,0.08)":"rgba(11,20,32,0.4)",
                  borderBottom:d.rows.length>0?"1px solid rgba(30,58,95,0.6)":"none"}}>
                  <div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,
                      fontWeight:700,color:B.dimmed,letterSpacing:2}}>AX1</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,
                      fontWeight:900,color:d.cases>0?B.teal:B.dimmed,lineHeight:1,
                      letterSpacing:1}}>{d.c.slice(-3)}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,
                      fontWeight:700,color:d.cases>0?B.text:B.dimmed}}>{d.c}</div>
                    <div style={{fontSize:11,color:B.dimmed,marginTop:1}}>
                      {[...GROUND,...UPPER].indexOf(d.c)<8?T.groundFloor:T.firstFloor}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,
                      fontWeight:900,color:B.teal,lineHeight:1}}>{d.cases}</div>
                    <div style={{fontSize:10,color:B.dimmed}}>cases</div>
                  </div>
                </div>
                {/* Product rows */}
                {d.rows.length===0&&(
                  <div style={{padding:"10px 14px",fontSize:12,color:B.dimmed,fontStyle:"italic"}}>
                    {T.dashNoStock}
                  </div>
                )}
                {d.rows.map((r,i)=>(
                  <div key={r.id} style={{display:"flex",alignItems:"flex-start",gap:10,
                    padding:"9px 14px",
                    borderBottom:i<d.rows.length-1?"1px solid rgba(30,58,95,0.4)":"none"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,
                        fontWeight:700,color:B.teal,letterSpacing:1}}>{r.code}</div>
                      <div style={{fontSize:13,color:B.text,lineHeight:1.3,
                        wordBreak:"break-word"}}>{r.name}</div>
                    </div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,
                      fontWeight:900,color:B.tealLight,flexShrink:0}}>{r.qty}</div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* ── ACTIVITY TIMELINE ── */}
        {view==="activity"&&(
          <>
            <div className="slabel">Update Activity This Session</div>

            {log.length===0&&(
              <div className="card" style={{padding:32,textAlign:"center"}}>
                <div style={{color:B.dimmed,fontSize:13,marginBottom:6}}>
                  {T.dashNoActivity}
                </div>
                <div style={{color:B.dimmed,fontSize:11}}>
                  Every stock update appears here as a timeline entry
                </div>
              </div>
            )}

            {/* Activity bar chart — cases changed per entry */}
            {log.length>0&&(
              <>
                <div className="card" style={{padding:"14px 14px 8px"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,
                    fontWeight:700,color:B.dimmed,letterSpacing:2,marginBottom:10}}>
                    {T.dashCasesChanged}
                  </div>
                  {log.slice(0,15).map((e,i)=>{
                    const maxD=Math.max(...log.slice(0,15).map(x=>x.delta||0),1);
                    const pct=((e.delta||0)/maxD)*100;
                    return(
                      <div key={e.id} style={{display:"flex",alignItems:"center",
                        gap:8,marginBottom:7}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",
                          fontSize:10,fontWeight:700,width:36,
                          color:e.type==="rem"?B.red:e.type==="new"?B.amber:B.teal,
                          flexShrink:0}}>
                          {e.type==="rem"?`-${e.delta}`:e.type==="new"?`+${e.delta}`:
                          `+${e.delta}`}
                        </div>
                        <div style={{flex:1,height:8,background:"rgba(30,58,95,0.6)",
                          borderRadius:4,overflow:"hidden"}}>
                          <div style={{height:"100%",borderRadius:4,width:`${pct}%`,
                            background:e.type==="rem"
                              ?`linear-gradient(90deg,${B.red},#900)`
                              :e.type==="new"
                                ?`linear-gradient(90deg,${B.amber},${B.orange})`
                                :`linear-gradient(90deg,${B.teal},${B.tealLight})`,
                          }}/>
                        </div>
                        <div style={{fontSize:10,color:B.dimmed,flexShrink:0,width:40,
                          textAlign:"right"}}>{e.ts.split(" ")[1]||e.ts}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Chronological timeline */}
                <div className="slabel" style={{marginTop:4}}>{T.dashTimeline}</div>
                <div style={{position:"relative",paddingLeft:20}}>
                  {/* Vertical line */}
                  <div style={{position:"absolute",left:6,top:0,bottom:0,width:2,
                    background:`linear-gradient(180deg,${B.teal},transparent)`}}/>

                  {log.map((e,i)=>(
                    <div key={e.id} style={{position:"relative",marginBottom:12,paddingLeft:16}}>
                      {/* Timeline dot */}
                      <div style={{position:"absolute",left:-8,top:4,width:10,height:10,
                        borderRadius:"50%",border:`2px solid ${B.teal}`,
                        background:e.type==="rem"?B.red:e.type==="new"?B.amber:B.teal}}/>

                      <div style={{background:"rgba(17,40,75,0.7)",border:"1px solid var(--border)",
                        borderRadius:"var(--radius)",padding:"10px 12px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",
                          alignItems:"flex-start",gap:8,marginBottom:4}}>
                          <div className={`log-badge ${e.type}`} style={{margin:0}}>
                            {e.type==="add"?`+${e.delta} added`:
                             e.type==="rem"?`-${e.delta} removed`:`New · ${e.delta} cases`}
                          </div>
                          <div style={{fontSize:10,color:B.dimmed,flexShrink:0}}>{e.ts}</div>
                        </div>
                        <div style={{fontSize:13,color:B.text,lineHeight:1.3,
                          wordBreak:"break-word"}}>{e.name}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,
                          color:B.muted,marginTop:3,letterSpacing:"0.5px"}}>
                          {e.code} · {e.container}
                          {e.device&&<span style={{color:B.dimmed}}> · {e.device}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}

// ─── CHANGE LOG ───────────────────────────────────────────────────────────────
function ChangeLog({log,T=LANGS.en}){
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{
        position:"sticky",top:0,zIndex:10,
        padding:"12px 16px",
        background:"linear-gradient(180deg,rgba(6,10,22,0.99),rgba(8,14,28,0.98))",
        borderBottom:"1px solid var(--border)",
        display:"flex",justifyContent:"space-between",alignItems:"center",
      }}>
        <div style={{paddingBottom:72}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,
            fontWeight:800,color:B.text,letterSpacing:1}}>Change Log</div>
          <div style={{fontSize:11,color:B.dimmed,marginTop:1}}>
            {T.logRecords(log.length)}
          </div>
        </div>
        <div style={{display:"flex",gap:10,fontSize:11}}>
          {[["add",T.logAdded,B.teal],["rem",T.logRemoved,B.red],["new",T.logNew,B.amber]].map(([t,l,c])=>(
            <div key={t} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:8,height:8,borderRadius:2,
                background:c,opacity:0.7}}/>
              <span style={{color:B.dimmed}}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        {log.length===0&&(
          <div style={{padding:40,textAlign:"center",color:B.dimmed,fontSize:13}}>
            No changes recorded yet. Updates made via the Update tab will appear here.
          </div>
        )}
        {log.map(e=>(
          <div key={e.id} className="log-row">
            <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-start"}}>
              <div className={`log-badge ${e.type}`}>
                {e.type==="add"?`+${e.delta}`:e.type==="rem"?`-${e.delta}`:"NEW"}
              </div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,
                fontWeight:700,color:B.dimmed,letterSpacing:1}}>{e.container}</div>
            </div>
            <div className="log-info">
              <div className="log-name">{e.name}</div>
              <div className="log-meta">{e.code}
                {e.type==="new"&&<span style={{color:B.amber,marginLeft:6}}>· New location · {e.delta} cases</span>}
                {e.type==="add"&&<span style={{color:B.teal,marginLeft:6}}>· +{e.delta} cases added</span>}
                {e.type==="rem"&&<span style={{color:B.red,marginLeft:6}}>· -{e.delta} cases removed</span>}
              </div>
              <div style={{fontSize:10,color:B.dimmed,marginTop:3,display:"flex",gap:8,flexWrap:"wrap"}}>
                <span>{e.ts}</span>
                {e.staff&&<span style={{color:B.muted,fontWeight:600}}>· {e.staff}</span>}
                {e.role&&<span>· {e.role}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
