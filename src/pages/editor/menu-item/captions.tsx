import { Button } from "@/components/ui/button";
import captionsData from "./combo.json";
import { getCaptionLines, getCaptions } from "../utils/captions";
import { ADD_CAPTION, dispatch } from "@designcombo/events";
import { loadFonts } from "../utils/fonts";
// interface Job {
//   id: string;
//   projectId: string;
//   fileName: string;
//   url?: string;
//   output?: string;
// }
export const Captions = () => {
  // const { activeIds, trackItemDetailsMap } = useStore();

  const generateCaptions = async () => {
    // https://cdn.designcombo.dev/fonts/theboldfont.ttf
    await loadFonts([
      {
        name: "theboldfont",
        url: "https://cdn.designcombo.dev/fonts/theboldfont.ttf",
      },
    ]);
    const captionLines = getCaptionLines(captionsData, 64, "theboldfont", 800);
    // console.log({ captions: captionLines });
    const captions = getCaptions(captionLines);
    // console.log({ captions: captions.slice(8, 9) });
    dispatch(ADD_CAPTION, {
      payload: captions,
    });
    // console.log({ data });
    // const [id] = activeIds;
    // const trackItem = trackItemDetailsMap[id];
    // const src = trackItem.details.src;
    // console.log(trackItem);
    //     POST https://transcribe.designcombo.dev
    // {
    //     "url": "https://dev-drawify-v3.s3.eu-west-3.amazonaws.com/images/video.mp4",
    //     "projectId": "asdasdasfdsf"
    // }
    // const reso = await axios.post(
    //   "https://transcribe.designcombo.dev",
    //   {
    //     url: "https://cdn.designcombo.dev/videos/a-real-code-red-at-becca-s-school.mp4",
    //     projectId: "asdasdasfdsf"
    //     // mode: "test"
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer RMU2FsdGVkX1/lPghp6YisxRFm+W2KcVcwrx1SYVD5N3O/g5NkxD3eq2TidsPih5do2epq3yyZfdVxPT0z8LWN3J/W/xtSEze/6snUgLhq5ccevl6pCNuvCcOn62pNsuXJ`
    //     }
    //   }
    // );
    // console.log({ reso });
    // const res = await axios.get(
    //   "https://transcribe.designcombo.dev/status/86",
    //   {
    //     headers: {
    //       Authorization: `Bearer RMU2FsdGVkX1/lPghp6YisxRFm+W2KcVcwrx1SYVD5N3O/g5NkxD3eq2TidsPih5do2epq3yyZfdVxPT0z8LWN3J/W/xtSEze/6snUgLhq5ccevl6pCNuvCcOn62pNsuXJ`
    //     }
    //   }
    // );
    // console.log({ res });
    // RMU2FsdGVkX1/lPghp6YisxRFm+W2KcVcwrx1SYVD5N3O/g5NkxD3eq2TidsPih5do2epq3yyZfdVxPT0z8LWN3J/W/xtSEze/6snUgLhq5ccevl6pCNuvCcOn62pNsuXJ
    // response object
    // {
    //     "projectId": "asdasdasfdsf",
    //     "fileName": "15a72516-45a9-476c-b07b-5edd85b994ac/asdasdasfdsf/6E3kbpMCd91H.json",
    //     "key": " ",
    //     "url": "https://transcribe-snapmotion.s3.us-east-1.amazonaws.com/15a72516-45a9-476c-b07b-5edd85b994ac/asdasdasfdsf/6E3kbpMCd91H.json"
    // }
    // const transcribe = data.transcribe;
    // console.log(transcribe);
    // console.log({ job });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-text-primary flex h-12 flex-none items-center px-4 text-sm font-medium">
        Captions
      </div>
      <div className="flex flex-col gap-8 px-4 py-4">
        <div className="text-center text-sm text-muted-foreground">
          Recognize speech in the selected video/audio and generate captions
          automatically.
        </div>
        <Button onClick={generateCaptions} variant="default" className="w-full">
          Generate
        </Button>
      </div>
    </div>
  );
};
