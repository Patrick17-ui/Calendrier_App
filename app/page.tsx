"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Menu,
  Clock,
  MapPin,
  Users,
  Calendar,
  Pause,
  Sparkles,
  X,
  Check,
} from "lucide-react"
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  getDay,
  getDate,
  setHours,
} from "date-fns"
import { fr } from "date-fns/locale"

// Types
type Event = {
  id: number
  title: string
  startTime: string
  endTime: string
  color: string
  date: Date
  description: string
  location: string
  attendees: string[]
  organizer: string
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAIPopup, setShowAIPopup] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    color: "bg-blue-500",
    description: "",
    location: "",
    attendees: [],
    organizer: "Moi",
  })
  const [attendeeInput, setAttendeeInput] = useState("")
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([
    "Mon Calendrier",
    "Travail",
    "Personnel",
    "Famille",
  ])

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialiser les événements
  useEffect(() => {
    const initialEvents: Event[] = [
      {
        id: 1,
        title: "Réunion d'équipe",
        startTime: "09:00",
        endTime: "10:00",
        color: "bg-blue-500",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        description: "Synchronisation hebdomadaire de l'équipe",
        location: "Salle de conférence A",
        attendees: ["Jean Dupont", "Marie Martin", "Pierre Durand"],
        organizer: "Alice Lefebvre",
      },
      {
        id: 2,
        title: "Déjeuner avec Sarah",
        startTime: "12:30",
        endTime: "13:30",
        color: "bg-green-500",
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        description: "Discuter du calendrier du projet",
        location: "Café Nero",
        attendees: ["Sarah Lee"],
        organizer: "Vous",
      },
      {
        id: 3,
        title: "Revue de projet",
        startTime: "14:00",
        endTime: "15:30",
        color: "bg-purple-500",
        date: addDays(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()), 2),
        description: "Revue de l'avancement du projet T2",
        location: "Salle de réunion 3",
        attendees: ["Équipe Alpha", "Parties prenantes"],
        organizer: "Chef de projet",
      },
      {
        id: 4,
        title: "Appel client",
        startTime: "10:00",
        endTime: "11:00",
        color: "bg-yellow-500",
        date: addDays(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()), 1),
        description: "Revue trimestrielle avec client majeur",
        location: "Réunion Zoom",
        attendees: ["Équipe client", "Équipe commerciale"],
        organizer: "Responsable de compte",
      },
      {
        id: 5,
        title: "Brainstorming d'équipe",
        startTime: "13:00",
        endTime: "14:30",
        color: "bg-indigo-500",
        date: addDays(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()), 3),
        description: "Session d'idéation pour nouvelles fonctionnalités",
        location: "Espace créatif",
        attendees: ["Équipe produit", "Équipe design"],
        organizer: "Propriétaire du produit",
      },
    ]
    setEvents(initialEvents)
    setFilteredEvents(initialEvents)
  }, [])

  // Filtrer les événements en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events)
    } else {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredEvents(filtered)
    }
  }, [searchQuery, events])

  // Filtrer les événements en fonction des calendriers sélectionnés
  useEffect(() => {
    const calendarColors: Record<string, string> = {
      "Mon Calendrier": "bg-blue-500",
      Travail: "bg-green-500",
      Personnel: "bg-purple-500",
      Famille: "bg-orange-500",
    }

    const filtered = events.filter((event) => {
      const colorClass = event.color
      const calendarName = Object.keys(calendarColors).find((key) => calendarColors[key] === colorClass)
      return calendarName ? selectedCalendars.includes(calendarName) : true
    })

    setFilteredEvents(filtered)
  }, [selectedCalendars, events])

  // Animation de chargement
  useEffect(() => {
    setIsLoaded(true)

    // Afficher la popup AI après 3 secondes
    const popupTimer = setTimeout(() => {
      setShowAIPopup(true)
    }, 3000)

    return () => clearTimeout(popupTimer)
  }, [])

  // Animation de texte pour la popup AI
  useEffect(() => {
    if (showAIPopup) {
      const text =
        "Il semble que vous n'ayez pas beaucoup de réunions aujourd'hui. Souhaitez-vous que je joue les essentiels de Hans Zimmer pour vous aider à entrer dans votre état de concentration ?"
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setTypedText((prev) => prev + text.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 50)

      return () => clearInterval(typingInterval)
    }
  }, [showAIPopup])

  // Gestion de l'audio
  useEffect(() => {
    if (isPlaying) {
      audioRef.current = new Audio("https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-0.mp3")
      audioRef.current.loop = true
      audioRef.current.play()
    } else if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [isPlaying])

  // Fonctions de navigation
  const goToToday = () => setCurrentDate(new Date())

  const goToPrevious = () => {
    if (currentView === "day") {
      setCurrentDate(subDays(currentDate, 1))
    } else if (currentView === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(subMonths(currentDate, 1))
    }
  }

  const goToNext = () => {
    if (currentView === "day") {
      setCurrentDate(addDays(currentDate, 1))
    } else if (currentView === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addMonths(currentDate, 1))
    }
  }

  // Gestion des événements
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleCreateEvent = () => {
    setShowEventForm(true)
  }

  const handleEventFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Créer un nouvel événement
    const eventDate = new Date(currentDate)
    const [startHour, startMinute] = newEvent.startTime?.split(":").map(Number) || [9, 0]
    const [endHour, endMinute] = newEvent.endTime?.split(":").map(Number) || [10, 0]

    const newEventObj: Event = {
      id: events.length + 1,
      title: newEvent.title || "Nouvel événement",
      startTime: newEvent.startTime || "09:00",
      endTime: newEvent.endTime || "10:00",
      color: newEvent.color || "bg-blue-500",
      date: eventDate,
      description: newEvent.description || "",
      location: newEvent.location || "",
      attendees: newEvent.attendees || [],
      organizer: newEvent.organizer || "Moi",
    }

    setEvents([...events, newEventObj])
    setFilteredEvents([...filteredEvents, newEventObj])
    setShowEventForm(false)

    // Réinitialiser le formulaire
    setNewEvent({
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-blue-500",
      description: "",
      location: "",
      attendees: [],
      organizer: "Moi",
    })
  }

  const handleAddAttendee = () => {
    if (attendeeInput.trim() !== "") {
      setNewEvent({
        ...newEvent,
        attendees: [...(newEvent.attendees || []), attendeeInput.trim()],
      })
      setAttendeeInput("")
    }
  }

  const handleRemoveAttendee = (index: number) => {
    const updatedAttendees = [...(newEvent.attendees || [])]
    updatedAttendees.splice(index, 1)
    setNewEvent({
      ...newEvent,
      attendees: updatedAttendees,
    })
  }

  const toggleCalendarSelection = (calendarName: string) => {
    if (selectedCalendars.includes(calendarName)) {
      setSelectedCalendars(selectedCalendars.filter((cal) => cal !== calendarName))
    } else {
      setSelectedCalendars([...selectedCalendars, calendarName])
    }
  }

  // Calcul des jours pour la vue semaine
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Semaine commence le lundi
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Calcul des jours pour le mini-calendrier
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const firstDayOfMonth = getDay(monthStart)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // Ajuster pour commencer par lundi

  // Créneaux horaires pour la vue jour/semaine
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8) // 8h à 20h

  // Calendriers disponibles
  const myCalendars = [
    { name: "Mon Calendrier", color: "bg-blue-500" },
    { name: "Travail", color: "bg-green-500" },
    { name: "Personnel", color: "bg-purple-500" },
    { name: "Famille", color: "bg-orange-500" },
  ]

  // Fonction pour calculer la position et la hauteur d'un événement
  const calculateEventStyle = (startTime: string, endTime: string) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = (start - 8) * 80 // 80px par heure
    const height = (end - start) * 80
    return { top: `${top}px`, height: `${height}px` }
  }

  // Filtrer les événements pour la vue actuelle
  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter((event) => isSameDay(event.date, day))
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Image d'arrière-plan */}
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
        alt="Paysage de montagne"
        fill
        className="object-cover"
        priority
      />

      {/* Navigation */}
      <header
        className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6 opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 text-white" />
          <span className="text-2xl font-semibold text-white drop-shadow-lg">Calendrier</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              placeholder="Rechercher"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full bg-white/10 backdrop-blur-sm pl-10 pr-4 py-2 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          <Settings className="h-6 w-6 text-white drop-shadow-md" />
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md">
            U
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="relative h-screen w-full pt-20 flex">
        {/* Barre latérale */}
        <div
          className={`w-64 h-full bg-white/10 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 rounded-tr-3xl opacity-0 ${isLoaded ? "animate-fade-in" : ""} flex flex-col justify-between`}
          style={{ animationDelay: "0.4s" }}
        >
          <div>
            <button
              className="mb-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 px-4 py-3 text-white w-full"
              onClick={handleCreateEvent}
            >
              <Plus className="h-5 w-5" />
              <span>Créer</span>
            </button>

            {/* Mini Calendrier */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">{format(currentDate, "MMMM yyyy", { locale: fr })}</h3>
                <div className="flex gap-1">
                  <button
                    className="p-1 rounded-full hover:bg-white/20"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </button>
                  <button
                    className="p-1 rounded-full hover:bg-white/20"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                  <div key={i} className="text-xs text-white/70 font-medium py-1">
                    {day}
                  </div>
                ))}

                {/* Jours vides avant le début du mois */}
                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="text-xs invisible">
                    X
                  </div>
                ))}

                {/* Jours du mois */}
                {monthDays.map((day, i) => (
                  <div
                    key={`day-${i}`}
                    className={`text-xs rounded-full w-7 h-7 flex items-center justify-center cursor-pointer
                      ${isSameDay(day, currentDate) ? "bg-blue-500 text-white" : "text-white hover:bg-white/20"}`}
                    onClick={() => setCurrentDate(day)}
                  >
                    {getDate(day)}
                  </div>
                ))}
              </div>
            </div>

            {/* Mes Calendriers */}
            <div>
              <h3 className="text-white font-medium mb-3">Mes calendriers</h3>
              <div className="space-y-2">
                {myCalendars.map((cal, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-sm ${cal.color} flex items-center justify-center cursor-pointer`}
                      onClick={() => toggleCalendarSelection(cal.name)}
                    >
                      {selectedCalendars.includes(cal.name) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-white text-sm">{cal.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bouton plus */}
          <button
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 p-4 text-white w-14 h-14 self-start"
            onClick={handleCreateEvent}
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        {/* Vue Calendrier */}
        <div
          className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.6s" }}
        >
          {/* Contrôles du Calendrier */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-white bg-blue-500 rounded-md" onClick={goToToday}>
                Aujourd'hui
              </button>
              <div className="flex">
                <button className="p-2 text-white hover:bg-white/10 rounded-l-md" onClick={goToPrevious}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="p-2 text-white hover:bg-white/10 rounded-r-md" onClick={goToNext}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-white">{format(currentDate, "d MMMM", { locale: fr })}</h2>
            </div>

            <div className="flex items-center gap-2 rounded-md p-1">
              <button
                onClick={() => setCurrentView("day")}
                className={`px-3 py-1 rounded ${currentView === "day" ? "bg-white/20" : ""} text-white text-sm`}
              >
                Jour
              </button>
              <button
                onClick={() => setCurrentView("week")}
                className={`px-3 py-1 rounded ${currentView === "week" ? "bg-white/20" : ""} text-white text-sm`}
              >
                Semaine
              </button>
              <button
                onClick={() => setCurrentView("month")}
                className={`px-3 py-1 rounded ${currentView === "month" ? "bg-white/20" : ""} text-white text-sm`}
              >
                Mois
              </button>
            </div>
          </div>

          {/* Vue Semaine */}
          {currentView === "week" && (
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full">
                {/* En-tête de la semaine */}
                <div className="grid grid-cols-8 border-b border-white/20">
                  <div className="p-2 text-center text-white/50 text-xs"></div>
                  {weekDays.map((day, i) => (
                    <div
                      key={i}
                      className={`p-2 text-center border-l border-white/20 cursor-pointer ${
                        isSameDay(day, currentDate) ? "bg-white/10" : ""
                      }`}
                      onClick={() => {
                        setCurrentDate(day)
                        setCurrentView("day")
                      }}
                    >
                      <div className="text-xs text-white/70 font-medium">
                        {format(day, "EEE", { locale: fr }).toUpperCase()}
                      </div>
                      <div
                        className={`text-lg font-medium mt-1 text-white ${
                          isSameDay(day, new Date())
                            ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                            : ""
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grille horaire */}
                <div className="grid grid-cols-8">
                  {/* Étiquettes horaires */}
                  <div className="text-white/70">
                    {timeSlots.map((time, i) => (
                      <div key={i} className="h-20 border-b border-white/10 pr-2 text-right text-xs">
                        {time > 12 ? `${time - 12}h` : `${time}h`}
                      </div>
                    ))}
                  </div>

                  {/* Colonnes des jours */}
                  {weekDays.map((day, dayIndex) => (
                    <div key={dayIndex} className="border-l border-white/20 relative">
                      {timeSlots.map((_, timeIndex) => (
                        <div
                          key={timeIndex}
                          className="h-20 border-b border-white/10"
                          onClick={() => {
                            const hour = timeIndex + 8
                            const newDate = setHours(day, hour)
                            setNewEvent({
                              ...newEvent,
                              startTime: `${hour}:00`,
                              endTime: `${hour + 1}:00`,
                            })
                            setCurrentDate(newDate)
                            setShowEventForm(true)
                          }}
                        ></div>
                      ))}

                      {/* Événements */}
                      {getEventsForDay(day).map((event, i) => {
                        const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                        return (
                          <div
                            key={i}
                            className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg`}
                            style={{
                              ...eventStyle,
                              left: "4px",
                              right: "4px",
                            }}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vue Jour */}
          {currentView === "day" && (
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full">
                {/* En-tête du jour */}
                <div className="grid grid-cols-2 border-b border-white/20">
                  <div className="p-2 text-center text-white/50 text-xs"></div>
                  <div className="p-2 text-center border-l border-white/20">
                    <div className="text-xs text-white/70 font-medium">
                      {format(currentDate, "EEEE", { locale: fr }).toUpperCase()}
                    </div>
                    <div
                      className={`text-lg font-medium mt-1 text-white ${
                        isSameDay(currentDate, new Date())
                          ? "bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                          : ""
                      }`}
                    >
                      {format(currentDate, "d")}
                    </div>
                  </div>
                </div>

                {/* Grille horaire */}
                <div className="grid grid-cols-2">
                  {/* Étiquettes horaires */}
                  <div className="text-white/70">
                    {timeSlots.map((time, i) => (
                      <div key={i} className="h-20 border-b border-white/10 pr-2 text-right text-xs">
                        {time > 12 ? `${time - 12}h` : `${time}h`}
                      </div>
                    ))}
                  </div>

                  {/* Colonne du jour */}
                  <div className="border-l border-white/20 relative">
                    {timeSlots.map((time, timeIndex) => (
                      <div
                        key={timeIndex}
                        className="h-20 border-b border-white/10"
                        onClick={() => {
                          setNewEvent({
                            ...newEvent,
                            startTime: `${time}:00`,
                            endTime: `${time + 1}:00`,
                          })
                          setShowEventForm(true)
                        }}
                      ></div>
                    ))}

                    {/* Événements */}
                    {getEventsForDay(currentDate).map((event, i) => {
                      const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                      return (
                        <div
                          key={i}
                          className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg`}
                          style={{
                            ...eventStyle,
                            left: "4px",
                            right: "4px",
                          }}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                          <div className="opacity-80 text-[10px]">{event.location}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vue Mois */}
          {currentView === "month" && (
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full">
                {/* En-tête du mois */}
                <div className="grid grid-cols-7 border-b border-white/20">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
                    <div key={i} className="p-2 text-center text-white font-medium">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grille du mois */}
                <div className="grid grid-cols-7 grid-rows-6 h-[calc(100%-40px)]">
                  {/* Jours vides avant le début du mois */}
                  {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="border border-white/10 p-1 min-h-[100px]"></div>
                  ))}

                  {/* Jours du mois */}
                  {monthDays.map((day, i) => (
                    <div
                      key={`day-${i}`}
                      className={`border border-white/10 p-1 min-h-[100px] ${
                        isSameDay(day, new Date()) ? "bg-white/10" : ""
                      } ${isSameDay(day, currentDate) ? "ring-2 ring-blue-500" : ""}`}
                      onClick={() => {
                        setCurrentDate(day)
                        setCurrentView("day")
                      }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className={`text-sm font-medium ${
                            isSameDay(day, new Date())
                              ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              : "text-white"
                          }`}
                        >
                          {format(day, "d")}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {getEventsForDay(day)
                          .slice(0, 3)
                          .map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={`${event.color} text-white text-xs p-1 rounded truncate cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEventClick(event)
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                        {getEventsForDay(day).length > 3 && (
                          <div className="text-white text-xs">+{getEventsForDay(day).length - 3} plus</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Popup AI */}
        {showAIPopup && (
          <div className="fixed bottom-8 right-8 z-20">
            <div className="w-[450px] relative bg-gradient-to-br from-blue-400/30 via-blue-500/30 to-blue-600/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-300/30 text-white">
              <button
                onClick={() => setShowAIPopup(false)}
                className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-blue-300" />
                </div>
                <div className="min-h-[80px]">
                  <p className="text-base font-light">{typedText}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={togglePlay}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                >
                  Oui
                </button>
                <button
                  onClick={() => setShowAIPopup(false)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                >
                  Non
                </button>
              </div>
              {isPlaying && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-white text-sm hover:bg-white/20 transition-colors"
                    onClick={togglePlay}
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause Hans Zimmer</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Détails de l'événement */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${selectedEvent.color} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
              <h3 className="text-2xl font-bold mb-4 text-white">{selectedEvent.title}</h3>
              <div className="space-y-3 text-white">
                <p className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {selectedEvent.location}
                </p>
                <p className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {format(selectedEvent.date, "EEEE d MMMM", { locale: fr })}
                </p>
                <p className="flex items-start">
                  <Users className="mr-2 h-5 w-5 mt-1" />
                  <span>
                    <strong>Participants:</strong>
                    <br />
                    {selectedEvent.attendees.join(", ") || "Aucun participant"}
                  </span>
                </p>
                <p>
                  <strong>Organisateur:</strong> {selectedEvent.organizer}
                </p>
                <p>
                  <strong>Description:</strong> {selectedEvent.description}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedEvent(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de création d'événement */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border border-white/30">
              <h3 className="text-xl font-bold mb-4 text-white">Créer un événement</h3>
              <form onSubmit={handleEventFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Titre</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Titre de l'événement"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">Heure de début</label>
                      <input
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">Heure de fin</label>
                      <input
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Lieu</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Lieu de l'événement"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                      placeholder="Description de l'événement"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Couleur</label>
                    <div className="flex gap-2">
                      {[
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-purple-500",
                        "bg-yellow-500",
                        "bg-red-500",
                        "bg-orange-500",
                        "bg-indigo-500",
                        "bg-pink-500",
                      ].map((color, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full ${color} cursor-pointer ${newEvent.color === color ? "ring-2 ring-white" : ""}`}
                          onClick={() => setNewEvent({ ...newEvent, color })}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Participants</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={attendeeInput}
                        onChange={(e) => setAttendeeInput(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ajouter un participant"
                      />
                      <button
                        type="button"
                        onClick={handleAddAttendee}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md"
                      >
                        +
                      </button>
                    </div>
                    <div className="space-y-1">
                      {newEvent.attendees?.map((attendee, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/10 rounded-md px-3 py-1">
                          <span className="text-white">{attendee}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttendee(i)}
                            className="text-white/70 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
