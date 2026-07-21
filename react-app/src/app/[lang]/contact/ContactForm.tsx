"use client";

import { useState } from "react";
import Link from "next/link";

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
};

type FormStrings = {
  eyebrow: string;
  h2: string;
  subPre: string;
  subLink: string;
  name: string;
  namePh: string;
  company: string;
  companyPh: string;
  email: string;
  emailPh: string;
  phone: string;
  phonePh: string;
  projectType: string;
  projectTypePh: string;
  projectOptions: string[];
  message: string;
  messagePh: string;
  submit: string;
  altLink: string;
  successAlert: string;
  sending: string;
  errorAlert: string;
};

type Props = {
  quoteHref: string;
  t: FormStrings;
};

export function ContactForm({ quoteHref, t }: Props) {
  const [form, setForm] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [honeypot, setHoneypot] = useState("");

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: "contact",
          name: form.name,
          email: form.email,
          website: honeypot,
          fields: [
            [t.name, form.name],
            [t.company, form.company],
            [t.email, form.email],
            [t.phone, form.phone],
            [t.projectType, form.projectType],
            [t.message, form.message],
          ],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        projectType: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="quick-form" onSubmit={handleSubmit}>
      <div className="ornament"></div>
      <h2>{t.h2}</h2>
      <p className="sub">
        {t.subPre}{" "}
        <Link href={quoteHref}>{t.subLink}</Link>
      </p>
      <div className="fields">
        <div className="top-row">
          <div className="field">
            <label htmlFor="contact-type">{t.projectType}</label>
            <select
              id="contact-type"
              value={form.projectType}
              onChange={(e) => update("projectType", e.target.value)}
            >
              <option value="">{t.projectTypePh}</option>
              {t.projectOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="field field-message">
            <label htmlFor="contact-message">{t.message}</label>
            <textarea
              id="contact-message"
              placeholder={t.messagePh}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
            />
          </div>
        </div>
        <div className="bottom-row">
          <div className="field">
            <label htmlFor="contact-name">{t.name}</label>
            <input
              id="contact-name"
              type="text"
              placeholder={t.namePh}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="contact-company">{t.company}</label>
            <input
              id="contact-company"
              type="text"
              placeholder={t.companyPh}
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="contact-email">{t.email}</label>
            <input
              id="contact-email"
              type="email"
              placeholder={t.emailPh}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="contact-phone">{t.phone}</label>
            <input
              id="contact-phone"
              type="tel"
              placeholder={t.phonePh}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </div>
      </div>
      {/* Honeypot — hidden from real visitors, catches naive bots. */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", height: 0, width: 0 }}
      />
      <div className="actions">
        <button
          type="submit"
          className="cta primary lg"
          disabled={status === "sending"}
          style={{
            background: "var(--color-orange)",
            opacity: status === "sending" ? 0.6 : 1,
          }}
        >
          {status === "sending" ? t.sending : t.submit}
        </button>
      </div>
      {status === "success" && (
        <p role="status" style={{ marginTop: 12, color: "#1a7f37" }}>
          {t.successAlert}
        </p>
      )}
      {status === "error" && (
        <p role="alert" style={{ marginTop: 12, color: "#b42318" }}>
          {t.errorAlert}
        </p>
      )}
      <Link href={quoteHref} className="briefing-link">
        {t.altLink}
      </Link>
    </form>
  );
}
