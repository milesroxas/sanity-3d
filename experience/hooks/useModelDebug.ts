import { useEffect } from "react";

type ModelFile = {
  _type: "modelFiles";
  fileName?: string;
  filePath?: string;
  fileUrl?: string;
};

interface ModelDebugOptions {
  componentName: string;
  modelFiles?: Array<ModelFile>;
  modelIndex?: number;
  modelPath: string;
  defaultPath: string;
}

export function useModelDebug({
  componentName,
  modelFiles,
  modelIndex = 0,
  modelPath,
  defaultPath,
}: ModelDebugOptions) {
  useEffect(() => {
    console.log(`${componentName} Debug:`, {
      providedModelFiles: modelFiles,
      selectedIndex: modelIndex,
      selectedModelFile: modelFiles?.[modelIndex ?? 0],
      usingPath: modelPath,
      isFallback: modelPath === defaultPath,
    });
  }, [componentName, modelFiles, modelIndex, modelPath, defaultPath]);
}
