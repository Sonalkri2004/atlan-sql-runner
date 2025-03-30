import styled from "styled-components";

const QueryInput = ({ query, setQuery, predefinedQueries, history, onRun }) => {
  const handleClear = () => setQuery("");

  return (
    <InputContainer>
      <label htmlFor="query-select">Select a Query:</label>
      <Select
        id="query-select"
        value={query}
        onChange={(e) => onRun(e.target.value)}
      >
        {predefinedQueries.map((q) => (
          <option key={q} value={q}>
            {q}
          </option>
        ))}
      </Select>
      <Textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your SQL query here..."
      />
      <ButtonGroup>
        <Button onClick={() => onRun(query)}>Run Query</Button>
        <Button onClick={handleClear} secondary>
          Clear
        </Button>
      </ButtonGroup>
      {history.length > 0 && (
        <History>
          <h4>Recent Queries:</h4>
          <ul>
            {history.map((item, index) => (
              <li key={index} onClick={() => onRun(item)}>
                {item}
              </li>
            ))}
          </ul>
        </History>
      )}
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Select = styled.select`
  padding: 8px;
  font-size: 14px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  font-size: 14px;
  resize: vertical;
  background-color: ${({ theme }) => (theme === "dark" ? "#333" : "#fff")};
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#000")};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: ${({ secondary }) => (secondary ? "#6c757d" : "#007bff")};
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: ${({ secondary }) => (secondary ? "#5a6268" : "#0056b3")};
  }
`;

const History = styled.div`
  margin-top: 10px;

  h4 {
    font-size: 14px;
    margin-bottom: 5px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    font-size: 12px;
    cursor: pointer;
    padding: 5px;
    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

export default QueryInput;