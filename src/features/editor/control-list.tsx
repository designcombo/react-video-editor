import { ItemType } from "@designcombo/types";
import { useCallback, useEffect, useState } from "react";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import useLayoutStore from "./store/use-layout-store";
import useStore from "./store/use-store";

export default function ControlList() {
  const { activeIds, trackItemsMap } = useStore();
  const [controlType, setControlType] = useState<ItemType | null>(null);

  useEffect(() => {
    if (activeIds.length === 1) {
      const [id] = activeIds;
      const trackItem = trackItemsMap[id];
      if (trackItem) {
        setControlType(trackItem.type);
      }
    } else {
      setControlType(null);
    }
  }, [activeIds, trackItemsMap]);

  return <>{controlType && <ControlMenu controlType={controlType} />}</>;
}

function ControlMenu({ controlType }: { controlType: ItemType }) {
  const { setShowToolboxItem, setActiveToolboxItem, activeToolboxItem } =
    useLayoutStore();

  const openToolboxItem = useCallback(
    (type: string) => {
      if (type === activeToolboxItem) {
        setShowToolboxItem(false);
        setActiveToolboxItem(null);
      } else {
        setShowToolboxItem(true);
        setActiveToolboxItem(type);
      }
    },
    [activeToolboxItem],
  );

  return (
    <div
      style={{ zIndex: 201 }}
      className="absolute right-2.5 top-1/2 flex w-14 -translate-y-1/2 flex-col items-center rounded-lg bg-sidebar py-2 shadow-lg"
    >
      {
        {
          image: (
            <ImageMenuList
              activeToolboxItem={activeToolboxItem!}
              type={controlType}
              openToolboxItem={openToolboxItem}
            />
          ),
          video: (
            <VideoMenuList
              activeToolboxItem={activeToolboxItem!}
              type={controlType}
              openToolboxItem={openToolboxItem}
            />
          ),
          audio: (
            <AudioMenuList
              activeToolboxItem={activeToolboxItem!}
              type={controlType}
              openToolboxItem={openToolboxItem}
            />
          ),
          text: (
            <TextMenuList
              activeToolboxItem={activeToolboxItem!}
              type={controlType}
              openToolboxItem={openToolboxItem}
            />
          ),
        }[controlType as "image"]
      }
    </div>
  );
}

const ImageMenuList = ({
  openToolboxItem,
  type,
  activeToolboxItem,
}: {
  openToolboxItem: (type: string) => void;
  type: ItemType;
  activeToolboxItem: string;
}) => {
  return (
    <div className="flex flex-col items-center">
      <BasicMenuListItem
        activeToolboxItem={activeToolboxItem}
        openToolboxItem={openToolboxItem}
        type={type}
      />
      <AnimationMenuListItem
        activeToolboxItem={activeToolboxItem}
        openToolboxItem={openToolboxItem}
      />
      <SmartMenuListItem
        activeToolboxItem={activeToolboxItem}
        openToolboxItem={openToolboxItem}
      />
    </div>
  );
};

const TextMenuList = ({
  openToolboxItem,
  type,
  activeToolboxItem,
}: {
  openToolboxItem: (type: string) => void;
  type: ItemType;
  activeToolboxItem: string;
}) => {
  return (
    <div className="flex flex-col items-center">
      <BasicMenuListItem
        activeToolboxItem={activeToolboxItem}
        openToolboxItem={openToolboxItem}
        type={type}
      />
      <AnimationMenuListItem
        activeToolboxItem={activeToolboxItem}
        openToolboxItem={openToolboxItem}
      />
      <SmartMenuListItem
        activeToolboxItem={activeToolboxItem}
        openToolboxItem={openToolboxItem}
      />
      <PresetsMenuListItem
        activeToolboxItem={activeToolboxItem}
        type={type}
        openToolboxItem={openToolboxItem}
      />
    </div>
  );
};

const VideoMenuList = ({
  openToolboxItem,
  type,
  activeToolboxItem,
}: {
  openToolboxItem: (type: string) => void;
  type: ItemType;
  activeToolboxItem: string;
}) => {
  return (
    <div className="flex flex-col items-center">
      <BasicMenuListItem
        activeToolboxItem={activeToolboxItem}
        openToolboxItem={openToolboxItem}
        type={type}
      />
      <AnimationMenuListItem
        activeToolboxItem={activeToolboxItem}
        openToolboxItem={openToolboxItem}
      />
    </div>
  );
};

const AudioMenuList = ({
  openToolboxItem,
  type,
  activeToolboxItem,
}: {
  openToolboxItem: (type: string) => void;
  type: ItemType;
  activeToolboxItem: string;
}) => {
  return (
    <div className="flex flex-col items-center">
      <BasicMenuListItem
        activeToolboxItem={activeToolboxItem}
        openToolboxItem={openToolboxItem}
        type={type}
      />
      <SmartMenuListItem
        activeToolboxItem={activeToolboxItem}
        openToolboxItem={openToolboxItem}
      />
    </div>
  );
};

const PresetsMenuListItem = ({
  openToolboxItem,
  type,
  activeToolboxItem,
}: {
  openToolboxItem: (type: string) => void;
  type: ItemType;
  activeToolboxItem: string;
}) => {
  return (
    <Button
      size="icon"
      onClick={() => openToolboxItem(`preset-${type}`)}
      variant={`preset-${type}` === activeToolboxItem ? "secondary" : "ghost"}
      className={
        `preset-${type}` !== activeToolboxItem ? "text-muted-foreground" : ""
      }
    >
      <Icons.preset size={20} />
    </Button>
  );
};

const BasicMenuListItem = ({
  openToolboxItem,
  type,
  activeToolboxItem,
}: {
  openToolboxItem: (type: string) => void;
  type: string;
  activeToolboxItem: string;
}) => {
  const Icon = Icons[type as "image"];
  return (
    <Button
      size="icon"
      onClick={() => openToolboxItem(`basic-${type}`)}
      variant={`basic-${type}` === activeToolboxItem ? "secondary" : "ghost"}
      className={
        `basic-${type}` !== activeToolboxItem ? "text-muted-foreground" : ""
      }
    >
      <Icon size={20} />
    </Button>
  );
};

const SmartMenuListItem = ({
  openToolboxItem,
  activeToolboxItem,
}: {
  openToolboxItem: (type: string) => void;
  activeToolboxItem: string;
}) => {
  return (
    <Button
      size="icon"
      onClick={() => openToolboxItem("smart")}
      variant={activeToolboxItem === "smart" ? "secondary" : "ghost"}
      className={activeToolboxItem !== "smart" ? "text-muted-foreground" : ""}
    >
      <Icons.smart size={20} />
    </Button>
  );
};

const AnimationMenuListItem = ({
  openToolboxItem,
  activeToolboxItem,
}: {
  openToolboxItem: (type: string) => void;
  activeToolboxItem: string;
}) => {
  return (
    <Button
      size="icon"
      onClick={() => openToolboxItem("animation")}
      variant={activeToolboxItem === "animation" ? "secondary" : "ghost"}
      className={
        activeToolboxItem !== "animation" ? "text-muted-foreground" : ""
      }
    >
      <svg
        width={20}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.77329 21.1395C6.2479 21.3357 5.67727 21.3772 5.12902 21.2591C4.58077 21.1409 4.07788 20.8681 3.67995 20.4729C3.40573 20.202 3.18839 19.879 3.0407 19.523C2.89302 19.1669 2.81797 18.785 2.81995 18.3995C2.82282 18.1286 2.8632 17.8594 2.93995 17.5995C2.65089 17.0591 2.42709 16.4861 2.27329 15.8929C1.66062 16.7379 1.37897 17.7782 1.48164 18.8169C1.5843 19.8557 2.06417 20.8207 2.83041 21.5295C3.59666 22.2382 4.59613 22.6415 5.63969 22.663C6.68325 22.6845 7.69849 22.3228 8.49329 21.6462C7.90225 21.5446 7.32504 21.3745 6.77329 21.1395ZM12.2733 18.4529C11.3101 18.9897 10.1982 19.1982 9.10595 19.0466C8.0137 18.895 7.00057 18.3917 6.21995 17.6129C5.44017 16.8357 4.93549 15.8252 4.78266 14.735C4.62984 13.6447 4.83722 12.5344 5.37329 11.5729C5.22747 10.9494 5.14483 10.3129 5.12662 9.67285C3.99221 10.8831 3.3732 12.4873 3.40057 14.1459C3.42794 15.8045 4.09956 17.3873 5.27329 18.5595C6.4502 19.7295 8.03445 20.3983 9.69374 20.4257C11.353 20.453 12.9585 19.8368 14.1733 18.7062C13.5331 18.6849 12.8967 18.6 12.2733 18.4529Z"
          fill="currentColor"
          fillOpacity="0.5"
        />
        <path
          d="M2.31998 18.3942H2.31998L2.31996 18.3969C2.31763 18.849 2.40565 19.297 2.57886 19.7145C2.75198 20.1319 3.00671 20.5105 3.3281 20.8281C3.79378 21.2904 4.3822 21.6096 5.02368 21.7478C5.59915 21.8719 6.19568 21.8456 6.7562 21.6732C6.91495 21.7365 7.07554 21.7947 7.23776 21.848C6.74151 22.0651 6.20021 22.1745 5.64999 22.1631C4.72873 22.1441 3.84638 21.7881 3.16993 21.1624C2.49348 20.5367 2.06985 19.6847 1.97921 18.7678C1.92477 18.217 1.99273 17.6657 2.17288 17.1516C2.2453 17.3233 2.32356 17.4926 2.40755 17.6592C2.352 17.9001 2.3226 18.1466 2.31998 18.3942ZM9.03722 19.5418C10.1726 19.6994 11.3273 19.5029 12.3446 18.9816C12.5134 19.0181 12.683 19.0503 12.8533 19.0782C11.9099 19.6462 10.8192 19.9442 9.70198 19.9257C8.1721 19.9005 6.7114 19.284 5.62619 18.2053C4.54461 17.1249 3.92573 15.6662 3.9005 14.1376C3.8821 13.0223 4.18082 11.9336 4.74979 10.9932C4.7771 11.1632 4.80878 11.3325 4.84483 11.5009C4.32414 12.517 4.12857 13.6706 4.2875 14.8044C4.45544 16.0024 5.00998 17.1128 5.8668 17.9668C6.72435 18.8224 7.83733 19.3753 9.03722 19.5418Z"
          stroke="currentColor"
          strokeOpacity="0.5"
        />
        <mask id="path-3-inside-1_4741_350" fill="white">
          <path d="M14.4394 17.4732C12.5735 17.4704 10.7663 16.8208 9.32553 15.6352C7.88477 14.4495 6.89961 12.801 6.53784 10.9705C6.17608 9.13998 6.46008 7.24067 7.34149 5.59605C8.22289 3.95144 9.64718 2.66324 11.3718 1.95087C13.0963 1.2385 15.0145 1.14602 16.7996 1.68919C18.5847 2.23235 20.1263 3.37756 21.1619 4.92976C22.1974 6.48196 22.6628 8.34514 22.4788 10.202C22.2948 12.0588 21.4728 13.7944 20.1528 15.1132C19.4024 15.8629 18.5115 16.4572 17.5311 16.8622C16.5508 17.2671 15.5002 17.4747 14.4394 17.4732ZM14.4394 2.6665C13.5538 2.66563 12.6766 2.83932 11.8581 3.17764C11.0396 3.51597 10.2958 4.01229 9.66923 4.63825C9.04266 5.2642 8.5456 6.00751 8.20646 6.82568C7.86733 7.64385 7.69277 8.52083 7.69278 9.4065C7.6929 10.293 7.86985 11.1707 8.21326 11.988C8.55668 12.8053 9.05966 13.5459 9.69278 14.1665C10.958 15.4314 12.6737 16.1419 14.4628 16.1419C16.2518 16.1419 17.9676 15.4314 19.2328 14.1665C20.175 13.2219 20.8157 12.019 21.0738 10.71C21.3318 9.401 21.1955 8.04488 20.6822 6.81339C20.1689 5.58191 19.3017 4.53047 18.1904 3.79224C17.079 3.05402 15.7736 2.66223 14.4394 2.6665Z" />
        </mask>
        <path
          d="M14.4394 17.4732C12.5735 17.4704 10.7663 16.8208 9.32553 15.6352C7.88477 14.4495 6.89961 12.801 6.53784 10.9705C6.17608 9.13998 6.46008 7.24067 7.34149 5.59605C8.22289 3.95144 9.64718 2.66324 11.3718 1.95087C13.0963 1.2385 15.0145 1.14602 16.7996 1.68919C18.5847 2.23235 20.1263 3.37756 21.1619 4.92976C22.1974 6.48196 22.6628 8.34514 22.4788 10.202C22.2948 12.0588 21.4728 13.7944 20.1528 15.1132C19.4024 15.8629 18.5115 16.4572 17.5311 16.8622C16.5508 17.2671 15.5002 17.4747 14.4394 17.4732ZM14.4394 2.6665C13.5538 2.66563 12.6766 2.83932 11.8581 3.17764C11.0396 3.51597 10.2958 4.01229 9.66923 4.63825C9.04266 5.2642 8.5456 6.00751 8.20646 6.82568C7.86733 7.64385 7.69277 8.52083 7.69278 9.4065C7.6929 10.293 7.86985 11.1707 8.21326 11.988C8.55668 12.8053 9.05966 13.5459 9.69278 14.1665C10.958 15.4314 12.6737 16.1419 14.4628 16.1419C16.2518 16.1419 17.9676 15.4314 19.2328 14.1665C20.175 13.2219 20.8157 12.019 21.0738 10.71C21.3318 9.401 21.1955 8.04488 20.6822 6.81339C20.1689 5.58191 19.3017 4.53047 18.1904 3.79224C17.079 3.05402 15.7736 2.66223 14.4394 2.6665Z"
          fill="currentColor"
        />
        <path
          d="M14.4394 17.4732L14.435 20.4732L14.4394 17.4732ZM22.4788 10.202L19.4934 9.90613L22.4788 10.202ZM20.1528 15.1132L22.2731 17.2355L20.1528 15.1132ZM14.4394 2.6665L14.4365 5.66653L14.449 5.66649L14.4394 2.6665ZM7.69278 9.4065L4.69278 9.4065L4.69278 9.40693L7.69278 9.4065ZM9.69278 14.1665L11.8138 12.0449L11.8034 12.0344L11.7928 12.0241L9.69278 14.1665ZM14.4628 16.1419L14.4628 19.1419L14.4628 16.1419ZM19.2328 14.1665L21.3538 16.2881L21.3567 16.2852L19.2328 14.1665ZM14.4439 14.4732C13.2719 14.4714 12.1368 14.0635 11.2319 13.3187L7.4192 17.9516C9.39577 19.5782 11.8751 20.4694 14.435 20.4732L14.4439 14.4732ZM11.2319 13.3187C10.3269 12.574 9.70814 11.5386 9.48092 10.3888L3.59477 11.5521C4.09107 14.0634 5.44262 16.325 7.4192 17.9516L11.2319 13.3187ZM9.48092 10.3888C9.25369 9.2391 9.43208 8.04615 9.98569 7.01317L4.69729 4.17894C3.48809 6.43519 3.09846 9.04086 3.59477 11.5521L9.48092 10.3888ZM9.98569 7.01317C10.5393 5.98018 11.4339 5.17107 12.5171 4.72363L10.2264 -0.821889C7.86046 0.15541 5.90649 1.92269 4.69729 4.17894L9.98569 7.01317ZM12.5171 4.72363C13.6003 4.27619 14.8051 4.21811 15.9263 4.55927L17.6729 -1.18089C15.2239 -1.92606 12.5924 -1.79919 10.2264 -0.821889L12.5171 4.72363ZM15.9263 4.55927C17.0476 4.90043 18.0158 5.61973 18.6663 6.59467L23.6575 3.26485C22.2368 1.13539 20.1219 -0.435727 17.6729 -1.18089L15.9263 4.55927ZM18.6663 6.59467C19.3167 7.5696 19.609 8.73986 19.4934 9.90613L25.4642 10.4978C25.7166 7.95041 25.0781 5.39431 23.6575 3.26485L18.6663 6.59467ZM19.4934 9.90613C19.3779 11.0724 18.8615 12.1625 18.0324 12.9909L22.2731 17.2355C24.084 15.4262 25.2118 13.0452 25.4642 10.4978L19.4934 9.90613ZM18.0324 12.9909C17.5611 13.4617 17.0016 13.835 16.3858 14.0894L18.6765 19.6349C20.0214 19.0793 21.2436 18.264 22.2731 17.2355L18.0324 12.9909ZM16.3858 14.0894C15.77 14.3438 15.1101 14.4742 14.4439 14.4732L14.435 20.4732C15.8902 20.4753 17.3315 20.1905 18.6765 19.6349L16.3858 14.0894ZM14.4424 -0.333495C13.1625 -0.334761 11.8949 -0.0837622 10.7121 0.405152L13.0041 5.95013C13.4583 5.7624 13.945 5.66602 14.4365 5.6665L14.4424 -0.333495ZM10.7121 0.405152C9.52929 0.894066 8.45442 1.61131 7.54896 2.51588L11.7895 6.76061C12.1372 6.41327 12.5499 6.13787 13.0041 5.95013L10.7121 0.405152ZM7.54896 2.51588C6.6435 3.42044 5.92519 4.4946 5.43511 5.67694L10.9778 7.97441C11.166 7.52041 11.4418 7.10795 11.7895 6.76061L7.54896 2.51588ZM5.43511 5.67694C4.94503 6.85928 4.69277 8.12662 4.69278 9.4065L10.6928 9.4065C10.6928 8.91505 10.7896 8.42841 10.9778 7.97441L5.43511 5.67694ZM4.69278 9.40693C4.69296 10.6924 4.94953 11.965 5.44748 13.1501L10.979 10.8259C10.7902 10.3764 10.6928 9.89367 10.6928 9.40607L4.69278 9.40693ZM5.44748 13.1501C5.94543 14.3352 6.67476 15.4091 7.59278 16.3089L11.7928 12.0241C11.4446 11.6828 11.1679 11.2754 10.979 10.8259L5.44748 13.1501ZM7.57173 16.2881C9.39951 18.1154 11.8782 19.1419 14.4628 19.1419L14.4628 13.1419C13.4693 13.1419 12.5164 12.7473 11.8138 12.0449L7.57173 16.2881ZM14.4628 19.1419C17.0473 19.1419 19.526 18.1154 21.3538 16.2881L17.1117 12.0449C16.4091 12.7473 15.4563 13.1419 14.4628 13.1419L14.4628 19.1419ZM21.3567 16.2852C22.7183 14.9202 23.6442 13.1818 24.0171 11.2902L18.1304 10.1298C17.9872 10.8561 17.6317 11.5237 17.1088 12.0478L21.3567 16.2852ZM24.0171 11.2902C24.39 9.39856 24.1931 7.43883 23.4513 5.6592L17.9131 7.96758C18.198 8.65093 18.2736 9.40343 18.1304 10.1298L24.0171 11.2902ZM23.4513 5.6592C22.7096 3.87958 21.4563 2.36014 19.8503 1.29333L16.5304 6.29116C17.1471 6.70079 17.6283 7.28423 17.9131 7.96758L23.4513 5.6592ZM19.8503 1.29333C18.2443 0.226522 16.3579 -0.339653 14.4298 -0.333481L14.449 5.66649C15.1894 5.66412 15.9137 5.88152 16.5304 6.29116L19.8503 1.29333Z"
          fill="currentColor"
          mask="url(#path-3-inside-1_4741_350)"
        />
      </svg>
    </Button>
  );
};
