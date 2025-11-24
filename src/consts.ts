// general 
export const Namespace = {
    user: 'user',
    items: 'items',
    pokemons: 'pokemons',
} as const;
// export const Namespace = {
//     auth: 'auth',
//     user: 'user',
//     shop: 'shop',
//     garden: 'garden',
//     inventory: 'inventory',
//     pokemon: 'pokemon'
// } as const;


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
export const GRID_CELL_W = 5; // cells
export const GRID_CELL_H = 1000; // cells
export const SCROLLBAR_WIDTH = 8;
export const SCROLL_MARGIN = 40;
export const SCROLL_SPEED = 15;

export const VIEWPORT_W = GRID_CELL_W * (CELL_SIZE + GRID_GAP) + SCROLLBAR_WIDTH; //320 - GENERAL_PADDING
export const VIEWPORT_H = 500;
