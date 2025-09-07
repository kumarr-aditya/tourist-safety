"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, MapPin, AlertTriangle, Link, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import LanguageSwitcher from "@/components/language-switcher"
import { registerOnBlockchain } from "@/lib/blockchain-utils"

export default function AuthPage() {
  const { t } = useLanguage()
  const [loginData, setLoginData] = useState({ email: "", password: "", role: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const [blockchainStatus, setBlockchainStatus] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    // Mock login - redirect based on role
    if (loginData.role === "tourist") {
      window.location.href = "/tourist-dashboard"
    } else if (loginData.role === "official") {
      window.location.href = "/official-dashboard"
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsRegistering(true)
    setBlockchainStatus(null)

    try {
      // Simulate blockchain registration process
      setBlockchainStatus({ type: "processing", message: t("blockchain.generating") })

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Register on blockchain
      const blockchainResult = registerOnBlockchain({
        name: registerData.name,
        email: registerData.email,
        role: registerData.role,
      })

      if (blockchainResult.success) {
        setBlockchainStatus({
          type: "success",
          message: t("blockchain.success"),
          blockchainId: blockchainResult.blockchainId,
        })

        // Store user data with blockchain ID for the session
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...registerData,
            blockchainId: blockchainResult.blockchainId,
          }),
        )

        // Redirect after showing success
        setTimeout(() => {
          if (registerData.role === "tourist") {
            window.location.href = "/tourist-dashboard"
          } else if (registerData.role === "official") {
            window.location.href = "/official-dashboard"
          }
        }, 3000)
      }
    } catch (error) {
      setBlockchainStatus({
        type: "error",
        message: t("blockchain.error"),
      })
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher variant="buttons" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("auth.welcomeTitle")}</h1>
          <p className="text-muted-foreground">{t("auth.welcomeSubtitle")}</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("auth.welcomeMessage")}</CardTitle>
            <CardDescription>{t("auth.signInDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t("common.login")}</TabsTrigger>
                <TabsTrigger value="register">{t("common.register")}</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t("auth.email")}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder={t("auth.enterEmail")}
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t("auth.password")}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder={t("auth.enterPassword")}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-role">{t("auth.role")}</Label>
                    <Select onValueChange={(value) => setLoginData({ ...loginData, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("auth.selectRole")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tourist">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {t("auth.tourist")}
                          </div>
                        </SelectItem>
                        <SelectItem value="official">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {t("auth.departmentOfficial")}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={!loginData.role}>
                    {t("common.login")}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">{t("auth.fullName")}</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder={t("auth.enterFullName")}
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t("auth.email")}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder={t("auth.enterEmail")}
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t("auth.password")}</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder={t("auth.createPassword")}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t("auth.confirmPassword")}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder={t("auth.confirmYourPassword")}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-role">{t("auth.role")}</Label>
                    <Select onValueChange={(value) => setRegisterData({ ...registerData, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("auth.selectRole")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tourist">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {t("auth.tourist")}
                          </div>
                        </SelectItem>
                        <SelectItem value="official">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {t("auth.departmentOfficial")}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={!registerData.role || isRegistering}>
                    {isRegistering ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t("blockchain.registering")}
                      </div>
                    ) : (
                      t("auth.createAccount")
                    )}
                  </Button>

                  {blockchainStatus && (
                    <div
                      className={`p-4 rounded-lg border ${
                        blockchainStatus.type === "success"
                          ? "bg-green-50 border-green-200"
                          : blockchainStatus.type === "error"
                            ? "bg-red-50 border-red-200"
                            : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {blockchainStatus.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {blockchainStatus.type === "processing" && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        )}
                        {blockchainStatus.type === "error" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        <span
                          className={`text-sm font-medium ${
                            blockchainStatus.type === "success"
                              ? "text-green-800"
                              : blockchainStatus.type === "error"
                                ? "text-red-800"
                                : "text-blue-800"
                          }`}
                        >
                          {blockchainStatus.message}
                        </span>
                      </div>
                      {blockchainStatus.blockchainId && (
                        <div className="flex items-center gap-2 text-xs text-green-700">
                          <Link className="h-3 w-3" />
                          <span className="font-mono">{blockchainStatus.blockchainId}</span>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </TabsContent>
            </Tabs>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">{t("auth.demoCredentials")}</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>{t("auth.tourist")}:</strong> tourist@demo.com / password
                </p>
                <p>
                  <strong>{t("auth.departmentOfficial")}:</strong> official@demo.com / password
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
