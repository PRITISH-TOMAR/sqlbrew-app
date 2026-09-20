// Ant Design color tokens (hardcoded)
const blue  = ['#e6f4ff','#bae0ff','#91caff','#69b1ff','#4096ff','#1677ff','#0958d9','#003eb3','#002c8c','#001d6c'];
const red   = ['#fff1f0','#ffccc7','#ffa39e','#ff7875','#ff4d4f','#f5222d','#cf1322','#a8071a','#820014','#5c0011'];
const gold  = ['#fffbe6','#fff1b8','#ffe58f','#ffd666','#ffc53d','#faad14','#d48806','#ad6800','#874d00','#614700'];
const cyan  = ['#e6fffb','#b5f5ec','#87e8de','#5cdbd3','#36cfc9','#13c2c2','#08979c','#006d75','#00474f','#002329'];
const green = ['#f6ffed','#d9f7be','#b7eb8f','#95de64','#73d13d','#52c41a','#389e0d','#237804','#135200','#092b00'];

export const lightGrey = [
  '#ffffff','#fafafa','#f5f5f5','#f0f0f0','#d9d9d9',
  '#bfbfbf','#8c8c8c','#595959','#262626','#141414','#000000',
];
export const darkGrey = [
  '#000000','#141414','#1e1e1e','#595959','#8c8c8c',
  '#bfbfbf','#d9d9d9','#f0f0f0','#f5f5f5','#fafafa','#ffffff',
];

export const buildPalette = (mode) => {
  const grey = mode === 'dark' ? darkGrey : lightGrey;

  return {
    mode,
    primary: {
      lighter: blue[0],
      light:   blue[3],
      main:    blue[5],
      dark:    blue[6],
      darker:  blue[8],
      contrastText: '#fff',
    },
    secondary: {
      lighter: grey[2],
      light:   grey[3],
      main:    grey[5],
      dark:    grey[7],
      darker:  grey[9],
      contrastText: grey[0],
    },
    error: {
      lighter: red[0],
      light:   red[2],
      main:    red[4],
      dark:    red[6],
      darker:  red[8],
      contrastText: '#fff',
    },
    warning: {
      lighter: gold[0],
      light:   gold[3],
      main:    gold[5],
      dark:    gold[7],
      darker:  gold[9],
      contrastText: grey[1],
    },
    info: {
      lighter: cyan[0],
      light:   cyan[3],
      main:    cyan[5],
      dark:    cyan[7],
      darker:  cyan[9],
      contrastText: '#fff',
    },
    success: {
      lighter: green[0],
      light:   green[3],
      main:    green[5],
      dark:    green[7],
      darker:  green[9],
      contrastText: '#fff',
    },
    grey: {
      0:   grey[0],
      50:  grey[1],
      100: grey[2],
      200: grey[3],
      300: grey[4],
      400: grey[5],
      500: grey[6],
      600: grey[7],
      700: grey[8],
      800: grey[9],
      900: grey[10],
      A50:  mode === 'dark' ? '#121212' : '#fafafb',
      A800: mode === 'dark' ? '#d3d8db' : '#e6ebf1',
    },
    text: {
      primary:   mode === 'dark' ? 'rgba(255,255,255,0.87)' : grey[7],
      secondary: grey[5],
      disabled:  mode === 'dark' ? 'rgba(255,255,255,0.3)' : grey[4],
    },
    divider: mode === 'dark' ? 'rgba(255,255,255,0.05)' : grey[3],
    background: {
      paper:   mode === 'dark' ? '#1e1e1e' : '#ffffff',
      default: mode === 'dark' ? '#121212' : '#fafafb',
    },
    action: {
      disabled: grey[3],
    },
  };
};
