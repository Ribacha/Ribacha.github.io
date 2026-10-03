# Loky 个人网站 · 项目文档

> 最后更新：2026-10-03
> 本文档是项目的完整交接手册：架构、设计规范、部署方式、待办事项。
> 新会话/新协作者从这里开始。

---

## 一、项目概览

| 项 | 内容 |
|---|---|
| 站点 | Loky 的个人网站（品牌名 **Loky**，GitHub 账号 **Ribacha**） |
| 技术栈 | **Astro 5** 静态站（Node 20+，`npm install` / `npm run dev` / `npm run build`） |
| 域名 | **lokykkxx.cn**（阿里云注册，实名已完成；**无需备案即可指向海外托管**） |
| 托管 | 双通道：① GitHub Pages（仓库 `Ribacha.github.io`，Actions 自动部署）② 阿里云轻量服务器（杭州，106.14.136.194，已部署待接管） |
| 本地目录 | `/Users/Zhuanz/Documents/个人网站` |

---

## 二、站点结构（v14）

```
一级界面：/ 首页
   ├─ 首屏：哥特 LOKY 字标 + 满幅磨砂照片墙（Z 轴海浪）
   ├─ 个人身份 / 项目 / 技能 / 个人喜好 / 联系（板块）
   └─ 左侧刻度导航（scrollspy）管首页内部
        │
二级界面（右侧按钮 = 二级界面目录）：
   ├─ /blog/     博客（分类 → 列表 → 文章，三级）
   ├─ /projects/ 档案（项目完整档案卡）
   ├─ /about/    关于（简介 + 时间线 + Now）
   ├─ /uses/     装备（开发/效率/研究清单）
   └─ /links/    友链（交换说明 + 占位）
```

**导航职责分离**：左侧小字刻度导航（SectionRail）只管首页内部；右侧侧边栏只管二级界面入口。

**博客分类固定三种**：ios（iOS 手记）/ notes（技术笔记）/ essays（随笔），映射在 `src/lib/blog.ts`。
**Obsidian 同步**：markdown 丢进 `src/content/blog/<分类>/<slug>.md`，frontmatter：title/description/date/category/tags。

---

## 三、设计规范（EVA 风）

| 元素 | 规范 |
|---|---|
| 主背景 | 深浅紫混合态（body 渐变 `#150d26 → #332061`） |
| 强调色 | **EVA 橙 `#ff8c1a`**（唯一强调色；绿/红均被否） |
| 次级色 | 紫晕 `#b39dff` / `#8a6cf0` |
| 字标 | 哥特字体 **UnifrakturCook**（@fontsource），紫渐变 + 橙闪烁光标 |
| 图标风格 | 黑色圆角方块 + 彩色图形（App 图标风），**全部 SVG 手绘** |
| 层级色标 | 橙 = 二级界面，深紫细色带 = 一级界面（**纯颜色，无文字标注**） |
| 卡片 | 右上装甲切角（clip-path）+ 悬停刀光顶线 + 编号开头（**不用 emoji**） |

**交互铁律**：所有按钮/文字点击有弹动（press-bounce）；LOKY 与 CTA **严禁浮动/呼吸动画**（要"贴在上面"）。

**首页照片墙**：12 格无缝图片墙（`src/assets/wall/01-10`），底下立方体柱身，行进波扫过时图片沿 Z 轴被推出（`Z_POP`/`LIFT`/`WAVE_T` 常量在 Hero.astro）；相邻防重算法保证 8 邻域不同图。

---

## 四、关键文件地图

```
src/
├── layouts/Base.astro        # 全局骨架；secondary 属性 = 二级界面提示条
├── styles/global.css         # 全部颜色变量（:root）+ 弹动 + prose
├── components/
│   ├── Sidebar.astro         # 右侧按钮 = 二级界面目录（紫/橙信号）
│   ├── SectionRail.astro     # 左侧小字刻度导航（首页 scrollspy）
│   ├── Hero.astro            # 海浪照片墙 + 波浪算法（常量在脚本顶部）
│   ├── Emblem.astro          # 烙印纹章 SVG
│   ├── Identity/Skills/Projects/Hobbies/Contact.astro  # 首页面板
│   └── (LokyMark.astro 已废弃删除)
├── pages/
│   ├── index.astro           # 首页
│   ├── projects|about|uses|links.astro   # 四个二级界面
│   └── blog/…                # 博客三级路由
├── content/blog/             # Obsidian 同步目标
├── lib/blog.ts               # 博客分类元数据
└── assets/wall/              # 照片墙图片（01-10）
```

---

## 五、部署方式（双通道）

| 通道 | 命令 | 说明 |
|---|---|---|
| GitHub Pages | `git push` | Actions 自动构建（约 1-2 分钟生效）；域名 lokykkxx.cn 已绑定 |
| 阿里云服务器 | `./deploy.sh` | build + scp 到 106.14.136.194（Caddy 服务 caddy.service 常驻） |

**服务器要点**：Caddy v2.10.2 在 `/usr/local/bin/caddy`；站点根 `/var/www/lokykkxx`；配置 `/etc/caddy/Caddyfile`（当前 `auto_https off` 仅 80 端口）；SSH 免密已配（`ssh root@106.14.136.194` 直连）。

---

## 六、待办 / 悬而未决

1. **ICP 备案（最优先）**：阿里云「ICP 备案」控制台提交（身份证+人脸），审核 1-3 周。
   通过后三连：① 阿里云解析 A 记录 @/www → `106.14.136.194`（替换指向 GitHub 的记录）
   ② 删除 Caddyfile 中 `auto_https off` 行并重启 caddy（自动签 HTTPS）
   ③ 页脚加备案号（工信部要求，Contact.astro）
2. **GitHub HTTPS 证书**：绑定超 3 小时仍未签出（GitHub 慢速队列，最长 24h）。已不重要——迁移到服务器后由 Caddy 签发。若想手动：仓库 Settings → Pages → Enforce HTTPS。
3. **凪真实 App 图标**：AppIcon.appiconset 目前无图片；做好后把 PNG 放进项目并替换 Projects/projects 页的占位 SVG。
4. **Uses 页内容**：当前为示意清单，需用户提供真实装备型号替换。
5. **服务器密码**：初始密码已在聊天中出现，迁移收尾后建议在阿里云控制台改掉。
6. **SearXNG 清理**（可选）：服务器预装的搜索应用在 8080/14449 端口，不需要可移除。
7. **Obsidian 同步**：等第一批真实文章。

---

## 七、历史决策（勿回退清单）

- 暗色主题（"眼前一黑"被否）→ EVA 深紫混合态 ✓
- 绿色、红色点缀（"太low""奇怪"被否）→ EVA 橙 ✓
- 几何 SVG 字标（"太丑"被否）→ 哥特 UnifrakturCook ✓
- 照片墙：Z 轴行进波推出（Y 轴浮动、随机起伏、半透明托架、横杠、花瓣 均被否）
- 首页板块顺序：身份 → **项目** → 技能 → 喜好 → 联系（项目在前）
- 项目展示：仅 3 个精选（Spotify/凪/RAG），oc-study/KKxx 隐藏
- 层级提示：纯颜色（橙/深紫），"二级界面"字样已删
- 侧边栏 = 纯二级界面目录（首页锚点已移除，左侧 rail 独管）
- 凪卡片不外链：主仓库 dustPyrotechnic/Serenity 为**私有**（转公开后再加链接）

---

## 八、新会话快速上手

对本会话 AI 说"继续 Loky 网站"即可——项目记忆（memory）与本文件都在。
常见任务对应：

- 改内容/文案 → 对应 `src/components/*.astro`
- 换配色 → `src/styles/global.css` 的 `:root`
- 加博客文章 → `src/content/blog/<分类>/<slug>.md`
- 发新版 → `git push` + `./deploy.sh`
- 调海浪 → `Hero.astro` 的 `Z_AMP` / `WAVE_T` / `WAVE_K`
