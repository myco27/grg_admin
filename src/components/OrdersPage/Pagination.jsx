import React, { useState, useEffect, Fragment } from "react";
import { Typography, IconButton, Button } from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  totalPages,
  onPageChange,
  isLoading,
}) {
    
  // DECLARATIONS
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }

    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.unshift(1);
      if (totalPages > 1 && !range.includes(totalPages)) {
        range.push(totalPages);
      }
    }

    return range;
  };

  const handlePageChange = (newPage) => {
    onPageChange(newPage);
  };

  return (
    <Fragment>
      {/* Pagination */}

      <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal mb-4"
        >
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}{" "}
          of {totalItems} items
        </Typography>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            color="purple"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || isLoading}
          >
            First
          </Button>
          <IconButton
            color="purple"
            size="sm"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-5 w-5" />
          </IconButton>

          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-2 py-1 text-black">...</span>
              ) : (
                <IconButton
                  className={currentPage === page ? "bg-gray-300" : ""}
                  variant="text"
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                >
                  {page}
                </IconButton>
              )}
            </div>
          ))}

          <IconButton
            color="purple"
            size="sm"
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronRight className="h-5 w-5" />
          </IconButton>
          <Button
            color="purple"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || isLoading}
          >
            Last
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
