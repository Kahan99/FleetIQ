import React from "react";







export const Table = ({ headers, children, className = "" }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100">
                        {headers.map((header, idx) =>
            <th key={idx} className="pb-4 pt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {header}
                            </th>
            )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">{children}</tbody>
            </table>
        </div>);

};

export const TableRow = ({
  children,
  className = ""
}) =>
<tr className={`group hover:bg-gray-50/50 transition-colors ${className}`}>
        {children}
    </tr>;


export const TableCell = ({
  children,
  className = ""
}) =>
<td className={`py-4 text-sm text-gray-600 ${className}`}>
        {children}
    </td>;