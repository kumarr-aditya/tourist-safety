"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Link, Clock, CheckCircle, AlertTriangle, Zap, Activity, RefreshCw } from "lucide-react"
import { getBlockchainNetworkStatus, getVerificationLevel, getBlockchainHistory } from "@/lib/blockchain-utils"

export default function BlockchainStatus({ blockchainId }) {
  const [networkStatus, setNetworkStatus] = useState(null)
  const [verificationLevel, setVerificationLevel] = useState(null)
  const [transactionHistory, setTransactionHistory] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadBlockchainData()
  }, [blockchainId])

  const loadBlockchainData = async () => {
    if (!blockchainId) return

    setIsRefreshing(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const network = getBlockchainNetworkStatus()
    const verification = getVerificationLevel(blockchainId)
    const history = getBlockchainHistory(blockchainId)

    setNetworkStatus(network)
    setVerificationLevel(verification)
    setTransactionHistory(history)
    setIsRefreshing(false)
  }

  const getVerificationColor = (level) => {
    switch (level) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 2:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case 3:
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getVerificationIcon = (level) => {
    switch (level) {
      case 1:
        return <Clock className="h-4 w-4" />
      case 2:
        return <CheckCircle className="h-4 w-4" />
      case 3:
        return <Shield className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (!blockchainId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No blockchain ID available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Blockchain ID Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Link className="h-4 w-4" />
            Blockchain Identity Status
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={loadBlockchainData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Blockchain ID</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">{blockchainId}</code>
            </div>

            {verificationLevel && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Verification Level</span>
                <Badge className={`${getVerificationColor(verificationLevel.level)} flex items-center gap-1`}>
                  {getVerificationIcon(verificationLevel.level)}
                  {verificationLevel.status}
                </Badge>
              </div>
            )}

            {verificationLevel && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Trust Score</span>
                  <span className="font-medium">{verificationLevel.level * 33}%</span>
                </div>
                <Progress value={verificationLevel.level * 33} className="h-2" />
                <p className="text-xs text-muted-foreground">{verificationLevel.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Network Status */}
      {networkStatus && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Network Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground">Network</span>
                <p className="font-medium">{networkStatus.network}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium capitalize">{networkStatus.status}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Block Height</span>
                <p className="font-mono text-xs">{networkStatus.blockHeight.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Gas Price</span>
                <p className="font-mono text-xs">{networkStatus.gasPrice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      {transactionHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactionHistory.map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {tx.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Block #{tx.blockHeight.toLocaleString()}</span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">{tx.id}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={tx.status === "confirmed" ? "default" : "secondary"} className="text-xs">
                      {tx.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{tx.fee}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
