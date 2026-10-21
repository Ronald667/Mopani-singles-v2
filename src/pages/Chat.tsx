import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, CheckCheck } from 'lucide-react'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  read: boolean
}

interface Conversation {
  profileId: string
  profileName: string
  profilePhoto: string
  village: string
  municipality: string
  lastMessage: string
  lastTime: string
  unreadCount: number
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    profileId: 'seed-1',
    profileName: 'Thabo Mabaso',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500',
    village: 'Nkowankowa',
    municipality: 'Greater Tzaneen',
    lastMessage: 'Hi there! Saw your profile on Mopani Singles.',
    lastTime: '10:14 AM',
    unreadCount: 1,
  },
  {
    profileId: 'seed-2',
    profileName: 'Khensani Chauke',
    profilePhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=500',
    village: 'Giyani',
    municipality: 'Greater Giyani',
    lastMessage: 'Hello! How are you doing today?',
    lastTime: 'Yesterday',
    unreadCount: 0,
  }
]

export function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('mopani_conversations')
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS
  })

  const [activeChatId, setActiveChatId] = useState<string>(INITIAL_CONVERSATIONS[0].profileId)
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('mopani_messages_map')
    if (saved) return JSON.parse(saved)
    return {
      'seed-1': [
        { id: 'm1', senderId: 'seed-1', text: 'Hi there! Saw your profile on Mopani Singles.', timestamp: '10:14 AM', read: true }
      ],
      'seed-2': [
        { id: 'm2', senderId: 'seed-2', text: 'Hello! How are you doing today?', timestamp: 'Yesterday', read: true }
      ]
    }
  })

  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    localStorage.setItem('mopani_conversations', JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    localStorage.setItem('mopani_messages_map', JSON.stringify(messagesMap))
  }, [messagesMap])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesMap, activeChatId])

  const activeConversation = conversations.find(c => c.profileId === activeChatId)
  const activeMessages = messagesMap[activeChatId] || []

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activeChatId) return

    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      senderId: 'currentUser',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    }

    const updated = [...activeMessages, newMsg]
    setMessagesMap({ ...messagesMap, [activeChatId]: updated })

    setConversations(conversations.map(c => c.profileId === activeChatId ? {
      ...c,
      lastMessage: inputText.trim(),
      lastTime: 'Just now',
      unreadCount: 0
    } : c))

    setInputText('')

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const replyMsg: Message = {
        id: 'reply-' + Date.now(),
        senderId: activeChatId,
        text: 'That sounds wonderful! Let us chat more and get to know each other better. 😊',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      }
      setMessagesMap(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), replyMsg]
      }))
      setConversations(prev => prev.map(c => c.profileId === activeChatId ? {
        ...c,
        lastMessage: 'That sounds wonderful! Let us chat more...',
        lastTime: 'Just now'
      } : c))
    }, 2500)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[75vh]">
        <div className="border-r border-gray-100 flex flex-col bg-gray-50/50">
          <div className="p-4 border-b border-gray-100 bg-white">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-rose-600" /> Messages & Matches
            </h2>
            <p className="text-xs text-gray-500">Real-time chat with Mopani singles</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {conversations.map(c => (
              <div
                key={c.profileId}
                onClick={() => {
                  setActiveChatId(c.profileId)
                  setConversations(conversations.map(item => item.profileId === c.profileId ? { ...item, unreadCount: 0 } : item))
                }}
                className={`p-4 flex items-center gap-3 cursor-pointer transition ${
                  activeChatId === c.profileId ? 'bg-rose-50/80 border-l-4 border-rose-600' : 'hover:bg-white'
                }`}
              >
                <div className="relative">
                  <img src={c.profilePhoto} alt={c.profileName} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{c.profileName}</h3>
                    <span className="text-[10px] text-gray-400">{c.lastTime}</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{c.lastMessage}</p>
                </div>
                {c.unreadCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {c.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col bg-white">
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-xs">
                <div className="flex items-center gap-3">
                  <img src={activeConversation.profilePhoto} alt={activeConversation.profileName} className="w-10 h-10 rounded-full object-cover shadow-xs" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{activeConversation.profileName}</h3>
                    <p className="text-[11px] text-rose-600 font-medium">
                      {activeConversation.village}, {activeConversation.municipality} • Active in Mopani
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/27821234567?text=Hi%20${encodeURIComponent(activeConversation.profileName)},%20let%20us%20chat%20on%20WhatsApp!`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-rose-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs hover:bg-rose-700 transition flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-rose-600" /> WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-rose-50/20">
                {activeMessages.map(m => {
                  const isMe = m.senderId === 'currentUser'
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm text-sm ${
                        isMe ? 'bg-rose-700 text-white rounded-br-xs' : 'bg-white text-gray-800 border border-rose-100 rounded-bl-xs'
                      }`}>
                        <p className="leading-relaxed">{m.text}</p>
                        <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${isMe ? 'text-rose-200' : 'text-gray-400'}`}>
                          <span>{m.timestamp}</span>
                          {isMe && <CheckCheck className="w-3.5 h-3.5 text-rose-300" />}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-rose-100 rounded-2xl px-4 py-3 shadow-xs text-xs text-gray-500 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-rose-600 rounded-full animate-bounce"></span>
                      <span className="inline-block w-2 h-2 bg-rose-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="inline-block w-2 h-2 bg-rose-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      <span className="ml-1 font-medium">{activeConversation.profileName} is typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  className="bg-rose-700 hover:bg-rose-800 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
