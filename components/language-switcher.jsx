"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function LanguageSwitcher({ variant = "select" }) {
  const { currentLanguage, changeLanguage, t } = useLanguage()

  const languages = [
    { code: "en", name: t("languages.english"), flag: "🇺🇸" },
    { code: "hi", name: t("languages.hindi"), flag: "🇮🇳" },
  ]

  if (variant === "buttons") {
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLanguage === lang.code ? "default" : "outline"}
            size="sm"
            onClick={() => changeLanguage(lang.code)}
            className="text-xs min-w-[60px] bg-background border"
            style={{
              color: currentLanguage === lang.code ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
              backgroundColor: currentLanguage === lang.code ? "hsl(var(--primary))" : "hsl(var(--background))",
            }}
          >
            <span className="mr-1" style={{ filter: "none" }}>
              {lang.flag}
            </span>
            <span className="font-medium">{lang.code.toUpperCase()}</span>
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={changeLanguage}>
        <SelectTrigger className="w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
