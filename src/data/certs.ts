export interface Cert {
  id: number; title: string; org: string; date: string; img: string; credential?: string
}
export const CERTS: Cert[] = [
  { id:1, title:'PCB Designing using Autodesk Eagle',           org:'Autodesk',                                date:'Oct 2023', img:'/assets/certs/certifications_1_eagle.png',         credential:'AUT-PCB-2023' },
  { id:2, title:'Python for Beginners',                         org:'KIMO.AI',                                 date:'May 2024', img:'/assets/certs/certifications_2_python.png',        credential:'KIMO-PY-2024' },
  { id:3, title:'Certified Broadcast Television Engg',          org:'Prasar Bharati',                          date:'Jul 2024', img:'/assets/certs/certifications_3_prasarbharati.png', credential:'PB-BTE-2024' },
  { id:4, title:'Skills for Interview & Professional Success',  org:'Tata Power Skill Development Institute',  date:'Nov 2025', img:'/assets/certs/certifications_4_interview.png',    credential:'TPSDI-SI-2025' },
  { id:5, title:'IoT Bootcamp Participation',                   org:'Deep Duo Foundation',                     date:'Jul 2025', img:'/assets/certs/certifications_5_iot.png',           credential:'DDF-IOT-2025' },
  { id:6, title:'100 Hours Employment Orientation',             org:'Labournet & Infosys Foundation',          date:'Oct 2025', img:'/assets/certs/certifications_6_100hours.jpeg',     credential:'LN-100H-2025' },
  { id:7, title:'Solar Installer Training',                     org:'Tata Power Skill Development Institute',  date:'Nov 2025', img:'/assets/certs/certifications_7_solar.jpeg',        credential:'TPSDI-SOL-2025' },
]
