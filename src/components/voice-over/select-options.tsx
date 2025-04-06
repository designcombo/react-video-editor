import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { ChevronsUpDown, PauseIcon, PlayIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { OptionsCountrys } from "@/features/editor/data/language";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

type SliderProps = React.ComponentProps<typeof Slider>;

type SliderValues = {
  speed: number;
  stability: number;
  similarity: number;
  styleExaggeration: number;
};

interface SelectGenderProps {
  onGenderChange: (gender: string) => void;
  gender: string;
}

interface SelectLenguageProps {
  onLenguageChange: (language: string) => void;
  language: string;
}
type ModelSliderOptionsProps = Omit<SliderProps, "value" | "onValueChange"> & {
  title: string;
  from: string;
  to: string;
  newValue: number;
  handleChange: (value: number) => void;
  type?: string;
};

export function SelectGender({ onGenderChange, gender }: SelectGenderProps) {
  return (
    <Select onValueChange={onGenderChange} value={gender}>
      <SelectTrigger
        onPointerDown={(e) => {
          // Prevent the click from closing the popover
          e.stopPropagation();
        }}
        className="w-auto text-xs"
      >
        <SelectValue placeholder="Select a Gender" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="All" className="cursor-pointer text-xs">
            All
          </SelectItem>
          <SelectItem value="male" className="cursor-pointer text-xs">
            Male
          </SelectItem>
          <SelectItem value="female" className="cursor-pointer text-xs">
            Female
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function SelectLanguage({
  onLenguageChange,
  language,
}: SelectLenguageProps) {
  return (
    <Select onValueChange={onLenguageChange} defaultValue="en" value={language}>
      <SelectTrigger
        onPointerDown={(e) => {
          // Prevent the click from closing the popover
          e.stopPropagation();
        }}
        className="w-auto text-sm"
      >
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {OptionsCountrys.map((country) => (
            <SelectItem
              key={country.id}
              value={country.code}
              className="cursor-pointer"
            >
              <div className="flex h-full w-full items-center justify-center gap-4">
                <div dangerouslySetInnerHTML={{ __html: country.image }} />{" "}
                <span className="text-xs">{country.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

type PropSelectSpeaker = {
  setVoiceId: Dispatch<SetStateAction<string>>;
};

export function SelectSpeaker({ setVoiceId }: PropSelectSpeaker) {
  const [gender, setGender] = React.useState("");
  const [language, setLanguage] = React.useState("en");
  const [voices, setVoices] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedVoice, setSelectedVoice] = React.useState<any>(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = React.useState<
    string | null
  >(null);

  const [activePreview, setActivePreview] = React.useState(false);

  const [currentAudio, setCurrentAudio] =
    React.useState<HTMLAudioElement | null>(null);

  const filteredVoices =
    gender && gender !== "All"
      ? voices.filter((voice: any) => voice.gender === gender)
      : voices;

  const playAudio = (audioUrl: string, voiceId: string, state?: boolean) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = new Audio(audioUrl);
    audio.onended = () => {
      setCurrentlyPlayingId("");
      setActivePreview(false);
    };

    audio
      .play()
      .then(() => {
        state && setCurrentlyPlayingId(voiceId);
        setCurrentAudio(audio);
        !state && setActivePreview(true);
      })
      .catch((e) => console.error("Error playing audio:", e));
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setCurrentlyPlayingId(null);
  };

  React.useEffect(() => {
    const fetchVoices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/voices?language=${language}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setVoices(data);
      } catch (err) {
        setError("Error fetching voices");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoices();
  }, [language]);

  React.useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  React.useEffect(() => {
    if (selectedVoice) {
      setVoiceId(selectedVoice.voice_id);
    }
  }, [selectedVoice]);

  // const voice = voices.find((voice) => voice.voice_id === value);

  return (
    <>
      <Popover>
        {!selectedVoice ? (
          <div className="w-full">
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-between">
                Select Voice
                <ChevronsUpDown className="ml-2 opacity-50" />
              </Button>
            </PopoverTrigger>
          </div>
        ) : (
          <PopoverTrigger asChild>
            <div className="flex h-9 cursor-pointer items-center gap-2 rounded-md border bg-background px-2 py-2 hover:bg-accent">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (activePreview) {
                    stopAudio();
                    setActivePreview(false);
                  } else {
                    if (selectedVoice?.preview_url) {
                      playAudio(
                        selectedVoice.preview_url,
                        selectedVoice.voice_id,
                      );
                      setActivePreview(true);
                    }
                  }
                }}
              >
                {activePreview ? (
                  <PauseIcon size={18} />
                ) : (
                  <PlayIcon size={18} />
                )}
              </div>
              <div className="flex w-full items-center justify-between text-sm">
                <div className="w-44 truncate">{selectedVoice?.name}</div>
                <ChevronsUpDown className="ml-2 w-4 opacity-50" />
              </div>
            </div>
          </PopoverTrigger>
        )}
        <PopoverContent className="bg-background p-0">
          <div className="grid grid-cols-2 gap-2 p-2">
            <SelectLanguage
              onLenguageChange={setLanguage}
              language={language}
            />
            <SelectGender onGenderChange={setGender} gender={gender} />
          </div>
          <ScrollArea className="h-72 w-full">
            {isLoading ? (
              <div className="flex h-full items-center justify-center py-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : error ? (
              <div className="flex h-full items-center justify-center text-sm text-red-500">
                {error}
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-0">
                {filteredVoices.length === 0 ? (
                  <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                    No voices found
                  </div>
                ) : (
                  filteredVoices.map((voice, index) => (
                    <div
                      key={index}
                      className="mx-2 flex cursor-pointer items-center gap-4 px-2 py-2 text-sm hover:bg-secondary/80"
                    >
                      {currentlyPlayingId === voice.voice_id ? (
                        <PauseIcon
                          size={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            stopAudio();
                          }}
                        />
                      ) : (
                        <PlayIcon
                          size={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (voice.preview_url) {
                              playAudio(
                                voice.preview_url,
                                voice.voice_id,
                                true,
                              );
                            }
                          }}
                        />
                      )}

                      <div
                        onClick={() => {
                          setSelectedVoice(voice);

                          stopAudio();
                        }}
                      >
                        <p className="w-52 overflow-hidden truncate whitespace-nowrap text-sm">
                          {voice.name}
                        </p>
                        <div className="flex gap-2 text-muted-foreground">
                          {voice.gender} {voice.descriptive}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </>
  );
}
export function SliderOptions({ className, ...props }: SliderProps) {
  const [sliderValues, setSliderValues] = React.useState<SliderValues>({
    speed: 1,
    stability: 50,
    similarity: 70,
    styleExaggeration: 0,
  });

  const [isSliding, setIsSliding] = React.useState<
    Record<keyof SliderValues, boolean>
  >({
    speed: false,
    stability: false,
    similarity: false,
    styleExaggeration: false,
  });

  const handleSliderChange = (name: keyof SliderValues, value: number) => {
    setSliderValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col gap-8">
      <ModelSliderOptions
        title="Speed"
        from="Slower"
        to="Faster"
        newValue={sliderValues.speed}
        isSliding={isSliding.speed}
        handleChange={(value: number) => handleSliderChange("speed", value)}
        setIsSliding={(sliding) =>
          setIsSliding((prev) => ({ ...prev, speed: sliding }))
        }
        min={0.7}
        max={1.2}
        type="speed"
        className={cn("w-full", className)}
        {...props}
      />
      <ModelSliderOptions
        title="Stability"
        from="More variable"
        to="More stable"
        newValue={sliderValues.stability}
        isSliding={isSliding.stability}
        handleChange={(value) => handleSliderChange("stability", value)}
        setIsSliding={(sliding) =>
          setIsSliding((prev) => ({ ...prev, stability: sliding }))
        }
        className={cn("w-full", className)}
        {...props}
      />
      <ModelSliderOptions
        title="Similarity"
        from="Low"
        to="High"
        newValue={sliderValues.similarity}
        isSliding={isSliding.similarity}
        handleChange={(value) => handleSliderChange("similarity", value)}
        setIsSliding={(sliding) =>
          setIsSliding((prev) => ({ ...prev, similarity: sliding }))
        }
        className={cn("w-full", className)}
        {...props}
      />
      <ModelSliderOptions
        title="Style Exaggeration"
        from="None"
        to="Exaggerated"
        newValue={sliderValues.styleExaggeration}
        isSliding={isSliding.styleExaggeration}
        handleChange={(value) => handleSliderChange("styleExaggeration", value)}
        setIsSliding={(sliding) =>
          setIsSliding((prev) => ({ ...prev, styleExaggeration: sliding }))
        }
        className={cn("w-full", className)}
        {...props}
      />
    </div>
  );
}

function ModelSliderOptions({
  className,
  title,
  from,
  to,
  min = 0,
  max = 100,
  newValue = 0,
  type,
  isSliding,
  setIsSliding,
  handleChange,
  ...props
}: ModelSliderOptionsProps & {
  isSliding: boolean;
  setIsSliding: (sliding: boolean) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <span>{from}</span>

          <span>{to}</span>
        </div>

        <SliderPrimitive.Root
          min={min}
          max={max}
          value={[newValue]}
          step={type === "speed" ? 0.01 : 1}
          onValueChange={(values) => {
            setIsSliding(true);
            handleChange(values[0]);
          }}
          className="relative flex w-full touch-none select-none items-center"
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="group block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 transition-transform group-hover:scale-100">
              {newValue}
            </Badge>
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
      </div>
    </div>
  );
}
