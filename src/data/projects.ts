export interface MediaItem {
  type: 'image' | 'youtube' | 'linkedin'
  src: string
}

export interface Project {
  id: string
  num: string
  name: string
  shortDesc: string
  year: string
  tags: string[]
  media: MediaItem[]
  coverImg: string
  glitchLabel?: string
}

export function getYtId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|shorts\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

export const PROJECTS: Project[] = [
  {
    id:'p01', num:'#01', name:'Smart Solar Tracking Panel',
    shortDesc:"Autonomous solar panel that aligns itself with the sun throughout the day using LDR sensors and servo motors to maximise energy efficiency. Built as my Engineer's Day project.",
    year:'2024', tags:['Embedded Electronics','Arduino IDE','Solar Systems','Servo Motors'],
    coverImg:'/assets/projects/1_Projects_media_1_solartracker.jpg',
    media:[
      {type:'image',src:'/assets/projects/1_Projects_media_1_solartracker.jpg'},
      {type:'image',src:'/assets/projects/1_Projects_media_2_solartracker.jpg'},
      {type:'linkedin',src:'https://www.linkedin.com/posts/arpan-kar-1806a628b_found-an-old-video-of-mine-giving-a-demonstration-activity-7404100230859804672-SdkM'},
    ],
  },
  {
    id:'p02', num:'#02', name:'Advanced 5-Channel 12V LED Chaser',
    shortDesc:'5-channel 12V LED chaser using Arduino Nano as main controller, with signal switching handled by power MOSFETs driven through transistors for stability and clean switching.',
    year:'2025', tags:['Arduino Nano','Power MOSFETs','Analog Electronics','Soldering'],
    coverImg:'/assets/projects/2_Projects_media_1_12vchaser.jpg',
    media:[
      {type:'youtube',src:'https://youtube.com/shorts/H30jMBHPApU?si=yLWBj0YURx8Uv_e8'},
      {type:'image',src:'/assets/projects/2_Projects_media_1_12vchaser.jpg'},
      {type:'image',src:'/assets/projects/2_Projects_media_2_12vchaser.jpg'},
      {type:'image',src:'/assets/projects/2_Projects_media_3_12vchaser.jpg'},
      {type:'image',src:'/assets/projects/2_Projects_media_4_12vchaser.jpg'},
    ],
  },
  {
    id:'p03', num:'#03', name:'DC Over-Voltage Monitoring & Protection',
    shortDesc:'Protection circuit that continuously monitors DC supply and auto-disconnects the load when voltage exceeds a preset threshold. Uses LM358 op-amp as a comparator with Zener-diode reference, relay switching, RC noise filters, and multi-layer protection.',
    year:'2025', tags:['LM358','Analog Electronics','Falstad','Protection Circuit'],
    coverImg:'/assets/projects/4_Projects_media_1_dcovervoltage.jpg',
    media:[
      {type:'image',src:'/assets/projects/4_Projects_media_1_dcovervoltage.jpg'},
      {type:'image',src:'/assets/projects/4_Projects_media_2_dcovervoltage.jpg'},
      {type:'image',src:'/assets/projects/4_Projects_media_3_dcovervoltage.jpg'},
      {type:'image',src:'/assets/projects/4_Projects_media_4_dcovervoltage.jpg'},
      {type:'image',src:'/assets/projects/4_Projects_media_5_dcovervoltage.jpg'},
    ],
  },
  {
    id:'p04', num:'#04', name:'Smart Door Open/Close Data Logger',
    shortDesc:'5th semester IoT mini project: door status is recorded and monitored remotely via smartphone or PC using a Blynk dashboard over MQTT.',
    year:'2025', tags:['IoT','Blynk IoT','Embedded Electronics','MQTT'],
    coverImg:'/assets/projects/7_Projects_media_1_dcover-undervoltage.jpg',
    media:[
      {type:'linkedin',src:'https://www.linkedin.com/posts/arpan-kar-1806a628b_my-5th-semester-iot-mini-project-is-a-smart-activity-7403293422364598272-sPgr'},
      {type:'image',src:'/assets/projects/7_Projects_media_1_dcover-undervoltage.jpg'},
      {type:'image',src:'/assets/projects/7_Projects_media_2_dcover-undervoltage.jpg'},
      {type:'image',src:'/assets/projects/7_Projects_media_3_dcover-undervoltage.jpg'},
      {type:'image',src:'/assets/projects/7_Projects_media_4_dcover-undervoltage.jpg'},
    ],
  },
  {
    id:'p05', num:'#05', name:'Guitar/Ukulele Acoustic Pickup [Falstad]',
    shortDesc:'Simulated piezoelectric pickup circuit on Falstad with two modes: Clean Preamp (high-impedance pre-amp for piezo) and Fuzz/Distortion FX (soft + hard clipping). Potentiometers control volume and distortion level.',
    year:'2025', tags:['Analog Electronics','Falstad','Audio Engineering','Piezo'],
    coverImg:'/assets/projects/6_Projects_media_1_ukulele-guitarpickup.jpg',
    media:[
      {type:'image',src:'/assets/projects/6_Projects_media_1_ukulele-guitarpickup.jpg'},
      {type:'image',src:'/assets/projects/6_Projects_media_2_ukulele-guitarpickup.jpg'},
      {type:'image',src:'/assets/projects/6_Projects_media_3_ukulele-guitarpickup.jpg'},
      {type:'image',src:'/assets/projects/6_Projects_media_4_ukulele-guitarpickup.jpg'},
      {type:'image',src:'/assets/projects/6_Projects_media_5_ukulele-guitarpickup.jpg'},
    ],
  },
  {
    id:'p06', num:'#06', name:'DC Under & Over-Voltage Protection [LM358]',
    shortDesc:'Dual-threshold protection circuit using two LM358 op-amps. Monitors both over-voltage (~12-13V) and under-voltage (~11-11.5V). Drives an optocoupler-MOSFET stage for electrical isolation. Load enabled only when supply stays within the safe window.',
    year:'2025', tags:['LM358','Analog Electronics','Falstad','Optocoupler'],
    coverImg:'/assets/projects/7_Projects_media_1_dcover-undervoltage.jpg',
    media:[
      {type:'image',src:'/assets/projects/7_Projects_media_1_dcover-undervoltage.jpg'},
      {type:'image',src:'/assets/projects/7_Projects_media_2_dcover-undervoltage.jpg'},
      {type:'image',src:'/assets/projects/7_Projects_media_3_dcover-undervoltage.jpg'},
      {type:'image',src:'/assets/projects/7_Projects_media_4_dcover-undervoltage.jpg'},
    ],
  },
  {
    id:'p07', num:'#07', name:'Class-D Amplifier — Discrete Components',
    shortDesc:'Built from scratch using discrete components. High-efficiency switching amplifier using PWM to drive a speaker load. A personal learning experience in power electronics and audio amplification.',
    year:'2026', tags:['Analog Electronics','Falstad','Audio Engineering','PWM'],
    coverImg:'/assets/projects/8_Projects_media_1_classdamp.jpg',
    media:[{type:'image',src:'/assets/projects/8_Projects_media_1_classdamp.jpg'}],
  },
  {
    id:'p08', num:'#08', name:'Double-Stage Transistor Pre-Amplifier',
    shortDesc:'Two-stage transistor pre-amp on 9V DC capable of amplifying a 2mV source to +/-1.1V after a bandpass filter (F0=600Hz, F1=6kHz). A 47k pot controls output amplitude.',
    year:'2026', tags:['Analog Electronics','Falstad','Audio Engineering','BJT'],
    coverImg:'/assets/projects/9_Projects_media_1_doubletransistoramp.jpg',
    media:[{type:'image',src:'/assets/projects/9_Projects_media_1_doubletransistoramp.jpg'}],
  },
  {
    id:'p09', num:'#09', name:'Two-Transistor Astable Multivibrator',
    shortDesc:'Simple red-blue LED chaser using a two-transistor astable multivibrator with discrete components only. Each LED stays ON for ~700ms per cycle based on RC timing.',
    year:'2026', tags:['Analog Electronics','Discrete Components','Soldering','Oscillator'],
    coverImg:'/assets/projects/10_Projects_media_1_astablemultivibrator.jpg',
    media:[
      {type:'linkedin',src:'https://www.linkedin.com/posts/arpan-kar-1806a628b_built-a-simple-redblue-led-chaser-using-activity-7429256698403463168-BELa'},
      {type:'image',src:'/assets/projects/10_Projects_media_1_astablemultivibrator.jpg'},
      {type:'image',src:'/assets/projects/10_Projects_media_2_astablemultivibrator.jpg'},
      {type:'image',src:'/assets/projects/10_Projects_media_3_astablemultivibrator.jpg'},
    ],
  },
  {
    id:'p10', num:'#10', name:'Variable Time Period Police LED Flasher',
    shortDesc:'Op-amp based variable time period controlled police LED flasher. Designed, simulated, and PCB layout completed in KiCad.',
    year:'2026', tags:['Analog Electronics','Falstad','KiCad','Op-Amp'],
    coverImg:'/assets/projects/11_Projects_media_1_policeflasher.jpg',
    media:[
      {type:'image',src:'/assets/projects/11_Projects_media_1_policeflasher.jpg'},
      {type:'image',src:'/assets/projects/11_Projects_media_2_policeflasher.jpg'},
      {type:'image',src:'/assets/projects/11_Projects_media_3_policeflasher.jpg'},
      {type:'image',src:'/assets/projects/11_Projects_media_4_policeflasher.jpg'},
    ],
  },
  {
    id:'p11', num:'#11', name:'RF Crystal Oscillator — 20 MHz',
    shortDesc:'Attempted 20MHz crystal oscillator using BF494 and BF495 radio transistors. Experiment did not fully meet expectations, but valuable hands-on RF design experience.',
    year:'2026', tags:['RF Electronics','KiCad','LTspice','Crystal Oscillator'],
    coverImg:'/assets/projects/12_Projects_media_1_rfcrystalosc.jpg',
    media:[
      {type:'image',src:'/assets/projects/12_Projects_media_1_rfcrystalosc.jpg'},
      {type:'image',src:'/assets/projects/12_Projects_media_2_rfcrystalosc.jpg'},
    ],
  },
  {
    id:'p12', num:'#12', name:'Mains EMF Detector — Darlington Pair',
    shortDesc:'Simple EMF detector using a Darlington pair transistor. Antenna picks up powerful 220V ~50Hz electric field radiation from nearby mains wiring. Weak signal is amplified enough to drive an LED.',
    year:'2026', tags:['Analog Electronics','Darlington Pair','Antenna','Soldering'],
    coverImg:'/assets/projects/13_Projects_media_1_emfdetector.jpg',
    media:[
      {type:'linkedin',src:'https://www.linkedin.com/posts/arpan-kar-1806a628b_mains-emf-detector-using-darlington-pair-activity-7433938943114444800-EEYz'},
      {type:'image',src:'/assets/projects/13_Projects_media_1_emfdetector.jpg'},
      {type:'image',src:'/assets/projects/13_Projects_media_2_emfdetector.jpg'},
      {type:'image',src:'/assets/projects/13_Projects_media_3_emfdetector.jpg'},
      {type:'image',src:'/assets/projects/13_Projects_media_4_emfdetector.jpg'},
    ],
  },
  {
    id:'p13', num:'#13', name:'Intensity-Controlled Flash Light — 555 IC',
    shortDesc:'PWM-based intensity-controlled flashlight using 555 IC to vary pulse width, BD139 to drive 4x1W LEDs in parallel, and a 10K trimmer for duty cycle control. Includes current-limiting resistor for thermal safety.',
    year:'2026', tags:['555 IC','PWM','Power Electronics','Prototyping'],
    coverImg:'/assets/projects/14_Projects_media_1_intensitycontrolled.jpg',
    media:[
      {type:'image',src:'/assets/projects/14_Projects_media_1_intensitycontrolled.jpg'},
      {type:'image',src:'/assets/projects/14_Projects_media_2_intensitycontrolled.jpg'},
      {type:'image',src:'/assets/projects/14_Projects_media_3_intensitycontrolled.jpg'},
    ],
  },
  {
    id:'p14', num:'#14', name:'Project HABR — High Altitude Balloon Relay',
    shortDesc:'Disaster management concept: emergency communication relays using high-altitude balloons when conventional networks fail. Presented at JISTech 2K26 at JIS College of Engineering.',
    year:'2026', tags:['LoRa RF','HAB','Disaster Management','IoT','Embedded Systems'],
    coverImg:'/assets/projects/14_Projects_media_1_habr.jpeg',
    glitchLabel:'MILESTONE',
    media:[
      {type:'image',src:'/assets/projects/14_Projects_media_1_habr.jpeg'},
      {type:'image',src:'/assets/projects/14_Projects_media_2_habr.jpeg'},
      {type:'image',src:'/assets/projects/14_Projects_media_3_habr.jpeg'},
      {type:'image',src:'/assets/projects/14_Projects_media_4_habr.jpeg'},
    ],
  },
]
