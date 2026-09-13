# AGENTS.md

Nytsai Piano Sheets 站点设计语言。改 UI 时先对照这里，再动 `css/main.css`、`css/fonts.css` 与 `js/config.js`。运行时资源全部走仓库内静态文件，见「本地静态资源」。

站点是白底衬线、纵向滚动翻页的单页。不要引入无衬线字体、彩色强调或装饰性背景。

## 配色

只使用下面这些颜色。新色先加 CSS 变量，不要在组件里写散落的 hex。

| Token | 值 | 用途 |
| --- | --- | --- |
| `--ink` | `#161616` | 主文字、选中态、按钮 hover 填充 |
| `--dim` | `#7a7a7a` | 副标题、职责、日期、未选中目录、乐谱说明 |
| `--muted` | `#8d8d8d` | 首页社交链接（默认） |
| 版权灰 | `#b4b4b4` | 左下角 Copyright |
| 正文灰 | `#333333` | 简介正文 |
| 分割线 | `#c5c5c5` | 简介横线、按钮描边、首尾接缝竖线（接缝可用 `#b8b8b8`） |
| 页面底 | `#ffffff` | `html` / `body` / `#stage` |
| 滚动条 | `#e2e2e2` | thumb；track 为白 |

交互：链接与按钮默认继承文字色，hover 收到 `--ink`。作品按钮 hover 为 `--ink` 底 + 白字。不要加彩色 hover、渐变或阴影色块。

封面投影仅用 `rgba(22, 22, 22, 0.14)`。

## 字体

按语言分流，不要混用到错误语种上。

| 语言 | 字体 | 加载 |
| --- | --- | --- |
| 简体 | `"Noto Serif SC", "Songti SC", serif` | 本地 `fonts/web/noto-serif-sc-*.woff2`，400 |
| 繁体 | `"Noto Serif TC", "Songti TC", serif` | 本地 `fonts/web/noto-serif-tc-*.woff2`，400 |
| 韩文 | `"Noto Serif KR", serif` | 本地 `fonts/web/noto-serif-kr-*.woff2`，400 |
| 日文 | `"Ryumin Pro"`（`--jp`） | 本地 `fonts/RyuminPro-Light.woff2`、`RyuminPro-Medium.woff2` |
| 西文 / 数字 | `"Cormorant Garamond", "Times New Roman", serif` | 本地 `fonts/web/cormorant-garamond-*.woff2`，roman + italic，400 |

日文必须 `lang="ja"`，走 `:lang(ja) { font-family: var(--jp); }`。整页日文界面时给 `html` 设 `lang="ja"`。字重：正文 / 标题 400（Light 文件），需要稍重时 500（Medium）。不要用粗体标题。

界面语言在左下角 Language 菜单切换（`js/i18n.js`）：简体、繁体、English、日本語、한국어。选择写入 `localStorage` 的 `score-locale`。作品标题保持日文原名，职责等说明走翻译表。`Language` 标签本身保持英文。

Noto / Cormorant / Ryumin 都只放仓库内 woff2。`css/fonts.css` 不要改回 Google Fonts、Bunny 或其它 CDN。不要改 `@font-face` 去链到系统字体路径。

### 字号与字距

字重一律 400。标题用较大字距，正文用较小字距。

| 角色 | 字体 | 大约字号 | letter-spacing |
| --- | --- | --- | --- |
| 首页主标题 | 中文栈（实际为英文句） | `clamp(1.35rem, 3.1vw, 2.35rem)` | `0.14em` |
| 社交链接 | Cormorant italic | `clamp(0.82rem, 1.35vw, 1.05rem)` | `0.18em` |
| 简介主标题 | 中文 | `clamp(1.55rem, 2.3vw, 2.05rem)` | `0.14em` |
| 简介副标题 | Cormorant italic | `clamp(0.95rem, 1.3vw, 1.12rem)` | `0.18em` |
| 简介正文 | 中文 | `0.9rem` / 行高 `1.9` | `0.04em` |
| 乐谱说明 / 作品日期 | Cormorant | 说明 `0.78rem`，日期 `1.56rem` | `0.04em` |
| 作品日文标题 | Ryumin | `clamp(0.98rem, 1.45vw, 1.38rem)` | `0.04em`，**单行** `nowrap` |
| 作品职责 | Ryumin | `clamp(0.78rem, 1.05vw, 0.92rem)` | `0.06em` |
| 作品按钮 | Cormorant | `0.72rem` | `0.16em` |
| 目录中文 | 中文 | `1.22rem` | `0.2em` |
| 目录英文 | Cormorant | `0.62rem` | `0.18em` |
| 占位页大标题 | 中文 | `clamp(2rem, 4vw, 3.1rem)` | `0.32em` |
| Copyright | Cormorant | `0.68rem` | `0.08em` |

作品日文标题禁止折成两行。宁肯略缩小字号或字距，也不要换行。

## 版式

- 全屏钉住 `#stage`（`100vh`），页面之间用滚动驱动切换，不要做成独立路由。
- 背景永远是白。首页点阵网格是交互层，不是底纹色。
- 右侧目录 `#wheel` 占约 `10.95rem`（`right: 2.15rem` + `width: 8.8rem`）。作品页内容在目录左侧居中：`#works { left: 0; right: 10.95rem; }`。
- 目录从简介页起滑入，首页隐藏。中英双行、右对齐；未选项 `--dim`，当前项 `--ink`。
- Copyright 固定左下，不随翻页消失。
- 分割线是 1px 实线 `#c5c5c5`，不要用粗线或虚线。
- 作品按钮：细描边矩形，无圆角、无填充；hover 才填黑。

## 动效

动画只用已加载的 GSAP（core、ScrollTrigger、ScrollSmoother、Observer）。不要加 CSS 关键帧（首页箭头呼吸除外），不要加其它动画库。

- 翻页：`js/config.js` 的 `App.TIMING`，时间轴在 `js/timeline.js`。
- 作品切换：点击封面或左右滑动；**不要**用滚轮/纵向滚动切换作品，也不要 `preventDefault` 吃掉页面滚动。
- 作品文案交叉淡入：上一组淡出一半后再淡入下一组（`copyOverlap: 0.5`）。
- 画廊：中间最大，未选中缩小变淡；首尾相接处用灰色竖线，高度跟两侧较矮的那张图，贴在缝里，不要压在放大封面上。
- 尊重 `prefers-reduced-motion`。

## 结构

无打包器，经典 script 标签，可 `file://` 打开。全局 `window.App`。

| 路径 | 职责 |
| --- | --- |
| `css/main.css` | 视觉与布局；设计 token 写在 `:root` |
| `css/fonts.css` | Noto / Cormorant 本地 `@font-face`；不要改回 CDN |
| `js/config.js` | `TIMING` / `GALLERY` / `WHEEL` / `FRAME` |
| `js/i18n.js` | 文案与语言菜单 |
| `js/works-data.js` | 作品标题、职责、日期、封面、链接 |
| `js/vendor/` | GSAP 本地脚本，清单见「本地静态资源」 |
| `score-data.js` | 内联乐谱 SVG（`SCORE_SVG`） |
| `fonts/` | Ryumin Pro；`fonts/web/` 为 Noto / Cormorant |
| `images/works/` | 作品封面 jpg，顺序与 `App.WORKS` 一致 |
| `PROMPTS.md` | 用户需求原文，按时间追加 |

日文资源用 Ryumin；中文文案不要标 `lang="ja"`。不要为了「统一」把全站改成一种字体。

## 本地静态资源

页面可 `file://` 打开，也必须能在国内访问的 GitHub Pages 上打开。运行时加载的字体、封面、GSAP、乐谱数据都放仓库里，用相对路径。不要在 `index.html` 里加 Google Fonts、Bunny、jsDelivr、unpkg 或其它 CDN。

允许的外链只有作品按钮：`detail` → ymm.co.jp，`amazon` → amzn 短链。不要把商品页、封面图或字体再热链回去。

### 入口

`index.html` 只引本地文件，顺序不要改乱：

1. `css/fonts.css`（Noto / Cormorant `@font-face`）
2. `css/main.css`（Ryumin `@font-face`、布局）
3. `js/vendor/gsap.min.js` → `js/config.js` → `js/intro.js`（开场动画立刻开始）
4. `ScrollTrigger` / `ScrollSmoother` / `Observer`
5. `score-data.js` 与其余 `js/*.js`

### 字体文件

`@font-face` 必须指向这些 woff2，不要改成系统路径或远程 URL。字重只用表里有的：Noto / Cormorant 400，Ryumin 300/400 用 Light、500 用 Medium。

| 族 | 文件 | 声明位置 |
| --- | --- | --- |
| Ryumin Pro Light | `fonts/RyuminPro-Light.woff2` | `css/main.css`，weight 300 / 400 |
| Ryumin Pro Medium | `fonts/RyuminPro-Medium.woff2` | `css/main.css`，weight 500 |
| Cormorant Garamond 400 | `fonts/web/cormorant-garamond-latin-400.woff2` | `css/fonts.css` |
| Cormorant Garamond 400 italic | `fonts/web/cormorant-garamond-latin-400-italic.woff2` | `css/fonts.css` |
| Cormorant Garamond 400 latin-ext | `fonts/web/cormorant-garamond-latin-ext-400.woff2` | `css/fonts.css` |
| Cormorant Garamond 400 italic latin-ext | `fonts/web/cormorant-garamond-latin-ext-400-italic.woff2` | `css/fonts.css` |
| Noto Serif SC | `fonts/web/noto-serif-sc-400.woff2`、`fonts/web/noto-serif-sc-latin-400.woff2` | `css/fonts.css` |
| Noto Serif TC | `fonts/web/noto-serif-tc-400.woff2`、`fonts/web/noto-serif-tc-latin-400.woff2` | `css/fonts.css` |
| Noto Serif KR | `fonts/web/noto-serif-kr-400.woff2`、`fonts/web/noto-serif-kr-latin-400.woff2` | `css/fonts.css` |

Noto 的 latin 与 CJK 必须分开声明并带 `unicode-range`，否则西文字母不会落到 latin 文件上。缺字时把对应 woff2 放进 `fonts/web/`，再在 `css/fonts.css` 加一条 `@font-face`。

### GSAP

版本 **3.15.0**。只用 `js/vendor/` 这四份 UMD，与全局 `npm install -g gsap@3.15.0` 的 `dist/` 对齐。不要再引 `cdn.jsdelivr.net` / `cdnjs`。升级时先更新全局包，再覆盖这四份：

- `js/vendor/gsap.min.js`
- `js/vendor/ScrollTrigger.min.js`
- `js/vendor/ScrollSmoother.min.js`
- `js/vendor/Observer.min.js`

### 作品封面

`js/works-data.js` 的 `image` 必须是 `images/works/NN.jpg`（两位序号，与 `App.WORKS` 下标一致）。不要写 Amazon / 乐天图片 URL。加新作品时先把封面存进 `images/works/`，再写数据。

| 文件 | 作品 |
| --- | --- |
| `images/works/01.jpg` | 角野隼斗 ピアノ作品集 |
| `images/works/02.jpg` | 角野隼斗 10 levels of “I got rhythm” |
| `images/works/03.jpg` | まらしぃ V.I.P X |
| `images/works/04.jpg` | 加羽沢美濃 ディズニー・ベスト・セレクション |
| `images/works/05.jpg` | 公式楽譜集 映画『蜜蜂と遠雷』より |
| `images/works/06.jpg` | 極上のピアノ2018秋冬号 |
| `images/works/07.jpg` | 清塚信也 For Tomorrow |
| `images/works/08.jpg` | 月刊ピアノ 2017年12月号 |
| `images/works/09.jpg` | 月刊ピアノ 2017年11月号 |
| `images/works/10.jpg` | オカリナで吹く 演歌・歌謡曲～津軽海峡・冬景色～ |
| `images/works/11.jpg` | H ZETTRIO 『Beautiful Flight』 |
| `images/works/12.jpg` | 弾きこなす！ボーカロイド人気曲ランキング30 |
| `images/works/13.jpg` | H ZETTRIO『PIANO CRAZE』 |
| `images/works/14.jpg` | クロマチックハーモニカで吹く 歌謡曲・演歌 |
| `images/works/15.jpg` | オカリナで吹く デュエット・レパートリー～カントリー・ロード～ |
| `images/works/16.jpg` | オカリナで吹く イベントお役立ち定番曲集 |

乐谱 SVG 已内联在 `score-data.js`（`window.SCORE_SVG`），不要改回外链 svg 文件。

## 不要做

- 不要加品牌色、渐变、卡片底、毛玻璃、大圆角。
- 不要用系统默认无衬线（`-apple-system`、Inter、PingFang 作主字体）。
- 不要把日期、按钮、英文副标题改成 Noto / Ryumin。
- 不要自动轮播作品。
- 不要从 CDN 加载字体、封面或 GSAP；外链只留给作品的详情页 / Amazon。
- 不要提交后改 git 配置，也不要在未要求时提交。
