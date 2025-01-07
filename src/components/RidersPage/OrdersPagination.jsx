import React from 'react';
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OrdersPagination({ currentPage, paginate, indexOfLastOrder, filteredOrders, ordersPerPage }) {
  const pageNumbers = [];
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const maxPagesToShow = 5; // Number of page numbers to show around the current page
    const pages = [];

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      return pageNumbers.map(number => (
        <IconButton
          key={number}
          size="sm"
          variant={currentPage === number ? "filled" : "text"}
          onClick={() => paginate(number)}
          className={currentPage === number ? "bg-purple-500 text-white" : ""}
        >
          {number}
        </IconButton>
      ));
    }

    // Calculate the range of page numbers to show
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    // Add the first page and ellipsis if needed
    if (start > 1) {
      pages.push(
        <IconButton
          key={1}
          size="sm"
          variant={currentPage === 1 ? "filled" : "text"}
          onClick={() => paginate(1)}
          className={currentPage === 1 ? "bg-purple-500 text-white" : ""}
        >
          1
        </IconButton>
      );
      if (start > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 py-1 text-black">
            ...
          </span>
        );
      }
    }

    // Add the range of page numbers
    for (let i = start; i <= end; i++) {
      pages.push(
        <IconButton
          key={i}
          size="sm"
          variant={currentPage === i ? "filled" : "text"}
          onClick={() => paginate(i)}
          className={currentPage === i ? "bg-purple-500 text-white" : ""}
        >
          {i}
        </IconButton>
      );
    }

    // Add the last page and ellipsis if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 py-1 text-black">
            ...
          </span>
        );
      }
      pages.push(
        <IconButton
          key={totalPages}
          size="sm"
          variant={currentPage === totalPages ? "filled" : "text"}
          onClick={() => paginate(totalPages)}
          className={currentPage === totalPages ? "bg-purple-500 text-white" : ""}
        >
          {totalPages}
        </IconButton>
      );
    }

    return pages;
  };

  return (
    <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
      {/* Showing items text */}
      <Typography variant="small" color="blue-gray" className="font-normal mb-4">
        Showing {indexOfLastOrder - ordersPerPage + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} items
      </Typography>

      {/* Pagination controls */}
      <div className="flex flex-wrap justify-center gap-2">
        {/* Previous Page Button */}
        <IconButton
          color="purple"
          variant="text"
          size="sm"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </IconButton>

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next Page Button */}
        <IconButton
          color="purple"
          variant="text"
          size="sm"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2"
        >
         <ChevronRight className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}