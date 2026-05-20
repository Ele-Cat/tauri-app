# Tauri App

基于 Tauri + Vue3 的跨平台桌面应用模板。

## 技术栈

- **前端框架**: Vue 3 + Vite
- **UI 组件**: Element Plus
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **路由**: Vue Router
- **国际化**: vue-i18n
- **HTTP 请求**: Axios + Tauri HTTP 插件
- **桌面框架**: Tauri v2
- **图标**: Lucide Vue Next

## 环境要求

- Node.js >= 18
- Rust >= 1.70
- pnpm / npm

## 安装依赖

```bash
npm install
```

## 开发

### 前端开发（Vite 热重载）

```bash
npm run dev
```

### 完整应用开发（含 Tauri）

```bash
npm run tauri dev
```

## 打包

### 构建前端资源

```bash
npm run build
```

### 构建桌面应用

```bash
npm run tauri build
```

构建产物位于 `src-tauri/target/release/bundle/` 目录：

| 平台 | 目录 | 产物 |
|------|------|------|
| Windows | `nsis/` | NSIS 安装包 (.exe) |
| Windows | `msi/` | MSI 安装包 |
| Linux | `deb/` | DEB 安装包 |
| Linux | `appimage/` | AppImage |
| macOS | `dmg/` | DMG 安装包 |

## 发布

发布采用 GitHub Actions 自动构建流程。

### 发布流程

1. **更新版本号**（本地完成会自动同步到 GitHub）
   ```bash
   # 本地测试版本号
   # 发布时无需手动修改，Actions 会自动从 tag 读取
   ```

2. **创建 Git Tag**
   ```bash
   git tag v0.0.1
   git push origin v0.0.1
   ```

3. **GitHub Actions 自动构建**
   - 触发条件：推送 `v*` 格式的 tag
   - 自动构建 Windows、Linux、macOS 三个平台的安装包
   - 构建完成后自动创建 GitHub Release

### 发布产物

发布产物包含以下文件（以 v0.0.1 为例）：

| 文件名 | 说明 |
|--------|------|
| `tauri-app_0.0.1_x64-setup.exe` | Windows NSIS 安装包 |
| `tauri-app_0.0.1_x64.msi` | Windows MSI 安装包 |
| `tauri-app_0.0.1_x64.zip` | Windows 便携版 |
| `tauri-app_0.0.1_amd64.deb` | Linux DEB 安装包 |
| `tauri-app_0.0.1_amd64.AppImage` | Linux AppImage |
| `tauri-app_0.0.1_linux-x64.tar.gz` | Linux 压缩包 |
| `tauri-app_0.0.1_aarch64.dmg` | macOS DMG (Apple Silicon) |
| `tauri-app_0.0.1_macos-arm64.tar.gz` | macOS 压缩包 |

## 目录结构

```
tauri-app/
├── src/                    # 前端源码
│   ├── api/               # API 接口
│   ├── config/            # 配置文件
│   ├── i18n/              # 国际化语言包
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   ├── utils/             # 工具函数
│   └── views/             # 页面组件
├── src-tauri/             # Tauri 后端源码
│   ├── src/               # Rust 源码
│   ├── capabilities/      # 权限配置
│   ├── icons/             # 应用图标
│   └── tauri.conf.json    # Tauri 配置
└── package.json
```

## 其他

### 修改图标

准备一张 512x512 的 PNG 图标，放到 `src-tauri/icons/` 目录，然后运行：

```bash
cargo tauri icon 图标文件名.png
```

这会自动生成所有平台所需的图标文件。
