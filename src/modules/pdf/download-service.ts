export type DownloadArtifact = {
  blob: Blob;
  fileName: string;
};

export interface DownloadService {
  download(artifact: DownloadArtifact): void;
}

export const browserDownloadService: DownloadService = {
  download({ blob, fileName }) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  },
};
