(() => {
  'use strict';

  function init() {
    const root = document.documentElement;
    const all = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
    const readStorage = key => {
      try { return localStorage.getItem(key); } catch (_) { return null; }
    };
    const writeStorage = (key, value) => {
      try { localStorage.setItem(key, value); } catch (_) { /* Storage is optional. */ }
    };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listenMedia = (query, listener) => {
      if (query.addEventListener) query.addEventListener('change', listener);
      else if (query.addListener) query.addListener(listener);
    };
    let language = readStorage('keskin-lang') === 'tr' ? 'tr' : 'en';
    const storedTheme = readStorage('keskin-theme');
    let themePreference = ['light', 'dark'].includes(storedTheme) ? storedTheme : 'dark';
    const textFor = key => {
      const dictionary = window.KESKIN_COPY || {};
      return dictionary[language]?.[key] ?? dictionary.tr?.[key];
    };
    const setSelected = (element, selected) => {
      element.classList.toggle('is-selected', selected);
      element.dataset.selected = String(selected);
    };

    const exampleImage = document.getElementById('example-image');
    const exampleButtons = all('[data-example]');
    const mobileLanguageToggle = document.getElementById('mobile-language-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    let currentExample = exampleButtons.find(button => button.getAttribute('aria-pressed') === 'true')
      || exampleButtons[0] || null;

    function syncMobilePreferences() {
      if (mobileLanguageToggle) {
        const currentLanguage = mobileLanguageToggle.querySelector('[data-current-language]');
        if (currentLanguage) currentLanguage.textContent = language.toUpperCase();
        mobileLanguageToggle.setAttribute('aria-label', textFor('switchLanguage'));
      }
      if (mobileThemeToggle) {
        mobileThemeToggle.dataset.currentTheme = themePreference;
        mobileThemeToggle.setAttribute('aria-label', textFor(themePreference === 'dark' ? 'switchThemeLight' : 'switchThemeDark'));
      }
    }

    function applyLanguage(announce = false) {
      const scrollPosition = announce ? { left: window.scrollX, top: window.scrollY } : null;
      root.lang = language;
      all('[data-i18n]').forEach(element => {
        const value = textFor(element.dataset.i18n);
        if (typeof value === 'string') element.textContent = value;
      });
      all('[data-i18n-aria]').forEach(element => {
        const value = textFor(element.dataset.i18nAria);
        if (typeof value === 'string') element.setAttribute('aria-label', value);
      });
      all('[data-i18n-alt]').forEach(element => {
        const value = textFor(element.dataset.i18nAlt);
        if (typeof value === 'string') element.setAttribute('alt', value);
      });
      all('[data-set-lang]').forEach(button => {
        const selected = button.dataset.setLang === language;
        button.setAttribute('aria-pressed', String(selected));
        setSelected(button, selected);
      });
      const title = textFor('metaTitle');
      if (typeof title === 'string') document.title = title;
      if (menuToggle) menuToggle.setAttribute('aria-label', textFor(menuOpen ? 'menuClose' : 'menuOpen'));
      syncMobilePreferences();
      updateComparison();
      const exampleAlt = currentExample && textFor(currentExample.dataset.altKey);
      if (exampleImage && typeof exampleAlt === 'string') exampleImage.alt = exampleAlt;
      if (scrollPosition && !lockedScroll) {
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo({ ...scrollPosition, behavior: 'auto' });
        root.style.scrollBehavior = previousBehavior;
      }
      if (announce) window.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
    }

    function applyTheme() {
      const theme = themePreference;
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0e1c2b' : '#f5f8fc');
      all('[data-set-theme]').forEach(button => {
        const selected = button.dataset.setTheme === theme;
        button.setAttribute('aria-pressed', String(selected));
        setSelected(button, selected);
      });
      syncMobilePreferences();
    }

    all('[data-set-lang]').forEach(button => button.addEventListener('click', () => {
      if (!['tr', 'en'].includes(button.dataset.setLang)) return;
      language = button.dataset.setLang;
      writeStorage('keskin-lang', language);
      applyLanguage(true);
    }));
    all('[data-set-theme]').forEach(button => button.addEventListener('click', () => {
      if (!['light', 'dark'].includes(button.dataset.setTheme)) return;
      themePreference = button.dataset.setTheme;
      writeStorage('keskin-theme', themePreference);
      applyTheme();
    }));
    mobileLanguageToggle?.addEventListener('click', () => {
      language = language === 'en' ? 'tr' : 'en';
      writeStorage('keskin-lang', language);
      applyLanguage(true);
    });
    mobileThemeToggle?.addEventListener('click', () => {
      themePreference = themePreference === 'dark' ? 'light' : 'dark';
      writeStorage('keskin-theme', themePreference);
      applyTheme();
    });
    window.addEventListener('storage', event => {
      if (event.key === 'keskin-lang' || event.key === null) {
        language = readStorage('keskin-lang') === 'tr' ? 'tr' : 'en';
        applyLanguage(true);
      }
      if (event.key === 'keskin-theme' || event.key === null) {
        const value = readStorage('keskin-theme');
        themePreference = ['light', 'dark'].includes(value) ? value : 'dark';
        applyTheme();
      }
    });

    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const narrowMenu = window.matchMedia('(max-width: 980px)');
    let menuOpen = false;
    let lockedScroll = null;

    function lockPageScroll() {
      if (lockedScroll) return;
      const body = document.body;
      const properties = ['position', 'top', 'left', 'right', 'width', 'overflow'];
      lockedScroll = {
        left: window.scrollX,
        top: window.scrollY,
        styles: properties.map(property => [property, body.style.getPropertyValue(property), body.style.getPropertyPriority(property)])
      };
      body.style.position = 'fixed';
      body.style.top = `${-lockedScroll.top}px`;
      body.style.left = `${-lockedScroll.left}px`;
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
    }

    function unlockPageScroll() {
      if (!lockedScroll) return;
      const saved = lockedScroll;
      lockedScroll = null;
      saved.styles.forEach(([property, value, priority]) => {
        if (value) document.body.style.setProperty(property, value, priority);
        else document.body.style.removeProperty(property);
      });
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo({ left: saved.left, top: saved.top, behavior: 'auto' });
      root.style.scrollBehavior = previousBehavior;
    }

    function setMenu(open, restoreFocus = false) {
      if (!menuToggle || !mainNav) return;
      open = Boolean(open && narrowMenu.matches);
      const opening = open && !menuOpen;
      menuOpen = open;
      root.dataset.menuOpen = String(open);
      menuToggle.setAttribute('aria-label', textFor(open ? 'menuClose' : 'menuOpen'));
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.dataset.open = String(open);
      mainNav.dataset.open = String(open);
      if (opening) mainNav.scrollTop = 0;
      if (menuBackdrop) menuBackdrop.hidden = !open;
      if (open) lockPageScroll();
      else unlockPageScroll();
      if (restoreFocus) menuToggle.focus({ preventScroll: true });
    }
    if (menuToggle && mainNav) {
      menuToggle.setAttribute('aria-controls', mainNav.id);
      setMenu(false);
      menuToggle.addEventListener('click', () => {
        setMenu(!menuOpen);
        if (menuOpen) requestAnimationFrame(() => mainNav.querySelector('a')?.focus({ preventScroll: true }));
      });
      mainNav.addEventListener('click', event => {
        if (event.target.closest('a[href]')) setMenu(false);
      });
      menuBackdrop?.addEventListener('click', () => setMenu(false, true));
      document.addEventListener('keydown', event => {
        if (!menuOpen || !narrowMenu.matches) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          setMenu(false, true);
          return;
        }
        if (event.key !== 'Tab') return;
        const focusable = [...all('.header-controls button:not([disabled])'), ...all('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', mainNav)]
          .filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
        if (!focusable.length) return;
        const currentIndex = focusable.indexOf(document.activeElement);
        const nextIndex = currentIndex < 0 ? (event.shiftKey ? focusable.length - 1 : 0)
          : (currentIndex + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
        event.preventDefault();
        const next = focusable[nextIndex];
        next.focus({ preventScroll: next === menuToggle });
      });
      document.addEventListener('click', event => {
        if (menuOpen && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
      });
      listenMedia(narrowMenu, () => { if (!narrowMenu.matches) setMenu(false); });
    }

    function anchorTarget(anchor) {
      try {
        const url = new URL(anchor.href, location.href);
        if (url.origin !== location.origin || url.pathname !== location.pathname
          || url.search !== location.search || !url.hash || url.hash === '#') return null;
        return document.getElementById(decodeURIComponent(url.hash.slice(1)));
      } catch (_) { return null; }
    }
    function syncScrollBehavior() {
      root.style.scrollBehavior = reducedMotion.matches ? 'auto' : 'smooth';
    }
    document.addEventListener('click', event => {
      const anchor = event.target.closest('a[href]');
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey
        || event.shiftKey || event.altKey || anchor.hasAttribute('download')
        || (anchor.target && anchor.target !== '_self')) return;
      const target = anchorTarget(anchor);
      if (!target) return;
      event.preventDefault();
      const hash = new URL(anchor.href, location.href).hash;
      try {
        if (location.hash !== hash) history.pushState(null, '', hash);
      } catch (_) { /* The link still scrolls in restricted local previews. */ }
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex') && !target.matches('a, button, input, select, textarea')) {
        target.setAttribute('tabindex', '-1');
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
      target.focus({ preventScroll: true });
    });
    syncScrollBehavior();
    listenMedia(reducedMotion, syncScrollBehavior);

    const comparison = document.getElementById('comparison');
    const compareStage = document.getElementById('compare-stage');
    const compareRange = comparison?.matches('input[type="range"]')
      ? comparison : comparison?.querySelector('input[type="range"]');
    function updateComparison() {
      if (!compareRange || !compareStage) return;
      const min = Number(compareRange.min || 0);
      const max = Number(compareRange.max || 100);
      const value = Number(compareRange.value);
      const split = Math.max(min, Math.min(max, Number.isFinite(value) ? value : 50));
      compareStage.style.setProperty('--split', `${split}%`);
      const label = textFor('comparisonValue');
      compareRange.setAttribute('aria-valuetext', typeof label === 'string' ? label.replace('{value}', String(split)) : `${split}%`);
    }
    if (compareRange && compareStage) {
      let hintUsed = false;
      let hintVisible = false;
      let hintTimer = 0;
      let hintFrame = 0;
      let hintSplit = null;
      let hintObserver = null;

      function stopComparisonHint(keepPosition = true) {
        hintUsed = true;
        clearTimeout(hintTimer);
        cancelAnimationFrame(hintFrame);
        hintTimer = hintFrame = 0;
        hintObserver?.disconnect();
        compareStage.classList.remove('is-hinting');
        if (keepPosition && hintSplit !== null) compareRange.value = String(Math.round(hintSplit));
        hintSplit = null;
        updateComparison();
      }
      function startComparisonHint() {
        hintTimer = 0;
        if (hintUsed || !hintVisible || document.hidden || reducedMotion.matches) return;
        hintUsed = true;
        const original = Number(compareRange.value);
        const amplitude = Math.min(3, original - Number(compareRange.min), Number(compareRange.max) - original);
        const cycleDuration = 1400;
        const duration = cycleDuration * 2;
        let startedAt = null;
        compareStage.classList.add('is-hinting');
        function animateHint(now) {
          if (startedAt === null) startedAt = now;
          const elapsed = now - startedAt;
          if (elapsed >= duration) {
            compareRange.value = String(original);
            stopComparisonHint(false);
            return;
          }
          // Two gentle left/right gestures, each easing to rest at the centre.
          const phase = (elapsed % cycleDuration) / cycleDuration;
          const eased = (1 - Math.cos(Math.PI * phase)) / 2;
          hintSplit = original + Math.sin(eased * Math.PI * 2) * amplitude;
          compareStage.style.setProperty('--split', `${hintSplit}%`);
          hintFrame = requestAnimationFrame(animateHint);
        }
        hintFrame = requestAnimationFrame(animateHint);
      }
      function queueComparisonHint() {
        if (!hintUsed && !hintTimer && hintVisible && !document.hidden && !reducedMotion.matches) {
          hintTimer = window.setTimeout(startComparisonHint, 360);
        }
      }
      ['pointerdown', 'focus', 'keydown'].forEach(type => {
        compareRange.addEventListener(type, () => stopComparisonHint());
      });
      ['input', 'change'].forEach(type => {
        compareRange.addEventListener(type, () => stopComparisonHint(false));
      });
      if ('IntersectionObserver' in window && !reducedMotion.matches) {
        hintObserver = new IntersectionObserver(entries => {
          const entry = entries[0];
          hintVisible = entry.isIntersecting && entry.intersectionRatio >= 0.55;
          if (hintVisible) queueComparisonHint();
          else if (hintFrame) stopComparisonHint();
          else {
            clearTimeout(hintTimer);
            hintTimer = 0;
          }
        }, { threshold: [0, 0.55] });
        hintObserver.observe(compareStage);
      }
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && hintFrame) stopComparisonHint();
        else if (!document.hidden) queueComparisonHint();
      });
      window.addEventListener('languagechange', () => {
        if (hintFrame) stopComparisonHint();
      });
      listenMedia(reducedMotion, () => {
        if (reducedMotion.matches) stopComparisonHint();
      });
      updateComparison();
    }

    // Native details remains the no-script fallback and keeps keyboard activation.
    all('.faq-list details').forEach(details => {
      const summary = details.querySelector('summary');
      const answer = summary?.nextElementSibling;
      if (!summary || !answer || typeof details.animate !== 'function') return;

      let targetOpen = details.open;
      let heightAnimation = null;
      let answerAnimation = null;
      let resizeFrame = 0;

      const reflectState = () => {
        details.dataset.faqOpen = String(targetOpen);
        summary.setAttribute('aria-expanded', String(targetOpen));
      };

      const finish = () => {
        heightAnimation?.cancel();
        answerAnimation?.cancel();
        heightAnimation = null;
        answerAnimation = null;
        details.open = targetOpen;
        details.style.removeProperty('height');
        delete details.dataset.faqAnimating;
        reflectState();
      };

      const transition = nextOpen => {
        // Read the current rendered frame before cancelling a previous motion.
        // This keeps repeated taps and direction reversals continuous.
        const startHeight = details.getBoundingClientRect().height;
        const wasOpen = details.open;
        const answerStyle = wasOpen ? getComputedStyle(answer) : null;
        const startOpacity = answerStyle ? answerStyle.opacity : '0';
        const startTransform = answerStyle ? answerStyle.transform : 'translateY(-6px)';
        targetOpen = nextOpen;
        reflectState();
        heightAnimation?.cancel();
        answerAnimation?.cancel();
        heightAnimation = null;
        answerAnimation = null;

        if (reducedMotion.matches) {
          finish();
          return;
        }

        // Keep the answer rendered until closing finishes. Measure its natural
        // height each time, so translated text and resized screens never clip.
        details.open = true;
        details.style.height = 'auto';
        const frameStyle = getComputedStyle(details);
        const borderHeight = parseFloat(frameStyle.borderTopWidth) + parseFloat(frameStyle.borderBottomWidth);
        const endHeight = targetOpen
          ? details.getBoundingClientRect().height
          : summary.getBoundingClientRect().height + borderHeight;
        if (Math.abs(startHeight - endHeight) < 1) {
          finish();
          return;
        }

        details.dataset.faqAnimating = 'true';
        details.style.height = `${startHeight}px`;
        const duration = Math.min(420, Math.max(240, Math.abs(endHeight - startHeight) * 1.2 + 220));
        heightAnimation = details.animate(
          [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
          { duration, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' }
        );
        answerAnimation = answer.animate(
          [
            { opacity: startOpacity, transform: startTransform },
            { opacity: targetOpen ? 1 : 0, transform: targetOpen ? 'translateY(0)' : 'translateY(-6px)' }
          ],
          { duration: targetOpen ? duration : Math.min(220, duration), easing: 'ease-out', fill: 'both' }
        );
        const activeAnimation = heightAnimation;
        activeAnimation.onfinish = () => {
          if (heightAnimation === activeAnimation) finish();
        };
      };

      summary.addEventListener('click', event => {
        event.preventDefault();
        transition(!targetOpen);
      });
      details.addEventListener('toggle', () => {
        // Also reflect native openings such as browser find-in-page results.
        if (!heightAnimation) {
          targetOpen = details.open;
          reflectState();
        }
      });

      // Observe the content, rather than the animated outer box, to avoid a
      // resize feedback loop. Settled accordions always use natural height.
      if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(() => {
          if (!heightAnimation || resizeFrame) return;
          resizeFrame = requestAnimationFrame(() => {
            resizeFrame = 0;
            if (heightAnimation) transition(targetOpen);
          });
        });
        observer.observe(summary);
        observer.observe(answer);
      }
      listenMedia(reducedMotion, () => {
        if (reducedMotion.matches && heightAnimation) finish();
      });
      reflectState();
    });

    const evidenceTabs = all('[data-evidence-tab]');
    const evidenceTabList = evidenceTabs[0]?.closest('[role="tablist"]');
    const evidencePanels = document.querySelector('.evidence-panels');
    const panelFor = tab => {
      const controlled = tab.getAttribute('aria-controls');
      if (controlled) return document.getElementById(controlled);
      return all('[data-evidence-panel]').find(panel => panel.dataset.evidencePanel === tab.dataset.evidenceTab);
    };
    function syncEvidenceIndicator() {
      const selected = evidenceTabs.find(tab => tab.getAttribute('aria-selected') === 'true');
      if (!selected || !evidenceTabList) return;
      evidenceTabList.style.setProperty('--tab-x', `${selected.offsetLeft}px`);
      evidenceTabList.style.setProperty('--tab-width', `${selected.offsetWidth}px`);
    }
    if (evidenceTabList && evidencePanels) {
      const indicator = document.createElement('span');
      indicator.className = 'evidence-tab-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      evidenceTabList.append(indicator);
      evidenceTabList.classList.add('has-indicator');
      evidencePanels.classList.add('is-enhanced');
    }
    function selectEvidence(tab, focus = false) {
      evidenceTabs.forEach(button => {
        const selected = button === tab;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
        setSelected(button, selected);
        const panel = panelFor(button);
        if (panel) {
          panel.setAttribute('role', 'tabpanel');
          panel.tabIndex = selected ? 0 : -1;
          panel.setAttribute('aria-hidden', String(!selected));
          panel.inert = !selected;
          // Both panels share one grid cell, reserving enough space for either.
          // Inactive content is hidden from interaction and assistive tools.
          panel.hidden = evidencePanels ? false : !selected;
        }
      });
      syncEvidenceIndicator();
      if (focus) tab.focus();
    }
    evidenceTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectEvidence(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = evidenceTabs.length - 1;
        else if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % evidenceTabs.length;
        else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + evidenceTabs.length) % evidenceTabs.length;
        if (next === undefined) return;
        event.preventDefault();
        selectEvidence(evidenceTabs[next], true);
      });
    });
    if (evidenceTabs.length) {
      selectEvidence(evidenceTabs.find(tab => tab.getAttribute('aria-selected') === 'true') || evidenceTabs[0]);
      requestAnimationFrame(() => requestAnimationFrame(() => evidenceTabList?.classList.add('is-ready')));
      if ('ResizeObserver' in window) {
        const tabObserver = new ResizeObserver(syncEvidenceIndicator);
        evidenceTabs.forEach(tab => tabObserver.observe(tab));
        if (evidenceTabList) tabObserver.observe(evidenceTabList);
      } else window.addEventListener('resize', syncEvidenceIndicator, { passive: true });
      window.addEventListener('languagechange', syncEvidenceIndicator);
      document.fonts?.ready.then(syncEvidenceIndicator).catch(() => {});
    }

    const imagePromises = new Map();
    function loadImage(source) {
      if (!imagePromises.has(source)) {
        const promise = new Promise((resolve, reject) => {
          const image = new Image();
          image.decoding = 'async';
          image.onload = async () => {
            if (image.decode) { try { await image.decode(); } catch (_) { /* onload already confirmed the image. */ } }
            resolve(image);
          };
          image.onerror = () => reject(new Error('Image could not be loaded.'));
          image.src = source;
        });
        imagePromises.set(source, promise);
        promise.catch(() => imagePromises.delete(source));
      }
      return imagePromises.get(source);
    }
    const exampleFrame = exampleImage?.closest('.context-image-frame');
    const exampleScene = exampleFrame?.querySelector('.context-image-scene');
    function syncExampleFocus() {
      if (!exampleFrame || !exampleScene || !exampleImage) return;
      const width = exampleFrame.clientWidth, height = exampleFrame.clientHeight;
      if (!width || !height) return;
      const imageWidth = exampleImage.naturalWidth || 1536;
      const imageHeight = exampleImage.naturalHeight || 1024;
      const fit = Math.max(width / imageWidth, height / imageHeight);
      const zoom = 2.65;
      const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
      // Centre the small boat in the lower part of this illustrative image.
      // Clamp the pan so the image always covers the frame, at every aspect ratio.
      const x = clamp(-zoom * (0.594 - 0.5) * imageWidth * fit, width * (zoom - 1) / 2);
      const y = clamp(-zoom * (0.803 - 0.5) * imageHeight * fit, height * (zoom - 1) / 2);
      exampleScene.style.setProperty('--focus-x', `${x}px`);
      exampleScene.style.setProperty('--focus-y', `${y}px`);
    }
    function markExample(button) {
      exampleButtons.forEach(candidate => {
        const selected = candidate === button;
        candidate.setAttribute('aria-pressed', String(selected));
        setSelected(candidate, selected);
      });
      if (exampleFrame) exampleFrame.dataset.exampleView = button.dataset.example;
    }
    let exampleRequest = 0;
    if (exampleImage && currentExample) {
      markExample(currentExample);
      syncExampleFocus();
      exampleImage.addEventListener('load', syncExampleFocus);
      if ('ResizeObserver' in window && exampleFrame) {
        new ResizeObserver(syncExampleFocus).observe(exampleFrame);
      } else window.addEventListener('resize', syncExampleFocus, { passive: true });
    }
    exampleButtons.forEach(button => button.addEventListener('click', async () => {
      const source = button.dataset.src;
      if (!exampleImage || !source) return;
      const request = ++exampleRequest;
      if (button === currentExample) {
        exampleImage.removeAttribute('aria-busy');
        return;
      }
      try {
        // Both views use the same image: change the framing without reloading
        // or flashing it. Keep loading support if a future view uses a new file.
        if (new URL(source, document.baseURI).href !== exampleImage.src) {
          exampleImage.setAttribute('aria-busy', 'true');
          await loadImage(source);
          if (request !== exampleRequest) return;
          exampleImage.src = source;
        }
        currentExample = button;
        const alt = textFor(button.dataset.altKey);
        if (typeof alt === 'string') exampleImage.alt = alt;
        markExample(button);
      } catch (_) {
        if (request === exampleRequest) exampleImage.dispatchEvent(new CustomEvent('keskin:image-error', { bubbles: true }));
      } finally {
        if (request === exampleRequest) exampleImage.removeAttribute('aria-busy');
      }
    }));

    const pixelDraws = new Map();
    const pixelObserver = 'ResizeObserver' in window ? new ResizeObserver(entries => {
      entries.forEach(entry => pixelDraws.get(entry.target)?.());
    }) : null;
    all('canvas[data-pixelate]').forEach(canvas => {
      const context = canvas.getContext('2d');
      const source = canvas.dataset.source;
      if (!context || !source) return;
      const small = document.createElement('canvas');
      const smallContext = small.getContext('2d');
      if (!smallContext) return;
      let sourceImage = null;
      let drawFrame = 0;
      const draw = () => {
        drawFrame = 0;
        if (!sourceImage || !canvas.isConnected) return;
        const width = canvas.clientWidth, height = canvas.clientHeight;
        if (width <= 0 || height <= 0) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const desiredWidth = Math.max(1, Math.round(width * dpr));
        const desiredHeight = Math.max(1, Math.round(height * dpr));
        if (canvas.width !== desiredWidth) canvas.width = desiredWidth;
        if (canvas.height !== desiredHeight) canvas.height = desiredHeight;
        const pixelSize = Math.max(2, Number(canvas.dataset.pixelSize) || 14);
        small.width = Math.max(1, Math.round(width / pixelSize));
        small.height = Math.max(1, Math.round(height / pixelSize));
        const imageRatio = sourceImage.naturalWidth / sourceImage.naturalHeight;
        const frameRatio = width / height;
        let cropWidth = sourceImage.naturalWidth;
        let cropHeight = sourceImage.naturalHeight;
        if (canvas.dataset.fit !== 'fill') {
          if (imageRatio > frameRatio) cropWidth = cropHeight * frameRatio;
          else cropHeight = cropWidth / frameRatio;
        }
        smallContext.imageSmoothingEnabled = true;
        smallContext.drawImage(sourceImage, (sourceImage.naturalWidth - cropWidth) / 2,
          (sourceImage.naturalHeight - cropHeight) / 2, cropWidth, cropHeight, 0, 0, small.width, small.height);
        context.imageSmoothingEnabled = false;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(small, 0, 0, canvas.width, canvas.height);
      };
      const scheduleDraw = () => { if (!drawFrame) drawFrame = requestAnimationFrame(draw); };
      pixelDraws.set(canvas, scheduleDraw);
      pixelObserver?.observe(canvas);
      loadImage(source).then(image => { sourceImage = image; scheduleDraw(); }).catch(() => {
        canvas.classList.add('has-image-error');
      });
    });

    const navLinks = all('[data-nav]').filter(link => link.matches('a[href]'));
    const navEntries = navLinks.map(link => ({ link, target: anchorTarget(link) })).filter(entry => entry.target);
    const progress = document.getElementById('reading-progress');
    let scrollFrame = 0;
    function updateScroll() {
      scrollFrame = 0;
      const scrollingElement = document.scrollingElement || root;
      const available = Math.max(0, scrollingElement.scrollHeight - window.innerHeight);
      const fraction = available ? Math.min(1, Math.max(0, scrollingElement.scrollTop / available)) : 0;
      if (progress) progress.style.transform = `scaleX(${fraction})`;
      if (navEntries.length) {
        const trigger = Math.min(180, window.innerHeight * 0.28);
        let active = null;
        navEntries.forEach(entry => {
          if (entry.target.getBoundingClientRect().top <= trigger) active = entry.target;
        });
        if (available > 0 && scrollingElement.scrollTop >= available - 2) active = navEntries[navEntries.length - 1].target;
        navEntries.forEach(entry => {
          if (entry.target === active) entry.link.setAttribute('aria-current', 'location');
          else entry.link.removeAttribute('aria-current');
        });
      }
    }
    function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    window.addEventListener('resize', () => {
      scheduleScroll();
      pixelDraws.forEach(scheduleDraw => scheduleDraw());
      if (menuOpen && menuToggle && getComputedStyle(menuToggle).display === 'none') setMenu(false);
    }, { passive: true });
    window.addEventListener('load', scheduleScroll);
    window.addEventListener('hashchange', scheduleScroll);

    const roadmap = document.getElementById('roadmap');
    const roadSteps = all('.road-step');
    const roadOrbit = roadmap?.querySelector('.roadmap-orbit');
    roadSteps.forEach((step, index) => step.style.setProperty('--road-delay', `${index * 90}ms`));
    const revealRoadmap = () => {
      roadmap?.classList.add('is-roadmap-visible');
      roadSteps.forEach(step => step.classList.add('is-step-visible'));
    };
    if ('IntersectionObserver' in window && !reducedMotion.matches) {
      const roadObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          if (entry.target === roadOrbit) roadmap?.classList.add('is-roadmap-visible');
          else entry.target.classList.add('is-step-visible');
          roadObserver.unobserve(entry.target);
        });
      }, { threshold: 0.25, rootMargin: '0px 0px -24px 0px' });
      roadSteps.forEach(step => roadObserver.observe(step));
      if (roadOrbit) roadObserver.observe(roadOrbit);
      listenMedia(reducedMotion, () => {
        if (reducedMotion.matches) {
          revealRoadmap();
          roadObserver.disconnect();
        }
      });
    } else revealRoadmap();

    const reveals = all('.reveal');
    const animatedSections = all('.flow-section, #hero-scene');
    if ('IntersectionObserver' in window) {
      root.classList.add('js');
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
      reveals.forEach(element => {
        if (reducedMotion.matches) element.classList.add('is-visible');
        else revealObserver.observe(element);
      });
      const sceneObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-active');
          sceneObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      animatedSections.forEach(element => sceneObserver.observe(element));
      const navObserver = new IntersectionObserver(scheduleScroll, { threshold: [0, 0.15, 0.5, 1] });
      new Set(navEntries.map(entry => entry.target)).forEach(element => navObserver.observe(element));
      listenMedia(reducedMotion, () => {
        if (reducedMotion.matches) {
          reveals.forEach(element => element.classList.add('is-visible'));
          revealObserver.disconnect();
        }
      });
    } else {
      reveals.forEach(element => element.classList.add('is-visible'));
      animatedSections.forEach(element => element.classList.add('is-active'));
    }

    applyTheme();
    applyLanguage();
    updateScroll();
    if (document.fonts?.ready) document.fonts.ready.then(scheduleScroll).catch(() => {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
