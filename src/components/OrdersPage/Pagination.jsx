import React, { useState, useEffect, Fragment } from "react";
import {
  Typography,
  IconButton,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  totalPages,
  onPageChange,
  isLoading,
  onPageSizeChange,
}) {
  // DECLARATIONS
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handlePageSizeChange = (value) => {    
    onPageSizeChange(value);
  };

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

      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="flex items-center gap-x-2 py-2">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Showing{" "}
          </Typography>
          <Select
            value={itemsPerPage.toString()}
            label="Items"
            className="min-w-[65px] text-sm"
            containerProps={{ className: "min-w-[65px]" }}
            menuProps={{ className: "min-w-[65px]" }}
            onChange={handlePageSizeChange}
          >
            {[10, 25, 50, 75, 100].map((size) => (
              <Option
                key={size}
                value={size.toString()}
                className="w-full text-center text-sm"
              >
                {size}
              </Option>
            ))}
          </Select>{" "}
          <Typography
            variant="small"
            color="blue-gray"
            className="text-nowrap font-normal"
          >
            of {totalItems} items
          </Typography>
        </div>

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
