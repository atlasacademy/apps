import { useState } from "react";
import Pagination from "react-bootstrap/Pagination";

interface Props {
    maxVisibleButtons?: number;
    itemsPerPage: number;
}

interface PaginationResult<T> {
    currentPage: number;
    totalPages: number;
    items: T[];
    goToPage: (pageNumber: number) => void;
    Paginator: React.FC
}

export default function usePaginator<T>(arr: T[], props: Props): PaginationResult<T> {
    const [currentPage, setCurrentPage] = useState(1);

    const { itemsPerPage, maxVisibleButtons = 5 } = props;
    const totalPages = Math.ceil(arr.length / itemsPerPage);
    const startIndex = Math.max((currentPage - 1) * itemsPerPage, 0);
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = arr.slice(startIndex, endIndex);

    const goToPage = (pageNumber: number) => {
        setCurrentPage(((pageNumber + totalPages - 1) % totalPages) + 1);
    };

    const Paginator: React.FC = () => {
        const visiblePageNumbers = getVisiblePageNumbers(currentPage, totalPages, maxVisibleButtons);

        return (
            <Pagination className="mb-0">
                <Pagination.First onClick={() => goToPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} />
                {visiblePageNumbers.map((pageNumber) => (
                    <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === currentPage}
                        onClick={() => goToPage(pageNumber)}
                    >
                        {pageNumber}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };


    return {
        currentPage,
        totalPages,
        items: paginatedItems,
        goToPage,
        Paginator
    };
}


function getVisiblePageNumbers(currentPage: number, totalPages: number, maxVisibleButtons: number): number[] {
    const halfButtons = Math.floor(maxVisibleButtons / 2);
    let startPage = Math.max(currentPage - halfButtons, 1);
    const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

    if (endPage - startPage + 1 < maxVisibleButtons) {
        startPage = Math.max(endPage - maxVisibleButtons + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
}
