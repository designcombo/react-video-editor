import { cn } from '@/lib/utils';
import { Input } from './input';
interface InputColorProps {
  className?: string;
  placeholder?: string;
  size?: 'sm' | 'lg' | 'default' | 'xs';
  value?: string;
  onChange?: (value: string) => void;
}
const InputColor = ({
  className,
  placeholder,
  size = 'xs',
  value = '#44bd32',
  onChange,
}: InputColorProps) => {
  return (
    <div className="relative">
      <Input
        size={size}
        className={cn('pl-8 font-medium', className)}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      <div
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        className="absolute left-1 h-[22px] w-[22px] rounded-sm bg-green-500"
      ></div>
    </div>
  );
};

export default InputColor;
