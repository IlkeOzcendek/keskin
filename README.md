<div align="center">
  <a href="https://ilkeozcendek.github.io/keskin/">
    <picture>
      <source media="(prefers-reduced-motion: reduce) and (max-width: 640px)" srcset="./assets/readme/keskin-hero-mobile-still.svg" />
      <source media="(prefers-reduced-motion: reduce)" srcset="./assets/readme/keskin-hero-still.svg" />
      <source media="(max-width: 640px)" srcset="./assets/readme/keskin-hero-mobile.svg" />
      <img src="./assets/readme/keskin-hero.svg" width="100%" alt="KESKİN — More detail. Better detection? An animated, illustrative radar scene with a resolution divider and detection brackets." />
    </picture>
  </a>
</div>

<p align="center">
  <strong>Improving Object Detection Performance in SAR Imagery<br />Using Super-Resolution Techniques</strong>
</p>

<p align="center">
  <a href="https://ilkeozcendek.github.io/keskin/"><strong>Explore the website</strong></a> &nbsp; · &nbsp;
  <a href="#the-research-question">Research</a> &nbsp; · &nbsp;
  <a href="#research-in-progress">Roadmap</a> &nbsp; · &nbsp;
  <a href="#the-keskin-team">Team</a>
</p>

## The research question

**Does a clearer image lead to better object detection?**

KESKİN investigates the relationship between **super-resolution** and **object detection** in synthetic aperture radar (SAR) imagery. We want to understand when additional image detail helps a detector find and locate objects, where it offers limited benefit, and what tradeoffs emerge.

Developed at **TED University** for **CMPE491 · 2026–27**, the project is currently at the proposal stage. This repository hosts its public website; research code and experimental results have not been published here yet.

## From imagery to evidence

<picture>
  <source media="(prefers-reduced-motion: reduce) and (max-width: 640px)" srcset="./assets/readme/research-flow-mobile-still.svg" />
  <source media="(prefers-reduced-motion: reduce)" srcset="./assets/readme/research-flow-still.svg" />
  <source media="(max-width: 640px)" srcset="./assets/readme/research-flow-mobile.svg" />
  <img src="./assets/readme/research-flow.svg" width="100%" alt="Proposed comparison: the same SAR input is evaluated through direct object detection and through super-resolution followed by detection. Both detection paths are compared; image quality is assessed separately." />
</picture>

1. **Prepare the data** — Review open SAR sources, select a suitable dataset, and define image pairs and the evaluation setup.
2. **Increase resolution** — Compare at least two deep learning super-resolution architectures, selected after the literature review.
3. **Detect objects** — Evaluate low-resolution and super-resolved inputs within the same detection evaluation setup.
4. **Measure the effect** — Examine image quality and detection performance separately, then report their relationship and limitations.

### Two perspectives, one research question

| Image quality | Object detection |
| :--- | :--- |
| How do detail and structure change? | Does that change help find and locate objects? |
| Compare outputs with reference imagery and selected quality measures. | Compare detection outcomes across the same evaluation setup. |

We are particularly interested in **small objects**, where useful detail is limited, and **busy scenes**, where nearby objects and complex backgrounds may make detection harder.

## Research in progress

| Stage | Focus | Status |
| :--- | :--- | :--- |
| **01 · Project proposal** | Research question, scope, and initial references | **In preparation** |
| **02 · Experiment design** | Dataset, architectures, and evaluation measures | Planned |
| **03 · Implementation** | Super-resolution and detection comparisons | Planned |
| **04 · Analysis & sharing** | Findings, limitations, and project outputs | Planned |

Dataset, model, and metric choices have not been finalized. No experimental results have been published. The website’s Documents section will host materials as they become available.

## The website

A visual introduction to the research, built with **HTML, CSS, JavaScript, and SVG** and published through **GitHub Pages**.

- **Explore the idea** with a draggable resolution comparison and separate image-quality and detection views.
- **Look closer** with animated small-detail and busy-scene exploration.
- **Follow the work** through the research roadmap, project archive, team, and questions.
- **Make it yours** with English/Turkish content, dark/light themes, and a responsive layout.

New visitors start in **English and dark mode**. The site remembers language and theme preferences, supports keyboard navigation, and respects reduced-motion settings.

<details>
<summary><strong>Take a look at the live website</strong></summary>
<br />
<a href="https://ilkeozcendek.github.io/keskin/">
  <img src="./assets/readme/website-preview.png" width="100%" alt="The KESKİN website in its default dark theme, showing the research question and an illustrative SAR comparison." />
</a>
</details>

<details>
<summary><strong>Run locally & navigate the source</strong></summary>

### Local preview

```bash
git clone https://github.com/IlkeOzcendek/keskin.git
cd keskin
```

Open `index.html` in your browser. No package installation or build step is required.

### Repository map

| File | Purpose |
| :--- | :--- |
| [`index.html`](index.html) | Page structure and research sections |
| [`content.js`](content.js) | English and Turkish content |
| [`styles.css`](styles.css) | Typography, themes, layout, and motion |
| [`app.js`](app.js) | Language, theme, menu, and interactive comparisons |
| [`assets/`](assets/) | Website imagery and favicon |
| [`assets/readme/`](assets/readme/) | Original animated SVGs and website preview |
| [`.nojekyll`](.nojekyll) | Static publishing configuration for GitHub Pages |

GitHub Pages publishes the root of `main`. Push website changes to that branch to update the live site; deployment progress appears in [Actions](https://github.com/IlkeOzcendek/keskin/actions).

The site uses Sora and Manrope from Google Fonts, with local fallback fonts. README illustrations are self-contained SVGs with no external font or animation service dependency.

</details>

<a name="the-keskin-team"></a>

## The KESKİN Team

| Busenur Arlı | İlke Özçendek | Zeynep Ersoy |
| :---: | :---: | :---: |
| Research team | Research team | Research team |

**Project adviser:** Prof. Dr. Gökçe Nur Yılmaz  
**TED University · CMPE491 · 2026–27**

<sub>The website’s radar-like harbor image is AI-generated. That image, the README illustrations, and the example detection boxes explain the research concept; they are not real SAR data, model outputs, or measured results.</sub>

<br /><br />

<a href="https://ilkeozcendek.github.io/keskin/">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="./assets/readme/follow-the-research-still.svg" />
    <img src="./assets/readme/follow-the-research.svg" width="100%" alt="Follow the research — visit the KESKİN website at ilkeozcendek.github.io/keskin." />
  </picture>
</a>
