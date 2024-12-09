import React from "react";
import { Typography, IconButton, Button } from "@material-tailwind/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    onPageChange 
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const delta = 2; 
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

    return (
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
            <Typography variant="small" color="blue-gray" className="font-normal mb-4">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} items
            </Typography>
            <div className="flex gap-2">
                <Button 
                    color="purple"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                 First
                </Button>
                <IconButton 
                    color="purple"
                    size="sm"
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-5 w-5" />
                </IconButton>

                {getPageNumbers().map((page, index) => (
                    <div key={index}>
                        { page === "..." ? (
                            <span className="px-2 py-1 text-black">...</span>
                        ) : (
                            <IconButton
                                className={`${currentPage === page ? "bg-gray-300" : ""}`}
                                variant="text"
                                size="sm"
                                onClick={() => onPageChange(page)}
                            >
                             {page}
                            </IconButton>
                        )}
                    </div>
                ))}

                <IconButton 
                    color="purple"
                    size="sm"
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-5 w-5"/>
                </IconButton>
                <Button 
                    color="purple"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                 Last
                </Button>
            </div>
        </div>
    );
}
