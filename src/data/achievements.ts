export interface AchievementMedia { type: 'image' | 'youtube'; src: string }
export interface Achievement {
  id: number; title: string; event: string; desc: string; date: string; badge: string; media: AchievementMedia[]
}
export const ACHIEVEMENTS: Achievement[] = [
  {
    id:1, title:'First Prize — Technical Speech',
    event:"Engineer's Day Technical Speech Competition",
    desc:'Won first prize for an in-depth technical speech on Non-Orbital Low Altitude Satellite Systems, covering orbital mechanics, signal propagation, and modern applications in global connectivity.',
    date:'2025', badge:'🥇 1ST PRIZE',
    media:[
      {type:'youtube', src:'https://youtu.be/wfWqIEdFU6c?si=NJxJx4ZPuGT0Rdha'},
      {type:'image',   src:'/assets/achievements/achivments_1_speech_1.jpeg'},
      {type:'image',   src:'/assets/achievements/achivments_1_speech_2.jpeg'},
      {type:'image',   src:'/assets/achievements/achivments_1_speech_3.jpeg'},
      {type:'image',   src:'/assets/achievements/achivments_1_speech_4.jpg'},
      {type:'image',   src:'/assets/achievements/achivments_1_speech_5.jpg'},
      {type:'image',   src:'/assets/achievements/achivments_1_speech_6.jpg'},
    ],
  },
  {
    id:2, title:'Participation — JIS Tech Fest 2K26',
    event:'JIS Technology Festival',
    desc:'Participated in the JIS Tech Fest with Project HABR (High Altitude Balloon Relay) — a disaster management concept using high-altitude balloons as emergency communication relays.',
    date:'2026', badge:'🎯 PARTICIPATION',
    media:[
      {type:'image', src:'/assets/achievements/achivments_2_jistech_1.jpeg'},
      {type:'image', src:'/assets/achievements/achivments_2_jistech_2.jpeg'},
    ],
  },
]
