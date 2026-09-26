export type Language = "en" | "km"

export const LANGUAGES: Language[] = ["en", "km"]

const en = {
  // Header
  "nav.explore": "Explore",
  "nav.hireCreatives": "Hire Creatives",
  "nav.findWork": "Find Work",
  "header.search": "Search inspiration, design styles, creators...",
  "header.searchShort": "Search inspiration, creators...",
  "header.toLight": "Switch to light mode",
  "header.toDark": "Switch to dark mode",
  "header.toOtherLanguage": "Switch to Khmer",
  "header.profile": "Your profile",
  "header.signIn": "Sign in",
  "header.signUp": "Sign up",
  "header.signOut": "Sign out",
  "header.openMenu": "Open menu",
  "header.closeMenu": "Close menu",

  // Bottom tab bar
  "tabs.explore": "Explore",
  "tabs.creatives": "Creatives",
  "tabs.jobs": "Jobs",
  "tabs.profile": "Profile",

  // Landing hero
  "audience.label": "What brings you here",
  "audience.hire": "Hire talent",
  "audience.work": "Get hired",
  "hero.word.productDesign": "product design",
  "hero.word.webDevelopment": "web development",
  "hero.word.brandIdentity": "brand identity",
  "hero.word.mobileApps": "mobile apps",
  "hero.word.motionVideo": "motion and video",
  "hero.hire.lead": "Work with independent talent in",
  "hero.hire.point1": "Browse finished work, not promises",
  "hero.hire.point2": "Agree scope and budget up front",
  "hero.hire.point3": "Funds held until you approve the result",
  "hero.hire.cta": "Browse creatives",
  "hero.hire.secondary": "Post a job",
  "hero.work.lead": "Get hired for what you are best at, in",
  "hero.work.point1": "Publish your work with no approval queue",
  "hero.work.point2": "Answer briefs from clients who are ready",
  "hero.work.point3": "Every project tracked to completion",
  "hero.work.cta": "Find work",
  "hero.work.secondary": "Show your work",
  "hero.createAccount": "Create an account",

  // Home feed
  "home.title": "Recent work",
  "home.subtitle": "Published by freelancers on the platform, newest first",
  "home.loading": "Loading published projects…",
  "home.showing": "Showing {count} published projects",
  "home.errorTitle": "Could not load projects",
  "home.retry": "Try again",
  "home.emptyTitle": "No projects match these filters",
  "home.emptyDescription": "Try a different category or industry.",
  "home.resetFilters": "Reset filters",

  // Footer
  "footer.brand": "Jes tae tver tv",
  "footer.description":
    "The trusted freelance marketplace connecting world-class creative and technical talent with verified projects.",
  "footer.freelancers": "Freelancers",
  "footer.overview": "Overview",
  "footer.findGigs": "Find Gigs",
  "footer.portfolio": "Portfolio Showcase",
  "footer.escrow": "Escrow Guarantee",
  "footer.clients": "Clients",
  "footer.discoverTalent": "Discover Talent",
  "footer.postProject": "Post a Project",
  "footer.enterprise": "Enterprise Solutions",
  "footer.resources": "Resources",
  "footer.pricing": "Pricing & Fees",
  "footer.help": "Help Center",
  "footer.trust": "Trust & Safety",
  "footer.legal": "Legal & Privacy",
  "footer.terms": "Terms of Service",
  "footer.privacy": "Privacy Policy",
  "footer.cookies": "Cookie Policy",
  "footer.copyright": "© {year} Jes tae tver tv Inc. All rights reserved.",
  "footer.badgeEscrow": "Middleman Escrow Protected",
  "footer.badgePayouts": "Global Payouts",
}

export type MessageKey = keyof typeof en

// Typed against the English keys, so a missing translation fails the build
// instead of rendering an empty string.
const km: Record<MessageKey, string> = {
  "nav.explore": "រុករក",
  "nav.hireCreatives": "ជួលអ្នកច្នៃប្រឌិត",
  "nav.findWork": "ស្វែងរកការងារ",
  "header.search": "ស្វែងរកគំនិត រចនាប័ទ្ម អ្នកបង្កើត...",
  "header.searchShort": "ស្វែងរកគំនិត អ្នកបង្កើត...",
  "header.toLight": "ប្តូរទៅរបៀបភ្លឺ",
  "header.toDark": "ប្តូរទៅរបៀបងងឹត",
  "header.toOtherLanguage": "ប្តូរទៅភាសាអង់គ្លេស",
  "header.profile": "ប្រវត្តិរូបរបស់អ្នក",
  "header.signIn": "ចូល",
  "header.signUp": "ចុះឈ្មោះ",
  "header.signOut": "ចាកចេញ",
  "header.openMenu": "បើកម៉ឺនុយ",
  "header.closeMenu": "បិទម៉ឺនុយ",

  "tabs.explore": "រុករក",
  "tabs.creatives": "អ្នកច្នៃប្រឌិត",
  "tabs.jobs": "ការងារ",
  "tabs.profile": "ប្រវត្តិរូប",

  "audience.label": "តើអ្វីនាំអ្នកមកទីនេះ",
  "audience.hire": "ជួលអ្នកជំនាញ",
  "audience.work": "ទទួលការងារ",
  "hero.word.productDesign": "រចនាផលិតផល",
  "hero.word.webDevelopment": "អភិវឌ្ឍគេហទំព័រ",
  "hero.word.brandIdentity": "អត្តសញ្ញាណម៉ាក",
  "hero.word.mobileApps": "កម្មវិធីទូរស័ព្ទ",
  "hero.word.motionVideo": "ចលនា និងវីដេអូ",
  "hero.hire.lead": "ធ្វើការជាមួយអ្នកជំនាញឯករាជ្យផ្នែក",
  "hero.hire.point1": "មើលស្នាដៃដែលធ្វើរួច មិនមែនត្រឹមការសន្យា",
  "hero.hire.point2": "ព្រមព្រៀងលើវិសាលភាព និងថវិកាជាមុន",
  "hero.hire.point3": "ប្រាក់ត្រូវរក្សាទុក រហូតដល់អ្នកយល់ព្រមលើលទ្ធផល",
  "hero.hire.cta": "មើលអ្នកច្នៃប្រឌិត",
  "hero.hire.secondary": "ប្រកាសការងារ",
  "hero.work.lead": "ទទួលការងារលើអ្វីដែលអ្នកពូកែបំផុត ផ្នែក",
  "hero.work.point1": "ផ្សព្វផ្សាយស្នាដៃរបស់អ្នក ដោយមិនចាំបាច់រង់ចាំការអនុម័ត",
  "hero.work.point2": "ឆ្លើយតបតម្រូវការពីអតិថិជនដែលត្រៀមខ្លួនរួចហើយ",
  "hero.work.point3": "គ្រប់គម្រោងត្រូវបានតាមដានរហូតដល់ចប់",
  "hero.work.cta": "ស្វែងរកការងារ",
  "hero.work.secondary": "បង្ហាញស្នាដៃរបស់អ្នក",
  "hero.createAccount": "បង្កើតគណនី",

  "home.title": "ស្នាដៃថ្មីៗ",
  "home.subtitle": "ចេញផ្សាយដោយអ្នកធ្វើការឯករាជ្យលើវេទិកា ថ្មីបំផុតមុនគេ",
  "home.loading": "កំពុងផ្ទុកគម្រោង…",
  "home.showing": "កំពុងបង្ហាញគម្រោងចំនួន {count}",
  "home.errorTitle": "មិនអាចផ្ទុកគម្រោងបានទេ",
  "home.retry": "ព្យាយាមម្តងទៀត",
  "home.emptyTitle": "គ្មានគម្រោងដែលត្រូវនឹងតម្រងទាំងនេះទេ",
  "home.emptyDescription": "សាកល្បងប្រភេទ ឬវិស័យផ្សេងទៀត។",
  "home.resetFilters": "កំណត់តម្រងឡើងវិញ",

  "footer.brand": "ចេះតែធ្វើទៅ",
  "footer.description":
    "ទីផ្សារការងារឯករាជ្យដែលអាចទុកចិត្តបាន ភ្ជាប់អ្នកជំនាញច្នៃប្រឌិត និងបច្ចេកទេសកម្រិតពិភពលោក ជាមួយគម្រោងដែលបានផ្ទៀងផ្ទាត់។",
  "footer.freelancers": "អ្នកធ្វើការឯករាជ្យ",
  "footer.overview": "ទិដ្ឋភាពទូទៅ",
  "footer.findGigs": "ស្វែងរកការងារ",
  "footer.portfolio": "បង្ហាញស្នាដៃ",
  "footer.escrow": "ការធានាប្រាក់បញ្ញើ",
  "footer.clients": "អតិថិជន",
  "footer.discoverTalent": "ស្វែងរកទេពកោសល្យ",
  "footer.postProject": "ប្រកាសគម្រោង",
  "footer.enterprise": "ដំណោះស្រាយសម្រាប់សហគ្រាស",
  "footer.resources": "ធនធាន",
  "footer.pricing": "តម្លៃ និងកម្រៃសេវា",
  "footer.help": "មជ្ឈមណ្ឌលជំនួយ",
  "footer.trust": "ទំនុកចិត្ត និងសុវត្ថិភាព",
  "footer.legal": "ច្បាប់ និងឯកជនភាព",
  "footer.terms": "លក្ខខណ្ឌប្រើប្រាស់",
  "footer.privacy": "គោលការណ៍ឯកជនភាព",
  "footer.cookies": "គោលការណ៍ខូគី",
  "footer.copyright": "© {year} ចេះតែធ្វើទៅ។ រក្សាសិទ្ធិគ្រប់យ៉ាង។",
  "footer.badgeEscrow": "ការពារដោយប្រាក់បញ្ញើតាមអន្តរការី",
  "footer.badgePayouts": "ការទូទាត់ជាសកល",
}

const MESSAGES: Record<Language, Record<MessageKey, string>> = { en, km }

/** Looks up a message and fills `{name}` placeholders from `params`. */
export function translate(
  language: Language,
  key: MessageKey,
  params?: Record<string, string | number>
) {
  const message = MESSAGES[language][key]
  if (!params) return message

  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  )
}
