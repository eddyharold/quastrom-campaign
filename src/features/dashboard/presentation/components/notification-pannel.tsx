"use client"

import { useState, useEffect } from "react"
import { Button } from "@/presentation/components/ui/button"
import { Input } from "@/presentation/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select"
import {
  X,
  Search,
  CheckCircle,
  AlertTriangle,
  Target,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Bell,
} from "lucide-react"

const allNotifications = [
  {
    id: 1,
    type: "warning",
    icon: AlertTriangle,
    title: "Budget Alert",
    message: "B2B Software Leads campaign has spent 80% of its budget",
    timestamp: "3 hours ago",
    read: false,
    color: "amber",
  },
  {
    id: 2,
    type: "info",
    icon: Target,
    title: "Conversion Validation",
    message: "12 new leads require validation for payment processing",
    timestamp: "1 hour ago",
    read: false,
    color: "blue",
  },
  {
    id: 3,
    type: "warning",
    icon: DollarSign,
    title: "Wallet Balance Low",
    message: "Your wallet balance is below $500",
    timestamp: "5 hours ago",
    read: true,
    color: "gray",
  },
  {
    id: 4,
    type: "success",
    icon: TrendingUp,
    title: "Campaign Performance",
    message: "Financial Services campaign exceeded conversion targets by 25%",
    timestamp: "2 days ago",
    read: false,
    color: "green",
  },
  {
    id: 5,
    type: "info",
    icon: MessageSquare,
    title: "New Comment",
    message: "Affiliate partner left a comment on Healthcare campaign",
    timestamp: "1 day ago",
    read: true,
    color: "blue",
  },
  {
    id: 6,
    type: "success",
    icon: CheckCircle,
    title: "Payment Processed",
    message: "Wallet top-up of $1,000 has been successfully processed",
    timestamp: "3 days ago",
    read: true,
    color: "green",
  },
]

const colorClasses = {
  amber: {
    bg: "bg-gradient-to-r from-amber-50 to-orange-50",
    border: "border-amber-200",
    icon: "bg-amber-100 text-amber-600",
    text: "text-amber-900",
    subtext: "text-amber-700",
  },
  blue: {
    bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
    border: "border-blue-200",
    icon: "bg-blue-100 text-blue-600",
    text: "text-blue-900",
    subtext: "text-blue-700",
  },
  gray: {
    bg: "bg-gradient-to-r from-gray-50 to-slate-50",
    border: "border-gray-200",
    icon: "bg-gray-100 text-gray-600",
    text: "text-gray-900",
    subtext: "text-gray-700",
  },
  green: {
    bg: "bg-gradient-to-r from-green-50 to-emerald-50",
    border: "border-green-200",
    icon: "bg-green-100 text-green-600",
    text: "text-green-900",
    subtext: "text-green-700",
  },
}

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  notifications: typeof allNotifications
  onDismiss: (id: number) => void
  onMarkAllRead: () => void
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onDismiss,
  onMarkAllRead,
}: NotificationPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || notification.type === filterType
    return matchesSearch && matchesFilter
  })

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const panel = document.getElementById("notification-panel")
      if (isOpen && panel && !panel.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" />}

      {/* Slide-in Panel */}
      <div
        id="notification-panel"
        className={`fixed top-0 right-0 h-full w-96 bg-white border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Controls */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={onMarkAllRead}>
                Mark all as read
              </Button>
              <span className="text-sm text-muted-foreground">
                {notifications.filter((n) => !n.read).length} unread
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-8"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Alert</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifications.map((notification) => {
              const colors = colorClasses[notification.color as keyof typeof colorClasses]
              const IconComponent = notification.icon

              return (
                <div
                  key={notification.id}
                  className={`group relative ${colors.bg} border ${colors.border} rounded-lg p-3 hover:shadow-sm transition-all ${
                    !notification.read ? "ring-1 ring-blue-200" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-7 h-7 ${colors.icon} rounded-full flex items-center justify-center`}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${colors.text}`}>{notification.title}</p>
                          <p className={`text-sm ${colors.subtext} mt-0.5 line-clamp-2`}>{notification.message}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDismiss(notification.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${colors.subtext}`}>{notification.timestamp}</span>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No notifications found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

interface NotificationCardProps {
  notification: (typeof allNotifications)[0]
  onDismiss: (id: number) => void
}

export function NotificationCard({ notification, onDismiss }: NotificationCardProps) {
  const colors = colorClasses[notification.color as keyof typeof colorClasses]
  const IconComponent = notification.icon

  return (
    <div
      className={`group relative ${colors.bg} border ${colors.border} rounded-lg p-3 hover:shadow-sm transition-all ${
        !notification.read ? "ring-1 ring-blue-200" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-7 h-7 ${colors.icon} rounded-full flex items-center justify-center`}>
          <IconComponent className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${colors.text}`}>{notification.title}</p>
              <p className={`text-sm ${colors.subtext} mt-0.5 line-clamp-1`}>{notification.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(notification.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 ml-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs ${colors.subtext}`}>{notification.timestamp}</span>
            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
          </div>
        </div>
      </div>
    </div>
  )
}

export { allNotifications }
