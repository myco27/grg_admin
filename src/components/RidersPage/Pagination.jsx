import React from 'react';
import { Button, IconButton } from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, paginate, indexOfLastRider, filteredRiders, ridersPerPage }) {
  const isFirstPage = currentPage === 1;
  const isLastPage = indexOfLastRider >= filteredRiders.length;
  const lastPage = Math.ceil(filteredRiders.length / ridersPerPage);

  return (
    <div className="flex justify-center mt-2 gap-1">
      {/* First Page Button */}
      <Button
        color="purple"
        size="sm" // Smaller button size
        onClick={() => paginate(1)}
        disabled={isFirstPage}
        className="px-2 py-1 text-xs normal-case" // Smaller padding and text
      >
        First
      </Button>

      {/* Previous Page Button */}
      <IconButton
        color="purple"
        size="sm" // Smaller button size
        onClick={() => paginate(currentPage - 1)}
        disabled={isFirstPage}
        className="p-1" // Smaller padding
      >
        <ChevronLeft className="h-4 w-4" /> {/* Smaller icon */}
      </IconButton>

      {/* Next Page Button */}
      <IconButton
        color="purple"
        size="sm" // Smaller button size
        onClick={() => paginate(currentPage + 1)}
        disabled={isLastPage}
        className="p-1" // Smaller padding
      >
        <ChevronRight className="h-4 w-4" /> {/* Smaller icon */}
      </IconButton>

      {/* Last Page Button */}
      <Button
        color="purple"
        size="sm" // Smaller button size
        onClick={() => paginate(lastPage)}
        disabled={isLastPage}
        className="px-2 py-1 text-xs normal-case"
      >
        Last
      </Button>
    </div>
  );
}