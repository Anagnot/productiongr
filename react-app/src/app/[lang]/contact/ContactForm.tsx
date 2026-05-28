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

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Contact form submitted:", form);
    alert(t.successAlert);
  }

  return (
    <form className="quick-form" onSubmit={handleSubmit}>
      <div className="ornament"></div>
      <div
        className="eyebrow bar"
        style={{
          color: "rgba(255,255,255,0.6)",
          marginBottom: 10,
        }}
      >
        {t.eyebrow}
      </div>
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
      <div className="actions">
        <button
          type="submit"
          className="cta primary lg"
          style={{ background: "var(--color-orange)" }}
        >
          {t.submit}
        </button>
      </div>
      <Link href={quoteHref} className="briefing-link">
        {t.altLink}
      </Link>
    </form>
  );
}
