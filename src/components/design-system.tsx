import { Input } from './ui/input';
import InputColor from './ui/input-color';

export default function DesignSystem() {
  return (
    <div className="w-64  m-auto pt-12 space-y-6">
      <div>
        <div className="text-lg font-bold">Inputs</div>
        <div className="text-sm space-y-2">
          <div>Small</div>
          <Input size="sm" placeholder="shadcn" />
          <div>Default</div>
          <Input placeholder="shadcn" />
          <div>Large</div>
          <Input size="lg" placeholder="shadcn" />
        </div>
      </div>
      <div>
        <div className="text-lg font-bold">Input Color</div>
        <div className="text-sm">Color</div>
        <InputColor />
      </div>
    </div>
  );
}
