import { Logo } from './Logo'
import { Users, UserPlus, ShieldAlert, Lock, Trash2, ShieldCheck, Sparkles, MessageCircle, User } from 'lucide-react'

interface NavbarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-rose-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Logo className="w-11 h-11 transition-transform group-hover:scale-105" />
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-rose-700 via-rose-800 to-amber-700 bg-clip-text text-transparent">
                Mopani Singles-v2
              </span>
              <p className="text-[10px] uppercase tracking-wider text-rose-600 font-semibold">
                Limpopo Romance & Matchmaking
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'discover'
                  ? 'bg-rose-700 text-white shadow-md shadow-rose-700/20'
                  : 'text-gray-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <Users className="w-4 h-4" /> Discover
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'matches'
                  ? 'bg-rose-700 text-white shadow-md shadow-rose-700/20'
                  : 'text-gray-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" /> Matches
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-rose-700 text-white shadow-md shadow-rose-700/20'
                  : 'text-gray-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <MessageCircle className="w-4 h-4" /> Messages
            </button>

            <button
              onClick={() => setActiveTab('myprofile')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'myprofile'
                  ? 'bg-rose-700 text-white shadow-md shadow-rose-700/20'
                  : 'text-gray-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <User className="w-4 h-4" /> My Profile
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-rose-700 text-white shadow-md shadow-rose-700/20'
                  : 'text-gray-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Register
            </button>

            <button
              onClick={() => setActiveTab('safety')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'safety'
                  ? 'bg-rose-700 text-white shadow-md shadow-rose-700/20'
                  : 'text-gray-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <ShieldAlert className="w-4 h-4" /> Safety
            </button>

            <button
              onClick={() => setActiveTab('delete')}
              className={`px-2.5 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-1 ${
                activeTab === 'delete'
                  ? 'bg-rose-700 text-white shadow-md'
                  : 'text-gray-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                activeTab === 'admin'
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Admin
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setActiveTab('myprofile')}
              className="bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs"
            >
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className="bg-amber-500 text-gray-900 text-xs font-bold px-2.5 py-2 rounded-xl shadow-xs"
            >
              Matches
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="bg-gray-900 text-white text-xs font-semibold px-2 py-2 rounded-xl"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Mobile secondary bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-gray-100 scrollbar-none">
          <button
            onClick={() => setActiveTab('discover')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'discover' ? 'bg-rose-700 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'matches' ? 'bg-rose-700 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'chat' ? 'bg-rose-700 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('myprofile')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'myprofile' ? 'bg-rose-700 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'register' ? 'bg-rose-700 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'safety' ? 'bg-rose-700 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Safety
          </button>
          <button
            onClick={() => setActiveTab('delete')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'delete' ? 'bg-rose-700 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Delete
          </button>
        </div>
      </div>
    </header>
  )
}
