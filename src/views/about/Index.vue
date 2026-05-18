<template>
  <div class="about-page">
    <div class="about-container">
      <div class="logo-area">
        <div class="logo-ring">
          <img class="logo-img" src="@/assets/images/logo.png" alt="AI Auto Cut" />
        </div>
        <div class="logo-glow" />
      </div>

      <div class="title-area">
        <h1 class="app-title">{{ $t('app.title') }}</h1>
        <div class="version-badge">
          <span class="version-dot" />
          <span>v{{ version }}</span>
        </div>
      </div>

      <div class="divider">
        <span class="divider-line" />
        <span class="divider-icon">⚙</span>
        <span class="divider-line" />
      </div>

      <div class="about-footer">
        <span>{{ $t('about.copyright') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'About' })
import { version } from '../../../package.json'
</script>

<style lang="scss" scoped>
.about-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
  background: radial-gradient(ellipse at 50% 0%, var(--bg-color-secondary) 0%, var(--bg-color) 60%);

  .about-container {
    position: relative;
    z-index: 3;
    text-align: center;
    padding: 20px 40px 40px;
    max-width: 560px;
    width: 100%;
    animation: fadeInUp 0.6s ease-out;

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(64px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  .logo-area {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;

    .logo-ring {
      width: 88px;
      height: 88px;
      border: 2px solid rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.06), transparent 70%);
      animation: ringPulse 3s ease-in-out infinite;

      @keyframes ringPulse {
        0%, 100% { border-color: rgba(255, 255, 255, 0.12); }
        50% { border-color: rgba(255, 255, 255, 0.22); }
      }
    }

    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .logo-glow {
      position: absolute;
      inset: -20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(100, 120, 255, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }
  }

  .title-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .app-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: 4px;
    margin: 0 0 8px;
    text-shadow: 0 2px 20px rgba(100, 120, 255, 0.2);
  }

  .version-badge {
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 8px;
    padding: 4px 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    font-size: 12px;
    color: #7a8194;
    margin-bottom: 16px;

    .version-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 6px #4ade80;
      animation: blink 2s ease-in-out infinite;

      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    }
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--bg-color-tertiary), transparent);
    }

    .divider-icon {
      font-size: 14px;
      opacity: 0.4;
    }
  }

  .capabilities {
    margin-bottom: 16px;

    .cap-title {
      font-size: 11px;
      color: var(--text-color-secondary);
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    .cap-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;

      .cap-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: var(--bg-color-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        text-align: left;
        transition: all 0.2s;

        &:hover {
          background: var(--hover-bg);
          border-color: var(--primary-color);
          transform: translateY(-1px);
        }

        .cap-icon {
          flex-shrink: 0;
          color: var(--text-color);
        }

        .cap-info {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-color);
        }
      }
    }
  }

  .about-footer {
    font-size: 11px;
    color: var(--text-color-muted);
    letter-spacing: 1px;
  }
}
</style>
