"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Language = "he" | "en";
type Theme = "azure" | "turquoise" | "emerald" | "violet" | "raspberry" | "sunset";
type Status = "idle" | "running" | "waiting" | "alarm" | "stopped";

const themes: Theme[] = ["azure", "turquoise", "emerald", "violet", "raspberry", "sunset"];
const themeNames: Record<Language, Record<Theme, string>> = {
  he: { azure: "כחול חי", turquoise: "טורקיז", emerald: "אזמרגד", violet: "סגול", raspberry: "פטל", sunset: "כתום שקיעה" },
  en: { azure: "Azure", turquoise: "Turquoise", emerald: "Emerald", violet: "Violet", raspberry: "Raspberry", sunset: "Sunset" },
};

const copy = {
  he: {
    appName: "מערכת ניטור רעש",
    beta: "BETA",
    date: new Intl.DateTimeFormat("he-IL", { dateStyle: "long" }).format(new Date()),
    language: "English",
    display: "הגדרות תצוגה",
    about: "אודות",
    displayTitle: "ערכת צבע",
    close: "סגירה",
    title: "ניטור עוצמת הרעש",
    intro: "מדידה בזמן אמת באמצעות המיקרופון של המכשיר והתרעה בעת חריגה מהסף שהוגדר.",
    idle: "המדידה טרם הופעלה",
    running: "מודד כעת",
    waiting: "מעל הסף — ממתין למשך שהוגדר",
    alarm: "חריגה מסף הרעש",
    stopped: "המדידה נעצרה",
    startHint: "יש להפעיל מדידה כדי לקבל נתונים",
    raw: "אות גולמי",
    noData: "אין נתון",
    estimated: "עוצמה משוערת",
    average: "ממוצע",
    peak: "שיא",
    overTime: "משך חריגה",
    secondsShort: "ש׳",
    settings: "הגדרות ניטור",
    threshold: "סף התרעה",
    duration: "משך חריגה נדרש",
    cooldown: "הפסקה בין התרעות",
    calibration: "היסט כיול",
    calibrationHint: "הערך המוצג מחושב לפי dBFS שנמדד בתוספת היסט הכיול.",
    sound: "התרעה קולית",
    vibration: "רטט במכשיר נתמך",
    start: "התחלת מדידה",
    stop: "עצירה",
    test: "בדיקת התרעה",
    reset: "איפוס נתונים",
    accuracyTitle: "מידע חשוב על דיוק המדידה",
    accuracy: "הדפדפן מקבל מהמיקרופון אות דיגיטלי יחסי. לכן ערך ה־dB המוצג הוא אומדן בלבד, אלא אם המכשיר כויל מול מד רעש אמין. אין להשתמש ביישומון לצורך קביעה מקצועית, רפואית או בטיחותית.",
    permission: "הגישה למיקרופון נדחתה. יש לאשר הרשאת מיקרופון בהגדרות האתר.",
    unavailable: "הדפדפן אינו מאפשר גישה למיקרופון. יש לפתוח את היישומון בחיבור HTTPS ובדפדפן עדכני.",
    failed: "לא ניתן להפעיל את המיקרופון. ייתכן שהוא נמצא בשימוש ביישום אחר.",
    aboutTitle: "אודות מערכת ניטור רעש",
    version: "גרסת מערכת: 0.1.0 · 27 ביולי 2026",
    betaWarning: "מערכת זו נמצאת בגרסת בטא. ייתכנו טעויות, תקלות או תוצאות לא מדויקות. מומלץ לבדוק מידע מהותי לפני הסתמכות עליו.",
    credit: "המערכת תוכננה ופותחה על ידי אביב מצא, בסיוע כלי בינה מלאכותית.",
    copyright: "© 2026 Aviv Matsa – Smart Information Systems",
    meterLabel: "מד עוצמת רעש משוערת",
  },
  en: {
    appName: "Noise Monitoring System",
    beta: "BETA",
    date: new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date()),
    language: "עברית",
    display: "Display settings",
    about: "About",
    displayTitle: "Colour theme",
    close: "Close",
    title: "Noise level monitoring",
    intro: "Real-time measurement using the device microphone, with an alert when the configured threshold is exceeded.",
    idle: "Measurement has not started",
    running: "Measuring now",
    waiting: "Above threshold — waiting for the configured duration",
    alarm: "Noise threshold exceeded",
    stopped: "Measurement stopped",
    startHint: "Start measurement to receive data",
    raw: "Raw signal",
    noData: "No data",
    estimated: "Estimated level",
    average: "Average",
    peak: "Peak",
    overTime: "Time over threshold",
    secondsShort: "sec",
    settings: "Monitoring settings",
    threshold: "Alert threshold",
    duration: "Required exceedance duration",
    cooldown: "Time between alerts",
    calibration: "Calibration offset",
    calibrationHint: "The displayed value is calculated as measured dBFS plus the calibration offset.",
    sound: "Sound alert",
    vibration: "Vibration on supported devices",
    start: "Start measurement",
    stop: "Stop",
    test: "Test alert",
    reset: "Reset data",
    accuracyTitle: "Important measurement accuracy information",
    accuracy: "The browser receives a relative digital signal from the microphone. The displayed dB value is therefore an estimate unless the device is calibrated against a reliable sound level meter. Do not use this app for professional, medical or safety determinations.",
    permission: "Microphone access was denied. Allow microphone access in the site settings.",
    unavailable: "This browser cannot access the microphone. Open the app over HTTPS in an up-to-date browser.",
    failed: "The microphone could not be started. It may be in use by another application.",
    aboutTitle: "About Noise Monitoring System",
    version: "System version: 0.1.0 · July 27, 2026",
    betaWarning: "This system is in beta. Errors, faults or inaccurate results may occur. Verify material information before relying on it.",
    credit: "Designed and developed by Aviv Matsa with the assistance of AI tools.",
    copyright: "© 2026 Aviv Matsa – Smart Information Systems",
    meterLabel: "Estimated noise level meter",
  },
} as const;

function loadTheme(): Theme {
  if (typeof window === "undefined") return "azure";
  const value = localStorage.getItem("amis-theme");
  const migrated = value === "ocean" ? "azure" : value === "forest" ? "emerald" : value === "plum" ? "violet" : value;
  return themes.includes(migrated as Theme) ? migrated as Theme : "azure";
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("he");
  const [theme, setTheme] = useState<Theme>("azure");
  const [showDisplay, setShowDisplay] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [db, setDb] = useState<number | null>(null);
  const [rawDb, setRawDb] = useState<number | null>(null);
  const [average, setAverage] = useState<number | null>(null);
  const [peak, setPeak] = useState<number | null>(null);
  const [overSeconds, setOverSeconds] = useState(0);
  const [threshold, setThreshold] = useState(75);
  const [duration, setDuration] = useState(2);
  const [cooldown, setCooldown] = useState(5);
  const [calibration, setCalibration] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [error, setError] = useState("");
  const running = status === "running" || status === "waiting" || status === "alarm";
  const t = copy[language];

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const smoothedRef = useRef(-100);
  const samplesRef = useRef<number[]>([]);
  const peakRef = useRef(-Infinity);
  const totalOverRef = useRef(0);
  const thresholdAtRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const lastAlarmRef = useRef(-Infinity);
  const alarmPlayingRef = useRef(false);

  useEffect(() => {
    setTheme(loadTheme());
    try {
      const saved = JSON.parse(localStorage.getItem("amis-noise-settings-v1") || "{}");
      if (Number.isFinite(saved.threshold)) setThreshold(saved.threshold);
      if (Number.isFinite(saved.duration)) setDuration(saved.duration);
      if (Number.isFinite(saved.cooldown)) setCooldown(saved.cooldown);
      if (Number.isFinite(saved.calibration)) setCalibration(saved.calibration);
      if (typeof saved.soundEnabled === "boolean") setSoundEnabled(saved.soundEnabled);
      if (typeof saved.vibrationEnabled === "boolean") setVibrationEnabled(saved.vibrationEnabled);
      if (saved.language === "en") setLanguage("en");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("amis-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    localStorage.setItem("amis-noise-settings-v1", JSON.stringify({ threshold, duration, cooldown, calibration, soundEnabled, vibrationEnabled, language }));
  }, [language, threshold, duration, cooldown, calibration, soundEnabled, vibrationEnabled]);

  const triggerAlarm = useCallback(async () => {
    if (alarmPlayingRef.current) return;
    alarmPlayingRef.current = true;
    setStatus("alarm");
    if (vibrationEnabled && navigator.vibrate) navigator.vibrate([250, 120, 250, 120, 500]);
    if (soundEnabled) {
      try {
        const ctx = audioContextRef.current && audioContextRef.current.state !== "closed"
          ? audioContextRef.current
          : new AudioContext();
        await ctx.resume();
        const gain = ctx.createGain();
        gain.gain.value = 0.18;
        gain.connect(ctx.destination);
        [0, 0.35, 0.7].forEach((offset, index) => {
          const osc = ctx.createOscillator();
          osc.type = "square";
          osc.frequency.value = index % 2 ? 880 : 1100;
          osc.connect(gain);
          osc.start(ctx.currentTime + offset);
          osc.stop(ctx.currentTime + offset + 0.22);
        });
      } catch {}
    }
    window.setTimeout(() => {
      alarmPlayingRef.current = false;
      setStatus((current) => current === "alarm" ? "running" : current);
    }, 1300);
  }, [soundEnabled, vibrationEnabled]);

  const stop = useCallback(async () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    try { await audioContextRef.current?.close(); } catch {}
    audioContextRef.current = null;
    try { await wakeLockRef.current?.release(); } catch {}
    wakeLockRef.current = null;
    thresholdAtRef.current = null;
    setStatus("stopped");
  }, []);

  const measure = useCallback((now: number) => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(data);
    let sumSquares = 0;
    for (const value of data) sumSquares += value * value;
    const rms = Math.sqrt(sumSquares / data.length);
    const raw = rms > 0 ? 20 * Math.log10(rms) : -100;
    const alpha = raw > smoothedRef.current ? 0.35 : 0.12;
    smoothedRef.current += alpha * (raw - smoothedRef.current);
    const estimated = smoothedRef.current + calibration;
    const isOver = estimated >= threshold;
    const delta = now - lastFrameRef.current;
    lastFrameRef.current = now;

    setDb(estimated);
    setRawDb(smoothedRef.current);
    const samples = samplesRef.current;
    samples.push(estimated);
    if (samples.length > 300) samples.shift();
    peakRef.current = Math.max(peakRef.current, estimated);
    if (isOver && delta > 0 && delta < 1000) totalOverRef.current += delta;
    setAverage(samples.reduce((sum, value) => sum + value, 0) / samples.length);
    setPeak(peakRef.current);
    setOverSeconds(totalOverRef.current / 1000);

    if (isOver) {
      if (thresholdAtRef.current === null) thresholdAtRef.current = now;
      const continuous = now - thresholdAtRef.current;
      if (continuous >= duration * 1000 && now - lastAlarmRef.current >= cooldown * 1000) {
        lastAlarmRef.current = now;
        void triggerAlarm();
      } else if (!alarmPlayingRef.current) setStatus("waiting");
    } else {
      thresholdAtRef.current = null;
      if (!alarmPlayingRef.current) setStatus("running");
    }
    animationRef.current = requestAnimationFrame(measure);
  }, [calibration, cooldown, duration, threshold, triggerAlarm]);

  const start = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t.unavailable);
      return;
    }
    try {
      const ctx = new AudioContext();
      await ctx.resume();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 },
        video: false,
      });
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0;
      source.connect(analyser);
      audioContextRef.current = ctx;
      streamRef.current = stream;
      analyserRef.current = analyser;
      smoothedRef.current = -100;
      lastFrameRef.current = performance.now();
      thresholdAtRef.current = null;
      setStatus("running");
      try {
        if ("wakeLock" in navigator) wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch {}
      animationRef.current = requestAnimationFrame(measure);
    } catch (cause) {
      setError(cause instanceof DOMException && cause.name === "NotAllowedError" ? t.permission : t.failed);
      await stop();
    }
  };

  const reset = () => {
    samplesRef.current = [];
    peakRef.current = -Infinity;
    totalOverRef.current = 0;
    thresholdAtRef.current = null;
    setAverage(null);
    setPeak(null);
    setOverSeconds(0);
  };

  useEffect(() => () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const statusText = t[status];
  const meterPercent = db === null ? 0 : Math.max(0, Math.min(100, ((db - 30) / 90) * 100));
  const thresholdPercent = Math.max(0, Math.min(100, ((threshold - 30) / 90) * 100));
  const level = db !== null && db >= threshold ? "danger" : db !== null && db >= threshold - 10 ? "warning" : "success";

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="identity">
            <div className="name-row"><strong>{t.appName}</strong><span className="beta">{t.beta}</span></div>
            <time>{t.date}</time>
          </div>
          <nav className="header-actions" aria-label={language === "he" ? "פעולות מערכת" : "System actions"}>
            <button onClick={() => setLanguage(language === "he" ? "en" : "he")}>{t.language}</button>
            <button aria-expanded={showDisplay} onClick={() => setShowDisplay(!showDisplay)}>{t.display}</button>
            <button onClick={() => setShowAbout(true)}>{t.about}</button>
          </nav>
          {showDisplay && (
            <section className="theme-popover" aria-label={t.displayTitle}>
              <h2>{t.displayTitle}</h2>
              {themes.map((item) => (
                <label key={item} className="theme-option">
                  <input type="radio" name="theme" checked={theme === item} onChange={() => setTheme(item)} />
                  <span className={`swatch swatch-${item}`} aria-hidden="true" />
                  <span>{themeNames[language][item]}</span>
                </label>
              ))}
            </section>
          )}
        </div>
      </header>

      <div className="workspace">
        <section className="page-intro">
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
        </section>

        {error && <div className="message danger-message" role="alert">{error}</div>}

        <div className="main-grid">
          <section className={`meter-panel level-${level} ${status === "alarm" ? "is-alarm" : ""}`} aria-label={t.meterLabel}>
            <div className="status-line"><span className="status-mark" aria-hidden="true" /><strong>{statusText}</strong></div>
            <div className="reading">
              <span className="db-value" dir="ltr">{db === null ? "--" : Math.round(db)}</span>
              <span className="db-unit">dB</span>
            </div>
            <p className="raw-value">{rawDb === null ? t.startHint : `${t.raw}: ${rawDb.toFixed(1)} dBFS`}</p>
            <div className="meter-track" role="meter" aria-valuemin={30} aria-valuemax={120} aria-valuenow={db === null ? undefined : Math.round(db)}>
              <span className="meter-fill" style={{ inlineSize: `${meterPercent}%` }} />
              <span className="threshold-mark" style={{ insetInlineStart: `${thresholdPercent}%` }} />
            </div>
            <div className="scale" dir="ltr"><span>30</span><span>60</span><span>90</span><span>120 dB</span></div>
            <dl className="stats">
              <div><dt>{t.average}</dt><dd dir="ltr">{average === null ? "--" : `${average.toFixed(1)} dB`}</dd></div>
              <div><dt>{t.peak}</dt><dd dir="ltr">{peak === null ? "--" : `${peak.toFixed(1)} dB`}</dd></div>
              <div><dt>{t.overTime}</dt><dd dir="ltr">{overSeconds.toFixed(1)} {t.secondsShort}</dd></div>
            </dl>
          </section>

          <section className="settings-panel">
            <h2>{t.settings}</h2>
            <div className="field">
              <label htmlFor="threshold">{t.threshold}<output dir="ltr">{threshold} dB</output></label>
              <input id="threshold" type="range" min="40" max="110" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
            </div>
            <div className="two-fields">
              <div className="field">
                <label htmlFor="duration">{t.duration}<output dir="ltr">{duration.toFixed(1)} {t.secondsShort}</output></label>
                <input id="duration" type="range" min=".2" max="10" step=".1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
              </div>
              <div className="field">
                <label htmlFor="cooldown">{t.cooldown}<output dir="ltr">{cooldown} {t.secondsShort}</output></label>
                <input id="cooldown" type="range" min="1" max="30" value={cooldown} onChange={(e) => setCooldown(Number(e.target.value))} />
              </div>
            </div>
            <div className="field calibration-field">
              <label htmlFor="calibration">{t.calibration}</label>
              <input id="calibration" type="number" min="50" max="140" step=".1" value={calibration} onChange={(e) => setCalibration(Number(e.target.value))} dir="ltr" />
              <small>{t.calibrationHint}</small>
            </div>
            <div className="toggles">
              <label><input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />{t.sound}</label>
              <label><input type="checkbox" checked={vibrationEnabled} onChange={(e) => setVibrationEnabled(e.target.checked)} />{t.vibration}</label>
            </div>
            <div className="actions">
              <button className="button-primary" disabled={running} onClick={start}>{t.start}</button>
              <button className="button-secondary" disabled={!running} onClick={() => void stop()}>{t.stop}</button>
              <button className="button-secondary" onClick={() => void triggerAlarm()}>{t.test}</button>
              <button className="button-text" onClick={reset}>{t.reset}</button>
            </div>
          </section>
        </div>

        <aside className="accuracy-note">
          <h2>{t.accuracyTitle}</h2>
          <p>{t.accuracy}</p>
        </aside>
      </div>

      {showAbout && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setShowAbout(false)}>
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="about-title">
            <div className="dialog-heading"><h2 id="about-title">{t.aboutTitle}</h2><span className="beta">{t.beta}</span></div>
            <p><strong>{t.version}</strong></p>
            <p>{t.betaWarning}</p>
            <p>{t.credit}</p>
            <p dir="ltr">Aviv Matsa – Smart Information Systems</p>
            <p dir="ltr">{t.copyright}</p>
            <button className="button-primary" onClick={() => setShowAbout(false)} autoFocus>{t.close}</button>
          </section>
        </div>
      )}
    </main>
  );
}
