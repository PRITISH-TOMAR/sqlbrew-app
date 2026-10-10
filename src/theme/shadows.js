// Light-mode shadows use the zinc neutral; dark mode uses pure black
export const buildShadows = (mode) => {
  const dark = mode === 'dark';
  const c = dark ? '0 0 0' : '24 24 27'; // rgb triplets
  return {
    z1:      dark ? '0 1px 2px rgb(0 0 0 / 50%)' : `0 1px 2px rgb(${c} / 8%)`,
    card:    dark ? '0 1px 2px rgb(0 0 0 / 40%)' : `0 1px 2px rgb(${c} / 6%), 0 1px 3px rgb(${c} / 6%)`,
    raised:  dark ? '0 8px 24px rgb(0 0 0 / 45%)' : `0 4px 12px rgb(${c} / 8%), 0 1px 3px rgb(${c} / 6%)`,
    popover: dark ? '0 12px 32px rgb(0 0 0 / 55%), 0 0 0 1px rgb(255 255 255 / 3%)' : `0 12px 32px rgb(${c} / 12%), 0 2px 6px rgb(${c} / 6%)`,
    dialog:  dark ? '0 24px 64px rgb(0 0 0 / 60%)' : `0 24px 64px rgb(${c} / 18%)`,
    button:  `0 1px 2px rgb(${c} / 10%)`,
    primary: dark ? '0 0 0 3px rgb(242 84 107 / 35%)' : '0 0 0 3px rgb(155 27 48 / 20%)',
    error:   dark ? '0 0 0 3px rgb(255 138 76 / 30%)' : '0 0 0 3px rgb(194 65 12 / 22%)',
    success: dark ? '0 0 0 3px rgb(61 214 140 / 30%)' : '0 0 0 3px rgb(21 128 79 / 22%)',
    primaryButton: dark ? '0 10px 24px rgb(242 84 107 / 22%)' : '0 10px 24px rgb(155 27 48 / 22%)',
  };
};
