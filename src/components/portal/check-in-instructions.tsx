'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Key,
  MapPin,
  Clock,
  Wifi,
  Car,
  Phone,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react'
import type { Property, Booking } from '@/types/database'

interface CheckInInstructionsProps {
  property: Property
  booking: Booking
}

export function CheckInInstructions({
  property,
  booking,
}: CheckInInstructionsProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [copiedAddress, setCopiedAddress] = useState(false)

  const copyAddress = async () => {
    await navigator.clipboard.writeText(property.address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  // These would typically come from a property_details or check_in_info table
  // For now, using placeholder content that demonstrates the structure
  const checkInDetails = {
    accessCode: '1234#', // Would come from secure field
    wifiName: 'PropertyWiFi',
    wifiPassword: 'guestpassword123',
    parkingInfo: 'Free parking available in the driveway.',
    emergencyContact: '(555) 123-4567',
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-green-100/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Key className="h-5 w-5" />
                Check-in Instructions
              </CardTitle>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-green-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-green-600" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-white p-2">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Address</p>
                <p className="text-sm text-green-700">{property.address}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-8 text-green-600 hover:text-green-800 hover:bg-green-100"
                  onClick={copyAddress}
                >
                  {copiedAddress ? (
                    <>
                      <Check className="mr-2 h-3 w-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-3 w-3" />
                      Copy Address
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Check-in Time */}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-white p-2">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Check-in Time</p>
                <p className="text-sm text-green-700">
                  {property.check_in_time || '3:00 PM'} or later
                </p>
              </div>
            </div>

            {/* Access Code */}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-white p-2">
                <Key className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Door Access</p>
                <p className="text-sm text-green-700">
                  Use the keypad at the front door. Your access code is:{' '}
                  <code className="rounded bg-white px-2 py-0.5 font-mono font-bold">
                    {checkInDetails.accessCode}
                  </code>
                </p>
              </div>
            </div>

            {/* WiFi */}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-white p-2">
                <Wifi className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">WiFi</p>
                <p className="text-sm text-green-700">
                  Network:{' '}
                  <code className="rounded bg-white px-2 py-0.5 font-mono">
                    {checkInDetails.wifiName}
                  </code>
                </p>
                <p className="text-sm text-green-700">
                  Password:{' '}
                  <code className="rounded bg-white px-2 py-0.5 font-mono">
                    {checkInDetails.wifiPassword}
                  </code>
                </p>
              </div>
            </div>

            {/* Parking */}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-white p-2">
                <Car className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Parking</p>
                <p className="text-sm text-green-700">{checkInDetails.parkingInfo}</p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-white p-2">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Emergency Contact
                </p>
                <p className="text-sm text-green-700">
                  For urgent issues during your stay:{' '}
                  <a
                    href={`tel:${checkInDetails.emergencyContact}`}
                    className="font-medium underline"
                  >
                    {checkInDetails.emergencyContact}
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
