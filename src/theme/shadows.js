export const buildShadows = (mode) => ({
  z1: mode === 'dark'
    ? '0px 1px 1px rgb(0 0 0 / 14%), 0px 2px 1px rgb(0 0 0 / 12%), 0px 1px 3px rgb(0 0 0 / 20%)'
    : '0px 1px 4px rgba(38,38,38,0.08)',
  button:        '0 2px #0000000b',
  text:          '0 -1px 0 rgb(0 0 0 / 12%)',
  primary:       '0 0 0 2px rgba(22,119,255,0.2)',
  secondary:     '0 0 0 2px rgba(140,140,140,0.2)',
  error:         '0 0 0 2px rgba(255,77,79,0.2)',
  warning:       '0 0 0 2px rgba(250,173,20,0.2)',
  info:          '0 0 0 2px rgba(19,194,194,0.2)',
  success:       '0 0 0 2px rgba(82,196,26,0.2)',
  primaryButton: '0 14px 12px rgba(22,119,255,0.2)',
});
