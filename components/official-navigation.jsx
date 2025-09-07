"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, BarChart3, Search, FileText, Bell, Settings, LogOut } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import LanguageSwitcher from "@/components/language-switcher"

export default function OfficialNavigation({ activeSection, onSectionChange, alertCount = 0 }) {
  const { t } = useLanguage()

  return (
    <header className="bg-card border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full p-2">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("official.officialDashboard")}</h1>
            <p className="text-sm text-muted-foreground">{t("official.monitoringSystem")}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1">
          <Button
            variant={activeSection === "dashboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSectionChange("dashboard")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {t("common.dashboard")}
          </Button>
          <Button
            variant={activeSection === "lookup" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSectionChange("lookup")}
          >
            <Search className="h-4 w-4 mr-2" />
            {t("official.touristLookup")}
          </Button>
          <Button
            variant={activeSection === "efir" ? "default" : "ghost"}
            size="sm"
            onClick={() => onSectionChange("efir")}
          >
            <FileText className="h-4 w-4 mr-2" />
            {t("common.efir")}
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
            {alertCount > 0 && <Badge className="ml-1 h-5 w-5 p-0 text-xs">{alertCount}</Badge>}
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex justify-center gap-1 mt-4">
        <Button
          variant={activeSection === "dashboard" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("dashboard")}
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
        <Button
          variant={activeSection === "lookup" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("lookup")}
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant={activeSection === "efir" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("efir")}
        >
          <FileText className="h-4 w-4" />
        </Button>
      </nav>
    </header>
  )
}
