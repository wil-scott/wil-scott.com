// public/js/main.js
import { initTerminal } from './terminal.js';
import { initUI } from './ui.js';

const term = initTerminal();
initUI(term);
