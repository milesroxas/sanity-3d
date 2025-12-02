'use client';
import { useCameraStore } from '@/experience/scenes/store/cameraStore';
import { useLogoMarkerStore } from '@/experience/scenes/store/logoMarkerStore';
import { usePoiStore } from '@/experience/scenes/store/poiStore';
import { useEffect, useMemo } from 'react';
import { PoiButton } from './PoiButton';

interface PoiManagerProps {
  scene: Sanity.Scene;
}

/**
 * PoiManager - Orchestrates POI display based on camera state
 *
 * Responsibilities:
 * - Filters inline POIs from scene data
 * - Controls POI visibility based on camera animation state
 * - Prevents race conditions by listening to animation completion
 * - Handles POI selection and delegates to overlay
 *
 * State Dependencies:
 * - cameraStore.isAnimating: Controls when POIs can appear
 * - logoMarkerStore.selectedScene: Indicates if a child scene is active
 * - poiStore: POI-specific state management
 */
export function PoiManager({ scene }: PoiManagerProps) {
  const isAnimating = useCameraStore(s => s.isAnimating);
  const selectedScene = useLogoMarkerStore(s => s.selectedScene);

  const poisVisible = usePoiStore(s => s.poisVisible);
  const selectedPoi = usePoiStore(s => s.selectedPoi);
  const setPoisVisible = usePoiStore(s => s.setPoisVisible);
  const setSelectedPoi = usePoiStore(s => s.setSelectedPoi);

  // POIs should be active when a scene is selected (regardless of drawer visibility)
  const isSceneActive = !!selectedScene;

  // Filter inline POIs only
  const inlinePois = useMemo(() => {
    if (!scene.pointsOfInterest) return [];

    return scene.pointsOfInterest.filter(
      (poi): poi is Sanity.PointOfInterest =>
        poi._type === 'pointOfInterest' && !!poi.markerPosition
    );
  }, [scene.pointsOfInterest]);

  // Show POIs after camera animation completes
  useEffect(() => {
    if (!isAnimating && isSceneActive && inlinePois.length > 0) {
      // Delay slightly to ensure camera has fully settled
      const timer = setTimeout(() => {
        setPoisVisible(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setPoisVisible(false);
    }
  }, [isAnimating, isSceneActive, inlinePois.length, setPoisVisible]);

  // Reset POI state when scene is deselected
  useEffect(() => {
    if (!isSceneActive) {
      setPoisVisible(false);
      setSelectedPoi(null);
    }
  }, [isSceneActive, setPoisVisible, setSelectedPoi]);

  const handlePoiClick = (poi: Sanity.PointOfInterest) => {
    setSelectedPoi(poi);
  };

  // Don't render if no POIs or wrong mode
  if (inlinePois.length === 0) return null;

  return (
    <group>
      {inlinePois.map((poi, index) => (
        <PoiButton
          key={poi._key}
          poi={poi}
          isVisible={poisVisible}
          isSelected={selectedPoi?._key === poi._key}
          onClick={handlePoiClick}
          index={index}
        />
      ))}
    </group>
  );
}
