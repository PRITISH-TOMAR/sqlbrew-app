import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import useNavbarHeight from '../../hooks/useNavbarHeight';
import { buildPalette } from '../../theme/palette';

const CustomToaster = () => {
  const navbarHeight = useNavbarHeight();
  const mode = useSelector((s) => s.theme);
  const p = buildPalette(mode);

  return (
    <Toaster
      position="top-right"
      reverseOrder={true}
      containerStyle={{
        top: `${navbarHeight + 10}px`,
        right: '20px',
      }}
      toastOptions={{
        style: {
          background: p.background.paper,
          color: p.text.primary,
          border: `1px solid ${p.divider}`,
          borderRadius: 10,
          fontFamily: "'Public Sans', system-ui, sans-serif",
          fontSize: '0.875rem',
          boxShadow: mode === 'dark' ? '0 12px 32px rgb(0 0 0 / 55%)' : '0 12px 32px rgb(46 37 40 / 12%)',
        },
        success: { iconTheme: { primary: p.success.main, secondary: p.background.paper } },
        error:   { iconTheme: { primary: p.error.main,   secondary: p.background.paper } },
        loading: { iconTheme: { primary: p.primary.main, secondary: p.divider } },
      }}
    />
  );
};

export default CustomToaster;
