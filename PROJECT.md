# Loky 个人网站 · 项目文档

> 最后更新：2026-10-09
> 本文档是项目的完整交接手册：架构、设计规范、部署方式、待办事项。
> 新会话/新协作者从这里开始。

---

## 一、项目概览

| 项 | 内容 |
|---|---|
| 站点 | Loky 的个人网站（品牌名 **Loky**，GitHub 账号 **Ribacha**，备案主体付凯璇） |
| 技术栈 | **Astro 5** 静态站（Node 20+，`npm install` / `npm run dev` / `npm run build`） |
| 域名 | **https://lokykkxx.cn**（正式入口，HTTPS 由服务器 Caddy 自动签发续期） |
| 托管 | 双通道：① **阿里云轻量服务器（主）** 杭州 106.14.136.194，Caddy 自动 HTTPS（ICP 备案 陕ICP备2026028229号 已通过，2026-10-09）② GitHub Pages（备份，ribacha.github.io） |
| 本地目录 | `/Users/Zhuanz/Documents/个人网站` |

---

## 二、站点结构（v14）

```
一级界面：/ 首页
   ├─ 首屏：哥特 LOKY 字标 + 满幅磨砂照片墙（Z 轴海浪）
   ├─ 个人身份（右侧 EVA-01 组装机甲位）/ 项目（左侧 EVA-02 侧身机甲位）/ 个人喜好 / 联系（板块）
   └─ 左侧刻度导航（scrollspy）管首页内部
        │
二级界面（右侧按钮 = 二级界面目录）：
   ├─ /blog/     博客（分类 → 列表 → 文章，三级）
   ├─ /projects/ 档案（项目完整档案卡）
   ├─ /about/    关于（简介 + 时间线 + Now）
   ├─ /uses/     装备（开发/效率/研究清单）
   ├─ /links/    友链（交换说明 + 占位）
   └─ /coffee/   请我喝咖啡（微信/支付宝收款码；入口在兴趣板块咖啡卡）
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

**身份面板机甲位**：右侧 EVA-01 头部（`src/assets/eva/eva01.jpg`，已裁剪并抹除水印）切成 5×5 装甲分片，滚动经过面板时分片从四周飞入逐块组装（核心先、外圈后，落位带橙光锁定闪光），进度由滚动位置驱动、可反向拆解；HUD 有状态灯（STANDBY/ASSEMBLING/ACTIVE）与 SYNC 同步率读数。全部在 `EvaAssembly.astro`；无 JS / prefers-reduced-motion 时直接呈现完整机体。

**项目面板机甲位**：左侧 EVA-02 半身机甲（`src/assets/eva/` 下 eva02.webp 为整图、`parts/` 为 12 个部件切片），**钉死视口最左侧的装饰**（非展示）：绝对定位 `left:0` + sticky 垂直居中跟随，`-8%` 左出血被 `overflow-x: clip` 裁掉（clip 而非 hidden，避免产生滚动容器破坏 sticky），内容区用 vw 计算的 padding-left 让位。**融合处理（防"生硬"，用户要求）**：①机甲区加右向渐隐 mask（黑到 80%、透明 99%——黑段必须盖住头部右缘 ~79%，朝内容溶解）；②装配期间显示淡色**图纸衬底**（eva02 整图 opacity 0.15 去饱和提亮，data-state=assembly 才可见，成型后淡出），碎片永远朝自己的剪影归位而非随机漂浮；③飞入距离/旋转整体收敛，小刀贴臂滑入不进内容区。**沿接缝线装配**：手工分析装甲线条，把机甲沿关节拆成 12 个多边形部件（226KB），按机械装配顺序（躯干起头→小刀压轴）各沿关节方向飞入归位，进度由整个项目板块驱动（sticky 元素自身不动）。刻度导航压在机甲上，靠深色 text-shadow 保持可读。≤960px 单栏堆叠（机甲→标题→卡片）。部件拆解定义在 `EvaFigure.astro` 的 PARTS 表（坐标为占画布百分比），改装配顺序/方向直接改表。

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
│   ├── EvaAssembly.astro     # 身份面板 EVA-01 滚动组装机甲位
│   ├── EvaFigure.astro       # 项目面板 EVA-02 无封装侧身机甲位（sticky+板块驱动）
│   ├── Identity/Projects/Hobbies/Contact.astro  # 首页面板
│   └── (LokyMark.astro 已废弃删除；Skills.astro 已删除)
├── pages/
│   ├── index.astro           # 首页
│   ├── projects|about|uses|links|coffee.astro   # 五个二级界面
│   └── blog/…                # 博客三级路由
├── content/blog/             # Obsidian 同步目标
├── lib/blog.ts               # 博客分类元数据
├── assets/wall/              # 照片墙图片（01-10）
├── assets/eva/               # eva01.jpg（EVA-01 裁剪去水印）/ eva02.webp + parts/（EVA-02 部件）
└── assets/coffee/            # wechat-qr / alipay-qr 收款码
```

---

## 五、部署方式（双通道）

| 通道 | 命令 | 说明 |
|---|---|---|
| **阿里云服务器（主）** | `./deploy.sh` | build + scp 到 106.14.136.194，秒级生效；**https://lokykkxx.cn 正式入口** |
| GitHub Pages（备份） | `git push` | Actions 自动构建，ribacha.github.io 可访问（网络走 SSH：`git push git@github.com:Ribacha/Ribacha.github.io.git main`） |

**服务器要点**：Caddy v2.10.2 在 `/usr/local/bin/caddy`；站点根 `/var/www/lokykkxx`；配置 `/etc/caddy/Caddyfile`（现役 = `Caddyfile.https`：lokykkxx.cn + www 自动 HTTPS，Let's Encrypt 自动签发续期，HTTP 308 跳转；原 HTTP 配置备份在 `Caddyfile.http`）；防火墙已放行 80/443/22；SSH 免密已配（`ssh root@106.14.136.194` 直连，本地代理挂掉时 SSH 仍可用）。

---

## 六、待办 / 悬而未决

1. ~~ICP 备案~~ ✅ 已通过（陕ICP备2026028229号，2026-10-09），解析已切阿里云、HTTPS 已由 Caddy 签发
2. ~~GitHub HTTPS 证书~~ 已无关紧要：主入口走阿里云 Caddy 自动证书；GitHub 上 ribacha.github.io 仍可用（可选：Settings → Pages 里移除自定义域名绑定）
3. **凪真实 App 图标**：AppIcon.appiconset 目前无图片；做好后把 PNG 放进项目并替换 Projects/projects 页的占位 SVG
4. **Uses 页内容**：当前为示意清单，需用户提供真实装备型号替换
5. **服务器密码**：初始密码已在聊天中出现，迁移收尾后建议在阿里云控制台改掉
6. **SearXNG 清理**（可选）：服务器预装的搜索应用在 8080/14449 端口，不需要可移除
7. **Obsidian 同步**：等第一批真实文章

---

## 七、历史决策（勿回退清单）

- 暗色主题（"眼前一黑"被否）→ EVA 深紫混合态 ✓
- 绿色、红色点缀（"太low""奇怪"被否）→ EVA 橙 ✓
- 几何 SVG 字标（"太丑"被否）→ 哥特 UnifrakturCook ✓
- 照片墙：Z 轴行进波推出（Y 轴浮动、随机起伏、半透明托架、横杠、花瓣 均被否）
- 首页板块顺序：身份 → **项目** → 技能 → 喜好 → 联系（项目在前）；**技能面板已整体删除（2026-10-03），skill 相关勿恢复**
- **身份面板右侧 = EVA-01 滚动组装机甲位（2026-10-03）**：素材取自用户提供图（网站素材/机甲组成.jpg），已裁头部+抹水印（保留画面里 EVA-01 大字）；滚动驱动非时间动画，组装可逆；LOKY/CTA 不浮动铁律不受影响
- **项目面板左侧 = EVA-02 无封装侧身机甲位（2026-10-03）**：素材（网站素材/机甲组成 2.jpg）经边缘泛洪抠黑底（保留机甲内部黑阴影）+ 分区清除画面英文/NERV/日文字 + **水平镜像**（放左侧面向内容，臂上 EVA-02 PROTO 小字随之镜像，属预期）；**沿装甲接缝线拆成 12 个多边形部件按机械顺序装配**（用户明确要求：不要方块分片、要贴死视口最左侧当装饰、可裁掉边缘一部分但别裁太多）；Projects 内容区右移让位、卡片单列纵排（勿恢复三列/居中容器）；sticky 进度必须由板块驱动（机甲自身不动）
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
