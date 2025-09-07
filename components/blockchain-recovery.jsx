"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Key, AlertTriangle, CheckCircle, Clock, RefreshCw } from "lucide-react"
import { initiateIdRecovery } from "@/lib/blockchain-utils"

export default function BlockchainRecovery() {
  const [recoveryData, setRecoveryData] = useState({
    email: "",
    backupPhrase: "",
    securityQuestion: "",
    securityAnswer: "",
  })
  const [recoveryStatus, setRecoveryStatus] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRecoverySubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setRecoveryStatus(null)

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const recoveryRequest = initiateIdRecovery(recoveryData.email, {
        backupPhrase: recoveryData.backupPhrase,
        securityQuestion: recoveryData.securityQuestion,
        securityAnswer: recoveryData.securityAnswer,
      })

      setRecoveryStatus({
        type: "success",
        message: "Recovery request submitted successfully",
        recoveryId: recoveryRequest.id,
        estimatedTime: "24-48 hours",
      })

      // Reset form
      setRecoveryData({
        email: "",
        backupPhrase: "",
        securityQuestion: "",
        securityAnswer: "",
      })
    } catch (error) {
      setRecoveryStatus({
        type: "error",
        message: "Failed to submit recovery request. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-primary/10 rounded-full p-3">
            <Key className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Shield className="h-5 w-5" />
          Blockchain ID Recovery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRecoverySubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recovery-email">Email Address</Label>
            <Input
              id="recovery-email"
              type="email"
              placeholder="Enter your registered email"
              value={recoveryData.email}
              onChange={(e) => setRecoveryData({ ...recoveryData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backup-phrase">Backup Recovery Phrase</Label>
            <Textarea
              id="backup-phrase"
              placeholder="Enter your 12-word backup phrase"
              rows={3}
              value={recoveryData.backupPhrase}
              onChange={(e) => setRecoveryData({ ...recoveryData, backupPhrase: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="security-question">Security Question</Label>
            <Input
              id="security-question"
              placeholder="What was your first pet's name?"
              value={recoveryData.securityQuestion}
              onChange={(e) => setRecoveryData({ ...recoveryData, securityQuestion: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="security-answer">Security Answer</Label>
            <Input
              id="security-answer"
              placeholder="Enter your security answer"
              value={recoveryData.securityAnswer}
              onChange={(e) => setRecoveryData({ ...recoveryData, securityAnswer: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing Recovery...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Submit Recovery Request
              </div>
            )}
          </Button>
        </form>

        {recoveryStatus && (
          <Alert
            className={`mt-4 ${
              recoveryStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-2">
              {recoveryStatus.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={recoveryStatus.type === "success" ? "text-green-800" : "text-red-800"}>
                {recoveryStatus.message}
              </AlertDescription>
            </div>
            {recoveryStatus.recoveryId && (
              <div className="mt-2 p-2 bg-white rounded border">
                <p className="text-xs text-muted-foreground">Recovery ID:</p>
                <code className="text-xs font-mono">{recoveryStatus.recoveryId}</code>
                <p className="text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Estimated processing time: {recoveryStatus.estimatedTime}
                </p>
              </div>
            )}
          </Alert>
        )}

        <div className="mt-6 p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Recovery Information</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Recovery requests are processed within 24-48 hours</p>
            <p>• You will receive email confirmation once processed</p>
            <p>• Keep your recovery ID safe for tracking purposes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
