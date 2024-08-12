import { useImperativeHandle, forwardRef, useState } from "react";

const ToneGenerator = forwardRef<
  { handlePlay: (correct: boolean) => void },
  {}
>((_, ref) => {
  const anthemMelody = [
    { note: "G4", freq: 392.0, duration: 1 },
    { note: "E4", freq: 329.63, duration: 1 },
    { note: "C4", freq: 261.63, duration: 1 },
    { note: "E4", freq: 329.63, duration: 1 },
    { note: "G4", freq: 392.0, duration: 1 },
    { note: "C5", freq: 523.25, duration: 1 },
    //bu
    { note: "E5", freq: 659.25, duration: 1 },
    { note: "D5", freq: 587.33, duration: 1 },
    { note: "C5", freq: 523.25, duration: 1 },
    { note: "E4", freq: 329.63, duration: 1 },
    { note: "Gb4", freq: 369.99, duration: 1 },
    { note: "G4", freq: 392.0, duration: 1 },
    //what
    { note: "G4", freq: 392.0, duration: 1 },
    { note: "G4", freq: 392.0, duration: 1 },
    { note: "E5", freq: 659.25, duration: 1 },
    { note: "D5", freq: 587.33, duration: 1 },
    { note: "C5", freq: 523.25, duration: 1 },
    { note: "B4", freq: 493.88, duration: 1 },
    //at the

    { note: "A4", freq: 440, duration: 1 },
    { note: "B4", freq: 493.88, duration: 1 },
    { note: "C5", freq: 523.25, duration: 1 },
    { note: "C5", freq: 523.25, duration: 1 },
    { note: "G4", freq: 392.0, duration: 1 },
    { note: "E4", freq: 329.63, duration: 1 },
    { note: "C4", freq: 261.63, duration: 1 },
  ];

  const [nextNote, setnextNote] = useState(0);
  useImperativeHandle(ref, () => ({
    handlePlay: (correct: boolean) => {
      // Create a new AudioContext each time the function is called

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      oscillator.type = correct ? "triangle" : "square";

      oscillator.frequency.setValueAtTime(
        correct
          ? anthemMelody[nextNote].freq
          : anthemMelody[nextNote].freq / 2 - 35,
        audioContext.currentTime
      );
      setnextNote((prev) => (prev === anthemMelody.length - 1 ? 0 : prev + 1));

      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime); // Start at a specific volume

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 3
      ); // Fade out over 1 second

      // Stop and clean up after 1 second
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
        audioContext.close(); // Close the AudioContext also
      }, 3000);
    },
  }));
  return <></>;
});

export default ToneGenerator;
