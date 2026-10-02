# Loky 个人网站实施方案

## 结论先行
- **托管**：Astro 静态站 → GitHub Pages，零服务器成本、免备案、自动 HTTPS
- **域名**：**kkxxloky.com 可注册**（查询已确认）。建议在阿里云/腾讯云注册 + 实名认证即可；因为网站托管在 GitHub 海外服务器上，**无需备案**。可选：同时注册 kkxxloky.cn 保护品牌（也已确认可注册）
- **视觉**：先搭结构与动画骨架（中性占位样式），**等你发送参考图片后**再按图完成视觉定稿

## 一、域名与部署链路
```
kkxxloky.com（阿里云/腾讯云注册 + 实名认证）
   └─ DNS: CNAME @ → ribacha.github.io（以及 www → ribacha.github.io）
        └─ GitHub 仓库 Ribacha.github.io
             └─ GitHub Actions 自动构建 Astro → GitHub Pages
                  └─ 绑定自定义域名 kkxxloky.com + 开启强制 HTTPS
```
- 需要你手动完成的只有两步：①注册 kkxxloky.com 并实名认证 ②DNS 控制台加两条 CNAME 记录（我会给出精确配置值）
- 其余（仓库创建、部署工作流、CNAME 文件）我在实施时完成

## 二、项目结构（Astro）
```
个人网站/
├── astro.config.mjs          # site: https://kkxxloky.com
├── package.json
├── public/
│   ├── CNAME                 # kkxxloky.com
│   └── favicon.svg
├── src/
│   ├── layouts/Base.astro    # 页面骨架 + View Transitions
│   ├── components/
│   │   ├── Sidebar.astro     # 侧边栏 + 唤出按钮
│   │   ├── Hero.astro        # 首屏大标题
│   │   ├── Identity.astro    # 个人身份面板
│   │   ├── Skills.astro      # 技能面板
│   │   ├── Projects.astro    # 项目面板（GitHub 项目卡片）
│   │   ├── Hobbies.astro     # 个人喜好面板
│   │   └── Contact.astro     # 联系方式面板
│   ├── pages/index.astro
│   └── styles/global.css
└── .github/workflows/deploy.yml   # 官方 withastro/action 部署
```

## 三、核心交互（按你的要求）
1. **侧边栏**：右上角固定侧边栏按钮，点击展开侧边栏（backdrop 毛玻璃遮罩 + 弹性过渡动画），分类导航：首页 / 个人身份 / 技能 / 项目 / 个人喜好 / 联系我；支持 Esc、点击遮罩、导航后自动关闭
2. **Apple 风格动画**（纯 CSS/JS，零重依赖）：
   - 滚动进入视口的渐入/上浮 reveal 动画（IntersectionObserver + stagger 错峰）
   - 大标题字符级渐入、面板滚动视差
   - 侧边栏 spring 弹性动画、按钮微交互
   - Astro View Transitions 页面级平滑过渡（为将来博客/子页面预留）
3. **面板内容**（数据来自你的 GitHub）：
   - 个人身份：Ribacha / Loky，iOS 开发（Objective-C++），计算机基础，AI/RAG 学习中
   - 项目：RAG-Agent、Spotify-Clone-Objective-C、oc-study 等项目卡片（外链 GitHub）
   - 个人喜好：蜘蛛侠、折腾工具、咖啡等（延续你 GitHub README 的幽默风格）
4. **响应式**：桌面 + 移动端自适应，中文为主

## 四、视觉设计（等你发图后进行）
- 骨架阶段使用中性占位样式（不设最终配色/字体）
- 你把参考图片拖进对话后，我按图定稿：配色、字体、面板质感、动画节奏

## 五、实施顺序
1. Astro 脚手架 + 配置（site 指向 kkxxloky.com）
2. Base 布局 + 侧边栏组件（按钮唤出、毛玻璃、分类导航）
3. 六个面板 + Apple 风动画
4. 本地 `npm run dev` 浏览器预览验证 + `npm run build` 构建验证
5. git init、创建 GitHub 仓库 `Ribacha.github.io`、推送、配置 Pages + 部署工作流
6. （你的操作）注册 kkxxloky.com → 实名 → 加 CNAME → GitHub Pages 绑定域名开 HTTPS

## 验证方式
- 本地浏览器打开预览：侧边栏开合、各面板滚动动画、移动端布局逐项目检
- 构建产物部署到 GitHub Pages 后，等域名生效后访问 kkxxloky.com 验证 HTTPS
