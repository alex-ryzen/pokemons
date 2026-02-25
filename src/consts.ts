// general 

export const Namespace = {
    Auth: 'auth',
    User: 'user',
    Shop: 'shop',
    Garden: 'garden',
    Inventory: 'inventory',
    Pokemon: 'pokemon'
} as const;

export const GRIDNAMES = {
    inventory: 'inv',
    garden: 'grdn'
} as const;

export const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL as string;
export const STATIC_URL = import.meta.env.VITE_STATIC_URL as string;

// layout
export const HEADER_HEIGHT = 86;
export const GENERAL_PADDING = 16;
export const GENERAL_GAP = 20;
export const ACCORDION_HEIGHT = 56;
export const ACCORDIONS_GAP = 20;
export const CONTENT_MARGIN_TOP = 8;

export const ASIDE_CONTENT_GAP = 16;
export const ASIDE_CONTENT_PADDING = 12;

export const FILTER_FIELD_HEIGHT = 32;

// item grid
export const CELL_SIZE = 48; // px
export const GRID_GAP = 12; // px
export const GRID_CELL_W = 5; // cells - test
export const GRID_CELL_H = 100; // cells - test
export const SCROLLBAR_WIDTH = 8;
export const SCROLL_MARGIN = 40;
export const SCROLL_SPEED = 15;

// export const VIEWPORT_W = GRID_CELL_W * (CELL_SIZE + GRID_GAP) + SCROLLBAR_WIDTH - GENERAL_PADDING / 2; //320 - GENERAL_PADDING
// export const VIEWPORT_H = 500;

export const DEBOUNCE_INTERVAL = 3000;

// data
export const LIMIT = 100;