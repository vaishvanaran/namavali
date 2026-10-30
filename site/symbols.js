/* Simple original line symbols for each deity group (drawn for this app). viewBox 0 0 64 64, stroke = currentColor. */
window.SYMBOLS = {
  // Ganapati — modaka on a plate
  ganapati: `<path d="M32 12c-3 6-12 13-12 22a12 12 0 0 0 24 0c0-9-9-16-12-22z"/><path d="M32 12v34M26 22c-1 7-1 15 0 23M38 22c1 7 1 15 0 23"/><path d="M12 50h40M16 50c2 4 6 5 16 5s14-1 16-5"/>`,
  // Guru — kamandalu
  guru: `<path d="M22 30h20c2 0 4 2 4 5 0 9-6 17-14 17s-14-8-14-17c0-3 2-5 4-5z"/><path d="M26 30v-6h12v6"/><path d="M24 24h16"/><path d="M38 26c6-4 12-3 14 1"/><path d="M28 18c0-4 8-4 8 0v6"/><path d="M24 42h16"/>`,
  // Shiva — trishula
  shiva: `<path d="M32 8v48"/><path d="M32 8l-3 6M32 8l3 6"/><path d="M18 14c0 10 5 16 14 16s14-6 14-16"/><path d="M18 14l-2 4M46 14l2 4"/><path d="M27 36h10"/><circle cx="32" cy="40" r="3"/>`,
  // Ambal — lotus
  devi: `<path d="M32 14c-6 7-6 20 0 30 6-10 6-23 0-30z"/><path d="M32 44c-5-9-14-14-22-12 2 8 11 13 22 12z"/><path d="M32 44c5-9 14-14 22-12-2 8-11 13-22 12z"/><path d="M32 44c-8-3-18-2-24 3M32 44c8-3 18-2 24 3"/><path d="M14 52h36"/>`,
  // Subrahmanya — vel
  subrahmanya: `<path d="M32 6c-7 8-9 15-9 20a9 9 0 0 0 18 0c0-5-2-12-9-20z"/><path d="M32 14v18"/><path d="M27 37h10"/><path d="M32 35v23"/><path d="M29 58h6"/>`,
  // Vishnu — shankha & chakra
  vishnu: `<circle cx="22" cy="30" r="11"/><circle cx="22" cy="30" r="3"/><path d="M22 19v22M11 30h22M14 22l16 16M30 22L14 38"/><path d="M44 18c6 0 10 6 9 13-1 6-5 9-9 9s-7-3-7-7 3-6 6-6c2 0 4 2 3 4"/><path d="M44 40v6l-3 4h6l-3-4"/><path d="M10 54h44"/>`,
  // Hanuman — gada
  hanuman: `<path d="M36 26l14 26"/><path d="M48 50l4 7"/><ellipse cx="30" cy="18" rx="11" ry="12" transform="rotate(-28 30 18)"/><path d="M22 14l14 8M24 22l10-14"/><path d="M33 31l6-2"/>`,
  // Navagraha — sun with eight grahas around
  navagraha: `<circle cx="32" cy="32" r="8"/><circle cx="32" cy="10" r="3.5"/><circle cx="32" cy="54" r="3.5"/><circle cx="10" cy="32" r="3.5"/><circle cx="54" cy="32" r="3.5"/><circle cx="16.5" cy="16.5" r="3.5"/><circle cx="47.5" cy="47.5" r="3.5"/><circle cx="47.5" cy="16.5" r="3.5"/><circle cx="16.5" cy="47.5" r="3.5"/>`,
  // Dikpalas — eight directions
  dikpala: `<circle cx="32" cy="32" r="22"/><path d="M32 6l5 21-5 5-5-5zM32 58l-5-21 5-5 5 5zM6 32l21-5 5 5-5 5zM58 32l-21 5-5-5 5-5z"/><path d="M15 15l9 9M49 49l-9-9M49 15l-9 9M15 49l9-9"/>`,
  // Others — kalasha with mango leaves
  others: `<path d="M20 34c0-6 5-10 12-10s12 4 12 10c0 10-5 18-12 18s-12-8-12-18z"/><path d="M24 24h16M26 52h12"/><path d="M32 22c0-5 0-9 0-12M32 14c-4-4-9-4-12-2 3 3 8 4 12 2zM32 14c4-4 9-4 12-2-3 3-8 4-12 2z"/><path d="M22 36h20"/>`,
};
window.symbolSVG = k => `<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${window.SYMBOLS[k] || window.SYMBOLS.others}</svg>`;
