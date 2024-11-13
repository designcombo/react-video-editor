export const frameToTimeString = (
  { frame }: { frame: number },
  { fps }: { fps: number },
): string => {
  // Calculate the total time in seconds
  const totalSeconds = frame / fps;

  // Calculate hours, minutes, seconds, and milliseconds
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);

  // Format the time string based on whether hours are zero or not
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
};

export const timeToString = ({ time }: { time: number }): string => {
  // Calculate the total time in seconds
  const totalSeconds = time / 1000;

  // Calculate hours, minutes, seconds, and milliseconds
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);

  // Format the time string based on whether hours are zero or not
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
};

export const getCurrentTime = () => {
  const currentTimeElement = document.getElementById("video-current-time");
  let currentTimeSeconds = currentTimeElement
    ? parseFloat(currentTimeElement.getAttribute("data-current-time")!)
    : 0;
  const currentTimeMiliseconds = currentTimeSeconds * 1000;
  return currentTimeMiliseconds;
};
