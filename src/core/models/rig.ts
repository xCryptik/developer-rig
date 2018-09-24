export interface RigExtensionView {
  x: number;
  y: number;
  orientation: string;
  id: string;
  channelId: string;
  features: {
    isChatEnabled: boolean;
  };
  type: string;
  mode?: string;
  role: string;
  linked: boolean;
  linkedUserId: string;
  opaqueId: string;
  isPopout: boolean;
  deleteViewHandler?: (id: string) => void;
  openEditViewHandler?: (id: string) => void;
  frameSize?: FrameSize;
}

export interface FrameSize {
  height: number;
  width: number;
}
