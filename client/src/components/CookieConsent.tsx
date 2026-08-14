import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Shield } from "lucide-react";

const COOKIE_CONSENT_KEY = "arica_cookie_consent";
const COOKIE_PREFERENCES_KEY = "arica_cookie_preferences";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function getStoredConsent(): string | null {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    return null;
  }
}

function getStoredPreferences(): CookiePreferences {
  try {
    const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<CookiePreferences>;
      return {
        necessary: true,
        analytics: typeof parsed.analytics === "boolean" ? parsed.analytics : false,
        marketing: typeof parsed.marketing === "boolean" ? parsed.marketing : false,
      };
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_PREFERENCES;
}

function saveConsent(preferences: CookiePreferences) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // storage unavailable
  }
}

function applyConsent(preferences: CookiePreferences) {
  window.dispatchEvent(new CustomEvent("arica-consent-update", {
    detail: preferences,
  }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setPreferences(getStoredPreferences());
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allAccepted);
    applyConsent(allAccepted);
    setPreferences(allAccepted);
    setVisible(false);
  }, []);

  const handleAcceptSelected = useCallback(() => {
    saveConsent(preferences);
    applyConsent(preferences);
    setVisible(false);
  }, [preferences]);

  const handleDeclineOptional = useCallback(() => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(onlyNecessary);
    applyConsent(onlyNecessary);
    setPreferences(onlyNecessary);
    setVisible(false);
  }, []);

  const togglePreference = useCallback((key: keyof CookiePreferences) => {
    if (key === "necessary") return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl shadow-black/50">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#42BA90]/10 border border-[#42BA90]/20 flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-5 h-5 text-[#42BA90]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Cookie Preferences</h3>
                    <p className="text-white/50 text-xs flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Your privacy matters to us
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDeclineOptional}
                  className="text-white/40 hover:text-white/70 transition-colors p-1"
                  aria-label="Close cookie banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-white/60 text-sm mb-4 leading-relaxed">
                We use cookies to enhance your browsing experience, improve site performance, 
                and analyze traffic. You can choose which cookies to allow below.
              </p>

              {/* Details toggle */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 mb-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      {/* Necessary */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">Necessary Cookies</p>
                          <p className="text-white/40 text-xs">Required for the website to function properly.</p>
                        </div>
                        <div className="w-10 h-5 rounded-full bg-[#42BA90] flex items-center justify-end px-0.5 cursor-not-allowed opacity-70">
                          <div className="w-4 h-4 rounded-full bg-white" />
                        </div>
                      </div>

                      {/* Performance and analytics */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">Performance &amp; Analytics</p>
                          <p className="text-white/40 text-xs">Gather aggregated, non-identifiable usage statistics to help improve performance and interfaces.</p>
                        </div>
                        <button
                          onClick={() => togglePreference("analytics")}
                          className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                            preferences.analytics ? "bg-[#42BA90] justify-end" : "bg-white/20 justify-start"
                          }`}
                          aria-label="Toggle performance and analytics cookies"
                        >
                          <div className="w-4 h-4 rounded-full bg-white" />
                        </button>
                      </div>

                      {/* Targeting and marketing */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">Targeting &amp; Marketing</p>
                          <p className="text-white/40 text-xs">Support personalized promotional campaigns and attribution across external platforms.</p>
                        </div>
                        <button
                          onClick={() => togglePreference("marketing")}
                          className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                            preferences.marketing ? "bg-[#42BA90] justify-end" : "bg-white/20 justify-start"
                          }`}
                          aria-label="Toggle targeting and marketing cookies"
                        >
                          <div className="w-4 h-4 rounded-full bg-white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-white/50 hover:text-white/80 transition-colors underline underline-offset-4"
                >
                  {showDetails ? "Hide Details" : "Customize"}
                </button>

                <div className="flex-1" />

                <button
                  onClick={handleDeclineOptional}
                  className="px-5 py-2.5 text-sm rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  Decline Optional
                </button>

                {showDetails ? (
                  <button
                    onClick={handleAcceptSelected}
                    className="px-5 py-2.5 text-sm rounded-xl bg-[#42BA90] text-white font-medium hover:bg-[#42BA90]/90 transition-all"
                  >
                    Save Preferences
                  </button>
                ) : (
                  <button
                    onClick={handleAcceptAll}
                    className="px-5 py-2.5 text-sm rounded-xl bg-[#42BA90] text-white font-medium hover:bg-[#42BA90]/90 transition-all"
                  >
                    Accept All
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
