import React from 'react';
import { Button, IconButton } from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, paginate, totalRiders, ridersPerPage }) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage * ridersPerPage >= totalRiders;
  const lastPage = Math.ceil(totalRiders / ridersPerPage);

  return (
    <div className="flex justify-center mt-2 gap-1">
      {/* First Page Button */}
      <Button
        color="purple"
        size="sm"
        onClick={() => paginate(1)}
        disabled={isFirstPage}
        className="px-2 py-1 text-xs normal-case"
      >
        First
      </Button>

      {/* Previous Page Button */}
      <IconButton
        color="purple"
        size="sm"
        onClick={() => paginate(currentPage - 1)}
        disabled={isFirstPage}
        className="p-1"
      >
        <ChevronLeft className="h-4 w-4" />
      </IconButton>

      {/* Next Page Button */}
      <IconButton
        color="purple"
        size="sm"
        onClick={() => paginate(currentPage + 1)}
        disabled={isLastPage}
        className="p-1"
      >
        <ChevronRight className="h-4 w-4" />
      </IconButton>

      {/* Last Page Button */}
      <Button
        color="purple"
        size="sm"
        onClick={() => paginate(lastPage)}
        disabled={isLastPage}
        className="px-2 py-1 text-xs normal-case"
      >
        Last
      </Button>
    </div>
  );
}