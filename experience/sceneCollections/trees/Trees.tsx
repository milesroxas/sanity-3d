import { PalmLarge } from "@/experience/baseModels/trees/PalmLarge";
import { PalmMedium } from "@/experience/baseModels/trees/PalmMedium";
import { useEffect } from "react";

export default function Trees() {
  // Trigger shadow update after mounting
  useEffect(() => {
    // Trigger shadow update after a short delay to ensure trees are loaded
    const timeout = setTimeout(() => {
      const event = new CustomEvent('shadow-update');
      window.dispatchEvent(event);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <>
      <PalmLarge />
      <PalmMedium />
    </>
  );
}
