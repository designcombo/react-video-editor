import useLayoutStore from '@/store/use-layout-store';
import { Transitions } from './transitions';
import { Texts } from './texts';
import { Uploads } from './uploads';
import { Audios } from './audios';
import { Elements } from './elements';
import { Images } from './images';
import { Videos } from './videos';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Container = ({ children }: { children: React.ReactNode }) => {
  const { showMenuItem, setShowMenuItem } = useLayoutStore();
  return (
    <div
      style={{
        left: showMenuItem ? '0' : '-100%',
        transition: 'left 0.25s ease-in-out',
        zIndex: 200,
      }}
      className="w-[340px] h-[calc(100%-32px-64px)] mt-6 absolute top-1/2 -translate-y-1/2 rounded-lg shadow-lg flex"
    >
      <div className="w-[74px]"></div>
      <div className="flex-1 relative bg-zinc-950 flex">
        <Button
          variant="ghost"
          className="absolute top-2 right-2 w-8 h-8 text-muted-foreground"
          size="icon"
        >
          <X width={16} onClick={() => setShowMenuItem(false)} />
        </Button>
        {children}
      </div>
    </div>
  );
};

const ActiveMenuItem = () => {
  const { activeMenuItem } = useLayoutStore();
  if (activeMenuItem === 'transitions') {
    return <Transitions />;
  }
  if (activeMenuItem === 'texts') {
    return <Texts />;
  }
  if (activeMenuItem === 'shapes') {
    return <Elements />;
  }
  if (activeMenuItem === 'videos') {
    return <Videos />;
  }

  if (activeMenuItem === 'audios') {
    return <Audios />;
  }

  if (activeMenuItem === 'images') {
    return <Images />;
  }
  if (activeMenuItem === 'uploads') {
    return <Uploads />;
  }
  return null;
};

export const MenuItem = () => {
  return (
    <Container>
      <ActiveMenuItem />
    </Container>
  );
};
