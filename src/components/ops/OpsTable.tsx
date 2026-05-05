import React from 'react';

interface Column<T> {
    key: keyof T | string;
    header: string;
    width?: string;
    render?: (row: T, index: number) => React.ReactNode;
}

interface OpsTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (row: T, index: number) => void;
    className?: string;
    loading?: boolean;
    emptyMessage?: string;
}

/**
 * OpsTable - Data table with ops styling
 */
function OpsTable<T extends Record<string, unknown>>({
    columns,
    data,
    onRowClick,
    className = '',
    loading = false,
    emptyMessage = 'No data available',
}: OpsTableProps<T>) {
    if (loading) {
        return (
            <div className={`ops-card ${className}`}>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="ops-skeleton h-12 rounded" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`ops-card overflow-hidden p-0 ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--ops-border)]">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ops-text-muted bg-[var(--ops-surface-2)]"
                                    style={{ width: col.width }}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-8 text-center ops-text-muted"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`
                    border-b border-[var(--ops-border)] last:border-b-0
                    transition-colors duration-150
                    hover:bg-[var(--ops-surface-2)]
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                                    onClick={() => onRowClick?.(row, rowIndex)}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-4 py-3 text-sm ops-text-primary"
                                        >
                                            {col.render
                                                ? col.render(row, rowIndex)
                                                : (row[col.key as keyof T] as React.ReactNode)
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OpsTable;
