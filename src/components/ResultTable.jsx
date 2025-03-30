import { useState } from "react";
import styled from "styled-components";
import * as XLSX from "xlsx";

const ResultTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  if (!data || data.length === 0) return <p>No results to display.</p>;

  const headers = Object.keys(data[0]);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (typeof aValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }
    return sortConfig.direction === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const copyToClipboard = () => {
    const text = [headers.join(",")]
      .concat(data.map((row) => headers.map((h) => row[h]).join(",")))
      .join("\n");
    navigator.clipboard.writeText(text);
    alert("Table data copied to clipboard!");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "query_results.xlsx");
  };

  return (
    <TableContainer>
      <TableHeader>
        <CopyButton onClick={copyToClipboard}>Copy Data</CopyButton>
        <ExportButton onClick={exportToExcel}>Export to Excel</ExportButton>
      </TableHeader>
      <Table>
        <thead>
          <tr>
            {headers.map((header) => (
              <Th key={header} onClick={() => handleSort(header)}>
                {header} {sortConfig.key === header && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <Td key={header}>{row[header]}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 10px;
`;

const CopyButton = styled.button`
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #218838;
  }
`;

const ExportButton = styled.button`
  padding: 5px 10px;
  background-color: #17a2b8;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #138496;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: ${({ theme }) => (theme === "dark" ? "#444" : "#f4f4f4")};
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => (theme === "dark" ? "#555" : "#e0e0e0")};
  }
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

export default ResultTable;