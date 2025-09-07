"use client"
import { Button } from "@/components/ui/button"
import { Shield, User, Bell, Settings, LogOut, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import LanguageSwitcher from "@/components/language-switcher"

export default function TouristNavigation({ activeSection, onSectionChange, touristName }) {
  const { t } = useLanguage()

  return (
    <header className="bg-card border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full p-2">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("auth.welcomeTitle")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("tourist.welcomeBack")}, {touristName}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1">
          <Button
            variant={activeSection === "profile" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSectionChange("profile")}
          >
            <User className="h-4 w-4 mr-2" />
            {t("common.profile")}
          </Button>
          <Button
            variant={activeSection === "alerts" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSectionChange("alerts")}
          >
            <Bell className="h-4 w-4 mr-2" />
            {t("common.alerts")}
          </Button>
          <Button
            variant={activeSection === "heatmap" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSectionChange("heatmap")}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {t("common.safetyMap")}
          </Button>
          <Button
            variant={activeSection === "settings" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSectionChange("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            {t("common.settings")}
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex justify-center gap-1 mt-4">
        <Button
          variant={activeSection === "profile" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("profile")}
        >
          <User className="h-4 w-4" />
        </Button>
        <Button
          variant={activeSection === "alerts" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("alerts")}
        >
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant={activeSection === "heatmap" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("heatmap")}
        >
          <MapPin className="h-4 w-4" />
        </Button>
        <Button
          variant={activeSection === "settings" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("settings")}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </nav>
    </header>
  )
}
