"use client"

import { createContext, useContext, useState, useEffect } from "react"
import enTranslations from "./translations/en.json"
import hiTranslations from "./translations/hi.json"

const LanguageContext = createContext()

const allTranslations = {
  en: enTranslations,
  hi: hiTranslations,
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [translations, setTranslations] = useState(allTranslations.en)

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("preferred-language")
    if (savedLanguage && allTranslations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    const loadTranslations = () => {
      try {
        const selectedTranslations = allTranslations[currentLanguage]
        if (selectedTranslations) {
          setTranslations(selectedTranslations)
        } else {
          // Fallback to English if language not found
          setTranslations(allTranslations.en)
        }
      } catch (error) {
        console.error("Failed to load translations:", error)
        // Fallback to English if translation fails
        setTranslations(allTranslations.en)
      }
    }

    loadTranslations()
  }, [currentLanguage])

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode)
    localStorage.setItem("preferred-language", languageCode)
  }

  const t = (key) => {
    const keys = key.split(".")
    let value = translations

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }

    return value || key
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        t,
        translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
