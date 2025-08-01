"use client"

import type { Event } from "@/types"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface EventDetailsModalProps {
  event: Event | null
  open: boolean
  onClose: () => void
}

export default function EventDetailsModal({ event, open, onClose }: EventDetailsModalProps) {
  // Responsive state
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!open || !event) return null

  // --- MOBILE LAYOUT: Bottom Sheet Style ---
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
        {/* Scrollable Content including Poster */}
        <div className="relative bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-y-auto max-h-[calc(100vh-5rem)]">
          {/* Poster Banner - fit entire poster with aspect ratio 3/4 */}
          <div className="relative w-full bg-white rounded-t-2xl flex items-center justify-center aspect-[3/4] max-h-[80vh]">
            <Image
              src={event.posterUrl || "/placeholder.svg"}
              alt={`${event.title} poster`}
              width={300}
              height={400}
              className="object-contain w-full h-full rounded-t-2xl"
              priority
            />
            {/* Animated down chevron for scroll hint */}
            <div className="absolute bottom-8 left-0 w-full flex justify-center z-20 pointer-events-none">
              <svg className="w-7 h-7 animate-bounce text-gray-400 opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {/* Fade-out gradient at bottom of poster */}
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-b from-transparent to-white pointer-events-none" />
            <button
              className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-700 hover:text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg text-2xl z-10"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          {/* Event Title (no overlap) */}
          <div className="relative px-5 pt-4">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{event.title}</h2>
          </div>
          {/* Bottom Sheet Content */}
          <div className="px-5 pb-28">
            <div className="flex flex-wrap gap-2 items-center text-sm font-medium mb-4">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full font-semibold ${event.registeredCount >= event.capacity ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                {event.registeredCount >= event.capacity ? "Full" : `${event.capacity - event.registeredCount} spots left`}
              </span>
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full">
                <MapPinIcon className="w-4 h-4 text-blue-600" />
                {event.location}
              </span>
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                {(() => {
                  const date = new Date(`1970-01-01T${event.time}`);
                  if (!isNaN(date.getTime())) {
                    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                  }
                  return event.time;
                })()}
              </span>
              {event.price !== undefined && event.price > 0 && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full">
                  <span className="text-green-600 font-bold">₹</span>
                  ₹{event.price}
                </span>
              )}
              {event.price === 0 && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free
                </span>
              )}
            </div>
            <hr className="my-3 border-gray-200/70" />
            <div className="text-base text-gray-700 whitespace-pre-line mb-4 leading-relaxed">{event.description}</div>
          </div>
        </div>
        {/* Sticky Register Button */}
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-2xl shadow-2xl px-4 py-4 flex justify-center">
          <Link href={`/events/${event.id}/register`} passHref legacyBehavior>
            <Button
              size="lg"
              className="w-full max-w-md px-0 py-4 text-lg font-semibold rounded-xl shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={event.registeredCount >= event.capacity}
            >
              {event.registeredCount >= event.capacity ? "Event Full" : "Register Now"}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // --- DESKTOP LAYOUT: Restore previous glassmorphic modal ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md">
      <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl lg:rounded-3xl shadow-2xl max-w-4xl w-full mx-0 lg:mx-4 animate-fade-in p-0 overflow-hidden flex flex-col lg:flex-row">
        <button
          className="absolute top-2 right-2 lg:top-4 lg:right-4 text-gray-600 hover:text-gray-900 text-3xl lg:text-2xl font-bold z-20 bg-white/50 backdrop-blur-sm rounded-full w-10 h-10 lg:w-8 lg:h-8 flex items-center justify-center hover:bg-white/70 transition-all"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Poster Section */}
        {event.posterUrl && (
          <div className="flex-shrink-0 flex flex-col justify-center items-center w-full lg:w-80 p-3 lg:p-8">
            <div className="rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm border border-white/30 p-1 lg:p-2 mb-3 lg:mb-4">
              <div className="rounded-lg lg:rounded-xl overflow-hidden">
                <Image
                  src={event.posterUrl || "/placeholder.svg"}
                  alt={`${event.title} poster`}
                  width={320}
                  height={420}
                  className="object-cover w-full h-auto max-h-[320px] lg:max-h-[420px]"
                  priority
                />
              </div>
            </div>
            {/* Register Button below poster */}
            <Link href={`/events/${event.id}/register`} passHref legacyBehavior>
              <Button
                size="lg"
                className="w-full px-0 lg:px-10 py-3 lg:py-4 text-base lg:text-lg font-semibold rounded-xl lg:rounded-2xl shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none backdrop-blur-sm border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={event.registeredCount >= event.capacity}
              >
                {event.registeredCount >= event.capacity ? "Event Full" : "Register Now"}
              </Button>
            </Link>
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 flex flex-col min-w-0 px-3 pt-3 pb-3 lg:px-6 lg:pt-6 lg:pb-6 lg:pl-0 lg:pr-8">
          <div className="flex-1 overflow-y-auto max-h-[60vh] lg:max-h-[70vh] pr-0 lg:pr-1">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3 lg:mb-4">{event.title}</h2>

            {/* Info Chips Row */}
            <div className="flex flex-wrap gap-2 lg:gap-3 items-center text-sm lg:text-base font-medium mb-4 lg:mb-6">
              <span
                className={`inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${
                  event.registeredCount >= event.capacity
                    ? "bg-red-100/80 text-red-800 border-red-200/50"
                    : "bg-green-100/80 text-green-800 border-green-200/50"
                }`}
              >
                {event.registeredCount >= event.capacity
                  ? "Full"
                  : `${event.capacity - event.registeredCount} spots left`}
              </span>

              <span className="inline-flex items-center gap-2 bg-gray-100/80 backdrop-blur-sm text-gray-800 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm border border-gray-200/50">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>

              <span className="inline-flex items-center gap-2 bg-gray-100/80 backdrop-blur-sm text-gray-800 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm border border-gray-200/50">
                <MapPinIcon className="w-4 h-4 text-blue-600" />
                {event.location}
              </span>

              <span className="inline-flex items-center gap-2 bg-gray-100/80 backdrop-blur-sm text-gray-800 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm border border-gray-200/50">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                {(() => {
                  const date = new Date(`1970-01-01T${event.time}`);
                  if (!isNaN(date.getTime())) {
                    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                  }
                  return event.time;
                })()}
              </span>
              {event.price !== undefined && event.price > 0 && (
                <span className="inline-flex items-center gap-2 bg-green-100/80 backdrop-blur-sm text-green-800 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm border border-green-200/50">
                  <span className="text-green-600 font-bold">₹</span>
                  ₹{event.price}
                </span>
              )}
              {event.price === 0 && (
                <span className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm text-blue-800 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm border border-blue-200/50">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free
                </span>
              )}
            </div>

            {/* Divider for better visibility */}
            <hr className="my-3 lg:my-4 border-gray-200/70" />

            {/* Description */}
            <div className="text-base lg:text-lg text-gray-700 whitespace-pre-line mb-4 lg:mb-6 leading-relaxed">{event.description}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 