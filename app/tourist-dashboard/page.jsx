"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import TouristNavigation from "@/components/tourist-navigation"
import ProfileSection from "@/components/tourist-sections/profile-section"
import AlertsSection from "@/components/tourist-sections/alerts-section"
import SettingsSection from "@/components/tourist-sections/settings-section"
import SafetyHeatmapSection from "@/components/tourist-sections/safety-heatmap-section"
import EmergencyChatbot from "@/components/emergency-chatbot"
import { useLanguage } from "@/lib/language-context"

export default function TouristDashboard() {
  const { t } = useLanguage()
  const [activeSection, setActiveSection] = useState("profile")
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const [showPanicAlert, setShowPanicAlert] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  // Mock tourist data
  const touristData = {
    name: "John Smith",
    passportNo: "AB123456789",
    digitalId: "TST-2024-001",
    blockchainId: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    safetyScore: 85,
    emergencyContacts: [
      { name: "Emergency Services", phone: "911" },
      { name: "Tourist Helpline", phone: "+1-800-TOURIST" },
    ],
    itinerary: [
      { location: "Times Square", time: "10:00 AM", status: "completed" },
      { location: "Central Park", time: "2:00 PM", status: "current" },
      { location: "Brooklyn Bridge", time: "5:00 PM", status: "upcoming" },
    ],
  }

  const mockAlerts = [
    { id: 1, type: "warning", message: "Heavy traffic reported in Times Square area", time: "10 mins ago" },
    { id: 2, type: "info", message: "Weather update: Light rain expected at 3 PM", time: "1 hour ago" },
    { id: 3, type: "success", message: "You've entered a safe zone - Central Park", time: "2 hours ago" },
  ]

  const handlePanicButton = () => {
    setShowPanicAlert(true)
    setTimeout(() => setShowPanicAlert(false), 3000)
  }

  const renderActiveSection = () => {
    console.log("[v0] Active section:", activeSection) // Added debug logging to track section changes
    switch (activeSection) {
      case "profile":
        return <ProfileSection touristData={touristData} />
      case "alerts":
        return (
          <AlertsSection
            mockAlerts={mockAlerts}
            trackingEnabled={trackingEnabled}
            setTrackingEnabled={setTrackingEnabled}
            showPanicAlert={showPanicAlert}
            handlePanicButton={handlePanicButton}
          />
        )
      case "heatmap":
        console.log("[v0] Rendering SafetyHeatmapSection") // Added debug logging for heatmap rendering
        return <SafetyHeatmapSection />
      case "settings":
        return <SettingsSection />
      default:
        return <ProfileSection touristData={touristData} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TouristNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        touristName={touristData.name}
      />

      <div className="max-w-7xl mx-auto p-4">{renderActiveSection()}</div>

      <Button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-cyan-600 hover:bg-cyan-700 shadow-lg z-40"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      <EmergencyChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </div>
  )
}
