import React from "react";
import { Typography, Button, IconButton } from "@material-tailwind/react";
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

    return (
        <div className="mt-8 flex items-center justify-between">
            <Typography variant="small" color="blue-gray" className="font-normal">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} items
            </Typography>
            <div className="flex gap-2">
                <IconButton 
                    color="blue"
                    size="sm"
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                >
                 <ChevronLeft className="h-5 w-5" />
                </IconButton>
                <IconButton 
                    color="blue"
                    size="sm"
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                 <ChevronRight className="h-5 w-5"/>
                </IconButton>
            </div>
        </div>
    );
}
