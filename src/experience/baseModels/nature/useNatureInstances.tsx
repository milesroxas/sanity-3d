import { useContext } from "react";
import { context } from "./NatureGroup";

export function useNatureInstances() {
  const instances = useContext(context);
  if (!instances)
    throw new Error(
      "useNatureInstances must be used within an Instances component"
    );
  return instances;
}
