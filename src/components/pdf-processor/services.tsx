"use client";

import { createContext, useContext, type ReactNode } from 'react';
import {
  workerBackedPdfDocumentService,
  type PdfDocumentService,
} from '../../modules/pdf/document-service';
import {
  browserDownloadService,
  type DownloadService,
} from '../../modules/pdf/download-service';
import {
  browserPdfProcessorService,
  type PdfProcessorService,
} from '../../modules/pdf/processor-service';

export type PdfProcessorServices = {
  processor: PdfProcessorService;
  documents: PdfDocumentService;
  downloads: DownloadService;
};

export const defaultPdfProcessorServices: PdfProcessorServices = {
  processor: browserPdfProcessorService,
  documents: workerBackedPdfDocumentService,
  downloads: browserDownloadService,
};

const PdfProcessorServicesContext = createContext<PdfProcessorServices>(defaultPdfProcessorServices);

export function PdfProcessorServicesProvider({
  services = defaultPdfProcessorServices,
  children,
}: {
  services?: PdfProcessorServices;
  children: ReactNode;
}) {
  return (
    <PdfProcessorServicesContext.Provider value={services}>
      {children}
    </PdfProcessorServicesContext.Provider>
  );
}

export function usePdfProcessorServices(): PdfProcessorServices {
  return useContext(PdfProcessorServicesContext);
}
