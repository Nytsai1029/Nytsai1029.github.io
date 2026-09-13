window.App = window.App || {};

App.i18n = {
  storageKey: "score-locale",
  locale: "zh",
  htmlLang: {
    zh: "zh-CN",
    "zh-Hant": "zh-TW",
    en: "en",
    ja: "ja",
    ko: "ko",
  },
  locales: [
    { id: "zh", name: "中文" },
    { id: "zh-Hant", name: "繁體中文" },
    { id: "en", name: "English" },
    { id: "ja", name: "日本語" },
    { id: "ko", name: "한국어" },
  ],
  strings: {
    zh: {
      "nav.label": "目录",
      "nav.home": "主页",
      "nav.about": "简介",
      "nav.works": "作品",
      "nav.service": "服务",
      "nav.contact": "联系",
      "nav.homeEn": "Home",
      "nav.aboutEn": "About",
      "nav.worksEn": "Works",
      "nav.serviceEn": "Service",
      "nav.contactEn": "Contact",
      "social.xiaohongshu": "小红书",
      "about.title": "你猜这个人",
      "about.sub": "Nytsai",
      "about.lead1": "绘谱雕版师",
      "about.lead2": "东京艺术大学作曲科毕业",
      "about.p1": "从大学在学期间开始，便在大型乐谱出版社从事乐谱制作工作，并于2017年独立。",
      "about.p2": "专门从事绘谱雕版、乐谱编辑、校对与审阅、DTP等版面制作工作。",
      "works.label": "作品",
      "works.detail": "SEE DETAIL",
      "works.amazon": "Amazon",
      "works.soon": "敬请期待",
      "page.service": "服务",
      "page.contact": "联系",
      "lang.aria": "选择语言",
    },
    "zh-Hant": {
      "nav.label": "目錄",
      "nav.home": "主頁",
      "nav.about": "簡介",
      "nav.works": "作品",
      "nav.service": "服務",
      "nav.contact": "聯繫",
      "nav.homeEn": "Home",
      "nav.aboutEn": "About",
      "nav.worksEn": "Works",
      "nav.serviceEn": "Service",
      "nav.contactEn": "Contact",
      "social.xiaohongshu": "小紅書",
      "about.title": "你猜這個人",
      "about.sub": "Nytsai",
      "about.lead1": "繪譜雕版師",
      "about.lead2": "東京藝術大學作曲科畢業",
      "about.p1": "從大學在學期間開始，便在大型樂譜出版社從事樂譜製作工作，並於2017年獨立。",
      "about.p2": "專門從事繪譜雕版、樂譜編輯、校對與審閱、DTP等版面製作工作。",
      "works.label": "作品",
      "works.detail": "SEE DETAIL",
      "works.amazon": "Amazon",
      "works.soon": "敬請期待",
      "page.service": "服務",
      "page.contact": "聯繫",
      "lang.aria": "選擇語言",
    },
    en: {
      "nav.label": "Menu",
      "nav.home": "Home",
      "nav.about": "About",
      "nav.works": "Works",
      "nav.service": "Service",
      "nav.contact": "Contact",
      "nav.homeEn": "Home",
      "nav.aboutEn": "About",
      "nav.worksEn": "Works",
      "nav.serviceEn": "Service",
      "nav.contactEn": "Contact",
      "social.xiaohongshu": "Xiaohongshu",
      "about.title": "Guess who",
      "about.sub": "Nytsai",
      "about.lead1": "Music engraver",
      "about.lead2": "Tokyo University of the Arts, Composition",
      "about.p1": "Began producing scores at a major publisher while still a student, and went independent in 2017.",
      "about.p2": "Specializes in engraving, editing, proofreading, and DTP.",
      "works.label": "Works",
      "works.detail": "SEE DETAIL",
      "works.amazon": "Amazon",
      "works.soon": "Coming soon",
      "page.service": "Service",
      "page.contact": "Contact",
      "lang.aria": "Choose language",
    },
    ja: {
      "nav.label": "目次",
      "nav.home": "ホーム",
      "nav.about": "紹介",
      "nav.works": "作品",
      "nav.service": "サービス",
      "nav.contact": "連絡",
      "nav.homeEn": "Home",
      "nav.aboutEn": "About",
      "nav.worksEn": "Works",
      "nav.serviceEn": "Service",
      "nav.contactEn": "Contact",
      "social.xiaohongshu": "小紅書",
      "about.title": "誰でしょう",
      "about.sub": "Nytsai",
      "about.lead1": "楽譜浄書家",
      "about.lead2": "東京藝術大学作曲科卒業",
      "about.p1": "大学在学中より大手楽譜出版社で楽譜制作に携わり、2017年に独立。",
      "about.p2": "楽譜浄書、編集、校正・校閲、DTPなどの版下制作を専門としています。",
      "works.label": "作品",
      "works.detail": "SEE DETAIL",
      "works.amazon": "Amazon",
      "works.soon": "近日公開",
      "page.service": "サービス",
      "page.contact": "連絡",
      "lang.aria": "言語を選択",
    },
    ko: {
      "nav.label": "목차",
      "nav.home": "홈",
      "nav.about": "소개",
      "nav.works": "작품",
      "nav.service": "서비스",
      "nav.contact": "연락",
      "nav.homeEn": "Home",
      "nav.aboutEn": "About",
      "nav.worksEn": "Works",
      "nav.serviceEn": "Service",
      "nav.contactEn": "Contact",
      "social.xiaohongshu": "샤오홍슈",
      "about.title": "이 사람은",
      "about.sub": "Nytsai",
      "about.lead1": "악보 조판가",
      "about.lead2": "도쿄예술대학 작곡과 졸업",
      "about.p1": "대학 재학 중부터 대형 악보 출판사에서 악보 제작을 시작했고, 2017년에 독립했습니다.",
      "about.p2": "악보 조판, 편집, 교정과 검수, DTP 등 판면 제작을 전문으로 합니다.",
      "works.label": "작품",
      "works.detail": "SEE DETAIL",
      "works.amazon": "Amazon",
      "works.soon": "기대해 주세요",
      "page.service": "서비스",
      "page.contact": "연락",
      "lang.aria": "언어 선택",
    },
  },
  roles: {
    "採譜・浄書を担当しました。": {
      zh: "负责采谱、净书。",
      "zh-Hant": "負責採譜、淨書。",
      en: "Transcription and engraving.",
      ja: "採譜・浄書を担当しました。",
      ko: "채보와 조판을 담당했습니다.",
    },
    "「The Dream of the Lambs」 の採譜＆楽譜浄書を担当しました。": {
      zh: "负责《The Dream of the Lambs》的采谱与净书。",
      "zh-Hant": "負責《The Dream of the Lambs》的採譜與淨書。",
      en: "Transcription and engraving for “The Dream of the Lambs.”",
      ja: "「The Dream of the Lambs」 の採譜＆楽譜浄書を担当しました。",
      ko: "「The Dream of the Lambs」의 채보와 조판을 담당했습니다.",
    },
    "「Baby,God Bless You」 の採譜を担当しました。": {
      zh: "负责《Baby, God Bless You》的采谱。",
      "zh-Hant": "負責《Baby, God Bless You》的採譜。",
      en: "Transcription of “Baby, God Bless You.”",
      ja: "「Baby,God Bless You」 の採譜を担当しました。",
      ko: "「Baby, God Bless You」의 채보를 담당했습니다.",
    },
    "《音楽の知識とピアノの技術が役立つ仕事》に記事が掲載されています。": {
      zh: "文章刊载于《音乐知识与钢琴技术有用的工作》。",
      "zh-Hant": "文章刊載於《音樂知識與鋼琴技術有用的工作》。",
      en: "Featured in “Work Where Music Knowledge and Piano Skill Matter.”",
      ja: "《音楽の知識とピアノの技術が役立つ仕事》に記事が掲載されています。",
      ko: "《음악 지식과 피아노 기술이 도움이 되는 일》에 기사가 실렸습니다.",
    },
    "アレンジ＆音源制作を担当しました。": {
      zh: "负责编曲与音源制作。",
      "zh-Hant": "負責編曲與音源製作。",
      en: "Arrangement and sound production.",
      ja: "アレンジ＆音源制作を担当しました。",
      ko: "편곡과 음원 제작을 담당했습니다.",
    },
    "採譜(ピアノ・オルガン)を担当しました。": {
      zh: "负责采谱（钢琴、管风琴）。",
      "zh-Hant": "負責採譜（鋼琴、管風琴）。",
      en: "Transcription (piano and organ).",
      ja: "採譜(ピアノ・オルガン)を担当しました。",
      ko: "채보(피아노·오르간)를 담당했습니다.",
    },
    "「独りんぼエンヴィー」 のアレンジ(上級)を担当しました。": {
      zh: "负责《独りんぼエンヴィー》高级编曲。",
      "zh-Hant": "負責《獨りんぼエンヴィー》高級編曲。",
      en: "Advanced arrangement of “Hitorinbo Envy.”",
      ja: "「独りんぼエンヴィー」 のアレンジ(上級)を担当しました。",
      ko: "「독린보 엔비」 상급 편곡을 담당했습니다.",
    },
    "採譜(ピアノ・オルガン・シンセ)を担当しました。": {
      zh: "负责采谱（钢琴、管风琴、合成器）。",
      "zh-Hant": "負責採譜（鋼琴、管風琴、合成器）。",
      en: "Transcription (piano, organ, and synth).",
      ja: "採譜(ピアノ・オルガン・シンセ)を担当しました。",
      ko: "채보(피아노·오르간·신디)를 담당했습니다.",
    },
    "一部楽曲のアレンジ＆音源制作を担当しました。": {
      zh: "负责部分曲目的编曲与音源制作。",
      "zh-Hant": "負責部分曲目的編曲與音源製作。",
      en: "Arrangement and sound production on selected tracks.",
      ja: "一部楽曲のアレンジ＆音源制作を担当しました。",
      ko: "일부 곡의 편곡과 음원 제작을 담당했습니다.",
    },
  },

  t(key) {
    const pack = this.strings[this.locale] || this.strings.zh;
    return pack[key] || this.strings.zh[key] || key;
  },

  workRole(work) {
    const row = this.roles[work.role];
    if (!row) return work.role;
    return row[this.locale] || row.ja || work.role;
  },

  apply() {
    const htmlLang = this.htmlLang[this.locale] || "zh-CN";
    document.documentElement.lang = htmlLang;
    document.documentElement.setAttribute("data-locale", this.locale);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = this.t(key);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", this.t(el.getAttribute("data-i18n-aria")));
    });
    const about = document.getElementById("about-copy");
    if (about) {
      if (this.locale === "ja") about.setAttribute("lang", "ja");
      else about.removeAttribute("lang");
    }
    const toggle = document.querySelector(".lang-toggle");
    if (toggle) toggle.setAttribute("aria-label", this.t("lang.aria"));
    const list = document.querySelector(".lang-list");
    if (list) list.setAttribute("aria-label", this.t("lang.aria"));
    if (App.works && App.works.relocalize) App.works.relocalize();
    if (App.era && App.era.relocalize) App.era.relocalize();
    if (App.lang && App.lang.markCurrent) App.lang.markCurrent();
  },

  set(locale) {
    if (!this.strings[locale]) return;
    this.locale = locale;
    try { localStorage.setItem(this.storageKey, locale); } catch (err) {}
    this.apply();
  },

  init() {
    let saved = "zh";
    try { saved = localStorage.getItem(this.storageKey) || "zh"; } catch (err) {}
    if (!this.strings[saved]) saved = "zh";
    this.locale = saved;
    this.apply();
  },
};

App.lang = {
  open: false,
  listH: 120,

  bind() {
    this.root = document.getElementById("lang");
    if (!this.root) return;
    this.toggle = this.root.querySelector(".lang-toggle");
    this.panel = this.root.querySelector(".lang-panel");
    this.list = this.root.querySelector(".lang-list");
    this.hintDown = this.root.querySelector(".lang-hint-down");
    this.hintBreathe = this.root.querySelector(".lang-hint-breathe");
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    App.i18n.locales.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-option";
      btn.setAttribute("data-locale", item.id);
      btn.textContent = item.name;
      if (item.id === App.i18n.locale) btn.setAttribute("aria-current", "true");
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        App.i18n.set(item.id);
        this.close();
      });
      this.list.appendChild(btn);
    });

    gsap.set(this.panel, { height: 0, autoAlpha: 0 });
    this.panel.setAttribute("aria-hidden", "true");
    gsap.set(this.hintDown, { autoAlpha: 0 });
    gsap.set(this.hintBreathe, { y: 0 });

    const toggleMenu = (event) => {
      event.stopPropagation();
      if (this.open) this.close();
      else this.openMenu();
    };
    this.root.addEventListener("click", (event) => event.stopPropagation());
    this.toggle.addEventListener("click", toggleMenu);

    document.addEventListener("click", () => {
      if (this.open) this.close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.open) this.close();
    });
    this.list.addEventListener("wheel", (event) => {
      event.stopPropagation();
      const max = this.list.scrollHeight - this.list.clientHeight;
      if (max <= 0) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      this.list.scrollTop = Math.max(0, Math.min(max, this.list.scrollTop + event.deltaY));
    }, { passive: false, capture: true });
  },

  markCurrent() {
    if (!this.list) return;
    this.list.querySelectorAll(".lang-option").forEach((btn) => {
      btn.toggleAttribute("aria-current", btn.getAttribute("data-locale") === App.i18n.locale);
    });
  },

  stopBreathe() {
    if (this.breatheTw) {
      this.breatheTw.kill();
      this.breatheTw = null;
    }
    if (this.hintBreathe) gsap.set(this.hintBreathe, { y: 0, opacity: 1 });
  },

  startBreathe() {
    this.stopBreathe();
    if (this.reduce || !this.hintBreathe) return;
    this.breatheTw = gsap.fromTo(this.hintBreathe, {
      y: 0,
      opacity: 0.22,
    }, {
      y: 2.2,
      opacity: 0.55,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  },

  openMenu() {
    this.open = true;
    this.root.classList.add("is-open");
    this.toggle.setAttribute("aria-expanded", "true");
    this.panel.setAttribute("aria-hidden", "false");
    const dur = this.reduce ? 0 : 0.48;
    if (this.tl) this.tl.kill();
    this.tl = gsap.timeline({
      defaults: { duration: dur, ease: "power2.inOut" },
    });
    this.tl.set(this.panel, { autoAlpha: 1 }, 0);
    this.tl.to(this.panel, { height: this.listH }, 0);
    this.tl.to(this.hintDown, {
      autoAlpha: 1,
      duration: this.reduce ? 0 : 0.28,
      ease: "power2.out",
    }, this.reduce ? 0 : 0.16);
    this.tl.add(() => this.startBreathe(), this.reduce ? 0 : 0.2);
  },

  close() {
    if (!this.open) return;
    this.open = false;
    this.root.classList.remove("is-open");
    this.toggle.setAttribute("aria-expanded", "false");
    const focused = this.root.querySelector(":focus");
    if (focused) focused.blur();
    this.stopBreathe();
    const dur = this.reduce ? 0 : 0.32;
    if (this.tl) this.tl.kill();
    this.tl = gsap.timeline({
      defaults: { duration: dur, ease: "power2.inOut" },
    });
    this.tl.to(this.hintDown, {
      autoAlpha: 0,
      duration: this.reduce ? 0 : 0.14,
      ease: "power2.in",
    }, 0);
    this.tl.to(this.panel, { height: 0 }, 0);
    this.tl.set(this.panel, { autoAlpha: 0 });
    this.tl.add(() => this.panel.setAttribute("aria-hidden", "true"));
  },
};
