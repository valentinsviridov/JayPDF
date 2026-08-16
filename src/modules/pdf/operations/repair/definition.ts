export type RepairOptions = {
  renderDpi?: number;
  imageQuality?: number;
  imageFormat?: 'png' | 'jpeg';
};

export const DEFAULT_REPAIR_OPTIONS: RepairOptions = {
  renderDpi: 144,
  imageQuality: 0.85,
  imageFormat: 'jpeg',
};
