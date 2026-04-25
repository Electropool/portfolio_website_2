import { motion } from 'framer-motion'
import {
  Mail, Github, Linkedin, Instagram, Facebook, Youtube,
  MessageCircle, Music, Gamepad2, ExternalLink
} from 'lucide-react'

interface SocialLink {
  label: string
  icon: React.ReactNode
  href: string
  type: 'link' | 'username' | 'copy'
  value: string
  color?: string
}

const SOCIALS: SocialLink[] = [
  // Professional
  { label: 'LinkedIn',    icon: <Linkedin size={16}/>,      href: 'https://www.linkedin.com/in/arpan-kar-1806a628b/', type:'link',     value:'arpan-kar-1806a628b' },
  { label: 'GitHub',      icon: <Github size={16}/>,         href: 'https://github.com/Electropool',                  type:'link',     value:'Electropool' },
  // Contact
  { label: 'Email',       icon: <Mail size={16}/>,           href: 'mailto:arpankar077@gmail.com',                    type:'link',     value:'arpankar077@gmail.com' },
  { label: 'Microsoft',   icon: <Mail size={16}/>,           href: 'mailto:arpankar077@gmail.com',                    type:'link',     value:'arpankar077@gmail.com' },
  { label: 'Telegram',    icon: <MessageCircle size={16}/>,  href: 'https://t.me/ArpanDeadpool',                      type:'username', value:'@ArpanDeadpool' },
  { label: 'Discord',     icon: <MessageCircle size={16}/>,  href: 'https://discord.com/users/electropool',           type:'username', value:'@electropool' },
  // Social
  { label: 'Instagram',   icon: <Instagram size={16}/>,      href: 'https://www.instagram.com/_.cbuzz._.keds._/',     type:'link',     value:'_.cbuzz._.keds._' },
  { label: 'Facebook',    icon: <Facebook size={16}/>,       href: 'https://www.facebook.com/arpan.kar.1426',         type:'link',     value:'arpan.kar.1426' },
  { label: 'YouTube',     icon: <Youtube size={16}/>,        href: 'https://www.youtube.com/channel/UC_XfXc34-z9PmDG0GQtUmQg', type:'link', value:'@electropool' },
  { label: 'Reddit',      icon: <ExternalLink size={16}/>,   href: 'https://www.reddit.com/user/Good_Sheepherder38/', type:'link',     value:'Good_Sheepherder38' },
  // Extras
  { label: 'Spotify',     icon: <Music size={16}/>,          href: 'https://open.spotify.com/user/31z5evi3np3tk5bex6gzpl4hzuvi', type:'link', value:'Spotify Profile' },
  { label: 'Apple Music', icon: <Music size={16}/>,          href: '#',                                               type:'username', value:'@a_kar' },
  { label: 'Steam',       icon: <Gamepad2 size={16}/>,       href: 'https://steamcommunity.com/profiles/76561199570018140', type:'link', value:'Steam Profile' },
  { label: 'Epic Games',  icon: <Gamepad2 size={16}/>,       href: '#',                                               type:'username', value:'Electropool007' },
  { label: 'Xbox',        icon: <Gamepad2 size={16}/>,       href: '#',                                               type:'username', value:'deadpool50540' },
  { label: 'Guns.lol',    icon: <ExternalLink size={16}/>,   href: 'https://guns.lol/electropool',                    type:'link',     value:'electropool' },
]

const GROUPS = [
  { title: 'PROFESSIONAL', keys: ['LinkedIn','GitHub'] },
  { title: 'CONTACT',      keys: ['Email','Microsoft','Telegram','Discord'] },
  { title: 'SOCIAL',       keys: ['Instagram','Facebook','YouTube','Reddit'] },
  { title: 'GAMING & AUDIO', keys: ['Spotify','Apple Music','Steam','Epic Games','Xbox','Guns.lol'] },
]

interface TooltipState { label: string; username?: string; visible: boolean }

export default function SocialDock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {GROUPS.map((group, gi) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.1 + 0.3, duration: 0.5 }}
        >
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.25em',
            color: 'var(--purple-light)',
            marginBottom: 12,
            textTransform: 'uppercase',
          }}>
            {group.title}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {group.keys.map(key => {
              const item = SOCIALS.find(s => s.label === key)
              if (!item) return null
              const isUsername = item.type === 'username'
              return (
                <a
                  key={key}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  title={isUsername ? item.value : item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    background: 'rgba(10,8,18,0.7)',
                    border: '1px solid var(--border)',
                    borderRadius: 5,
                    color: 'var(--text-dim)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all .25s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--border-bright)'
                    e.currentTarget.style.color = 'var(--accent)'
                    e.currentTarget.style.background = 'rgba(124,58,237,0.12)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-dim)'
                    e.currentTarget.style.background = 'rgba(10,8,18,0.7)'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {isUsername && (
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: 'var(--purple-light)',
                      background: 'rgba(124,58,237,0.12)',
                      padding: '1px 6px',
                      borderRadius: 3,
                      border: '1px solid var(--border)',
                    }}>
                      {item.value}
                    </span>
                  )}
                  {item.href.startsWith('http') && !isUsername && (
                    <ExternalLink size={11} style={{ opacity: 0.4 }} />
                  )}
                </a>
              )
            })}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
