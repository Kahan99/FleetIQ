import React from "react";

interface TableProps {
    headers: string[];
    children: React.ReactNode;
    className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, children, className = "" }) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100">
                        {headers.map((header, idx) => (
                            <th key={idx} className="pb-4 pt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">{children}</tbody>
            </table>
        </div>
    );
};

export const TableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = "",
}) => (
    <tr className={`group hover:bg-gray-50/50 transition-colors ${className}`}>
        {children}
    </tr>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = "",
}) => (
    <td className={`py-4 text-sm text-gray-600 ${className}`}>
        {children}
    </td>
);
