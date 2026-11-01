# Hi there, Welcome to my space! 👋

这是我 (**yiaobang**) 的个人网站与在线作品集仓库。该项目不仅是我的数字名片，也是我记录旅行足迹和展示个人项目的聚集地。您可以通过访问 [yiaobang.github.io](https://yiaobang.github.io) 浏览在线版本。

## 💡 项目简介

本站点目前围绕两项内容展开：
- 🛫 **Travel (游记)**：记录我走过的地方，使用图文与画廊组件进行回顾。
- 💻 **SerialPortToolFX**：我的跨平台串口调试工具，可从首页直接跳转至 GitHub 仓库。

界面设计力求极简，原生支持多语言（中/日/英），并非常注重各种设备上的图片渲染和响应速度。

## 🛠 它是如何构建的？（技术架构）

虽然是一个轻量个人站点，但我选择了当下现代且高效的前端工具链进行开发：
- **核心环境**：React 19 + TypeScript 强类型支持
- **构建工具**：Vite + SWC (`@vitejs/plugin-react-swc`) 打造极速更新体感
- **页面路由**：React Router DOM v7 (采用 `HashRouter` 策略)
- **多语言适配**：基于 `i18next` 与 `react-i18next` 的动态翻译方案
- **自动化与性能优化**：内部使用了 Node.js 加上 `sharp` 图像处理库编写了批量转换 `.webp` 的脚本，有效减少图片带宽占用。
- **宿主与部署**：通过 `gh-pages` 配合 GitHub Pages 进行全静态分发。

## 🖼 图片资源分层

站点同时维护三套图片，运行时按用途各取所需：

| 目录 | 用途 | 规格 | 是否部署 |
| --- | --- | --- | --- |
| `originals/images/` | 原图，仅作为生成变体的输入 | 原始尺寸 | ❌ |
| `public/images-display/` | 灯箱大图 | 最长边 ≤1920 · WebP q76 | ✅ |
| `public/images-thumb/` | 列表与胶片条缩略图 | 360×260 cover · WebP q62 | ✅ |

原图刻意放在 `public/` 之外。原因很实在：Vite 会把 `public/` 整个复制进构建产物，
而运行时从来没请求过原图——它只会让每次部署凭空多出 470MB。移出之后，
`dist` 从 564MB 降到约 94MB，页面加载行为完全不变。

## 📝 新增一次游记

1. 照片放进 `originals/images/<序号>.<名称>/`
2. `npm run convert-webp` —— 转成 WebP 并重建 `public/data/photos.json`
3. `npm run optimize-images` —— 生成 display / thumb 两档变体（已存在的会跳过）
4. 在 `public/data/travels.json` 补一条记录，`id` 与文件夹序号保持一致，中/日/英各写一份文案
5. `npm run dev` 本地预览；`npm run deploy` 发布（会自动先构建）

## 🗺 架构巧思：关于路由 (HashRouter) 的选择

考虑到该项目完全托管在了只支持纯静态资源响应的 **GitHub Pages** 上，为了能够完美运行单页应用 (SPA) 且杜绝 404，本站点彻底抛弃了依赖后端的 `BrowserRouter`，全面采用了 **`<HashRouter>`** 作为路由分发器。

这意味着所有页面路径带上了 `#` 号前缀（例如：`yiaobang.github.io/#/travel`）。任何对页面的硬刷新或者直接链接访问请求都会先由服务器平稳返回 `index.html`，然后毫无障碍地交由我们的 React 客户端代码进行解析与切页，彻底解决静态环境路由乱窜的隐患。
