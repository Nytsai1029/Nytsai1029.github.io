window.App = window.App || {};

App.SERVICE_FIGURES = {
  score: {
    src: "images/service/engraving-img.webp",
    alt: "Music engraving",
    wide: true,
  },
  pavaneLogo: {
    src: "images/service/pavane-logo.webp",
    alt: "Pavane",
    ink: "light",
  },
  pavaneSample: {
    src: "images/service/pavane-img.webp",
    alt: "Pavane",
  },
};

App.SERVICE_EXT = {
  mayura: "https://www.mayura.app/",
};

App.SERVICE_LISTS = {
  engraving: [
    {
      label: "Piano Solo",
      items: [
        { name: "Pavane pour une infante défunte (Ravel) / 6mm", pdf: "pdf/service/pavane_6mm.pdf" },
        { name: "Pavane pour une infante défunte (Ravel) / 7mm", pdf: "pdf/service/pavane_7mm.pdf" },
        { name: "Gaspard de la nuit (Ravel)", pdf: "pdf/service/gaspard-de-la-nuit.pdf" },
      ],
    },
    {
      label: "Chamber Music",
      items: [
        { name: "Czardas (Monti)", pdf: "pdf/service/czardas.pdf" },
        { name: "String Quartet (Ravel)", pdf: "pdf/service/Ravel_StringQuartet.pdf" },
      ],
    },
    {
      label: "Orchestral Music",
      items: [
        { name: "La mer (Debussy)", pdf: "pdf/service/la-mer.pdf" },
      ],
    },
  ],
  production: [
    { name: "Piano Solo (Classical)", id: "445820487" },
    { name: "Violin + Piano (Classical)", id: "570450234" },
    { name: "String + Quartet (Classical)", id: "949597990" },
    { name: "String + Quartet (Classical)", id: "947602630" },
    { name: "Piano Concerto (Classical)", id: "945766366" },
  ],
  library: [
    "caxixi_01",
    "caxixi_02",
    "caxixi_03",
    "cheerhorn_01",
    "cheerhorn_02",
    "cheerhorn_03",
    "eat_snack_01",
    "ratchet_01",
    "ratchet_02",
    "ratchet_03",
    "ratchet_04",
    "ratchet_rit._01",
    "ratchet_rit._02",
    "s.cymb._01",
    "s.cymb._roll_01",
    "s.cymb._roll_02",
    "s.cymb._roll_03",
    "s.cymb._roll_04",
    "s.cymb._roll_05",
    "s.cymb._roll_06",
    "s.cymb._roll_07",
    "s.cymb._roll_08",
    "s.cymb._roll_09",
    "s.cymb._roll_10",
    "s.cymb._roll_11",
    "s.cymb._roll_12",
    "s.cymb._roll_13",
    "s.cymb._roll_14",
    "s.cymb._roll_15",
    "s.cymb._rub_01",
    "shaker(kinomi)_01",
    "shaker(kinomi)_02",
    "shaker(kinomi)_03",
    "snare_01",
    "snare_02",
    "snare_mute_01",
    "snare_roll_01",
    "snare_roll_02",
    "snare_roll_03",
    "tambourine_01",
    "tambourine_roll_01",
    "triangle_01",
    "triangle_02",
    "triangle_03",
    "triangle_roll_01",
    "triangle_roll_02",
    "w.chime_down_01",
    "w.chime_down_02",
    "w.chime_down_03",
    "w.chime_random_01",
    "w.chime_up_01",
    "w.chime_up_02",
    "w.chime_up_03",
  ],
};

App.SERVICE_COPY = {
  zh: {
    engraving: [
      {
        h: "〈 将乐谱从实用品升华为艺术品 〉",
        p: ["优秀的乐谱不仅具备功能性和可读性，更自然而然地展现出艺术的美感。我们秉承欧洲匠人构筑的制谱理论，提供无与伦比的最高品质乐谱。"],
        note: "使用软件: Finale + Illustrator",
        figure: "score",
      },
      {
        h: "〈 使用原创字体 〉",
        p: ["「要绘制出美丽的乐谱，就需要美丽的字体」。基于这一理念，我们独立开发了音乐符号字体“Pavane”。它的设计灵感来自于以优雅与华丽著称的孔雀。（本网站的乐谱均使用“Pavane”字体。）"],
        figures: ["pavaneLogo", "pavaneSample"],
      },
      {
        h: "〈 绘谱软件开发中 〉",
        p: ["目前使用 Finale 与 Illustrator 进行制谱。同时，我们也在开发自主的乐谱绘谱软件。"],
        ext: "mayura",
      },
      { h: "〈 绘谱样本 〉", groups: "engraving" },
      {
        h: "〈 绘谱雕版委托 〉",
        p: ["请通过联系页提交委托。估价免费，也会尽可能配合需求。欢迎随时咨询。"],
      },
    ],
    production: [
      { h: "Sample", streams: "production" },
    ],
    library: [
      { p: ["这是可以在 DTM 等中使用的采样素材（打击乐）。请随意使用。"] },
      { note: "Sample Quality: 44.1kHz / 24bit" },
      { note: "Data Format: wav" },
      { p: ["在手机和平板电脑上仅供试听。", "请从电脑下载后使用。"] },
      { list: "library" },
    ],
  },
  "zh-Hant": {
    engraving: [
      {
        h: "〈 將樂譜從實用品昇華為藝術品 〉",
        p: ["優秀的樂譜不僅具備功能性與可讀性，更自然而然地展現出藝術的美感。我們秉承歐洲匠人構築的製譜理論，提供無與倫比的最高品質樂譜。"],
        note: "使用軟體: Finale + Illustrator",
        figure: "score",
      },
      {
        h: "〈 使用原創字體 〉",
        p: ["「要繪製出美麗的樂譜，就需要美麗的字體」。基於這一理念，我們獨立開發了音樂符號字體「Pavane」。它的設計靈感來自以優雅與華麗著稱的孔雀。（本網站的樂譜均使用「Pavane」字體。）"],
        figures: ["pavaneLogo", "pavaneSample"],
      },
      {
        h: "〈 繪譜軟體開發中 〉",
        p: ["目前使用 Finale 與 Illustrator 進行製譜。同時，我們也在開發自主的樂譜繪譜軟體。"],
        ext: "mayura",
      },
      { h: "〈 繪譜樣本 〉", groups: "engraving" },
      {
        h: "〈 繪譜雕版委託 〉",
        p: ["請透過聯繫頁提交委託。估價免費，也會盡可能配合需求。歡迎隨時諮詢。"],
      },
    ],
    production: [
      { h: "Sample", streams: "production" },
    ],
    library: [
      { p: ["這是可以在 DTM 等使用的採樣素材（打擊樂）。請隨意使用。"] },
      { note: "Sample Quality: 44.1kHz / 24bit" },
      { note: "Data Format: wav" },
      { p: ["在手機和平板電腦上僅供試聽。", "請從電腦下載後使用。"] },
      { list: "library" },
    ],
  },
  en: {
    engraving: [
      {
        h: "〈 Practical Scores to Art 〉",
        p: ["Exceptional scores go beyond mere functionality and readability—they seamlessly embody artistic beauty. Following the engraving theories established by European craftsmen, we create unparalleled, high-quality scores."],
        note: "Software used: Finale + Illustrator",
        figure: "score",
      },
      {
        h: "〈 Using Original Fonts 〉",
        p: ["“Beautiful fonts are essential for creating beautiful scores.” With this belief in mind, we independently developed the musical symbol font “Pavane”, inspired by the elegance and grandeur of the peacock. (All scores on this website are created using “Pavane”.)"],
        figures: ["pavaneLogo", "pavaneSample"],
      },
      {
        h: "〈 Engraving Software in Development 〉",
        p: ["Scores are currently produced with Finale and Illustrator. In parallel, we are developing our own music engraving software."],
        ext: "mayura",
      },
      { h: "〈 Engraving Samples 〉", groups: "engraving" },
      {
        h: "〈 Music Engraving Request 〉",
        p: ["Please submit your request via the contact page. Estimates are free, and we will make every effort to meet your needs. Don’t hesitate to reach out."],
      },
    ],
    production: [
      { h: "Sample", streams: "production" },
    ],
    library: [
      { p: ["This is sampling material (percussion) that can be used in DTM and similar work. Feel free to use it."] },
      { note: "Sample Quality: 44.1kHz / 24bit" },
      { note: "Data Format: wav" },
      { p: ["Only preview is available on smartphones and tablets.", "Please download and use from a computer."] },
      { list: "library" },
    ],
  },
  ja: {
    engraving: [
      {
        h: "〈 楽譜を実用品から芸術品へ 〉",
        p: ["優れた楽譜は、機能性・可読性を満たすだけでなく、自ずと芸術的な美しさを醸し出します。ヨーロッパの職人が築き上げた浄書セオリーを踏襲し、他の追随を許さない最高品質の楽譜を提供します。"],
        note: "使用ソフト: Finale + Illustrator",
        figure: "score",
      },
      {
        h: "〈 独自のフォントを使用 〉",
        p: ["「美しい楽譜を表現するためには美しいフォントが必要」との考えから、音楽記号フォント“Pavane”を独自に開発。優美で華麗な姿で魅了する鳥「孔雀」から着想を得てデザインされました。（当ウェブサイトの楽譜は全て“Pavane”を使用しています。）"],
        figures: ["pavaneLogo", "pavaneSample"],
      },
      {
        h: "〈 浄書ソフトを開発中 〉",
        p: ["現行の浄書は Finale と Illustrator で行っています。並行して、自作の楽譜浄書ソフトを開発しています。"],
        ext: "mayura",
      },
      { h: "〈 浄書サンプル 〉", groups: "engraving" },
      {
        h: "〈 楽譜浄書のご依頼 〉",
        p: ["連絡ページからご依頼ください。お見積もりは無料で、ご要望にも可能な限り対応します。お気軽にご相談ください。"],
      },
    ],
    production: [
      { h: "Sample", streams: "production" },
    ],
    library: [
      { p: ["DTM等でご使用頂けるサンプリング素材（パーカッション）です。ご自由にお使いください。"] },
      { note: "Sample Quality: 44.1kHz / 24bit" },
      { note: "Data Format: wav" },
      { p: ["スマートフォン、タブレットからは試聴のみとなります。", "PCからダウンロードの上、ご使用ください。"] },
      { list: "library" },
    ],
  },
  ko: {
    engraving: [
      {
        h: "〈 악보를 실용품에서 예술품으로 〉",
        p: ["뛰어난 악보는 기능성과 가독성을 갖출 뿐 아니라, 예술적 아름다움을 스스로 드러냅니다. 유럽 장인이 쌓아 온 조판 이론을 따르며, 다른 곳이 따르지 못하는 최고 품질의 악보를 제공합니다."],
        note: "사용 소프트웨어: Finale + Illustrator",
        figure: "score",
      },
      {
        h: "〈 독자 폰트를 사용 〉",
        p: ["「아름다운 악보를 그리려면 아름다운 글꼴이 필요하다」는 생각에서 음악 기호 폰트 “Pavane”을 독자 개발했습니다. 우아하고 화려한 자태로 매혹하는 새, 공작에서 착상했습니다. (이 사이트의 악보는 모두 “Pavane”을 사용합니다.)"],
        figures: ["pavaneLogo", "pavaneSample"],
      },
      {
        h: "〈 조판 소프트웨어 개발 중 〉",
        p: ["현재 조판은 Finale와 Illustrator로 진행합니다. 그와 병행해 자체 악보 조판 소프트웨어를 개발하고 있습니다."],
        ext: "mayura",
      },
      { h: "〈 조판 샘플 〉", groups: "engraving" },
      {
        h: "〈 악보 조판 의뢰 〉",
        p: ["연락 페이지에서 의뢰해 주세요. 견적은 무료이며, 요청에도 가능한 한 응합니다. 편하게 상담해 주세요."],
      },
    ],
    production: [
      { h: "Sample", streams: "production" },
    ],
    library: [
      { p: ["DTM 등에 사용할 수 있는 샘플링 소재(타악기)입니다. 자유롭게 사용하세요."] },
      { note: "Sample Quality: 44.1kHz / 24bit" },
      { note: "Data Format: wav" },
      { p: ["스마트폰과 태블릿에서는 시청만 가능합니다.", "컴퓨터에서 다운로드한 뒤 사용해 주세요."] },
      { list: "library" },
    ],
  },
};
