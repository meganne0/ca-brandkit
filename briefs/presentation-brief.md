# CyberArmor presentation brief

Fill this file out, then submit it in Cursor (or hand it to whoever builds the deck).  
A filled brief is enough to generate slides automatically — you do **not** need to know CSS or HTML.

**How to use**
1. Duplicate this file (e.g. `briefs/acme-q3-deck.md`) so the template stays clean.
2. Complete **Deck meta**, then add one `## Slide N` block per slide.
3. Pick a **layout** (`LY-##`) and **background** (`BG-##`) from the guides below — or leave blank and ask the builder to choose.
4. Fill only the fields that match your layout. Delete unused field lines.
5. Submit / attach the finished markdown.

**Preview the recipes**
- Hub: [index.html](../index.html)
- Slides: [slides.html](../slides.html) · [layouts.html](../layouts.html) · [backgrounds.html](../backgrounds.html)
- LinkedIn (optional section at bottom): [linkedin.html](../linkedin.html)

---

## Deck meta

```yaml
title:          # Working title for this deck
audience:       # Who sees it (execs, prospects, conference, internal, …)
goal:           # One sentence: what should they remember / do?
tone:           # e.g. confident, urgent, educational, technical
owner:          # Your name
date:           # YYYY-MM-DD
channel: slides # slides | linkedin | both
notes:          # Anything the builder should know
```

---

## Layout chooser (slides · 16:9)

Use this when you are not sure which `LY` to pick. Prefer the **suggested** layout; alternatives are fine.

| If your slide is mainly… | Use | Also good |
|--------------------------|-----|-----------|
| Opening title | **LY-01** Cover | — |
| Team / speakers | **LY-02** Team | — |
| Agenda / roadmap | **LY-03** TOC | LY-09 steps |
| New section opener (“01 Collection”) | **LY-04** Section | — |
| Pull-quote / big statement | **LY-05** Quote | LY-13 single line |
| Point + screenshot evidence | **LY-06** Insight + evidence | LY-07 (image left) |
| Screenshot-first story | **LY-07** Evidence + insight | LY-06 |
| Narrative + bullet list | **LY-08** Text + bullets | — |
| 3-step process | **LY-09** Three steps | LY-18–20 timeline |
| 4-step process | **LY-10** Four steps | — |
| One big number | **LY-11** Metric spotlight | — |
| 2–3 numbers in a row | **LY-12** Metrics row | — |
| Provocative single line | **LY-13** Single Line | LY-14 |
| Single line + short aside | **LY-14** Single Line with Sub-line | — |
| Hero image + title (centered) | **LY-15** Image title · center | LY-16 / LY-17 |
| Hero image + title (top) | **LY-16** Image title · top | allows bullets |
| Hero image + title (bottom) | **LY-17** Image title · bottom | — |
| Timeline begins (title left, first step right) | **LY-18** Timeline · start | — |
| Timeline middle (full width) | **LY-19** Timeline · full | — |
| Timeline ends (+ closing line) | **LY-20** Timeline · end | — |

### Backgrounds (slides)

Any `BG` can pair with any `LY`. If unsure, leave blank or use **BG-01**.

| ID | Look |
|----|------|
| BG-01 | Warm ember |
| BG-02 | Cool depth |
| BG-03 | Orange rise + swirl |
| BG-04 | Triple glow stack |
| BG-05 | Cool + ember mix |
| BG-06 | Swirl wash |
| BG-07 | Warm floor |
| BG-08 | Corner dual glow |
| BG-09 | Soft cool + ember |
| BG-10 | Banner swirl |
| BG-11 | Dotglow wash |
| BG-12 | Full glow field |

---

## Fields by layout (slides)

Copy only what you need into each slide block. Paths are relative to the brand kit root (e.g. `visual assets/screenshots/...`).

### LY-01 Cover
- `headline` (required) · `accent` (optional phrase inside headline to highlight orange) · `subtitle`

### LY-02 Team
- `sectionTitle` · `title` · `subtitle`
- `people` — list of `{ name, role, avatar }` (1–3)

### LY-03 TOC
- `sectionTitle` · `title` · `subtitle`
- `items` — list of `{ number, title, description }`

### LY-04 Section
- `number` · `sectionTitle` · `subtitle`

### LY-05 Quote
- `quote` · `attribution` (optional)

### LY-06 / LY-07 Split
- `number` · `sectionTitle` · `title` · `body` (or `subtitle`)
- `images` — list of screenshot paths · `alt` (optional)

### LY-08 Text + bullets
- `number` · `sectionTitle` · `title` · `body`
- `bullets` — list of strings

### LY-09 / LY-10 Steps
- `sectionTitle` · `title` · `subtitle`
- `steps` — list of `{ icon?, title, description }`  
  Icons are Phosphor names if you know them (e.g. `shield-check`); otherwise leave blank.

### LY-11 Metric spotlight
- `value` · `label` / `body` · `source` (optional)

### LY-12 Metrics row
- `metrics` — list of `{ value, label, source? }` (2–3)

### LY-13 Single Line
- `question`

### LY-14 Single Line with Sub-line
- `question` · `subtitle` (shown in brackets)

### LY-15 / LY-16 / LY-17 Image title
- `number` · `sectionTitle` · `title` · `subtitle`
- `image` — path · `alt`
- `bullets` — optional (best on LY-16)

### LY-18 / LY-19 / LY-20 Timeline
- `number` · `sectionTitle`
- `title` · `subtitle` — mainly for **LY-18**
- `startNumber` — continuing count (e.g. `2` after a start slide)
- `steps` — list of `{ title, description }`
- `closing` — **LY-20** only (right-side closing line)

---

## Slides

Duplicate a block per slide. Keep the `---` separators.

### Slide 1

```yaml
layout: LY-01          # required — see chooser above
background: BG-01      # optional
title_note: Cover      # optional label for builders

# --- content (match your layout) ---
headline: Identity threats start in the collection phase
accent: collection phase
subtitle: Proactive defense for credentials and identity assets — before the breach.
```

---

### Slide 2

```yaml
layout: LY-04
background: BG-04
title_note: Section opener

number: "01"
sectionTitle: Collection
subtitle: Before the breach, attackers assemble identity assets in the open.
```

---

### Slide 3

```yaml
layout:                # pick from chooser
background:
title_note:

# Paste the fields for your layout here
```

---

<!-- Add more ### Slide N blocks as needed -->

---

## Optional · LinkedIn assets

Only fill this if `channel` is `linkedin` or `both`.  
Square = 1080×1080 · Landscape = 1200×627.

### LinkedIn layout chooser

| Need | Use | Format |
|------|-----|--------|
| Hook / brand + headline | **LI-LY-01** | square · no footer |
| Clean quote panel | **LI-LY-02** | square |
| Big stat | **LI-LY-03** | square |
| CTA (logo on top, centered) | **LI-LY-04** | square · no footer |
| Wide headline banner | **LI-LY-05** | landscape |
| Split headline / body | **LI-LY-06** | landscape |
| Stat + context strip | **LI-LY-07** | landscape |
| Image left + copy | **LI-LY-08** | landscape |
| Copy + image right | **LI-LY-09** | landscape |
| Image left + label/title/body | **LI-LY-10** | landscape |
| Clean landscape quote | **LI-LY-11** | landscape |
| Quote + speaker photo | **LI-LY-12** | square |
| Landscape quote + speaker photo | **LI-LY-13** | landscape |

---

## YouTube thumbnails (1280×720)

Preview: [youtube.html](../youtube.html)

| Need | Use | Fields |
|------|-----|--------|
| Hook + 1–2 screenshots | **YT-01** | `hook` · `subline` · `accent?` · `shots[]` |
| Hook + process steps | **YT-02** | `hook` · `subline` · `steps[{label}]` (3–8) · optional host |
| Hook + left/right contrast | **YT-03** | `hook` · `subline` · `left` · `right` |
| Hook + big metric | **YT-04** | `hook` · `subline` · `metric{value,label}` |
| Hook + host portrait | **YT-05** | `hook` · `subline` · `host` · `role` · `avatar?` |
| Hook + host + shot | **YT-06** | `hook` · `subline` · `host` · `role` · `shots[0]` |
| Hook + single shot | **YT-08** | `hook` · `subline` · `shots[0]` |
| Hook + bullets | **YT-09** | `hook` · `subline` · `bullets[{label}]` |
| Hook + dual metrics | **YT-10** | `hook` · `subline` · `metrics[{value,label}]` |

Optional: `badge` — small orange sticker label above the hook

Backgrounds: **YT-BG-01…04** · Decor (optional): **YT-DX-01** matrix rain · **YT-DX-05** matrix rain dense · **YT-DX-02** matrix binary · **YT-DX-03** digital windows · **YT-DX-04** ripple mesh · **YT-DX-06** fake browser — stack over any YT-BG, under the layout


### YouTube posts

```yaml
layout: YT-01
bg: YT-BG-01
decor: YT-DX-01
hook: REMOTE ACCESS, HIJACKED
accent: HIJACKED
subline: Legitimate RMM used as the foothold
shots:
  - src: ...
    alt: ...
```

---

### LinkedIn backgrounds

| Square | Landscape |
|--------|-----------|
| LI-BG-01 Warm ember | LI-BG-05 Warm ember |
| LI-BG-02 Soft cool + ember | LI-BG-06 Soft cool + ember |
| LI-BG-03 Full glow field | LI-BG-07 Banner swirl |
| LI-BG-04 Orange rise + swirl | |

### LinkedIn posts

#### Post 1

```yaml
layout: LI-LY-01
background: LI-BG-01
format: square          # square | landscape — must match layout

headline: Identity threats start in the collection phase
accent: collection phase
subtitle: Proactive defense for credentials and identity assets — before the breach.
```

#### Post 2

```yaml
layout:
background:
format:

# Fields depend on layout — common ones:
# headline / title / subtitle / body / label / value / quote / attribution
# speaker / avatar / cta / placeholder / image
```

---

## Builder checklist (leave blank)

```yaml
status: draft            # draft | ready-to-build | built
generated_deck:          # path once built (e.g. index.html or a new deck file)
questions_for_author: []
```
