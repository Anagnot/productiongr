"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

type FileKind = "pdf" | "doc";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];

function fileKindFor(name: string): FileKind | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) return "doc";
  return null;
}

type FileEntry = {
  name: string;
  size: string;
  tag: string;
  kind: FileKind;
};

type DefaultFileEntry = {
  name: string;
  size: string;
  tag: string;
  kind: string;
};

type FormState = {
  name: string;
  role: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  channel: string;
  customChannel: string;
  goal: string;
  productType: string;
  quantity: string;
  budget: string;
  materials: string[];
  sustainability: string;
  onShelfDate: string;
  delivery: string;
  installation: string;
  files: FileEntry[];
  notes: string;
  consent: boolean;
};

type Channel = { code: string; name: string; desc: string };
type Goal = { code: string; title: string; en: string; desc: string };
type Material = { code: string; name: string; desc: string; feat: boolean };

type QuoteStrings = {
  dateLocale: string;
  selectPlaceholder: string;
  h1Line1: string;
  h1Line2: string;
  ledePre: string;
  ledeStrong: string;
  ledePost: string;
  saveState: string;
  stepNames: string[];
  stepNow: string;
  stepLabelPrefix: string;
  channels: Channel[];
  goals: Goal[];
  materials: Material[];
  premiumLabel: string;
  step1: {
    eye: string;
    h2: string;
    p: string;
    name: string;
    namePh: string;
    role: string;
    rolePh: string;
    company: string;
    companyPh: string;
    industry: string;
    industryOptions: string[];
    email: string;
    emailPh: string;
    phone: string;
    phonePh: string;
  };
  step2: {
    eye: string;
    h2: string;
    pPre: string;
    pStrong: string;
    pPost: string;
    channelLabel: string;
    customChannelPh: string;
    goalLabel: string;
    productTypeLabel: string;
    productOptions: string[];
    quantityLabel: string;
    quantityOptions: string[];
    budgetLabel: string;
    budgetOptions: string[];
  };
  step3: {
    eye: string;
    h2: string;
    p: string;
    sustainabilityLabel: string;
    sustainabilityPh: string;
  };
  step4: {
    eye: string;
    h2: string;
    pPre: string;
    pStrong: string;
    pPost: string;
    dateLabel: string;
    urgencyLabel: string;
    urgency: {
      ontrack: string;
      tight: string;
      rush: string;
      none: string;
    };
    deliveryLabel: string;
    deliveryOptions: string[];
    installationLabel: string;
    installationOptions: string[];
  };
  step5: {
    eye: string;
    h2: string;
    p: string;
    dropzoneH6: string;
    dropzoneP: string;
    browse: string;
    formats: string;
    uploadedSuffix: string;
    rejectIntro: string;
    rejectType: string;
    rejectSize: string;
    notesLabel: string;
    notesPh: string;
    consentPre: string;
    consentLink: string;
    consentPost: string;
  };
  footer: {
    stepRemainingPre: string;
    stepRemainingMid: string;
    stepRemainingPost: string;
    back: string;
    next: string;
    submit: string;
  };
  submitAlert: string;
  sending: string;
  errorAlert: string;
  missingAlert: string;
  summary: {
    h5: string;
    items: { k: string; field: string }[];
    pending: string;
    filesCountSuffix: string;
    filesSingle: string;
    timeline: {
      title: string;
      onTrack: string;
      tight: string;
      rush: string;
      noDate: string;
      subtext: string;
      subtextTight: string;
      subtextRush: string;
      subtextNone: string;
      breakdown: { k: string; v: string }[];
      tagline: string;
    };
    marker: string;
  };
  defaults: {
    name: string;
    role: string;
    company: string;
    industry: string;
    email: string;
    phone: string;
    productType: string;
    quantity: string;
    budget: string;
    onShelfDate: string;
    delivery: string;
    installation: string;
    files: DefaultFileEntry[];
  };
};

type Props = {
  t: QuoteStrings;
};

const STEP_EST_MINS = [4, 2, 2, 1, 1];

// Client-only flag (SSR snapshot = false) — gates the date-driven delivery
// timeline so its "now"-relative output never causes a hydration mismatch.
const subscribeNoop = () => () => {};
const getClientTrue = () => true;
const getServerFalse = () => false;

export function QuoteWizard({ t }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    name: "",
    role: "",
    company: "",
    industry: "",
    email: "",
    phone: "",
    channel: "",
    customChannel: "",
    goal: "",
    productType: "",
    quantity: "",
    budget: "",
    materials: [],
    sustainability: "",
    onShelfDate: "",
    delivery: "",
    installation: "",
    files: [],
    notes: "",
    consent: false,
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "missing"
  >("idle");

  const isClient = useSyncExternalStore(
    subscribeNoop,
    getClientTrue,
    getServerFalse,
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMaterial(code: string) {
    setForm((prev) => ({
      ...prev,
      materials: prev.materials.includes(code)
        ? prev.materials.filter((m) => m !== code)
        : [...prev.materials, code],
    }));
  }

  function removeFile(name: string) {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.name !== name),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 5) void submitBrief();
  }

  function next() {
    if (step < 5) setStep(step + 1);
    else void submitBrief();
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  const goalLabel = useMemo(
    () => t.goals.find((g) => g.code === form.goal)?.title ?? "—",
    [form.goal, t.goals],
  );
  const channelLabel = useMemo(() => {
    if (form.channel === "YC") {
      return (
        form.customChannel.trim() ||
        t.channels.find((c) => c.code === "YC")?.name ||
        "—"
      );
    }
    return t.channels.find((c) => c.code === form.channel)?.name ?? "—";
  }, [form.channel, form.customChannel, t.channels]);
  const materialsLabel = useMemo(() => {
    if (form.materials.length === 0) return null;
    return form.materials
      .map((c) => t.materials.find((m) => m.code === c)?.name)
      .filter(Boolean)
      .join(", ");
  }, [form.materials, t.materials]);

  const onShelfDateLabel = useMemo(() => {
    if (!form.onShelfDate) return null;
    try {
      const d = new Date(form.onShelfDate);
      return d.toLocaleDateString(t.dateLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return form.onShelfDate;
    }
  }, [form.onShelfDate, t.dateLocale]);

  async function submitBrief() {
    if (status === "sending" || status === "success") return;
    if (
      form.name.trim() === "" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())
    ) {
      setStatus("missing");
      setStep(1);
      return;
    }
    setStatus("sending");
    const summaryLabel = (field: string) =>
      t.summary.items.find((it) => it.field === field)?.k ?? field;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: "quote",
          name: form.name,
          email: form.email,
          fields: [
            [t.step1.name, form.name],
            [t.step1.role, form.role],
            [t.step1.company, form.company],
            [t.step1.industry, form.industry],
            [t.step1.email, form.email],
            [t.step1.phone, form.phone],
            [t.step2.channelLabel, channelLabel === "—" ? "" : channelLabel],
            [t.step2.goalLabel, goalLabel === "—" ? "" : goalLabel],
            [t.step2.productTypeLabel, form.productType],
            [t.step2.quantityLabel, form.quantity],
            [t.step2.budgetLabel, form.budget],
            [summaryLabel("materials"), materialsLabel ?? ""],
            [t.step3.sustainabilityLabel, form.sustainability],
            [t.step4.dateLabel, onShelfDateLabel ?? ""],
            [t.step4.deliveryLabel, form.delivery],
            [t.step4.installationLabel, form.installation],
            [
              summaryLabel("files"),
              form.files.map((f) => `${f.name} (${f.size})`).join(", "),
            ],
            [t.step5.notesLabel, form.notes],
          ],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // Traffic-light delivery timeline, computed backward from the chosen
  // installation date: >=10 wks → on track, 7–10 wks → tight, <7 wks → rush.
  const timeline = useMemo(() => {
    const tl = t.summary.timeline;
    const target = form.onShelfDate ? new Date(form.onShelfDate) : null;
    if (!isClient || !target || Number.isNaN(target.getTime())) {
      return {
        status: "none" as const,
        headline: tl.noDate,
        subtext: tl.subtextNone,
        urgency: t.step4.urgency.none,
      };
    }
    const weeks =
      (target.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7);
    const dateStr = onShelfDateLabel ?? form.onShelfDate;
    if (weeks >= 10) {
      return {
        status: "ontrack" as const,
        headline: tl.onTrack.replace("{date}", dateStr),
        subtext: tl.subtext,
        urgency: t.step4.urgency.ontrack,
      };
    }
    if (weeks >= 7) {
      return {
        status: "tight" as const,
        headline: tl.tight.replace("{date}", dateStr),
        subtext: tl.subtextTight,
        urgency: t.step4.urgency.tight,
      };
    }
    return {
      status: "rush" as const,
      headline: tl.rush,
      subtext: tl.subtextRush,
      urgency: t.step4.urgency.rush,
    };
  }, [
    isClient,
    form.onShelfDate,
    onShelfDateLabel,
    t.summary.timeline,
    t.step4.urgency,
  ]);

  const summaryValues: Record<string, string | null> = {
    company: form.company || null,
    role: form.role || null,
    channel: channelLabel,
    goal: goalLabel,
    productType: form.productType || null,
    quantity: form.quantity || null,
    materials: materialsLabel,
    onShelfDate: onShelfDateLabel,
    files:
      form.files.length > 0
        ? `${form.files.length} ${
            form.files.length === 1
              ? t.summary.filesSingle
              : t.summary.filesCountSuffix
          }`
        : null,
  };

  return (
    <section className="wizard-shell">
      <div className="container">
        <div className="top">
          <div>
            <h1>
              {t.h1Line1}
              <br />
              {t.h1Line2}
            </h1>
            <p className="lede">
              {t.ledePre} <strong>{t.ledeStrong}</strong>
              {t.ledePost}
            </p>
          </div>
          <span className="save-state">{t.saveState}</span>
        </div>

        <div className="progress-strip">
          {t.stepNames.map((name, i) => {
            const n = i + 1;
            const isDone = n < step;
            const isActive = n === step;
            const cls = `step-pill${isActive ? " active" : ""}${
              isDone ? " done" : ""
            }`;
            return (
              <div key={n} className={cls} onClick={() => setStep(n)}>
                <div className="num-circle">
                  {isDone ? "✓" : String(n).padStart(2, "0")}
                </div>
                <div>
                  <div className="label">
                    {`${t.stepLabelPrefix} ${String(n).padStart(2, "0")}${
                      isActive ? ` · ${t.stepNow}` : ""
                    }`}
                  </div>
                  <div className="name">{name}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="wizard-body">
          <form className="form-card" onSubmit={handleSubmit}>
            {/* Step 1 */}
            <div className={`step-content${step === 1 ? " active" : ""}`}>
              <div className="step-head">
                <div className="eye">{t.step1.eye}</div>
                <h2>{t.step1.h2}</h2>
                <p>{t.step1.p}</p>
              </div>
              <div className="row-2 fg">
                <div className="field">
                  <label htmlFor="q-name">{t.step1.name}</label>
                  <input
                    id="q-name"
                    type="text"
                    placeholder={t.step1.namePh}
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="q-role">{t.step1.role}</label>
                  <input
                    id="q-role"
                    type="text"
                    placeholder={t.step1.rolePh}
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                  />
                </div>
              </div>
              <div className="row-2 fg">
                <div className="field">
                  <label htmlFor="q-company">{t.step1.company}</label>
                  <input
                    id="q-company"
                    type="text"
                    placeholder={t.step1.companyPh}
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="q-industry">{t.step1.industry}</label>
                  <select
                    id="q-industry"
                    value={form.industry}
                    onChange={(e) => update("industry", e.target.value)}
                  >
                    <option value="">{t.selectPlaceholder}</option>
                    {t.step1.industryOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row-2 fg">
                <div className="field">
                  <label htmlFor="q-email">{t.step1.email}</label>
                  <input
                    id="q-email"
                    type="email"
                    placeholder={t.step1.emailPh}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="q-phone">{t.step1.phone}</label>
                  <input
                    id="q-phone"
                    type="tel"
                    placeholder={t.step1.phonePh}
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`step-content${step === 2 ? " active" : ""}`}>
              <div className="step-head">
                <div className="eye">{t.step2.eye}</div>
                <h2>{t.step2.h2}</h2>
                <p>
                  {t.step2.pPre} <strong>{t.step2.pStrong}</strong>{" "}
                  {t.step2.pPost}
                </p>
              </div>

              <div className="fg">
                <div className="fg-label">{t.step2.channelLabel}</div>
                <div className="opt-grid col-4">
                  {t.channels.map((c) => (
                    <div
                      key={c.code}
                      className={`opt${
                        form.channel === c.code ? " selected" : ""
                      }`}
                      onClick={() => update("channel", c.code)}
                    >
                      <div className="opt-glyph">{c.code}</div>
                      <h5>{c.name}</h5>
                      <p>{c.desc}</p>
                    </div>
                  ))}
                </div>
                {form.channel === "YC" && (
                  <div className="field custom-channel">
                    <input
                      type="text"
                      placeholder={t.step2.customChannelPh}
                      value={form.customChannel}
                      onChange={(e) =>
                        update("customChannel", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>

              <div className="fg">
                <div className="fg-label">{t.step2.goalLabel}</div>
                <div className="goal-strip">
                  {t.goals.map((g) => (
                    <div
                      key={g.code}
                      className={`goal-card${
                        form.goal === g.code ? " selected" : ""
                      }`}
                      onClick={() => update("goal", g.code)}
                    >
                      <div className="icon-glyph">{g.code}</div>
                      <h5>{g.title}</h5>
                      <div className="en">{g.en}</div>
                      <p>{g.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row-2 fg">
                <div>
                  <div className="fg-label">{t.step2.productTypeLabel}</div>
                  <div className="field">
                    <select
                      value={form.productType}
                      onChange={(e) => update("productType", e.target.value)}
                    >
                      <option value="">{t.selectPlaceholder}</option>
                      {t.step2.productOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="fg-label">{t.step2.quantityLabel}</div>
                  <div className="field">
                    <select
                      value={form.quantity}
                      onChange={(e) => update("quantity", e.target.value)}
                    >
                      <option value="">{t.selectPlaceholder}</option>
                      {t.step2.quantityOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="fg">
                <div className="fg-label">{t.step2.budgetLabel}</div>
                <div className="field">
                  <select
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                  >
                    <option value="">{t.selectPlaceholder}</option>
                    {t.step2.budgetOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`step-content${step === 3 ? " active" : ""}`}>
              <div className="step-head">
                <div className="eye">{t.step3.eye}</div>
                <h2>{t.step3.h2}</h2>
                <p>{t.step3.p}</p>
              </div>
              <div className="opt-grid col-3">
                {t.materials.map((m) => {
                  const selected = form.materials.includes(m.code);
                  const cls = `opt${m.feat ? " feat" : ""}${
                    selected ? " selected" : ""
                  }`;
                  return (
                    <div
                      key={m.code}
                      className={cls}
                      onClick={() => toggleMaterial(m.code)}
                    >
                      <div className="opt-glyph">
                        {m.feat ? `${m.code} · ${t.premiumLabel}` : m.code}
                      </div>
                      <h5>{m.name}</h5>
                      <p>{m.desc}</p>
                    </div>
                  );
                })}
              </div>
              <div className="fg" style={{ marginTop: 28 }}>
                <div className="field">
                  <label htmlFor="q-sustain">{t.step3.sustainabilityLabel}</label>
                  <textarea
                    id="q-sustain"
                    placeholder={t.step3.sustainabilityPh}
                    value={form.sustainability}
                    onChange={(e) => update("sustainability", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`step-content${step === 4 ? " active" : ""}`}>
              <div className="step-head">
                <div className="eye">{t.step4.eye}</div>
                <h2>{t.step4.h2}</h2>
                <p>
                  {t.step4.pPre} <strong>{t.step4.pStrong}</strong>
                  {t.step4.pPost}
                </p>
              </div>
              <div className="date-pick">
                <div className="label-row">
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--fg-secondary)",
                        marginBottom: 4,
                      }}
                    >
                      {t.step4.dateLabel}
                    </div>
                    <div className="selected-date">
                      {onShelfDateLabel ?? "—"}
                    </div>
                  </div>
                  <div className="field" style={{ minWidth: 200 }}>
                    <input
                      type="date"
                      value={form.onShelfDate}
                      onChange={(e) => update("onShelfDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="urgency-bar">
                  <span className="label">{t.step4.urgencyLabel}</span>
                  <span className={`indicator status-${timeline.status}`}>
                    {timeline.urgency}
                  </span>
                </div>
              </div>
              <div className="row-2 fg" style={{ marginTop: 28 }}>
                <div>
                  <div className="fg-label">{t.step4.deliveryLabel}</div>
                  <div className="field">
                    <select
                      value={form.delivery}
                      onChange={(e) => update("delivery", e.target.value)}
                    >
                      <option value="">{t.selectPlaceholder}</option>
                      {t.step4.deliveryOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="fg-label">{t.step4.installationLabel}</div>
                  <div className="field">
                    <select
                      value={form.installation}
                      onChange={(e) => update("installation", e.target.value)}
                    >
                      <option value="">{t.selectPlaceholder}</option>
                      {t.step4.installationOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className={`step-content${step === 5 ? " active" : ""}`}>
              <div className="step-head">
                <div className="eye">{t.step5.eye}</div>
                <h2>{t.step5.h2}</h2>
                <p>{t.step5.p}</p>
              </div>
              <label htmlFor="q-files" className="dropzone">
                <div className="glyph-box"></div>
                <h6>{t.step5.dropzoneH6}</h6>
                <p>{t.step5.dropzoneP}</p>
                <span className="browse">{t.step5.browse}</span>
                <div className="formats">{t.step5.formats}</div>
                <input
                  id="q-files"
                  type="file"
                  multiple
                  accept={ACCEPTED_EXTENSIONS.join(",")}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const picked = Array.from(e.target.files ?? []);
                    e.target.value = "";
                    if (picked.length === 0) return;
                    const rejected: string[] = [];
                    const accepted: FileEntry[] = [];
                    for (const f of picked) {
                      const kind = fileKindFor(f.name);
                      if (!kind) {
                        rejected.push(`${f.name} — ${t.step5.rejectType}`);
                        continue;
                      }
                      if (f.size > MAX_FILE_BYTES) {
                        rejected.push(`${f.name} — ${t.step5.rejectSize}`);
                        continue;
                      }
                      accepted.push({
                        name: f.name,
                        size: `${(f.size / 1024 / 1024).toFixed(1)} MB ${t.step5.uploadedSuffix}`,
                        tag: "upload",
                        kind,
                      });
                    }
                    if (accepted.length > 0) {
                      setForm((prev) => ({
                        ...prev,
                        files: [...prev.files, ...accepted],
                      }));
                    }
                    if (rejected.length > 0) {
                      alert(`${t.step5.rejectIntro}\n\n${rejected.join("\n")}`);
                    }
                  }}
                />
              </label>
              <div className="files-list">
                {form.files.map((f) => (
                  <div key={f.name} className="file-row">
                    <div className={`icon ${f.kind}`}>
                      {f.kind.toUpperCase()}
                    </div>
                    <div>
                      <div className="name">{f.name}</div>
                      <div className="meta-text">{f.size}</div>
                    </div>
                    <div className="meta-text">{f.tag}</div>
                    <div className="remove" onClick={() => removeFile(f.name)}>
                      ×
                    </div>
                  </div>
                ))}
              </div>
              <div className="fg" style={{ marginTop: 28 }}>
                <div className="field">
                  <label htmlFor="q-notes">{t.step5.notesLabel}</label>
                  <textarea
                    id="q-notes"
                    placeholder={t.step5.notesPh}
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </div>
              </div>
              <div
                className="fg"
                style={{
                  padding: 18,
                  background: "var(--color-gray-1)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: 0,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <span
                    onClick={() => update("consent", !form.consent)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: form.consent
                        ? "var(--color-orange)"
                        : "var(--color-white)",
                      border: form.consent
                        ? "none"
                        : "1px solid var(--border-default)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {form.consent ? "✓" : ""}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "var(--fg-primary)",
                    }}
                    onClick={() => update("consent", !form.consent)}
                  >
                    {t.step5.consentPre}{" "}
                    <a
                      href="#"
                      style={{
                        color: "var(--color-gray-4)",
                        fontWeight: 700,
                        textDecoration: "underline",
                        textUnderlineOffset: 3,
                      }}
                    >
                      {t.step5.consentLink}
                    </a>{" "}
                    {t.step5.consentPost}
                  </span>
                </label>
              </div>
            </div>

            <div className="wizard-footer">
              <div className="step-meta">
                {`${t.footer.stepRemainingPre} ${step} ${t.footer.stepRemainingMid} ${STEP_EST_MINS[step - 1]} ${t.footer.stepRemainingPost}`}
              </div>
              <div className="actions">
                <button
                  type="button"
                  className="cta outline"
                  style={{ visibility: step === 1 ? "hidden" : "visible" }}
                  onClick={back}
                >
                  {t.footer.back}
                </button>
                <button
                  type="button"
                  className={`cta primary${step === 5 ? " lg" : ""}`}
                  disabled={step === 5 && status === "sending"}
                  style={{
                    ...(step === 5
                      ? { background: "var(--color-orange)" }
                      : undefined),
                    opacity: step === 5 && status === "sending" ? 0.6 : 1,
                  }}
                  onClick={next}
                >
                  {step === 5 && status === "sending"
                    ? t.sending
                    : step === 5
                      ? t.footer.submit
                      : t.footer.next}
                </button>
              </div>
            </div>
            {step === 5 && status === "success" && (
              <p role="status" style={{ marginTop: 12, color: "#1a7f37" }}>
                {t.submitAlert}
              </p>
            )}
            {step === 5 && status === "error" && (
              <p role="alert" style={{ marginTop: 12, color: "#b42318" }}>
                {t.errorAlert}
              </p>
            )}
            {status === "missing" && (
              <p role="alert" style={{ marginTop: 12, color: "#b42318" }}>
                {t.missingAlert}
              </p>
            )}
          </form>

          <aside className="summary">
            <h5>{t.summary.h5}</h5>
            {t.summary.items.map((it) => {
              const value = summaryValues[it.field];
              return (
                <div key={it.field} className="item">
                  <span className="k">{it.k}</span>
                  <span className={`v${value ? "" : " pending"}`}>
                    {value ?? t.summary.pending}
                  </span>
                </div>
              );
            })}

            <div className={`timeline status-${timeline.status}`}>
              <div className="tl-title">{t.summary.timeline.title}</div>
              <div className="tl-headline">{timeline.headline}</div>
              <div className="tl-sub">{timeline.subtext}</div>
              <div className="tl-breakdown">
                {t.summary.timeline.breakdown.map((b) => (
                  <div key={b.k} className="tl-row">
                    <span className="tl-k">{b.k}</span>
                    <span className="tl-v">{b.v}</span>
                  </div>
                ))}
              </div>
              <div className="tl-tagline">{t.summary.timeline.tagline}</div>
            </div>

            <div className="marker-note">{t.summary.marker}</div>
          </aside>
        </div>
      </div>
    </section>
  );
}
