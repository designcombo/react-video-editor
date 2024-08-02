import { useEffect } from 'react';
import useDataState from './store/use-data-state';
import { getCompactFontData } from './utils/fonts';
import { FONTS } from './data/fonts';
import { Editor } from './components/editor';

export const theme = {
  colors: {
    gray: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
      1000: '#040405',
      1100: '#010101',
    },
  },
};

function App() {
  const { setCompactFonts, setFonts } = useDataState();

  useEffect(() => {
    setCompactFonts(getCompactFontData(FONTS));
    setFonts(FONTS);
  }, []);

  return <Editor />;
}

export default App;
