"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { User, Phone, MapPin, Calendar, Link, Shield } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import BlockchainStatus from "@/components/blockchain-status"

export default function ProfileSection({ touristData }) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("tourist.personalInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{t("official.name")}</p>
              <p className="font-medium">{touristData.name}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                {t("blockchain.blockchainId")}
              </p>
              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                <Link className="h-4 w-4 text-green-600" />
                <p className="font-mono text-sm text-green-800">{touristData.blockchainId}</p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-auto">
                  {t("blockchain.verifiedId")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{t("tourist.digitalId")}</p>
              <p className="font-mono text-sm bg-muted p-2 rounded">{touristData.digitalId}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{t("tourist.passportNumber")}</p>
              <p className="font-mono text-sm">{touristData.passportNo}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{t("tourist.safetyScore")}</p>
              <div className="space-y-1">
                <Progress value={touristData.safetyScore} className="h-2" />
                <p className="text-sm font-medium">{touristData.safetyScore}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {t("tourist.emergencyContacts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {touristData.emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">{contact.name}</span>
                <Button variant="outline" size="sm">
                  <Phone className="h-3 w-3 mr-1" />
                  {contact.phone}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Blockchain Status Section */}
      <BlockchainStatus blockchainId={touristData.blockchainId} />

      {/* Today's Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("tourist.todaysItinerary")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {touristData.itinerary.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="text-sm font-mono bg-muted px-2 py-1 rounded">{item.time}</div>
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">{item.location}</div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : item.status === "current"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {t(`official.${item.status}`)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
