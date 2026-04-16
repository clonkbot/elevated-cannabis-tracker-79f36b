import { useState, useEffect } from 'react'
import { Leaf, Plus, TrendingUp, Clock, Sparkles, Moon, Sun, Zap, Heart, Brain, X, ChevronDown } from 'lucide-react'

interface Session {
  id: string
  strain: string
  type: 'indica' | 'sativa' | 'hybrid'
  method: string
  amount: string
  effects: string[]
  mood: number
  timestamp: Date
  notes: string
}

interface Strain {
  name: string
  type: 'indica' | 'sativa' | 'hybrid'
  thc: number
  cbd: number
  timesUsed: number
}

const EFFECTS = [
  { name: 'Relaxed', icon: Moon },
  { name: 'Euphoric', icon: Sparkles },
  { name: 'Creative', icon: Brain },
  { name: 'Energized', icon: Zap },
  { name: 'Calm', icon: Heart },
  { name: 'Focused', icon: Sun },
]

const METHODS = ['Flower', 'Vape', 'Edible', 'Concentrate', 'Tincture']

const initialStrains: Strain[] = [
  { name: 'Blue Dream', type: 'hybrid', thc: 21, cbd: 0.1, timesUsed: 12 },
  { name: 'Granddaddy Purple', type: 'indica', thc: 23, cbd: 0.1, timesUsed: 8 },
  { name: 'Sour Diesel', type: 'sativa', thc: 19, cbd: 0.2, timesUsed: 5 },
  { name: 'OG Kush', type: 'hybrid', thc: 20, cbd: 0.3, timesUsed: 15 },
]

const initialSessions: Session[] = [
  {
    id: '1',
    strain: 'Blue Dream',
    type: 'hybrid',
    method: 'Vape',
    amount: '0.25g',
    effects: ['Relaxed', 'Creative'],
    mood: 4,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    notes: 'Great for evening creative work'
  },
  {
    id: '2',
    strain: 'Sour Diesel',
    type: 'sativa',
    method: 'Flower',
    amount: '0.5g',
    effects: ['Energized', 'Focused'],
    mood: 5,
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
    notes: 'Perfect morning session'
  },
  {
    id: '3',
    strain: 'Granddaddy Purple',
    type: 'indica',
    method: 'Edible',
    amount: '10mg',
    effects: ['Relaxed', 'Calm'],
    mood: 4,
    timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000),
    notes: 'Sleep aid'
  },
]

function GlassCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'float-up 0.8s ease-out forwards',
        opacity: 0,
        transform: 'translateY(20px)'
      }}
    >
      {children}
    </div>
  )
}

function TypeBadge({ type }: { type: 'indica' | 'sativa' | 'hybrid' }) {
  const colors = {
    indica: 'bg-violet-500/30 text-violet-100 border-violet-400/40',
    sativa: 'bg-amber-500/30 text-amber-100 border-amber-400/40',
    hybrid: 'bg-emerald-500/30 text-emerald-100 border-emerald-400/40'
  }
  return (
    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium border ${colors[type]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  )
}

function StatCard({ label, value, icon: Icon, trend, delay }: { label: string; value: string; icon: typeof Leaf; trend?: string; delay: number }) {
  return (
    <GlassCard className="p-4 md:p-6" delay={delay}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-xs md:text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl md:text-3xl font-display font-bold text-white">{value}</p>
          {trend && <p className="text-emerald-300 text-xs md:text-sm mt-1 flex items-center gap-1"><TrendingUp size={12} /> {trend}</p>}
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 flex items-center justify-center">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
        </div>
      </div>
    </GlassCard>
  )
}

function EffectBar({ effect, count, max }: { effect: string; count: number; max: number }) {
  const percentage = (count / max) * 100
  const EffectIcon = EFFECTS.find(e => e.name === effect)?.icon || Sparkles

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
        <EffectIcon className="w-3 h-3 md:w-4 md:h-4 text-white/70" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/80 text-xs md:text-sm">{effect}</span>
          <span className="text-white/50 text-xs">{count}x</span>
        </div>
        <div className="h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [strains] = useState<Strain[]>(initialStrains)
  const [showModal, setShowModal] = useState(false)
  const [newSession, setNewSession] = useState<{
    strain: string
    type: 'indica' | 'sativa' | 'hybrid'
    method: string
    amount: string
    effects: string[]
    mood: number
    notes: string
  }>({
    strain: '',
    type: 'hybrid',
    method: 'Flower',
    amount: '',
    effects: [],
    mood: 3,
    notes: ''
  })

  const effectCounts = sessions.reduce((acc, session) => {
    session.effects.forEach(effect => {
      acc[effect] = (acc[effect] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const maxEffectCount = Math.max(...Object.values(effectCounts), 1)

  const weekSessions = sessions.filter(s =>
    s.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  const avgMood = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + s.mood, 0) / sessions.length).toFixed(1)
    : '0'

  const favoriteStrain = strains.reduce((a, b) => a.timesUsed > b.timesUsed ? a : b)

  const handleAddSession = () => {
    if (!newSession.strain || !newSession.amount) return

    const session: Session = {
      id: Date.now().toString(),
      ...newSession,
      timestamp: new Date()
    }
    setSessions([session, ...sessions])
    setShowModal(false)
    setNewSession({
      strain: '',
      type: 'hybrid',
      method: 'Flower',
      amount: '',
      effects: [],
      mood: 3,
      notes: ''
    })
  }

  const toggleEffect = (effect: string) => {
    setNewSession(prev => ({
      ...prev,
      effects: prev.effects.includes(effect)
        ? prev.effects.filter(e => e !== effect)
        : [...prev.effects, effect]
    }))
  }

  const formatTime = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes float-up {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 0.8; }
      }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Animated gradient background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(-45deg, #1a3a2f, #2d1f3d, #1f2d1a, #3d2f1a, #1a2d3d)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite'
        }}
      />

      {/* Floating orbs */}
      <div className="fixed top-20 left-10 w-64 h-64 md:w-96 md:h-96 rounded-full bg-emerald-500/20 blur-3xl" style={{ animation: 'pulse-glow 4s ease-in-out infinite' }} />
      <div className="fixed bottom-20 right-10 w-64 h-64 md:w-80 md:h-80 rounded-full bg-amber-500/20 blur-3xl" style={{ animation: 'pulse-glow 5s ease-in-out infinite', animationDelay: '1s' }} />
      <div className="fixed top-1/2 left-1/2 w-48 h-48 md:w-72 md:h-72 rounded-full bg-violet-500/15 blur-3xl" style={{ animation: 'pulse-glow 6s ease-in-out infinite', animationDelay: '2s' }} />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-12">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Leaf className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">Elevated</h1>
              <p className="text-white/50 text-xs md:text-sm">Mindful consumption tracking</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 md:px-6 md:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95"
          >
            <Plus size={20} />
            <span>Log Session</span>
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-10">
          <StatCard label="This Week" value={`${weekSessions}`} icon={Clock} trend="+2 from last" delay={100} />
          <StatCard label="Avg Mood" value={avgMood} icon={Heart} delay={200} />
          <StatCard label="Total Logged" value={`${sessions.length}`} icon={TrendingUp} delay={300} />
          <StatCard label="Strains Tried" value={`${strains.length}`} icon={Leaf} delay={400} />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <GlassCard className="p-4 md:p-8" delay={500}>
              <h2 className="text-lg md:text-xl font-display font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Recent Sessions
              </h2>
              <div className="space-y-3 md:space-y-4">
                {sessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="p-3 md:p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 md:mb-3">
                      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                        <h3 className="font-semibold text-white text-sm md:text-base">{session.strain}</h3>
                        <TypeBadge type={session.type} />
                      </div>
                      <span className="text-white/40 text-xs md:text-sm">{formatTime(session.timestamp)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {session.method}
                      </span>
                      <span>{session.amount}</span>
                      <div className="flex gap-1 flex-wrap">
                        {session.effects.map(effect => (
                          <span key={effect} className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                    {session.notes && (
                      <p className="mt-2 md:mt-3 text-white/40 text-xs md:text-sm italic">&ldquo;{session.notes}&rdquo;</p>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Strain Library */}
            <GlassCard className="p-4 md:p-8" delay={600}>
              <h2 className="text-lg md:text-xl font-display font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-amber-400" />
                Strain Library
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {strains.map((strain) => (
                  <div
                    key={strain.name}
                    className="p-3 md:p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm md:text-base">{strain.name}</h3>
                      <TypeBadge type={strain.type} />
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 text-xs text-white/50">
                      <span>THC: {strain.thc}%</span>
                      <span>CBD: {strain.cbd}%</span>
                      <span className="ml-auto text-emerald-400">{strain.timesUsed}x used</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Effects Breakdown */}
            <GlassCard className="p-4 md:p-6" delay={700}>
              <h2 className="text-lg md:text-xl font-display font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Effects Overview
              </h2>
              <div className="space-y-3 md:space-y-4">
                {Object.entries(effectCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([effect, count]) => (
                    <EffectBar key={effect} effect={effect} count={count} max={maxEffectCount} />
                  ))}
                {Object.keys(effectCounts).length === 0 && (
                  <p className="text-white/40 text-sm text-center py-4">No effects logged yet</p>
                )}
              </div>
            </GlassCard>

            {/* Favorite Strain */}
            <GlassCard className="p-4 md:p-6" delay={800}>
              <h2 className="text-base md:text-lg font-display font-bold text-white mb-3 md:mb-4">Top Strain</h2>
              <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base md:text-lg">{favoriteStrain.name}</h3>
                  <TypeBadge type={favoriteStrain.type} />
                </div>
                <p className="text-white/60 text-xs md:text-sm">Used {favoriteStrain.timesUsed} times</p>
              </div>
            </GlassCard>

            {/* Quick Stats */}
            <GlassCard className="p-4 md:p-6" delay={900}>
              <h2 className="text-base md:text-lg font-display font-bold text-white mb-3 md:mb-4">Preferences</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Favorite Method</span>
                  <span className="text-white font-medium">Vape</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Peak Time</span>
                  <span className="text-white font-medium">Evening</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Type Preference</span>
                  <span className="text-white font-medium">Hybrid</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 md:mt-16 pb-6 text-center">
          <p className="text-white/30 text-xs">
            Requested by @michaeloneth · Built by @clonkbot
          </p>
        </footer>
      </div>

      {/* Add Session Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/15 border border-white/30 rounded-3xl shadow-2xl p-5 md:p-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 md:mb-6">
              <h2 className="text-xl md:text-2xl font-display font-bold text-white">Log Session</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-4 md:space-y-5">
              {/* Strain */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Strain</label>
                <div className="relative">
                  <select
                    value={newSession.strain}
                    onChange={e => {
                      const strain = strains.find(s => s.name === e.target.value)
                      setNewSession(prev => ({
                        ...prev,
                        strain: e.target.value,
                        type: strain?.type || 'hybrid'
                      }))
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white appearance-none focus:outline-none focus:border-emerald-400/50 transition-colors"
                  >
                    <option value="" className="bg-gray-800">Select strain...</option>
                    {strains.map(strain => (
                      <option key={strain.name} value={strain.name} className="bg-gray-800">{strain.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                </div>
              </div>

              {/* Method */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Method</label>
                <div className="flex flex-wrap gap-2">
                  {METHODS.map(method => (
                    <button
                      key={method}
                      onClick={() => setNewSession(prev => ({ ...prev, method }))}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        newSession.method === method
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Amount</label>
                <input
                  type="text"
                  value={newSession.amount}
                  onChange={e => setNewSession(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="e.g., 0.5g, 10mg"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 transition-colors"
                />
              </div>

              {/* Effects */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Effects Felt</label>
                <div className="flex flex-wrap gap-2">
                  {EFFECTS.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      onClick={() => toggleEffect(name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        newSession.effects.includes(name)
                          ? 'bg-gradient-to-r from-emerald-500 to-amber-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <Icon size={16} />
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Mood Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setNewSession(prev => ({ ...prev, mood: rating }))}
                      className={`flex-1 py-3 rounded-xl text-lg font-bold transition-all ${
                        newSession.mood >= rating
                          ? 'bg-gradient-to-r from-emerald-500 to-amber-500 text-white'
                          : 'bg-white/10 text-white/30 hover:bg-white/20'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={newSession.notes}
                  onChange={e => setNewSession(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="How was your experience?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleAddSession}
                disabled={!newSession.strain || !newSession.amount}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/30 disabled:shadow-none"
              >
                Log Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
