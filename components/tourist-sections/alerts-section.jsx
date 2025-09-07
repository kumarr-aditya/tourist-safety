"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, AlertTriangle, CheckCircle, Bell, Shield } from "lucide-react"

export default function AlertsSection({
  mockAlerts,
  trackingEnabled,
  setTrackingEnabled,
  showPanicAlert,
  handlePanicButton,
}) {
  return (
    <div className="space-y-6">
      {/* Panic Alert */}
      {showPanicAlert && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-medium">
            Emergency alert sent! Help is on the way. Stay calm and remain in your current location.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Emergency Actions
          </CardTitle>
          <CardDescription>Quick access to safety features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handlePanicButton}
              className="h-20 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              <div className="text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-1" />
                <span className="font-bold">PANIC BUTTON</span>
              </div>
            </Button>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Real-time Tracking</p>
                <p className="text-sm text-muted-foreground">Share location with authorities</p>
              </div>
              <Switch checked={trackingEnabled} onCheckedChange={setTrackingEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Safety Alerts & Notifications
          </CardTitle>
          <CardDescription>Recent geo-fencing updates and safety information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
                {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-accent mt-0.5" />}
                {alert.type === "info" && <MapPin className="h-5 w-5 text-primary mt-0.5" />}
                {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                <div className="flex-1">
                  <p className="font-medium text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Current Location Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Safe Zone</p>
                <p className="text-sm text-green-600">Central Park, NYC</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600">Last updated</p>
              <p className="text-xs text-green-500">2 minutes ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
