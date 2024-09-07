import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Slider } from '@/components/ui/slider';
import { Plus, RefreshCcw, RotateCw } from 'lucide-react';
import { useState } from 'react';

const Opacity = () => {
  const [value, setValue] = useState([10]);

  return (
    <div>
      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="temperature">Opacity</Label>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 40px 24px',
            gap: '4px',
          }}
        >
          <Slider
            id="opacity"
            max={1}
            step={0.1}
            onValueChange={setValue}
            aria-label="Temperature"
          />
          <Input className="w-11 px-2 text-sm text-center" defaultValue={100} />
          <div className="flex items-center">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-zinc-400"
            >
              <RotateCw size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opacity;
