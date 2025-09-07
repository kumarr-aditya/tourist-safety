"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, AlertTriangle, CheckCircle, Navigation, Star, Locate, Users } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import locationDatabase from "@/lib/data/locations-database.json"

export default function SafetyHeatmapSection() {
  const { t } = useLanguage()
  console.log("[v0] SafetyHeatmapSection component loaded")

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [showCurrentLocation, setShowCurrentLocation] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [map, setMap] = useState(null)
  const mapRef = useRef(null)

  const locations = locationDatabase.locations.map((location) => ({
    id: location.id,
    name: location.name,
    coordinates: [location.coordinates.latitude, location.coordinates.longitude],
    safetyScore: location.safety_metrics.overall_score,
    category: location.safety_metrics.category,
    crowdLevel: location.crowd_analytics.current_level,
    incidents: location.incident_data.total_incidents_30d,
    features: location.safety_features.map((feature) => feature.name),
    description: location.description,
    address: `${location.address.street}, ${location.address.city}, ${location.address.state}`,
    lastUpdated: location.updated_at,
    riskLevel: location.safety_metrics.risk_level,
    averageVisitors: location.crowd_analytics.average_daily_visitors,
    incidentTypes: location.incident_data.incident_types,
  }))

  const databaseInfo = locationDatabase.metadata

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const cssLink = document.createElement("link")
          cssLink.rel = "stylesheet"
          cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          cssLink.crossOrigin = ""
          document.head.appendChild(cssLink)
        }

        // Load Leaflet JS
        if (!window.L) {
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          script.crossOrigin = ""

          script.onload = () => {
            setLeafletLoaded(true)
          }

          script.onerror = () => {
            console.error("[v0] Failed to load Leaflet")
            setLeafletLoaded(false)
          }

          document.head.appendChild(script)
        } else {
          setLeafletLoaded(true)
        }
      } catch (error) {
        console.error("[v0] Error loading Leaflet:", error)
        setLeafletLoaded(false)
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (leafletLoaded && window.L && mapRef.current && !map) {
      try {
        const leafletMap = window.L.map(mapRef.current, {
          center: [40.758, -73.9855], // Times Square
          zoom: 13,
          zoomControl: true,
        })

        // Add tile layer
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(leafletMap)

        // Add location markers
        locations.forEach((location) => {
          const color = getSafetyColor(location.safetyScore)
          const crowdIcon = getCrowdIcon(location.crowdLevel)

          // Create custom marker
          const marker = window.L.circleMarker(location.coordinates, {
            radius: 12,
            fillColor: color,
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(leafletMap)

          const popupContent = `
            <div class="p-2">
              <h3 class="font-bold text-sm mb-2">${location.name}</h3>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span>ID:</span>
                  <span class="font-mono text-xs">${location.id}</span>
                </div>
                <div class="flex justify-between">
                  <span>Safety Score:</span>
                  <span class="font-semibold">${location.safetyScore}/100</span>
                </div>
                <div class="flex justify-between">
                  <span>Risk Level:</span>
                  <span class="capitalize">${location.riskLevel.replace("_", " ")}</span>
                </div>
                <div class="flex justify-between">
                  <span>Crowd Level:</span>
                  <span>${crowdIcon} ${location.crowdLevel}</span>
                </div>
                <div class="flex justify-between">
                  <span>Daily Visitors:</span>
                  <span>${location.averageVisitors?.toLocaleString() || "N/A"}</span>
                </div>
                <div class="flex justify-between">
                  <span>Incidents (30d):</span>
                  <span>${location.incidents}</span>
                </div>
                <div class="text-xs text-gray-500 mt-2">
                  Last Updated: ${new Date(location.lastUpdated).toLocaleDateString()}
                </div>
                <p class="mt-2 text-gray-600">${location.description}</p>
              </div>
            </div>
          `

          marker.bindPopup(popupContent)

          marker.on("click", () => {
            setSelectedLocation(location)
          })

          // Add safety zone circle
          window.L.circle(location.coordinates, {
            radius: 200,
            fillColor: color,
            color: color,
            weight: 1,
            opacity: 0.6,
            fillOpacity: 0.2,
          }).addTo(leafletMap)
        })

        setMap(leafletMap)
        console.log("[v0] Leaflet map initialized successfully")
      } catch (error) {
        console.error("[v0] Error initializing Leaflet map:", error)
      }
    }
  }, [leafletLoaded, map])

  const getSafetyColor = (score) => {
    if (score >= 90) return "#22c55e"
    if (score >= 80) return "#3b82f6"
    if (score >= 70) return "#eab308"
    return "#ef4444"
  }

  const getSafetyBadge = (category) => {
    const variants = {
      "very-safe": "default",
      safe: "secondary",
      moderate: "outline",
      caution: "destructive",
    }
    return variants[category] || "outline"
  }

  const getCrowdIcon = (level) => {
    switch (level) {
      case "high":
        return "🔴"
      case "medium":
        return "🟡"
      case "low":
        return "🟢"
      default:
        return "⚪"
    }
  }

  const getCrowdBadge = (level) => {
    switch (level) {
      case "high":
        return "destructive"
      case "medium":
        return "outline"
      case "low":
        return "default"
      default:
        return "secondary"
    }
  }

  const handleLocateMe = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation([latitude, longitude])
          setShowCurrentLocation(true)

          // Add current location marker to map
          if (window.L) {
            const currentMarker = window.L.marker([latitude, longitude], {
              icon: window.L.divIcon({
                html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                className: "current-location-marker",
              }),
            }).addTo(map)

            currentMarker.bindPopup("📍 You are here").openPopup()
            map.setView([latitude, longitude], 15)
          }
        },
        () => {
          // Fallback to Times Square
          const fallback = [40.758, -73.9855]
          setCurrentLocation(fallback)
          setShowCurrentLocation(true)
          if (map) {
            map.setView(fallback, 15)
          }
        },
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">🗺️ {t("heatmap.title")}</h2>
        <p className="text-blue-100">{t("heatmap.description")}</p>
        <div className="mt-3 text-xs text-blue-200">
          Data Source: {databaseInfo.data_source} | Version: {databaseInfo.version} | Last Updated:{" "}
          {new Date(databaseInfo.last_updated).toLocaleDateString()}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t("heatmap.mapTitle")}
          </CardTitle>
          <CardDescription>{t("heatmap.mapDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Leaflet Map */}
            <div className="lg:col-span-2">
              <div className="relative rounded-lg border overflow-hidden">
                <div ref={mapRef} className="h-[400px] w-full" style={{ minHeight: "400px" }} />

                {/* Custom controls overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white shadow-lg border-2"
                    onClick={handleLocateMe}
                    disabled={!leafletLoaded}
                  >
                    <Locate className="h-4 w-4" />
                  </Button>
                </div>

                {/* Loading indicator */}
                {!leafletLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading map...</p>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg border-2 z-[1000] max-w-[200px]">
                  <h4 className="font-semibold text-sm mb-3">{t("heatmap.legend.title")}</h4>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-700 mb-1">{t("heatmap.legend.safetyScores")}:</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>{t("heatmap.legend.verySafe")} (90+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>{t("heatmap.legend.safe")} (80-89)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>{t("heatmap.legend.moderate")} (70-79)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>{t("heatmap.legend.caution")} (&lt;70)</span>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-gray-700 mb-1 mt-3">
                      {t("heatmap.legend.crowdLevels")}:
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🔴</span>
                        <span>{t("heatmap.legend.highCrowd")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🟡</span>
                        <span>{t("heatmap.legend.mediumCrowd")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🟢</span>
                        <span>{t("heatmap.legend.lowCrowd")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-4">
              {selectedLocation ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedLocation.name}
                      </span>
                      <Badge variant={getSafetyBadge(selectedLocation.category)}>
                        {selectedLocation.category.replace("-", " ")}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs font-mono">
                      ID: {selectedLocation.id} | Risk: {selectedLocation.riskLevel?.replace("_", " ")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("heatmap.details.safetyScore")}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(selectedLocation.safetyScore / 20)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{selectedLocation.safetyScore}/100</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("heatmap.details.crowdLevel")}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={getCrowdBadge(selectedLocation.crowdLevel)} className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="capitalize">{selectedLocation.crowdLevel}</span>
                          <span>{getCrowdIcon(selectedLocation.crowdLevel)}</span>
                        </Badge>
                      </div>
                    </div>

                    {selectedLocation.averageVisitors && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Daily Visitors</span>
                        <span className="font-semibold">{selectedLocation.averageVisitors.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("heatmap.details.recentIncidents")}</span>
                      <span className="flex items-center gap-1">
                        {selectedLocation.incidents === 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        {selectedLocation.incidents}
                      </span>
                    </div>

                    {selectedLocation.incidentTypes && selectedLocation.incidentTypes.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground">Recent Incident Types</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedLocation.incidentTypes.map((type, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {type.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-sm text-muted-foreground">{t("heatmap.details.description")}</span>
                      <p className="text-sm mt-1">{selectedLocation.description}</p>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">{t("heatmap.details.safetyFeatures")}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedLocation.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground border-t pt-2">
                      <div>Address: {selectedLocation.address}</div>
                      <div>Last Updated: {new Date(selectedLocation.lastUpdated).toLocaleDateString()}</div>
                    </div>

                    <Button className="w-full" size="sm">
                      <Navigation className="h-4 w-4 mr-2" />
                      {t("heatmap.details.getDirections")}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t("heatmap.details.clickLocation")}</p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t("heatmap.overview.title")}</CardTitle>
                  <CardDescription className="text-xs">
                    {databaseInfo.total_records} locations in database
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{t("heatmap.overview.averageSafety")}</span>
                    <span className="font-semibold">
                      {Math.round(locations.reduce((sum, loc) => sum + loc.safetyScore, 0) / locations.length)}/100
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("heatmap.overview.totalLocations")}</span>
                    <span className="font-semibold">{locations.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("heatmap.overview.safeZones")}</span>
                    <span className="font-semibold text-green-600">
                      {locations.filter((l) => l.safetyScore >= 80).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("heatmap.overview.cautionAreas")}</span>
                    <span className="font-semibold text-yellow-600">
                      {locations.filter((l) => l.safetyScore < 70).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Incidents (30d)</span>
                    <span className="font-semibold text-red-600">
                      {locations.reduce((sum, loc) => sum + loc.incidents, 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
