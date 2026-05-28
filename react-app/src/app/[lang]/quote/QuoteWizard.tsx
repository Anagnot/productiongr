"use client";

import { useMemo, useState } from "react";

type FileKind = "pdf" | "img" | "zip";

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
  goal: string;
  productType: string;
  quantity: string;
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
    goalLabel: string;
    productTypeLabel: string;
    productOptions: string[];
    quantityLabel: string;
    quantityOptions: string[];
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
    urgencyIndicator: string;
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
  summary: {
    h5: string;
    items: { k: string; field: string }[];
    pending: string;
    filesCountSuffix: string;
    filesSingle: string;
    otifEye: string;
    otifV: string;
    otifHint: string;
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

export function QuoteWizard({ t }: Props) {
  const [step, setStep] = useState(2);
  const [form, setForm] = useState<FormState>({
    name: t.defaults.name,
    role: t.defaults.role,
    company: t.defaults.company,
    industry: t.defaults.industry,
    email: t.defaults.email,
    phone: t.defaults.phone,
    channel: "SM",
    goal: "NEW",
    productType: t.defaults.productType,
    quantity: t.defaults.quantity,
    materials: ["M01", "M04"],
    sustainability: "",
    onShelfDate: t.defaults.onShelfDate,
    delivery: t.defaults.delivery,
    installation: t.defaults.installation,
    files: t.defaults.files.map((f) => ({
      ...f,
      kind: (f.kind === "pdf" || f.kind === "zip" ? f.kind : "img") as FileKind,
    })),
    notes: "",
    consent: true,
  });

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
    console.log("Quote wizard submitted:", form);
    alert(t.submitAlert);
  }

  function next() {
    if (step < 5) setStep(step + 1);
    else {
      console.log("Quote wizard submitted:", form);
      alert(t.submitAlert);
    }
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  const goalLabel = useMemo(
    () => t.goals.find((g) => g.code === form.goal)?.title ?? "—",
    [form.goal, t.goals],
  );
  const channelLabel = useMemo(
    () => t.channels.find((c) => c.code === form.channel)?.name ?? "—",
    [form.channel, t.channels],
  );
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
                      {t.step2.quantityOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
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
                  <span className="indicator">{t.step4.urgencyIndicator}</span>
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
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length === 0) return;
                    const newFiles: FileEntry[] = files.map((f) => ({
                      name: f.name,
                      size: `${(f.size / 1024 / 1024).toFixed(1)} MB ${t.step5.uploadedSuffix}`,
                      tag: "upload",
                      kind: f.name.toLowerCase().endsWith(".pdf")
                        ? "pdf"
                        : f.name.toLowerCase().endsWith(".zip")
                        ? "zip"
                        : "img",
                    }));
                    setForm((prev) => ({
                      ...prev,
                      files: [...prev.files, ...newFiles],
                    }));
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
                  style={
                    step === 5 ? { background: "var(--color-orange)" } : undefined
                  }
                  onClick={next}
                >
                  {step === 5 ? t.footer.submit : t.footer.next}
                </button>
              </div>
            </div>
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

            <div className="otif">
              <div className="eye">{t.summary.otifEye}</div>
              <div className="v">{t.summary.otifV}</div>
              <div className="hint">{t.summary.otifHint}</div>
            </div>

            <div className="marker-note">{t.summary.marker}</div>
          </aside>
        </div>
      </div>
    </section>
  );
}
