/**
 * LLM Wiki settings section — DSH WebUI client bundle (hand-written, no build step).
 *
 * Loaded by the browser module table as the `./client` export of the
 * `dsh-llm-wiki` bundle package (see dsh/package.json nested `dsh.client` +
 * `exports["./client"]`). Factory form only: registering work happens in
 * `apply()`, never at module top level.
 *
 * - React comes from the browser module table (`require('react')`).
 * - No Harness Client packages are imported (forbidden for plugins).
 * - Styling uses `var(--dsw-alias-*)` theme tokens + plain elements.
 * - Field keys mirror the Host `Config` schema (src/dsh/settings-ui.ts);
 *   namespace `llm-wiki` is the Host Loader row id.
 *
 * Locale is the DeepSeek Harness split, not one dictionary:
 * - Plugin-list title/description live in `locale/{en,zh}.json` (`meta.*`).
 *   `readPluginMeta` reads those files and never consults `ctx.locale`.
 * - Screen copy lives in `STRINGS` below and is registered with
 *   `ctx.locale.register("llm-wiki", { en, zh })`. The browser module table
 *   cannot `require` the JSON files, so the dictionaries are inlined.
 *   Slot entries set `locale: "llm-wiki"` and render with the framework `t`
 *   seat. Do not override `t` from `inject()` — that spread replaces the
 *   revision-keyed seat and language switches stop updating memoized children.
 *
 * DRAFT: assembled from the researched configForms/slots contract; NOT yet
 * verified against a live Harness. If `configForms` or the `settings.section`
 * slot is absent, apply() no-ops and settings remain editable via
 * /wiki-model, /wiki-trajectories, and settings files.
 */
window.__ModuleLoader__.load({
  id: "dsh-llm-wiki",
  factory(require) {
    const React = require("react");
    const h = React.createElement;
    const NS = "llm-wiki";
    const ENTRY = "llm-wiki";

    // UI_DICTIONARY_START
    const STRINGS = {
      en: {
        title: "LLM Wiki",
        subtitle: "Knowledge-base behavior for this profile.",
        save: "Save",
        discard: "Discard",
        close: "Close",
        unavailable: "Settings unavailable",
        overridden: " · overridden",
        on: "on",
        off: "off",
        sessionModel: "(session model)",
        "panel.subtitle": "Vault status, capabilities, and background jobs.",
        "panel.refresh": "Refresh",
        "panel.loading": "Loading wiki status…",
        "panel.noVault": "No wiki vault here yet.",
        "panel.noVaultHint": "Run /wiki-bootstrap <topic> in this project.",
        "panel.settingsHint": "Edit in Settings → LLM Wiki",
        "field.autoRecall.label": "Automatic recall",
        "field.autoRecall.hint": "Inject relevant wiki pages before each turn.",
        "field.notices.label": "UI notices",
        "field.notices.hint": "Show recall hits, reminders, and background reports.",
        "field.trajectories.label": "Agent trajectories",
        "field.trajectories.hint": "Opt-in working memory: capture, distill, and recall skills.",
        "field.taskModel.label": "Synthesis model",
        "field.taskModel.hint": "'provider/id'. Empty = session model.",
        "field.semanticWeight.label": "Semantic weight",
        "field.semanticWeight.hint": "0 = pure lexical recall.",
        "field.recallLinksThreshold.label": "Links-first threshold",
        "field.recallLinksThreshold.hint": "Page count above which recall returns links.",
        "field.ambientPersonalVault.label": "Ambient personal vault",
        "field.ambientPersonalVault.hint": "Recall from the personal vault outside projects.",
        "status.topic": "Topic",
        "status.mode": "Mode",
        "status.pages": "Pages",
        "status.health": "Health",
        "status.orphansGaps": "Orphans / Gaps",
        "status.updated": "Updated",
        "status.qmd": "QMD",
        "status.semantic": "Semantic",
        "status.jobs": "Jobs",
        "status.cwd": "Cwd",
        "status.flags": "Recall/Traj/Notices",
        "status.model": "Model",
        "status.tools": "Tools",
        "status.lastRecall": "Last recall",
        "status.background": "Background",
        "status.rawQueue": "Raw queue",
        "status.zeroBacklinks": "Zero backlinks",
        "status.stale": "Stale 30d+",
        "status.notice": "Notice",
        "status.unknown": "Unknown",
        "status.never": "Never",
        "status.none": "—",
        "status.pageCount": "{count} pages",
        "status.qmdValue": "{state} · {docs} docs · emb pending {pending}",
        "status.modePersonal": "personal",
        "status.modeCompany": "company",
        "status.healthEmpty": "🔴 Empty",
        "status.healthWarning": "⚠️ Warning",
        "status.healthGood": "✅ Good",
        "status.jobsAvailable": "available",
        "status.jobsMissing": "missing",
        "status.jobsUnknown": "unknown",
        "status.flagRecallOn": "recall:on",
        "status.flagRecallOff": "recall:off",
        "status.flagTrajOn": "traj:on",
        "status.flagTrajOff": "traj:off",
        "status.flagNoticesOn": "notices:on",
        "status.flagNoticesOff": "notices:off",
        "status.qmdReady": "ready",
        "status.qmdMissing": "missing",
        "status.qmdStale": "stale",
        "status.qmdRecovering": "recovering",
        "status.qmdError": "error",
        "notice.layoutFixed": "Personal wiki layout fixed: flattened {count} entries.",
        "notice.created": "Wiki created (topic pending).",
        "notice.blocked": "Wiki setup blocked (bootstrap).",
        "dock.backgroundStarted": "background {label} started",
        "dock.backgroundFailed": "background {label} failed",
        "dock.recalled": "recalled {count} page(s) for this task",
      },
      zh: {
        title: "LLM Wiki",
        subtitle: "此配置的知识库行为。",
        save: "保存",
        discard: "放弃",
        close: "关闭",
        unavailable: "设置不可用",
        overridden: " · 已修改",
        on: "开",
        off: "关",
        sessionModel: "（当前会话模型）",
        "panel.subtitle": "知识库状态、能力自检与后台任务。",
        "panel.refresh": "刷新",
        "panel.loading": "正在加载知识库状态…",
        "panel.noVault": "此处还没有知识库。",
        "panel.noVaultHint": "在此项目中运行 /wiki-bootstrap <topic>。",
        "panel.settingsHint": "在「设置 → LLM Wiki」中修改",
        "field.autoRecall.label": "自动召回",
        "field.autoRecall.hint": "每轮开始前注入相关知识库页面。",
        "field.notices.label": "界面提示",
        "field.notices.hint": "显示召回命中、提醒和后台报告。",
        "field.trajectories.label": "智能体轨迹",
        "field.trajectories.hint": "可选的工作记忆：采集、提炼与召回技能。",
        "field.taskModel.label": "合成模型",
        "field.taskModel.hint": "“provider/id”。留空则使用当前会话模型。",
        "field.semanticWeight.label": "语义权重",
        "field.semanticWeight.hint": "0 表示纯词法召回。",
        "field.recallLinksThreshold.label": "链接优先阈值",
        "field.recallLinksThreshold.hint": "页面数超过该值后，召回只返回链接。",
        "field.ambientPersonalVault.label": "个人库常驻",
        "field.ambientPersonalVault.hint": "在项目之外也从个人知识库召回。",
        "status.topic": "主题",
        "status.mode": "模式",
        "status.pages": "页面",
        "status.health": "健康度",
        "status.orphansGaps": "孤立页 / 缺口",
        "status.updated": "更新于",
        "status.qmd": "QMD",
        "status.semantic": "语义",
        "status.jobs": "任务",
        "status.cwd": "工作目录",
        "status.flags": "召回 / 轨迹 / 提示",
        "status.model": "模型",
        "status.tools": "工具",
        "status.lastRecall": "最近召回",
        "status.background": "后台",
        "status.rawQueue": "原始队列",
        "status.zeroBacklinks": "零反向链接",
        "status.stale": "超过 30 天未更新",
        "status.notice": "提示",
        "status.unknown": "未知",
        "status.never": "从未",
        "status.none": "—",
        "status.pageCount": "{count} 页",
        "status.qmdValue": "{state} · {docs} 篇文档 · 待嵌入 {pending}",
        "status.modePersonal": "个人",
        "status.modeCompany": "公司",
        "status.healthEmpty": "🔴 空",
        "status.healthWarning": "⚠️ 警告",
        "status.healthGood": "✅ 良好",
        "status.jobsAvailable": "可用",
        "status.jobsMissing": "缺失",
        "status.jobsUnknown": "未知",
        "status.flagRecallOn": "召回:开",
        "status.flagRecallOff": "召回:关",
        "status.flagTrajOn": "轨迹:开",
        "status.flagTrajOff": "轨迹:关",
        "status.flagNoticesOn": "提示:开",
        "status.flagNoticesOff": "提示:关",
        "status.qmdReady": "就绪",
        "status.qmdMissing": "缺失",
        "status.qmdStale": "过期",
        "status.qmdRecovering": "恢复中",
        "status.qmdError": "错误",
        "notice.layoutFixed": "个人知识库目录已展平，整理了 {count} 项。",
        "notice.created": "知识库已创建（主题待定）。",
        "notice.blocked": "知识库初始化被阻止。",
        "dock.backgroundStarted": "后台 {label} 已开始",
        "dock.backgroundFailed": "后台 {label} 失败",
        "dock.recalled": "已为本轮任务召回 {count} 页",
      },
    };
    // UI_DICTIONARY_END

    function fill(template, params) {
      if (!params) return template;
      return template.replace(/\{(\w+)\}/g, (match, name) =>
        Object.hasOwn(params, name) ? String(params[name]) : match,
      );
    }

    function tr(t, key, params) {
      if (!key) return "";
      if (typeof t === "function") {
        const translated = params ? t(key, params) : t(key);
        // A missing entry comes back as the key. English copy that is the
        // key itself ("on" → "on") misses this check and uses the dictionary.
        if (translated && translated !== key) return translated;
      }
      return fill(STRINGS.en[key] ?? key, params);
    }

    const PANEL_ID = "wiki-status";
    const SUMMARY_KEYS = new Set(["autoRecall", "notices", "trajectories", "taskModel"]);
    const HEALTH = {
      "🔴 Empty": "status.healthEmpty",
      "⚠️ Warning": "status.healthWarning",
      "✅ Good": "status.healthGood",
    };
    const JOBS = {
      available: "status.jobsAvailable",
      missing: "status.jobsMissing",
      unknown: "status.jobsUnknown",
    };
    const QMD_STATE = {
      ready: "status.qmdReady",
      missing: "status.qmdMissing",
      stale: "status.qmdStale",
      recovering: "status.qmdRecovering",
      error: "status.qmdError",
    };
    const MODES = { personal: "status.modePersonal", company: "status.modeCompany" };

    const FIELDS = [
      {
        key: "autoRecall",
        labelKey: "field.autoRecall.label",
        hintKey: "field.autoRecall.hint",
        type: "boolean",
      },
      {
        key: "notices",
        labelKey: "field.notices.label",
        hintKey: "field.notices.hint",
        type: "boolean",
      },
      {
        key: "trajectories",
        labelKey: "field.trajectories.label",
        hintKey: "field.trajectories.hint",
        type: "boolean",
      },
      {
        key: "taskModel",
        labelKey: "field.taskModel.label",
        hintKey: "field.taskModel.hint",
        type: "string",
      },
      {
        key: "semanticWeight",
        labelKey: "field.semanticWeight.label",
        hintKey: "field.semanticWeight.hint",
        type: "number",
      },
      {
        key: "recallLinksThreshold",
        labelKey: "field.recallLinksThreshold.label",
        hintKey: "field.recallLinksThreshold.hint",
        type: "number",
      },
      {
        key: "ambientPersonalVault",
        labelKey: "field.ambientPersonalVault.label",
        hintKey: "field.ambientPersonalVault.hint",
        type: "boolean",
      },
    ];

    function useForm(scope) {
      return React.useSyncExternalStore(
        (cb) => scope.subscribe(cb),
        () => scope.getSnapshot(),
      );
    }

    const rowStyle = { display: "flex", gap: 8, fontSize: 13 };
    const keyStyle = { color: "var(--dsw-alias-text-secondary, #888)", minWidth: 168 };
    const hintStyle = { color: "var(--dsw-alias-text-secondary, #888)" };

    function useStatusJson(url) {
      const [state, setState] = React.useState({ loading: true, data: null, error: null });
      const refresh = React.useCallback(() => {
        let cancelled = false;
        setState((s) => ({ ...s, loading: true, error: null }));
        fetch(url)
          .then((r) => r.json())
          .then((data) => {
            if (!cancelled) setState({ loading: false, data, error: null });
          })
          .catch((err) => {
            if (!cancelled) setState({ loading: false, data: null, error: String(err) });
          });
        return () => {
          cancelled = true;
        };
      }, [url]);
      React.useEffect(() => refresh(), [refresh]);
      return { ...state, refresh };
    }

    function boolOn(field, value) {
      return field.key === "trajectories" ? value === true : value !== false;
    }

    function modelText(t, value) {
      if (value == null || value === "" || value === "(session model)")
        return tr(t, "sessionModel");
      return String(value);
    }

    function mapped(t, value, table) {
      const key = table[value];
      return key
        ? tr(t, key)
        : value == null || value === ""
          ? tr(t, "status.none")
          : String(value);
    }

    function SettingsSummary(props) {
      const { scope, t } = props;
      const snap = useForm(scope);
      const value = snap?.value || {};
      return h(
        "div",
        { style: { display: "grid", gap: 4, fontSize: 13 } },
        ...FIELDS.filter((field) => SUMMARY_KEYS.has(field.key)).map((field) =>
          h(
            "div",
            { key: field.key, style: rowStyle },
            h("span", { style: keyStyle }, tr(t, field.labelKey)),
            h(
              "span",
              null,
              field.type === "boolean"
                ? tr(t, boolOn(field, value[field.key]) ? "on" : "off")
                : modelText(t, value[field.key]),
            ),
          ),
        ),
        h("small", { style: hintStyle }, tr(t, "panel.settingsHint")),
      );
    }

    function WikiStatusIcon(props) {
      const size = props?.size || 20;
      return h(
        "span",
        { style: { fontSize: size, lineHeight: 1 }, title: tr(props?.t, "title") },
        "🧠",
      );
    }

    function statusRows(t, data) {
      const st = data.status || {};
      const cap = st.capabilities || {};
      const qmd = st.qmd || {};
      const dash = data.dashboard || {};
      const ui = data.ui || {};
      const qmdState = QMD_STATE[qmd.state] ? tr(t, QMD_STATE[qmd.state]) : String(qmd.state ?? "");
      const notice = ui.setupCode
        ? tr(t, ui.setupCode, ui.setupParams || undefined)
        : ui.setupMessage;
      const background =
        ui.lastBackground ||
        (ui.background?.length
          ? `${ui.background[ui.background.length - 1].label} …`
          : tr(t, "status.none"));
      const pairs = [
        ["topic", tr(t, "status.topic"), st.topic ?? tr(t, "status.unknown")],
        ["mode", tr(t, "status.mode"), mapped(t, st.mode ?? "personal", MODES)],
        ["pages", tr(t, "status.pages"), st.totalPages ?? 0],
        ["health", tr(t, "status.health"), mapped(t, st.health ?? "", HEALTH)],
        ["orphans", tr(t, "status.orphansGaps"), `${st.orphans ?? 0} / ${st.gaps ?? 0}`],
        ["updated", tr(t, "status.updated"), st.lastUpdated || tr(t, "status.never")],
        [
          "qmd",
          tr(t, "status.qmd"),
          tr(t, "status.qmdValue", {
            state: qmdState,
            docs: qmd.totalDocuments ?? 0,
            pending: qmd.needsEmbedding ?? 0,
          }),
        ],
        [
          "semantic",
          tr(t, "status.semantic"),
          cap.semantic === "on" || cap.semantic === "off"
            ? tr(t, cap.semantic)
            : String(cap.semantic ?? "?"),
        ],
        ["jobs", tr(t, "status.jobs"), mapped(t, cap.jobs ?? "?", JOBS)],
        ["cwd", tr(t, "status.cwd"), cap.cwd ?? data.vaultRoot ?? ""],
        [
          "flags",
          tr(t, "status.flags"),
          [
            tr(t, cap.autoRecall ? "status.flagRecallOn" : "status.flagRecallOff"),
            tr(t, cap.trajectories ? "status.flagTrajOn" : "status.flagTrajOff"),
            tr(t, cap.notices === false ? "status.flagNoticesOff" : "status.flagNoticesOn"),
          ].join(" "),
        ],
        ["model", tr(t, "status.model"), modelText(t, ui.modelLabel || cap.taskModel)],
        ["tools", tr(t, "status.tools"), ui.toolCount ?? 0],
        [
          "recall",
          tr(t, "status.lastRecall"),
          ui.lastRecallCount == null
            ? tr(t, "status.none")
            : tr(t, "status.pageCount", { count: ui.lastRecallCount }),
        ],
        ["background", tr(t, "status.background"), background],
        ["raw", tr(t, "status.rawQueue"), dash.rawQueue ?? "?"],
        ["backlinks", tr(t, "status.zeroBacklinks"), dash.zeroBacklinks ?? "?"],
        ["stale", tr(t, "status.stale"), dash.staleCount ?? "?"],
      ];
      if (notice) pairs.push(["notice", tr(t, "status.notice"), notice]);
      return pairs.map(([key, label, value]) =>
        h(
          "div",
          { key, style: rowStyle },
          h("span", { style: keyStyle }, label),
          h("span", null, String(value)),
        ),
      );
    }

    function WikiStatusPanel(props) {
      const { scope, t } = props;
      const [cwd, setCwd] = React.useState(null);
      const url = `/wiki/status.json${cwd ? `?cwd=${encodeURIComponent(cwd)}` : ""}`;
      const { loading, data, error, refresh } = useStatusJson(url);
      let body = null;
      if (loading && !data) {
        body = h("div", null, tr(t, "panel.loading"));
      } else if (error || (data && data.ok === false)) {
        body = h(
          "div",
          { style: { display: "grid", gap: 4 } },
          h("div", null, tr(t, "panel.noVault")),
          h("small", { style: hintStyle }, tr(t, "panel.noVaultHint")),
        );
      } else if (data) {
        body = h("div", { style: { display: "grid", gap: 4 } }, ...statusRows(t, data));
      }
      return h(
        "div",
        { style: { padding: 16, display: "grid", gap: 12, maxWidth: 560 } },
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: 8 } },
          h("h2", { style: { margin: 0, fontSize: 16 } }, `🧠 ${tr(t, "title")}`),
          h("span", { style: { flex: 1 } }),
          h("button", { onClick: refresh }, tr(t, "panel.refresh")),
        ),
        h(
          "p",
          { style: { margin: 0, color: "var(--dsw-alias-text-secondary, #888)", fontSize: 12 } },
          tr(t, "panel.subtitle"),
        ),
        h(SettingsSummary, { scope, t }),
        data?.vaults && data.vaults.length > 1
          ? h(
              "div",
              { style: { display: "flex", gap: 4, flexWrap: "wrap", fontSize: 12 } },
              ...data.vaults.map((root) =>
                h(
                  "button",
                  {
                    key: root,
                    disabled: root === data.vaultRoot,
                    onClick: () => setCwd(root),
                    title: root,
                  },
                  String(root).split("/").pop() || root,
                ),
              ),
            )
          : null,
        body,
      );
    }

    function WikiDockLine(props) {
      const sid = props?.sessionId || props?.session?.id || null;
      const url = `/wiki/status.json${sid ? `?session=${encodeURIComponent(sid)}` : ""}`;
      const [line, setLine] = React.useState(null);
      React.useEffect(() => {
        let cancelled = false;
        let timer = null;
        const load = () => {
          fetch(url)
            .then((r) => r.json())
            .then((data) => {
              if (cancelled) return;
              const lines = data?.transient || [];
              setLine(lines.length ? lines[lines.length - 1] : null);
            })
            .catch(() => {
              if (!cancelled) setLine(null);
            });
        };
        load();
        timer = setInterval(load, 10000);
        return () => {
          cancelled = true;
          if (timer) clearInterval(timer);
        };
      }, [url]);
      if (!line) return null;
      const text = line.code ? tr(props?.t, line.code, line.params) : line.text;
      if (!text) return null;
      return h("div", { style: { fontSize: 12, ...hintStyle } }, `🧠 ${text}`);
    }

    function WikiSection(props) {
      const { close, scope, t } = props;
      const snap = useForm(scope);
      const [draft, setDraft] = React.useState(null);
      const dirty = draft !== null;

      const save = async () => {
        if (!draft) return;
        const entries = Object.entries(draft);
        for (const [k, v] of entries) {
          const ok = await scope.set(k, v === "" ? undefined : v);
          if (ok === false) break;
        }
        setDraft(null);
      };

      if (!snap || snap.status === "unavailable") {
        return h("div", { style: { padding: 24 } }, tr(t, "unavailable"));
      }
      const value = (draft ?? snap.value) || {};

      return h(
        "div",
        { style: { padding: 24, display: "grid", gap: 16, maxWidth: 640 } },
        h("h2", { style: { margin: 0, fontSize: 18 } }, tr(t, "title")),
        h("p", { style: { margin: 0, ...hintStyle } }, tr(t, "subtitle")),
        ...FIELDS.map((field) => {
          const current = value[field.key];
          const isDirty = dirty && field.key in draft;
          const hint = tr(t, field.hintKey);
          return h(
            "label",
            { key: field.key, style: { display: "grid", gap: 4 } },
            h("span", null, tr(t, field.labelKey), isDirty ? tr(t, "overridden") : ""),
            field.type === "boolean"
              ? h("input", {
                  type: "checkbox",
                  role: "switch",
                  "aria-checked": Boolean(current),
                  checked: Boolean(current),
                  disabled: !snap.writable,
                  onChange: (e) => setDraft({ ...(draft || {}), [field.key]: e.target.checked }),
                })
              : h("input", {
                  value: String(current ?? ""),
                  disabled: !snap.writable,
                  inputMode: field.type === "number" ? "numeric" : undefined,
                  placeholder: hint,
                  onChange: (e) =>
                    setDraft({
                      ...(draft || {}),
                      [field.key]:
                        field.type === "number" ? Number(e.target.value) : e.target.value,
                    }),
                }),
            h("small", { style: hintStyle }, hint),
          );
        }),
        h(
          "div",
          { style: { display: "flex", gap: 8 } },
          h("button", { disabled: !snap.writable || !dirty, onClick: save }, tr(t, "save")),
          h("button", { disabled: !dirty, onClick: () => setDraft(null) }, tr(t, "discard")),
          h("button", { onClick: close }, tr(t, "close")),
        ),
      );
    }

    function disposeAll(disposers) {
      return () => {
        for (const dispose of disposers.splice(0)) {
          try {
            if (typeof dispose === "function") dispose();
          } catch (_) {
            /* best effort */
          }
        }
      };
    }

    return {
      inject: ["slots", "locale", "configForms"],
      apply(ctx) {
        const disposers = [];
        const cleanup = () => disposeAll(disposers)();
        try {
          try {
            ctx.logger?.info?.("[llm-wiki] client apply: registering settings.section");
          } catch (_) {}
          const bound = ctx.locale?.bind ? ctx.locale.bind(NS) : null;
          if (ctx.locale?.register) {
            disposers.push(
              ctx.effect(() => ctx.locale.register(NS, STRINGS), "wiki-ui: dictionaries"),
            );
          }
          // Top-level Settings nav entries (Models, Agent presets, …) register
          // `settings.section` directly. `whileServed` is for `plugins.item`
          // cards inside Built-in plugins — gating the nav on it hid the page
          // entirely when the client finally loaded. Host Config still needs
          // `.volatile()` so describe serves values into configForms.get.
          if (!ctx.slots?.inject || !ctx.slots?.register) {
            try {
              ctx.logger?.warn?.("[llm-wiki] settings UI skipped: slots unavailable");
            } catch (_) {}
            return cleanup;
          }
          if (!ctx.configForms?.get) {
            try {
              ctx.logger?.warn?.("[llm-wiki] settings UI skipped: configForms unavailable");
            } catch (_) {}
            return cleanup;
          }
          const scope = ctx.configForms.get(ENTRY);
          // `locale: NS` installs the framework `t` seat. Do not also return
          // `t` from inject(); that spread replaces the revision-keyed seat.
          disposers.push(
            ctx.effect(
              () =>
                ctx.slots.inject("settings.section", () =>
                  ctx.slots.register(
                    {
                      name: "settings.section",
                      id: "wiki",
                      order: 60,
                      label: () => tr(bound, "title"),
                      locale: NS,
                      inject: () => ({ scope }),
                    },
                    WikiSection,
                  ),
                ),
              "wiki-ui: settings page",
            ),
          );
          // G1: sidebar status panel — icon in the panellist + keyed main
          // page. Root scope: no sessionId, so the panel reads the
          // last-active vault (host default) with a vault picker fallback.
          disposers.push(
            ctx.effect(
              () =>
                ctx.slots.inject("sidebar.panellist", () =>
                  ctx.slots.register(
                    {
                      name: "sidebar.panellist",
                      id: PANEL_ID,
                      order: 40,
                      label: () => tr(bound, "title"),
                      locale: NS,
                      inject: () => ({}),
                    },
                    WikiStatusIcon,
                  ),
                ),
              "wiki-ui: sidebar icon",
            ),
          );
          disposers.push(
            ctx.effect(
              () =>
                ctx.slots.inject("main", () =>
                  ctx.slots.register(
                    {
                      name: "main",
                      key: PANEL_ID,
                      label: () => tr(bound, "title"),
                      locale: NS,
                      inject: () => ({ scope }),
                    },
                    WikiStatusPanel,
                  ),
                ),
              "wiki-ui: status panel",
            ),
          );
          // G2: transient recall/background line near the composer (session
          // scope carries sessionId; renders nothing when notices are off).
          disposers.push(
            ctx.effect(
              () =>
                ctx.slots.inject("conversation.composer.dock", () =>
                  ctx.slots.register(
                    {
                      name: "conversation.composer.dock",
                      id: "wiki-dock",
                      order: 20,
                      locale: NS,
                      inject: () => ({}),
                    },
                    WikiDockLine,
                  ),
                ),
              "wiki-ui: composer dock",
            ),
          );
        } catch (err) {
          try {
            ctx.logger.warn(`[llm-wiki] settings UI failed: ${err.message}`);
          } catch (_) {
            /* best effort */
          }
        }
        return cleanup;
      },
    };
  },
});
