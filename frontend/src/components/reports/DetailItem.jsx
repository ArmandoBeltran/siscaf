import React from 'react';
import '../../assets/css/detail-item.css';

function DetailItem({ headers, data }) {
    return (
        <table className="table-detail">
            <thead>
                <tr className="bg-gray-100">
                    {headers.map((header, idx) => (
                        <th key={idx} className="text-left px-2 py-1">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, idxRow) => (
                    <tr key={idxRow}>
                        {headers.map((header, idxCol) => (
                            <td key={idxCol} className="px-2 py-1">
                                {React.isValidElement(row[header])
                                    ? row[header]
                                    : row[header]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DetailItem;
