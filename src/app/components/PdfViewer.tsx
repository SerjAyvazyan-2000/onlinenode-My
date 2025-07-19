"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Spinner } from "@heroui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// Initialize the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/react-pdf/pdf.worker.mjs";

// Options for React-PDF
const pdfOptions = {
  cMapUrl: "/react-pdf/cmaps/",
  standardFontDataUrl: "/react-pdf/standard_fonts/",
};

interface PdfViewerProps {
  pdfFile: string;
  containerWidth?: number;
  autoScale?: boolean;
  renderTextLayer?: boolean;
  renderAnnotationLayer?: boolean;
  firstPageShowNumber?: number;
}

export default function PdfViewer({
  pdfFile,
  containerWidth: externalWidth,
  autoScale = true,
  renderTextLayer = true,
  renderAnnotationLayer = true,
  firstPageShowNumber = 1,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInputValue, setPageInputValue] = useState<string>("1");
  const [pageNumChangeBlocked, setPageNumChangeBlocked] =
    useState<boolean>(false);
  const documentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageNumChangeBlockedRef = useRef(false);
  const navigationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getContainerWidth = () => {
    if (externalWidth && externalWidth > 0) {
      return externalWidth;
    }
    return containerRef.current?.clientWidth || 0;
  };

  const scrollToPage = (pageNumber: number) => {
    if (documentRef.current) {
      const pageElement = documentRef.current.querySelector(
        `[data-page-number="${pageNumber}"]`,
      );
      if (pageElement) {
        const rect = pageElement.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const absoluteTop = rect.top + scrollTop;

        window.scrollTo({
          top: absoluteTop - 10,
          behavior: "smooth",
        });
      }
    }
  };

  const navigateToPage = (newPage: number) => {
    if (navigationTimerRef.current) {
      clearTimeout(navigationTimerRef.current);
    }

    setPageNumChangeBlocked(true);
    setCurrentPage(newPage);
    setPageInputValue((newPage + firstPageShowNumber - 1).toString());
    scrollToPage(newPage);

    navigationTimerRef.current = setTimeout(() => {
      setPageNumChangeBlocked(false);
      navigationTimerRef.current = null;
    }, 1000);
  };

  const applyPageInputValue = () => {
    // If the field is empty, set page 1
    if (!pageInputValue.trim()) {
      navigateToPage(1);
      return;
    }

    let pageNum = parseInt(pageInputValue, 10) - firstPageShowNumber + 1;

    // If it is not a number, go back to the current page
    if (isNaN(pageNum)) {
      setPageInputValue((currentPage + firstPageShowNumber - 1).toString());
      return;
    }

    // Limit the value from 1 to numPages
    pageNum = Math.max(1, Math.min(pageNum, numPages));

    navigateToPage(pageNum);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      navigateToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      navigateToPage(currentPage + 1);
    }
  };

  // Handler for successful PDF document upload
  const onDocumentLoadSuccess = useCallback(
    (data: { numPages: number }): void => {
      setNumPages(data.numPages);
      setIsLoading(false);
    },
    [setNumPages, setIsLoading],
  );

  // Handler for loading the first page to get its dimensions
  const onFirstPageLoadSuccess = (page: any) => {
    if (!pageWidth) {
      // Getting the original PDF page width
      const { originalWidth } = page;
      setPageWidth(originalWidth);
    }
  };

  // This handler will update the temporary value without changing the currentPage
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allowing an empty value so that the field can be completely cleared
    setPageInputValue(e.target.value);
  };

  // Handler for the Enter key
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyPageInputValue();
      // Снимаем фокус с поля ввода
      (e.target as HTMLElement).blur();
    }
  };

  // Handler for losing focus from the input field
  const handlePageInputBlur = () => {
    applyPageInputValue();
  };

  // Activate page input focus
  const handlePageInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  useEffect(() => {
    setPageInputValue((currentPage + firstPageShowNumber - 1).toString());
  }, [currentPage]);

  // Window resizing handler, change PDF scale
  useEffect(() => {
    if (!autoScale) return;

    const updateScale = () => {
      const containerWidth = getContainerWidth();
      if (containerWidth > 0 && pageWidth) {
        // Calculating the scale so that the page fits into the container
        // We leave a small indentation (0.95) so that the page does not rest against the edges
        const newScale = (containerWidth * 0.95) / pageWidth;
        setScale(newScale);
      }
    };

    // Updating the size when changing the width of the container or the width of the page
    updateScale();

    // Configuring the Resize Observer to track container size changes
    const resizeObserver = new ResizeObserver(updateScale);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Subscribing to change the window size
    window.addEventListener("resize", updateScale);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      window.removeEventListener("resize", updateScale);
    };
  }, [autoScale, externalWidth, pageWidth]);

  useEffect(() => {
    pageNumChangeBlockedRef.current = pageNumChangeBlocked;
  }, [pageNumChangeBlocked]);

  // Determining the current page during the scrolling process
  useEffect(() => {
    // Skip if the PDF document has not yet been uploaded or there are no pages
    if (isLoading || numPages === 0) return;

    // A function for determining which page of a document is most visible
    const determineVisiblePage = () => {
      if (!documentRef.current) return;

      if (pageNumChangeBlockedRef.current) return;

      // Getting all the page elements
      const pageElements =
        documentRef.current.querySelectorAll("[data-page-number]");
      if (!pageElements.length) return;

      let maxVisiblePage = 1;
      let maxVisibleArea = 0;

      // Checking each page and find the one with the largest visible area
      pageElements.forEach((pageElement) => {
        const rect = pageElement.getBoundingClientRect();
        const pageNumber = parseInt(
          pageElement.getAttribute("data-page-number") || "1",
          10,
        );

        // Calculating the height of the visible part of the page
        const windowHeight = window.innerHeight;
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(windowHeight, rect.bottom);

        // If the lower visible point is higher than the upper one, then the page is not visible
        if (visibleBottom <= visibleTop) return;

        // Calculating the visible area of the page
        const visibleHeight = visibleBottom - visibleTop;
        const visibleWidth = Math.min(rect.width, window.innerWidth);
        const visibleArea = visibleHeight * visibleWidth;

        // If this page has more visible area than the previous maximum
        // we update the maximum area and page number.
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          maxVisiblePage = pageNumber;
        }
      });

      // Updating the status only if the page number has changed
      if (maxVisiblePage !== currentPage) {
        setCurrentPage(maxVisiblePage);
      }
    };

    // Adding a scroll event handler
    const handleScroll = () => {
      // Using requestAnimationFrame to optimize performance
      window.requestAnimationFrame(determineVisiblePage);
    };

    // Adding a scroll event listener
    window.addEventListener("scroll", handleScroll);

    determineVisiblePage();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, numPages, currentPage]);

  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      <div
        ref={containerRef}
        className="w-full max-w-4xl mx-auto overflow-auto mt-2 relative"
      >
        <div ref={documentRef}>
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            options={pdfOptions}
            className="flex flex-col items-center pt-2"
            loading={
              <div className="flex justify-center items-center">
                <Spinner className="p-10" size="lg" />
              </div>
            }
          >
            {Array.from({ length: numPages }, (_, index) => (
              <div
                key={`page-container-${index + 1}`}
                className="mb-4 bg-white [box-shadow:0_0_10px_rgba(0,0,0,0.35)]"
              >
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={renderTextLayer}
                  renderAnnotationLayer={renderAnnotationLayer}
                  scale={scale}
                  onLoadSuccess={
                    index === 0 ? onFirstPageLoadSuccess : undefined
                  }
                  data-page-number={index + 1}
                  loading={
                    <div className="flex justify-center items-center">
                      <Spinner className="p-10" size="lg" />
                    </div>
                  }
                />
              </div>
            ))}
          </Document>
        </div>

        {/* Bottom navigation panel */}
        {!isLoading && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 bg-white rounded-full shadow-lg px-4 py-2 border border-gray-200">
            <button
              onClick={goToPreviousPage}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              disabled={isLoading}
              aria-label="Previous page"
              type="button"
            >
              <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
            </button>

            <div className="flex items-center">
              <input
                type="number"
                min={firstPageShowNumber}
                max={numPages}
                value={pageInputValue}
                onChange={handlePageInputChange}
                onKeyDown={handlePageInputKeyDown}
                onBlur={handlePageInputBlur}
                onFocus={handlePageInputFocus}
                className="w-10 h-8 text-center border rounded
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none"
                disabled={isLoading}
              />
              <span className="mx-1 text-sm">из</span>
              <span className="text-sm">
                {numPages + firstPageShowNumber - 1}
              </span>
            </div>

            <button
              onClick={goToNextPage}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              disabled={isLoading}
              aria-label="Next page"
              type="button"
            >
              <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
