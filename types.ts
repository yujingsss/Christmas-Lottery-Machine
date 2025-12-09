export interface Photo {
  id: string;
  url: string;
}

export interface PhotoPoolProps {
  photos: Photo[];
  onAddPhotos: (files: FileList | null) => void;
  onRemovePhoto: (id: string) => void;
  disabled: boolean;
}

export interface SlotMachineProps {
  currentDisplay: Photo[];
  isSpinning: boolean;
  poolEmpty: boolean;
}