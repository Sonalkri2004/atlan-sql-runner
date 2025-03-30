import { useState, useEffect } from "react";
import styled from "styled-components";
import QueryInput from "./components/QueryInput";
import ResultTable from "./components/ResultTable";

// Mock data for predefined queries
const mockData = {
  "SELECT * FROM employees": [
    { id: 1, name: "John Doe", role: "Engineer", salary: 75000 },
    { id: 2, name: "Jane Smith", role: "Manager", salary: 90000 },
    { id: 3, name: "Bob Johnson", role: "Analyst", salary: 60000 },
  ],
  "SELECT * FROM orders": [
    { orderId: 101, customer: "Acme Corp", amount: 5000, date: "2025-03-01" },
    { orderId: 102, customer: "Beta Inc", amount: 3000, date: "2025-03-02" },
  ],
};

const predefinedQueries = Object.keys(mockData);

const App = () => {
  const [query, setQuery] = useState(() => localStorage.getItem("lastQuery") || predefinedQueries[0]);
  const [results, setResults] = useState(mockData[predefinedQueries[0]]);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("queryHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("lastQuery", query); // Save query to localStorage
  }, [query]);

  useEffect(() => {
    localStorage.setItem("queryHistory", JSON.stringify(history)); // Save history to localStorage
  }, [history]);

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
    setResults(mockData[newQuery] || mockData[predefinedQueries[0]]);
    if (!predefinedQueries.includes(newQuery) && !history.includes(newQuery)) {
      setHistory((prev) => [newQuery, ...prev].slice(0, 5));
    }
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <AppContainer isDarkMode={isDarkMode}>
      <Header>SQL Query Runner</Header>
      <DarkModeToggle>
        <label>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          Dark Mode
        </label>
      </DarkModeToggle>
      <Main>
        <QueryInput
          query={query}
          setQuery={setQuery}
          predefinedQueries={predefinedQueries}
          history={history}
          onRun={handleQueryChange}
        />
        <ResultTable data={results} />
      </Main>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: ${({ isDarkMode }) => (isDarkMode ? "#1a1a1a" : "#fff")};
  color: ${({ isDarkMode }) => (isDarkMode ? "#fff" : "#000")};
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
`;

const Header = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const DarkModeToggle = styled.div`
  text-align: right;
  margin-bottom: 10px;
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export default App;