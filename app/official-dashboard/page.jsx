"use client"

import { useState, useEffect } from "react"
import OfficialNavigation from "@/components/official-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Users, Search, MapPin, AlertTriangle, FileText, Bell, Clock, Phone, Link, Shield } from "lucide-react"
import dynamic from "next/dynamic"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false })

export default function OfficialDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTourist, setSelectedTourist] = useState(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [customIcons, setCustomIcons] = useState({})
  const [efirData, setEfirData] = useState({
    incidentType: "",
    location: "",
    description: "",
    touristId: "",
    severity: "",
  })

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== "undefined") {
        const L = await import("leaflet")

        // Fix for default markers
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        // Create custom icons for tourist status
        const icons = {
          active: new L.Icon({
            iconUrl:
              "data:image/svg+xml;base64," +
              btoa(`
              <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
                <path fill="#22c55e" stroke="#fff" strokeWidth="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
                <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
              </svg>
            `),
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          }),
          alert: new L.Icon({
            iconUrl:
              "data:image/svg+xml;base64," +
              btoa(`
              <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
                <path fill="#ef4444" stroke="#fff" strokeWidth="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
                <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
              </svg>
            `),
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          }),
        }

        setCustomIcons(icons)
        setLeafletLoaded(true)
      }
    }

    loadLeaflet()
  }, [])

  // Mock data
  const mockAlerts = [
    {
      id: 1,
      touristId: "TST-2024-001",
      blockchainId: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      name: "John Smith",
      type: "panic",
      location: "Central Park, NYC",
      time: "2 mins ago",
      severity: "high",
    },
    {
      id: 2,
      touristId: "TST-2024-002",
      blockchainId: "0x2b3c4d5e6f7890abcdef1234567890abcdef123",
      name: "Sarah Johnson",
      type: "geo-fence",
      location: "Restricted Area - Downtown",
      time: "15 mins ago",
      severity: "medium",
    },
    {
      id: 3,
      touristId: "TST-2024-003",
      blockchainId: "0x3c4d5e6f7890abcdef1234567890abcdef1234",
      name: "Mike Chen",
      type: "medical",
      location: "Times Square, NYC",
      time: "1 hour ago",
      severity: "high",
    },
  ]

  const mockTourists = [
    {
      id: "TST-2024-001",
      blockchainId: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      name: "John Smith",
      passport: "AB123456789",
      location: "Central Park, NYC",
      coordinates: [40.7829, -73.9654], // Added real coordinates for map display
      safetyScore: 85,
      status: "active",
      lastSeen: "5 mins ago",
    },
    {
      id: "TST-2024-002",
      blockchainId: "0x2b3c4d5e6f7890abcdef1234567890abcdef123",
      name: "Sarah Johnson",
      passport: "CD987654321",
      location: "Brooklyn Bridge, NYC",
      coordinates: [40.7061, -73.9969], // Added real coordinates for map display
      safetyScore: 92,
      status: "active",
      lastSeen: "12 mins ago",
    },
    {
      id: "TST-2024-003",
      blockchainId: "0x3c4d5e6f7890abcdef1234567890abcdef1234",
      name: "Mike Chen",
      passport: "EF456789123",
      location: "Times Square, NYC",
      coordinates: [40.758, -73.9855], // Added real coordinates for map display
      safetyScore: 78,
      status: "alert",
      lastSeen: "1 hour ago",
    },
  ]

  const touristClusters = [
    { coordinates: [40.758, -73.9855], count: 245, zone: "Times Square" },
    { coordinates: [40.7829, -73.9654], count: 189, zone: "Central Park" },
    { coordinates: [40.7061, -73.9969], count: 156, zone: "Brooklyn Bridge" },
    { coordinates: [40.7157, -73.997], count: 134, zone: "Chinatown" },
    { coordinates: [40.7074, -74.0113], count: 98, zone: "Wall Street" },
    { coordinates: [40.7264, -73.9818], count: 167, zone: "East Village" },
    { coordinates: [40.748, -74.0048], count: 123, zone: "High Line" },
    { coordinates: [40.723, -74.003], count: 135, zone: "SoHo" },
  ]

  const filteredTourists = mockTourists.filter(
    (tourist) =>
      tourist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tourist.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEfirSubmit = (e) => {
    e.preventDefault()
    alert("E-FIR submitted successfully!")
    setEfirData({ incidentType: "", location: "", description: "", touristId: "", severity: "" })
  }

  const renderDashboardSection = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Active Tourists</span>
            </div>
            <p className="text-2xl font-bold">1,247</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Active Alerts</span>
            </div>
            <p className="text-2xl font-bold">{mockAlerts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Safe Zones</span>
            </div>
            <p className="text-2xl font-bold">23</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Reports Today</span>
            </div>
            <p className="text-2xl font-bold">8</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Incoming Alerts
            </CardTitle>
            <CardDescription>Real-time notifications from tourists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        alert.severity === "high"
                          ? "destructive"
                          : alert.severity === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {alert.name} ({alert.touristId})
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="h-3 w-3 text-green-600" />
                      <p className="text-xs font-mono text-green-700 bg-green-50 px-1 rounded">
                        {alert.blockchainId.slice(0, 10)}...{alert.blockchainId.slice(-8)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm">Respond</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tourist Cluster Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Tourist Distribution
            </CardTitle>
            <CardDescription>Live heatmap of tourist locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg border overflow-hidden">
              {leafletLoaded ? (
                <MapContainer
                  center={[40.758, -73.9855]} // NYC center
                  zoom={11}
                  style={{ height: "300px", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* Tourist cluster circles */}
                  {touristClusters.map((cluster, index) => (
                    <Circle
                      key={`cluster-${index}`}
                      center={cluster.coordinates}
                      radius={cluster.count * 2} // Scale radius based on tourist count
                      fillColor={cluster.count > 200 ? "#ef4444" : cluster.count > 150 ? "#eab308" : "#22c55e"}
                      fillOpacity={0.3}
                      color={cluster.count > 200 ? "#ef4444" : cluster.count > 150 ? "#eab308" : "#22c55e"}
                      weight={2}
                    />
                  ))}

                  {/* Individual tourist markers */}
                  {mockTourists.map((tourist) => (
                    <Marker
                      key={tourist.id}
                      position={tourist.coordinates}
                      icon={customIcons[tourist.status]}
                      eventHandlers={{
                        click: () => setSelectedTourist(tourist),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{tourist.name}</h3>
                          <p className="text-sm">ID: {tourist.id}</p>
                          <p className="text-sm">Status: {tourist.status}</p>
                          <p className="text-sm">Safety Score: {tourist.safetyScore}/100</p>
                          <p className="text-sm">Last seen: {tourist.lastSeen}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Shield className="h-3 w-3 text-green-600" />
                            <p className="text-xs font-mono text-green-700">{tourist.blockchainId.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <div className="h-72 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Loading tourist distribution map...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                <p className="text-xs">Safe Zones</p>
                <p className="text-sm font-semibold">892 tourists</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                <p className="text-xs">Caution Zones</p>
                <p className="text-sm font-semibold">352 tourists</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
                <p className="text-xs">Alert Zones</p>
                <p className="text-sm font-semibold">3 tourists</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderLookupSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Tourist Lookup
        </CardTitle>
        <CardDescription>Search tourists by name or ID</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by name or Tourist ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {filteredTourists.map((tourist) => (
            <div
              key={tourist.id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedTourist(tourist)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{tourist.name}</p>
                  <p className="text-sm text-muted-foreground">{tourist.id}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="h-3 w-3 text-green-600" />
                    <p className="text-xs font-mono text-green-700">
                      {tourist.blockchainId.slice(0, 10)}...{tourist.blockchainId.slice(-8)}
                    </p>
                  </div>
                </div>
                <Badge variant={tourist.status === "active" ? "default" : "destructive"}>{tourist.status}</Badge>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {tourist.location}
                </p>
                <p>Last seen: {tourist.lastSeen}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedTourist && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Tourist Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-medium">{selectedTourist.name}</p>
                </div>
                <div>
                  <Label>Tourist ID</Label>
                  <p className="font-mono text-sm">{selectedTourist.id}</p>
                </div>
                <div className="col-span-2">
                  <Label className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    Blockchain ID
                  </Label>
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded mt-1">
                    <Link className="h-4 w-4 text-green-600" />
                    <p className="font-mono text-sm text-green-800">{selectedTourist.blockchainId}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-auto">Verified</span>
                  </div>
                </div>
                <div>
                  <Label>Passport</Label>
                  <p className="font-mono text-sm">{selectedTourist.passport}</p>
                </div>
                <div>
                  <Label>Safety Score</Label>
                  <p className="font-medium">{selectedTourist.safetyScore}/100</p>
                </div>
                <div>
                  <Label>Current Location</Label>
                  <p>{selectedTourist.location}</p>
                </div>
                <div>
                  <Label>Last Seen</Label>
                  <p>{selectedTourist.lastSeen}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )

  const renderEfirSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          E-FIR Generation
        </CardTitle>
        <CardDescription>Create electronic First Information Report</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEfirSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incident-type">Incident Type</Label>
              <Input
                id="incident-type"
                placeholder="e.g., Medical Emergency, Theft, etc."
                value={efirData.incidentType}
                onChange={(e) => setEfirData({ ...efirData, incidentType: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tourist-id">Tourist ID</Label>
              <Input
                id="tourist-id"
                placeholder="TST-2024-XXX"
                value={efirData.touristId}
                onChange={(e) => setEfirData({ ...efirData, touristId: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Incident location"
                value={efirData.location}
                onChange={(e) => setEfirData({ ...efirData, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Input
                id="severity"
                placeholder="Low, Medium, High"
                value={efirData.severity}
                onChange={(e) => setEfirData({ ...efirData, severity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Incident Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the incident..."
              rows={4}
              value={efirData.description}
              onChange={(e) => setEfirData({ ...efirData, description: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Generate E-FIR
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboardSection()
      case "lookup":
        return renderLookupSection()
      case "efir":
        return renderEfirSection()
      default:
        return renderDashboardSection()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <OfficialNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        alertCount={mockAlerts.length}
      />

      <div className="max-w-7xl mx-auto p-4">{renderActiveSection()}</div>
    </div>
  )
}
