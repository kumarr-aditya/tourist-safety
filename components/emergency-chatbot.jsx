"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Send, MessageCircle, Phone, MapPin, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function EmergencyChatbot({ isOpen, onClose }) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      message: t("chatbot.welcomeMessage"),
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0") * -1)
      }
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { id: "emergency", text: t("chatbot.callEmergency"), icon: Phone, urgent: true },
    { id: "location", text: t("chatbot.shareLocation"), icon: MapPin },
    { id: "medical", text: t("chatbot.medicalHelp"), icon: AlertTriangle },
    { id: "police", text: t("chatbot.contactPolice"), icon: Phone },
  ]

  const handleQuickAction = (actionId) => {
    let response = ""
    switch (actionId) {
      case "emergency":
        response = t("chatbot.emergencyResponse")
        break
      case "location":
        response = t("chatbot.locationResponse")
        break
      case "medical":
        response = t("chatbot.medicalResponse")
        break
      case "police":
        response = t("chatbot.policeResponse")
        break
      default:
        response = t("chatbot.defaultResponse")
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      message: quickActions.find((a) => a.id === actionId)?.text || "",
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: response,
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false)
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        message: t("chatbot.helpResponse"),
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ touchAction: "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      onTouchMove={(e) => {
        e.preventDefault()
      }}
    >
      <Card
        className="w-96 h-[500px] flex flex-col shadow-2xl border-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: "auto" }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-t-lg flex-shrink-0 border-0 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg text-white font-bold tracking-wide">{t("chatbot.title")}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 hover:text-white border-0 rounded-full p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0 bg-card">
          <div
            className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-gradient-to-b from-card to-muted/30"
            style={{
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              maxHeight: "280px",
            }}
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground ml-4"
                      : "bg-white text-card-foreground border border-border/20 mr-4"
                  }`}
                >
                  <p className="text-sm leading-relaxed font-medium">{message.message}</p>
                  <p className="text-xs opacity-70 mt-2 font-normal">{message.timestamp}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-card-foreground p-4 rounded-2xl shadow-sm border border-border/20 mr-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border/20 bg-muted/50 flex-shrink-0">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              {t("chatbot.quickActions")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.urgent ? "destructive" : "secondary"}
                  size="sm"
                  onClick={() => handleQuickAction(action.id)}
                  className="flex items-center space-x-2 text-xs h-10 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <action.icon className="h-3 w-3" />
                  <span className="truncate">{action.text}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-border/20 bg-background flex-shrink-0">
            <div className="flex space-x-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t("chatbot.messagePlaceholder")}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 text-sm bg-input border-border/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-secondary hover:bg-secondary/90 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
