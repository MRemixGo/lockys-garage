import React, { useState, useEffect } from 'react';
import { Volume2, Play, Star, Coins, Wrench, Lock, ArrowLeft, Check, Sparkles, Trophy } from 'lucide-react';

const SHOP_ITEMS = {
  paint: [
    { id: 'paint-red', name: 'Fire Red', price: 0, type: 'paint', value: '#ef4444' },
    { id: 'paint-blue', name: 'Deep Blue', price: 50, type: 'paint', value: '#2563eb' },
    { id: 'paint-green', name: 'Slime Green', price: 50, type: 'paint', value: '#16a34a' },
    { id: 'paint-yellow', name: 'Bumblebee', price: 50, type: 'paint', value: '#eab308' },
    { id: 'paint-orange', name: 'Sunset', price: 75, type: 'paint', value: '#f97316' },
    { id: 'paint-pink', name: 'Hot Pink', price: 75, type: 'paint', value: '#ec4899' },
    { id: 'paint-purple', name: 'Royal Purple', price: 100, type: 'paint', value: '#9333ea' },
    { id: 'paint-cyan', name: 'Neon Cyan', price: 125, type: 'paint', value: '#06b6d4' },
    { id: 'paint-black', name: 'Stealth Black', price: 150, type: 'paint', value: '#18181b' },
    { id: 'paint-white', name: 'Ice White', price: 150, type: 'paint', value: '#f8fafc' },
    { id: 'paint-gold', name: 'Solid Gold', price: 250, type: 'paint', value: '#d97706' },
  ],
  wheels: [
    { id: 'wheel-stock', name: 'Stock Rims', price: 0, type: 'wheels', value: 'stock' },
    { id: 'wheel-steel', name: 'Steelies', price: 50, type: 'wheels', value: 'steel' },
    { id: 'wheel-sport', name: '5-Spoke Sport', price: 100, type: 'wheels', value: 'sport' },
    { id: 'wheel-offroad', name: 'Chunky Mud', price: 150, type: 'wheels', value: 'offroad' },
    { id: 'wheel-star', name: 'Gold Star Rims', price: 200, type: 'wheels', value: 'star' },
    { id: 'wheel-spinner', name: 'Chrome Spinners', price: 200, type: 'wheels', value: 'spinner' },
    { id: 'wheel-neon', name: 'Green Neon Glow', price: 300, type: 'wheels', value: 'neon' },
    { id: 'wheel-fire', name: 'Fire Rings', price: 350, type: 'wheels', value: 'fire' },
  ],
  spoiler: [
    { id: 'spoiler-none', name: 'No Spoiler', price: 0, type: 'spoiler', value: 'none' },
    { id: 'spoiler-lip', name: 'Ducktail Lip', price: 75, type: 'spoiler', value: 'lip' },
    { id: 'spoiler-gt', name: 'GT Racing Wing', price: 150, type: 'spoiler', value: 'gt' },
    { id: 'spoiler-rally', name: 'Rally High Wing', price: 175, type: 'spoiler', value: 'rally' },
    { id: 'spoiler-super', name: 'Hyper Wing', price: 200, type: 'spoiler', value: 'super' },
    { id: 'spoiler-rocket', name: 'Rocket Thrusters', price: 400, type: 'spoiler', value: 'rocket' },
  ],
  decals: [
    { id: 'decal-none', name: 'Clean Body', price: 0, type: 'decals', value: 'none' },
    { id: 'decal-stripes', name: 'Side Racing Stripes', price: 100, type: 'decals', value: 'stripes' },
    { id: 'decal-lightning', name: 'Lightning Bolts', price: 150, type: 'decals', value: 'lightning' },
    { id: 'decal-flames', name: 'Hot Flames', price: 200, type: 'decals', value: 'flames' },
    { id: 'decal-stars', name: 'Shooting Stars', price: 125, type: 'decals', value: 'stars' },
  ],
  extras: [
    { id: 'extra-none', name: 'Standard Setup', price: 0, type: 'extras', value: 'none' },
    { id: 'extra-tint', name: 'Limo Window Tint', price: 100, type: 'extras', value: 'tint' },
    { id: 'extra-underglow-b', name: 'Blue Neon Underglow', price: 250, type: 'extras', value: 'underglow-b' },
    { id: 'extra-underglow-r', name: 'Red Neon Underglow', price: 250, type: 'extras', value: 'underglow-r' },
    { id: 'extra-underglow-g', name: 'Green Neon Underglow', price: 250, type: 'extras', value: 'underglow-g' },
    { id: 'extra-flames', name: 'Exhaust Flames', price: 300, type: 'extras', value: 'flames' },
  ]
};

const speak = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.85; 
    msg.pitch = 1.1; 
    window.speechSynthesis.speak(msg);
  }
};

// Tracks whether the next occurrence of a question type should be Hard (true) or Easy (false)
const questionDifficulty = { add: false, sub: false, pattern: false, order: false, shapes: false, countBy: false, groups: false };

const generateQuestion = () => {
  const types = ['add', 'sub', 'pattern', 'order', 'shapes', 'countBy', 'groups'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  // Alternate difficulty for this specific question type
  const isHard = questionDifficulty[type];
  questionDifficulty[type] = !questionDifficulty[type];

  let questionText = '';
  let options = [];
  let correctAnswer = '';
  let hint = '';
  let visual = null;

  switch (type) {
    case 'add': {
      if (isHard) {
        const a = Math.floor(Math.random() * 21) + 9; // 9 to 29
        const b = Math.floor(Math.random() * 21) + 9; // 9 to 29
        correctAnswer = (a + b).toString();
        questionText = `What is ${a} + ${b}?`;
        hint = `Try adding the tens, then the ones!`;
        options = [correctAnswer, (a + b + 10).toString(), (a + b - 2).toString(), (a + b + 2).toString()];
      } else {
        const a = Math.floor(Math.random() * 15) + 1;
        const b = Math.floor(Math.random() * (20 - a)) + 1; 
        correctAnswer = (a + b).toString();
        questionText = `What is ${a} + ${b}?`;
        hint = `Start at ${a} and count up ${b} more!`;
        options = [correctAnswer, (a + b + 1).toString(), (a + b - 1).toString(), (a + b + 2).toString()];
      }
      break;
    }
    case 'sub': {
      if (isHard) {
        const a = Math.floor(Math.random() * 11) + 10; // 10 to 20
        const b = Math.floor(Math.random() * (a - 1)) + 1; // up to a-1
        correctAnswer = (a - b).toString();
        questionText = `What is ${a} - ${b}?`;
        hint = `Start at ${a} and count backward ${b} steps.`;
        options = [correctAnswer, (a - b + 2).toString(), (a - b - 1).toString(), (a - b + 5).toString()];
      } else {
        const a = Math.floor(Math.random() * 8) + 3; // 3 to 10
        const b = Math.floor(Math.random() * a) + 1;
        correctAnswer = (a - b).toString();
        questionText = `What is ${a} - ${b}?`;
        hint = `Start at ${a} and count backward ${b} steps.`;
        let bad1 = a - b + 1;
        let bad2 = Math.max(0, a - b - 1);
        if (bad2 === a - b) bad2 = a - b + 2;
        options = [correctAnswer, bad1.toString(), bad2.toString(), (a - b + 3).toString()];
      }
      break;
    }
    case 'pattern': {
      const pool = ['🔴', '🔵', '⭐', '🌙', '🍎', '🍌', '🚗', '🚕'];
      const shuffled = pool.sort(() => 0.5 - Math.random());
      
      let unit;
      if (isHard) {
        const units = [
            [0,1,1], // abb
            [0,1,2,2,3], // abccd
            [0,1,1,2,2,3], // abbccd
            [0,1,2,3,4,2,3,4], // abcdecde
            [0,0,0,1,1,2] // aaabbc
        ];
        unit = units[Math.floor(Math.random() * units.length)];
      } else {
        const units = [
            [0,1], // ab
            [0,1,2], // abc
        ];
        unit = units[Math.floor(Math.random() * units.length)];
      }
      
      const displayLen = isHard ? unit.length + 2 : unit.length * 2; 
      const seqIds = [];
      for(let i=0; i<displayLen; i++) {
          seqIds.push(unit[i % unit.length]);
      }
      const nextId = unit[displayLen % unit.length];
      
      const seqStr = seqIds.map(idx => shuffled[idx]);
      correctAnswer = shuffled[nextId];
      
      questionText = `What comes next in the pattern? ${seqStr.join(', ')}`;
      hint = `Look closely at how the symbols repeat!`;
      
      options = shuffled.slice(0, 4);
      if (!options.includes(correctAnswer)) options[0] = correctAnswer;
      break;
    }
    case 'order': {
      const nums = [];
      while(nums.length < 4) {
        const r = Math.floor(Math.random() * 30) + 1;
        if (!nums.includes(r)) nums.push(r);
      }
      const sorted = [...nums].sort((a,b) => a-b);
      correctAnswer = sorted.join(', ');
      questionText = `Which list is in order from SMALLEST to BIGGEST?`;
      hint = `Look for the list starting with the smallest number and increasing!`;
      options = [
        correctAnswer,
        [...nums].sort((a,b) => b-a).join(', '),
        [nums[1], nums[0], nums[3], nums[2]].join(', '),
        [nums[2], nums[3], nums[0], nums[1]].join(', ')
      ];
      break;
    }
    case 'shapes': {
      const shapeMap = { 'Circle': '🔴', 'Triangle': '🔺', 'Square': '🟦', 'Cube': '🧊', 'Sphere': '🔮' };
      const shapeNames = Object.keys(shapeMap);
      const target = shapeNames[Math.floor(Math.random() * shapeNames.length)];
      questionText = `Select the ${target}.`;
      correctAnswer = shapeMap[target];
      hint = `Look for the picture of a ${target}.`;
      options = Object.values(shapeMap).sort(() => 0.5 - Math.random()).slice(0, 4);
      if (!options.includes(correctAnswer)) options[0] = correctAnswer;
      break;
    }
    case 'countBy': {
      let step;
      if (isHard) {
        step = Math.floor(Math.random() * 20) + 6; // skip count by 6 to 25
      } else {
        step = [2, 5, 10][Math.floor(Math.random() * 3)];
      }
      
      const start = step * (Math.floor(Math.random() * 4) + 1);
      const seq = [start, start + step, start + (step * 2), start + (step * 3)];
      correctAnswer = (start + (step * 2)).toString();
      seq[2] = '___';
      
      questionText = `Fill in the missing number: ${seq.join(', ')}`;
      hint = `Look closely! We are skip-counting by ${step}s.`;
      const val = parseInt(correctAnswer, 10);
      options = [correctAnswer, (val + step).toString(), (val - step).toString(), (val + 1).toString()];
      break;
    }
    case 'groups': {
      if (isHard) {
        const containers = ['buckets', 'boxes', 'baskets', 'bags'];
        const items = ['apples', 'toys', 'cars', 'candies'];
        const c = containers[Math.floor(Math.random() * containers.length)];
        const i = items[Math.floor(Math.random() * items.length)];
        
        let g = Math.floor(Math.random() * 6) + 3; 
        let n = Math.floor(Math.random() * 6) + 3; 
        // Ensure total is between 10 and 40
        while (g * n < 10 || g * n > 40) {
           g = Math.floor(Math.random() * 6) + 3;
           n = Math.floor(Math.random() * 6) + 3;
        }
        
        correctAnswer = (g * n).toString();
        questionText = `If there are ${g} ${c} and each ${c} has ${n} ${i} in it, how many ${i} are there in total?`;
        hint = `Try counting by ${n}s, ${g} times!`;
        visual = null;
      } else {
        const g = Math.floor(Math.random() * 3) + 2; 
        const n = Math.floor(Math.random() * 3) + 2; 
        if (g * n > 10) { 
          correctAnswer = (2 * 3).toString(); 
          visual = { type: 'groups', groups: 2, itemsPerGroup: 3, emoji: '🍎' };
        } else {
          correctAnswer = (g * n).toString();
          const emojis = ['🍎', '⭐', '🚗', '🍪', '⚽'];
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];
          visual = { type: 'groups', groups: g, itemsPerGroup: n, emoji };
        }
        questionText = "How many items are there in total?";
        hint = `Count all the items inside each group!`;
      }
      
      const val = parseInt(correctAnswer, 10);
      options = [correctAnswer, (val + 1).toString(), (val - 1).toString(), (val + 2).toString()];
      break;
    }
    default:
      correctAnswer = "5";
      questionText = "2 + 3 = ?";
      hint = "Add 2 and 3 together.";
      options = ["5", "4", "6", "3"];
  }

  // Ensure unique, clean string options with no NaN values
  let cleanOptions = [...new Set(options.map(o => String(o)))].filter(o => o !== "NaN" && o !== "undefined");
  while (cleanOptions.length < 4) {
    const base = parseInt(correctAnswer, 10) || 1;
    const fake = (base + cleanOptions.length + 1).toString();
    if (!cleanOptions.includes(fake)) cleanOptions.push(fake);
  }

  return {
    text: questionText,
    answer: correctAnswer,
    options: cleanOptions.sort(() => 0.5 - Math.random()),
    hint: hint,
    visual: visual
  };
};

const HighDefCarRenderer = ({ config }) => {
  const { paint = '#ef4444', wheels = 'stock', spoiler = 'none', decals = 'none', extras = 'none' } = config;

  // Wheel Coordinates tailored perfectly for the Muscle Car Chassis
  const rearX = 160;
  const frontX = 460;
  const wheelY = 165;
  const tireRadius = 48;
  const rimRadius = 28;

  return (
    <div className="relative flex justify-center items-center w-full h-full min-h-[160px] select-none overflow-hidden">
      {/* Tight viewBox so the car perfectly fills its container dynamically */}
      <svg viewBox="0 20 600 230" className="w-full h-full object-contain drop-shadow-2xl overflow-visible">
        <defs>
          {/* Metallic paint shine gradient specifically contoured for the muscle body */}
          <linearGradient id="paintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="25%" stopColor={paint} stopOpacity="1" />
            <stop offset="85%" stopColor={paint} stopOpacity="1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
          </linearGradient>

          {/* Glow filter for Neon and Fire */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
          </filter>
        </defs>

        {/* ========================================================== */}
        {/* UNDERGLOW (EXTRAS)                                         */}
        {/* ========================================================== */}
        {extras === 'underglow-b' && <ellipse cx="310" cy="205" rx="220" ry="15" fill="#3b82f6" opacity="0.85" filter="url(#glow)" />}
        {extras === 'underglow-r' && <ellipse cx="310" cy="205" rx="220" ry="15" fill="#ef4444" opacity="0.85" filter="url(#glow)" />}
        {extras === 'underglow-g' && <ellipse cx="310" cy="205" rx="220" ry="15" fill="#22c55e" opacity="0.85" filter="url(#glow)" />}

        {/* ========================================================== */}
        {/* EXHAUST BASE & FLAMES (EXTRAS)                             */}
        {/* ========================================================== */}
        {/* Exhaust Pipes */}
        <rect x="25" y="150" width="25" height="12" rx="4" fill="#52525b" stroke="#18181b" strokeWidth="2" />
        
        {extras === 'flames' && (
          <g transform="translate(25, 156) scale(-1, 1)">
            {/* Flames pointing backwards from the exhaust */}
            <path d="M 0,-6 Q 30,-25 50,-5 Q 30,10 0,6 Z" fill="#f97316">
              <animate attributeName="d" values="M 0,-6 Q 30,-25 50,-5 Q 30,10 0,6 Z; M 0,-6 Q 40,-35 60,-5 Q 25,20 0,6 Z; M 0,-6 Q 30,-25 50,-5 Q 30,10 0,6 Z" dur="0.15s" repeatCount="indefinite" />
            </path>
            <path d="M 0,-2 Q 20,-10 30,0 Q 20,10 0,2 Z" fill="#fef08a" />
          </g>
        )}

        {/* ========================================================== */}
        {/* MUSCLE CAR BODY SHELL                                      */}
        {/* ========================================================== */}
        <g id="muscle-chassis">
          {/* Main Heavy Body Path */}
          <path 
            d="M 40,165 L 40,105 L 110,100 L 200,55 L 330,55 L 410,95 L 560,105 L 575,125 L 565,165 Z" 
            fill="url(#paintGrad)" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" 
          />
          
          {/* Classic Muscle Side Indent / Beltline */}
          <path d="M 110,105 L 560,115" stroke="#000000" strokeWidth="4" opacity="0.3" strokeLinecap="round" />
          <path d="M 200,125 L 400,125 L 400,150 L 190,150 Z" fill="none" stroke="#000" strokeWidth="2" opacity="0.15" />

          {/* Hood Scoop */}
          <path d="M 430,95 L 480,90 L 485,100 L 430,102 Z" fill="url(#paintGrad)" stroke="#0f172a" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="480,90 485,100 495,100" fill="#000" />

          {/* Angular Tinted Windows */}
          <path 
            d="M 210,65 L 320,65 L 390,92 L 125,95 Z" 
            fill={extras === 'tint' ? '#090d16' : '#bae6fd'} opacity={extras === 'tint' ? '0.95' : '0.8'}
            stroke="#0f172a" strokeWidth="5" strokeLinejoin="round" 
          />
          {/* B-Pillar */}
          <line x1="290" y1="65" x2="280" y2="95" stroke="#0f172a" strokeWidth="7" />

          {/* Deep Recessed Grill & Headlight */}
          <rect x="555" y="108" width="20" height="15" rx="3" fill="#0f172a" />
          <circle cx="565" cy="115" r="5" fill="#fef08a" stroke="#fbbf24" strokeWidth="1" />
        </g>

        {/* ========================================================== */}
        {/* CUSTOM DECALS (Mapped to Muscle Body)                      */}
        {/* ========================================================== */}
        {decals === 'stripes' && (
          // Side Boss-style Racing Stripes
          <g fill="#ffffff" opacity="0.9">
            <path d="M 120,135 L 430,135 L 430,145 L 120,145 Z" />
            <path d="M 120,148 L 430,148 L 430,151 L 120,151 Z" />
          </g>
        )}
        {decals === 'lightning' && (
          <path d="M 150,135 L 260,125 L 230,145 L 350,135 L 300,155 L 190,145 Z" fill="#fef08a" stroke="#000" strokeWidth="2" />
        )}
        {decals === 'flames' && (
          <path d="M 430,125 Q 330,125 280,145 Q 360,135 380,155 Q 300,155 200,165 L 430,165 Z" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
        )}
        {decals === 'stars' && (
          <g fill="#fbbf24" stroke="#000" strokeWidth="1">
            <polygon points="200,130 204,140 214,140 206,146 209,156 200,150 191,156 194,146 186,140 196,140" />
            <polygon points="260,125 263,132 270,132 265,137 267,144 260,140 253,144 255,137 250,132 257,132" />
            <polygon points="150,140 152,145 157,145 153,149 155,154 150,151 145,154 147,149 143,145 148,145" transform="scale(0.8) translate(40, 30)" />
          </g>
        )}

        {/* ========================================================== */}
        {/* WHEEL ARCHES & WHEELS                                      */}
        {/* ========================================================== */}
        {/* Wheel Arch Cutouts (Tighter, smaller wells) */}
        <path d="M 105,165 A 55 55 0 0 1 215,165 Z" fill="#020617" stroke="#0f172a" strokeWidth="5" />
        <path d="M 405,165 A 55 55 0 0 1 515,165 Z" fill="#020617" stroke="#0f172a" strokeWidth="5" />

        {/* Wheels Loop */}
        {[ { cx: rearX, cy: wheelY }, { cx: frontX, cy: wheelY } ].map((w, idx) => (
          <g key={idx}>
            {/* Thick Muscle Rubber Tire */}
            <circle cx={w.cx} cy={w.cy} r={tireRadius} fill="#18181b" stroke="#000000" strokeWidth="4" />
            
            {/* Rims Selection */}
            {wheels === 'stock' && (
              <>
                <circle cx={w.cx} cy={w.cy} r={rimRadius} fill="#d4d4d8" stroke="#71717a" strokeWidth="4" />
                <circle cx={w.cx} cy={w.cy} r="12" fill="#27272a" />
              </>
            )}
            {wheels === 'steel' && (
              <>
                <circle cx={w.cx} cy={w.cy} r={rimRadius+2} fill="#3f3f46" stroke="#18181b" strokeWidth="3" />
                {[0, 60, 120, 180, 240, 300].map(deg => (
                  <circle key={deg} cx={w.cx} cy={w.cy - 18} r="6" fill="#000" transform={`rotate(${deg} ${w.cx} ${w.cy})`} />
                ))}
              </>
            )}
            {wheels === 'sport' && (
              <>
                <circle cx={w.cx} cy={w.cy} r={rimRadius+4} fill="#e4e4e7" stroke="#a1a1aa" strokeWidth="2" />
                {[0, 72, 144, 216, 288].map(deg => (
                  <rect key={deg} x={w.cx - 5} y={w.cy - 34} width="10" height="30" fill="#27272a" transform={`rotate(${deg} ${w.cx} ${w.cy})`} />
                ))}
                <circle cx={w.cx} cy={w.cy} r="8" fill="#ef4444" />
              </>
            )}
            {wheels === 'offroad' && (
              <>
                <circle cx={w.cx} cy={w.cy} r={rimRadius-5} fill="#52525b" stroke="#000" strokeWidth="4" />
                {/* Chunky Treads */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                  <rect key={deg} x={w.cx - 10} y={w.cy - 52} width="20" height="14" fill="#000" transform={`rotate(${deg} ${w.cx} ${w.cy})`} />
                ))}
              </>
            )}
            {wheels === 'star' && (
              <>
                <circle cx={w.cx} cy={w.cy} r={rimRadius+2} fill="#18181b" />
                <polygon points={`${w.cx},${w.cy-32} ${w.cx+10},${w.cy-10} ${w.cx+32},${w.cy-8} ${w.cx+15},${w.cy+9} ${w.cx+19},${w.cy+30} ${w.cx},${w.cy+19} ${w.cx-19},${w.cy+30} ${w.cx-15},${w.cy+9} ${w.cx-32},${w.cy-8} ${w.cx-10},${w.cy-10}`} fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
              </>
            )}
            {wheels === 'spinner' && (
              <>
                <circle cx={w.cx} cy={w.cy} r={rimRadius+4} fill="#a1a1aa" />
                <g>
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${w.cx} ${w.cy}`} to={`360 ${w.cx} ${w.cy}`} dur="1s" repeatCount="indefinite" />
                  <line x1={w.cx - 32} y1={w.cy} x2={w.cx + 32} y2={w.cy} stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
                  <line x1={w.cx} y1={w.cy - 32} x2={w.cx} y2={w.cy + 32} stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
                </g>
                <circle cx={w.cx} cy={w.cy} r="10" fill="#eab308" />
              </>
            )}
            {wheels === 'neon' && (
              <>
                <circle cx={w.cx} cy={w.cy} r={rimRadius+2} fill="#18181b" stroke="#22c55e" strokeWidth="6" filter="url(#glow)" />
                <circle cx={w.cx} cy={w.cy} r="12" fill="#22c55e" />
              </>
            )}
            {wheels === 'fire' && (
              <>
                <circle cx={w.cx} cy={w.cy} r={rimRadius+4} fill="#18181b" />
                <circle cx={w.cx} cy={w.cy} r={rimRadius} fill="none" stroke="#f97316" strokeWidth="6" />
                <circle cx={w.cx} cy={w.cy} r={rimRadius-12} fill="none" stroke="#fef08a" strokeWidth="4" />
              </>
            )}
          </g>
        ))}

        {/* ========================================================== */}
        {/* CUSTOM SPOILERS (Mounted strictly to Muscle Trunk)         */}
        {/* ========================================================== */}
        {spoiler === 'lip' && (
           <path d="M 35,110 L 25,95 C 35,90 50,95 60,103 Z" fill="#27272a" stroke="#000" strokeWidth="3" />
        )}
        {spoiler === 'gt' && (
          <g>
            <line x1="55" y1="104" x2="55" y2="60" stroke="#18181b" strokeWidth="6" strokeLinecap="round" />
            <line x1="95" y1="101" x2="95" y2="60" stroke="#18181b" strokeWidth="6" strokeLinecap="round" />
            <path d="M 20,65 L 130,55 L 135,62 L 20,72 Z" fill={paint} stroke="#0f172a" strokeWidth="4" strokeLinejoin="round" />
          </g>
        )}
        {spoiler === 'rally' && (
          <g>
            <path d="M 40,105 L 20,60 L 40,55 L 60,102 Z" fill="#18181b" stroke="#000" strokeWidth="3" />
            <path d="M 5,65 L 80,50 L 85,60 L 5,75 Z" fill={paint} stroke="#0f172a" strokeWidth="4" />
          </g>
        )}
        {spoiler === 'super' && (
          <path d="M 40,105 C 20,65 50,35 110,40 C 80,55 70,90 75,102 Z" fill={paint} stroke="#0f172a" strokeWidth="4" />
        )}
        {spoiler === 'rocket' && (
          <g transform="translate(5, 120) rotate(-15)">
            <rect x="0" y="0" width="70" height="28" rx="14" fill="#9ca3af" stroke="#000" strokeWidth="4" />
            <polygon points="0,6 -35,14 0,22" fill="#f97316" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('menu'); 
  const [coins, setCoins] = useState(100);
  const [progress, setProgress] = useState(0);
  const [firstTry, setFirstTry] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);

  // Hardcoded to always use the awesome Muscle Car
  const [carConfig, setCarConfig] = useState({
    paint: '#ef4444', 
    wheels: 'stock',
    spoiler: 'none',
    decals: 'none',
    extras: 'none'
  });

  const [inventory, setInventory] = useState([
    'paint-red', 'wheel-stock', 'spoiler-none', 'decal-none', 'extra-none'
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Load and Save to Browser Local Storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lockysMuscleGarageSaveV4');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.coins !== undefined) setCoins(data.coins);
        if (data.progress !== undefined) setProgress(data.progress);
        if (data.carConfig) setCarConfig(data.carConfig);
        if (data.inventory) setInventory(data.inventory);
      }
    } catch (e) {
      console.error("Error loading save:", e);
    }
  }, []);

  useEffect(() => {
    const data = { coins, progress, carConfig, inventory };
    localStorage.setItem('lockysMuscleGarageSaveV4', JSON.stringify(data));
  }, [coins, progress, carConfig, inventory]);

  const startQuiz = () => {
    setCurrentQuestion(generateQuestion());
    setShowHint(false);
    setFirstTry(true);
    setShowCheckmark(false);
    setView('quiz');
  };

  const playBell = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6 Note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch(e) {
      console.log("Audio not supported");
    }
  };

  const handleAnswer = (selected) => {
    if (showCheckmark) return; // Prevent clicking while checkmark is showing

    if (selected === currentQuestion.answer) {
      setShowCheckmark(true);
      playBell();
      
      setTimeout(() => {
        setShowCheckmark(false);
        const newProgress = progress + 1;
        
        // ONLY award 5 coins if they got it right on the very first try for this question
        if (firstTry) {
          setCoins(prev => prev + 5);
        }

        if (newProgress >= 20) {
          setProgress(0);
          setCoins(prev => prev + 50); // Bonus 50 for finishing round
          setView('success');
          speak("Awesome work Locky! You unlocked the garage!");
        } else {
          setProgress(newProgress);
          setCurrentQuestion(generateQuestion());
          setShowHint(false);
          setFirstTry(true); // Reset firstTry flag for the new question
        }
      }, 1000);
    } else {
      setShowHint(true);
      setFirstTry(false); // They missed the first try, so they won't get coins for this question
      speak(currentQuestion.hint || "Try again!");
    }
  };

  const buyItem = (item) => {
    if (coins >= item.price && !inventory.includes(item.id)) {
      setCoins(prev => prev - item.price);
      setInventory(prev => [...prev, item.id]);
      equipItem(item);
    }
  };

  const equipItem = (item) => {
    if (inventory.includes(item.id)) {
      setCarConfig(prev => ({
        ...prev,
        [item.type === 'decals' ? 'decals' : item.type]: item.value
      }));
    }
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100 p-6">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-black text-sky-900 mb-4 drop-shadow-md">Locky's Math Garage</h1>
        
        <div className="flex items-center justify-center space-x-6 text-2xl font-black bg-white px-8 py-3 rounded-full shadow-lg border-4 border-sky-200">
          <div className="flex items-center text-amber-500"><Coins className="mr-2 h-8 w-8" /> {coins}</div>
          <div className="w-1 h-8 bg-slate-200"></div>
          <div className="flex items-center text-emerald-600"><Star className="mr-2 h-8 w-8" /> {progress}/20</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-8 border-sky-200 w-full max-w-4xl flex flex-col items-center h-64 md:h-80">
        <HighDefCarRenderer config={carConfig} />
      </div>

      <div className="flex space-x-6 w-full max-w-xl">
        <button 
          onClick={startQuiz}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-3xl font-black py-5 px-6 rounded-3xl shadow-xl transition-all hover:scale-105 flex items-center justify-center border-b-8 border-emerald-700"
        >
          <Play className="mr-3 h-10 w-10" /> Play Math
        </button>
        <button 
          onClick={() => setView('garage')}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-3xl font-black py-5 px-6 rounded-3xl shadow-xl transition-all hover:scale-105 flex items-center justify-center border-b-8 border-purple-900"
        >
          <Wrench className="mr-3 h-10 w-10" /> Garage
        </button>
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (!currentQuestion) return null;

    return (
      <div className="flex flex-col min-h-screen bg-sky-50 p-6 landscape:flex-row landscape:items-center">
        {/* Left Side Info Panel */}
        <div className="w-full landscape:w-1/3 flex flex-col items-center landscape:items-start p-4">
          <button 
            onClick={() => setView('menu')} 
            className="mb-6 text-sky-700 hover:text-sky-900 flex items-center text-xl font-bold bg-white px-5 py-2 rounded-full shadow border-2 border-sky-200"
          >
            <ArrowLeft className="mr-2" /> Menu
          </button>

          <div className="w-full bg-white rounded-3xl shadow-lg p-6 border-4 border-sky-200 mb-6">
            <h2 className="text-xl font-black text-slate-700 mb-3">Trip to Garage</h2>
            <div className="w-full bg-slate-200 rounded-full h-8 mb-3 overflow-hidden border-2 border-slate-300">
              <div 
                className="bg-emerald-500 h-8 rounded-full transition-all duration-500 flex items-center justify-end px-2" 
                style={{ width: `${(progress / 20) * 100}%` }}
              >
                <Star className="text-white h-5 w-5" />
              </div>
            </div>
            <p className="text-center font-bold text-lg text-sky-700">{progress} of 20 Completed</p>
          </div>

          <div className="flex items-center text-3xl font-black bg-amber-100 px-8 py-4 rounded-full shadow text-amber-600 border-4 border-amber-300 w-full justify-center">
            <Coins className="mr-3 h-10 w-10" /> {coins} Coins
          </div>
        </div>

        {/* Right Side Question Area */}
        <div className="w-full landscape:w-2/3 flex flex-col items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl p-8 border-8 border-sky-200 flex flex-col items-center relative overflow-hidden">
            
            {/* Success Overlay */}
            {showCheckmark && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all duration-300">
                <Check className="w-48 h-48 text-emerald-500 drop-shadow-2xl animate-bounce" strokeWidth={4} />
              </div>
            )}

            <div className="flex items-center w-full mb-6 gap-4">
              <button 
                onClick={() => speak(currentQuestion.text)}
                className="bg-sky-500 hover:bg-sky-600 text-white font-black px-6 py-4 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 text-2xl shrink-0"
              >
                <Volume2 className="h-8 w-8" /> READ
              </button>

              <div className="bg-sky-50 p-6 rounded-2xl border-4 border-sky-100 flex-1 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-snug">
                  {currentQuestion.text}
                </h2>
              </div>
            </div>

            {/* Visual Group Representation */}
            {currentQuestion.visual && currentQuestion.visual.type === 'groups' && (
              <div className="mb-6 flex flex-wrap justify-center gap-4 bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 w-full">
                {Array.from({ length: currentQuestion.visual.groups }).map((_, gIdx) => (
                  <div key={gIdx} className="bg-white border-4 border-sky-300 rounded-2xl p-3 flex flex-wrap justify-center items-center gap-2 shadow-inner" style={{ minWidth: '100px' }}>
                    {Array.from({ length: currentQuestion.visual.itemsPerGroup }).map((_, iIdx) => (
                      <span key={iIdx} className="text-4xl">{currentQuestion.visual.emoji}</span>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Hint Display */}
            {showHint && (
              <div className="w-full bg-amber-100 border-4 border-amber-400 text-amber-900 px-6 py-3 rounded-2xl mb-6 text-xl font-bold animate-bounce text-center">
                {currentQuestion.hint}
              </div>
            )}

            {/* 4 Large Tap Option Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="bg-white border-4 border-sky-300 hover:bg-sky-100 hover:border-sky-500 text-sky-900 font-black text-3xl md:text-4xl py-6 px-4 rounded-3xl shadow-md active:scale-95 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-emerald-50">
      <div className="bg-white rounded-[3rem] shadow-2xl p-12 border-8 border-emerald-300 text-center max-w-xl">
        <Trophy className="h-28 w-28 text-amber-400 mx-auto mb-6 animate-bounce" />
        <h1 className="text-5xl font-black text-emerald-600 mb-4">Garage Unlocked!</h1>
        <p className="text-2xl text-slate-600 font-bold mb-8">
          You earned <span className="text-amber-500">+50 Bonus Coins</span>!
        </p>
        <button 
          onClick={() => setView('garage')}
          className="bg-purple-600 hover:bg-purple-700 text-white text-3xl font-black py-5 px-10 rounded-full shadow-xl transition-transform hover:scale-105 w-full flex justify-center items-center"
        >
          <Wrench className="mr-3 h-8 w-8" /> Go to Locky's Garage
        </button>
      </div>
    </div>
  );

  const renderGarage = () => {
    const renderCategory = (title, itemsKey) => (
      <div className="mb-8 bg-white p-6 rounded-3xl shadow-md border-2 border-slate-200">
        <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase">{title}</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {SHOP_ITEMS[itemsKey].map(item => {
            const isOwned = inventory.includes(item.id);
            const isEquipped = carConfig[item.type === 'decals' ? 'decals' : item.type] === item.value;
            const canAfford = coins >= item.price;

            // Thumbnail Configuration (keeps other active parts visible)
            const thumbConfig = {
              paint: item.type === 'paint' ? item.value : carConfig.paint,
              wheels: item.type === 'wheels' ? item.value : carConfig.wheels,
              spoiler: item.type === 'spoiler' ? item.value : carConfig.spoiler,
              decals: item.type === 'decals' ? item.value : carConfig.decals,
              extras: item.type === 'extras' ? item.value : carConfig.extras
            };

            return (
              <div 
                key={item.id} 
                className={`bg-slate-50 rounded-2xl p-4 border-4 flex flex-col items-center justify-between transition-all ${
                  isEquipped ? 'border-emerald-500 bg-emerald-50/50 shadow-lg scale-105' : 'border-slate-200'
                }`}
              >
                {/* Big Visual SVG Thumbnail (Fills the box) */}
                <div className="w-full h-32 bg-white rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden mb-3 p-1 relative">
                  {item.type === 'paint' ? (
                    /* Massive paint block to show the new color clearly */
                    <div 
                      className="absolute inset-0 rounded-lg shadow-inner m-1 border-4 border-black/20" 
                      style={{ 
                        background: `linear-gradient(135deg, #ffffff44 0%, ${item.value} 40%, ${item.value} 80%, #00000066 100%)` 
                      }} 
                    />
                  ) : (
                    /* Render the muscle car large within the thumbnail */
                    <HighDefCarRenderer config={thumbConfig} />
                  )}
                </div>

                <span className="text-sm font-bold text-slate-800 text-center mb-3 h-10 flex items-center">{item.name}</span>

                <div className="w-full mt-auto">
                  {isOwned ? (
                    <button 
                      onClick={() => equipItem(item)}
                      disabled={isEquipped}
                      className={`w-full py-3 rounded-xl font-black text-base transition-all ${
                        isEquipped 
                          ? 'bg-emerald-500 text-white shadow-inner' 
                          : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md'
                      }`}
                    >
                      {isEquipped ? 'Equipped' : 'Equip'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => buyItem(item)}
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-xl font-black text-base flex items-center justify-center transition-transform ${
                        canAfford 
                          ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-md active:scale-95' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? <Coins className="mr-2 h-6 w-6"/> : <Lock className="mr-2 h-5 w-5"/>}
                      {item.price}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

    return (
      <div className="flex flex-col min-h-screen bg-slate-100 landscape:flex-row">
        {/* Left Fixed Car Preview Panel (Made Larger) */}
        <div className="w-full landscape:w-1/2 p-6 flex flex-col items-center bg-sky-100 border-r-8 border-sky-200 shadow-xl landscape:h-screen landscape:sticky landscape:top-0">
          <div className="w-full flex justify-between items-center mb-2">
            <button 
              onClick={() => setView('menu')} 
              className="bg-white text-slate-800 font-black px-6 py-3 rounded-full shadow hover:bg-slate-50 flex items-center text-xl transition-transform hover:scale-105"
            >
              <ArrowLeft className="mr-2 h-6 w-6" /> Done
            </button>
            
            <div className="bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-full shadow flex items-center text-3xl border-4 border-amber-500">
              <Coins className="mr-3 h-8 w-8" /> {coins}
            </div>
          </div>

          <h1 className="text-4xl font-black text-sky-900 mt-4 mb-2">Locky's Garage</h1>
          <p className="text-lg font-bold text-sky-700 mb-6">Build the ultimate Muscle Car!</p>

          {/* Large Live Interactive Preview */}
          <div className="w-full flex-1 flex justify-center items-center bg-white rounded-3xl shadow-inner p-4 border-4 border-sky-200 mt-2 mb-6 min-h-[250px] relative overflow-hidden">
            <HighDefCarRenderer config={carConfig} />
          </div>
        </div>

        {/* Right Scrollable Customization Shop */}
        <div className="w-full landscape:w-1/2 p-6 overflow-y-auto bg-slate-100" style={{ maxHeight: '100vh' }}>
          {renderCategory("Paint Colors", "paint")}
          {renderCategory("Wheel Rims", "wheels")}
          {renderCategory("Spoilers & Wings", "spoiler")}
          {renderCategory("Custom Decals", "decals")}
          {renderCategory("Awesome Extras", "extras")}
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans text-slate-900 select-none min-h-screen bg-sky-50">
      {view === 'menu' && renderMenu()}
      {view === 'quiz' && renderQuiz()}
      {view === 'success' && renderSuccess()}
      {view === 'garage' && renderGarage()}
    </div>
  );
}
