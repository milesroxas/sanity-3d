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
    const isDefaultPath = modelPath === defaultPath;
    const source = isDefaultPath ? "public" : "Sanity";

    console.log(`🔍 ${componentName} Model Source: ${source}`);
    console.log(`📦 ${componentName} Model Path: ${modelPath}`);

    if (!isDefaultPath) {
      console.log("📋 Sanity Model Details:", {
        fileName: modelFiles?.[modelIndex ?? 0]?.fileName,
        filePath: modelFiles?.[modelIndex ?? 0]?.filePath,
        fileUrl: modelFiles?.[modelIndex ?? 0]?.fileUrl,
      });
    }
  }, [componentName, modelFiles, modelIndex, modelPath, defaultPath]);
}
