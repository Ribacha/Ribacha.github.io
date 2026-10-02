import { defineConfig } from 'astro/config';

// 部署目标：GitHub Pages 用户站点（Ribacha.github.io），自定义域名 lokykkxx.cn
// 仓库位于仓库根路径部署，无需配置 base
export default defineConfig({
  site: 'https://lokykkxx.cn',
});
