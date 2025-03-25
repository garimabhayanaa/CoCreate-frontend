import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Chat from "../components/Chat";
import ChangeLog from "../components/ChangeLog";
import Collaborators from "../components/Collaborators";
import OnlineUsers from "../components/OnlineUsers";
import "../stylesheets/Editor.css";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const socket = io("http://localhost:5001");

const supportedFileTypes = {
  text: ["txt", "md"],
  code: ["py", "js", "java", "cpp", "c", "swift"],
  csv: ["csv"],
};

const Cell = ({
  cell,
  index,
  moveCell,
  updateCell,
  deleteCell,
  runCell,
  runAI,
  addCell,
  permission,
}) => {
  const [showTools, setShowTools] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);

  const [{ isDragging }, drag] = useDrag({
    type: "CELL",
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "CELL",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCell(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const updateTableCell = (row, col, value) => {
    const newTableData = [...cell.content.data];
    newTableData[row][col] = value;
    updateCell(cell.id, { ...cell.content, data: newTableData });
  };

  const addRow = () => {
    const newRow = new Array(cell.content.cols).fill("");
    updateCell(cell.id, {
      ...cell.content,
      rows: cell.content.rows + 1,
      data: [...cell.content.data, newRow],
    });
  };

  const removeRow = () => {
    if (cell.content.rows > 1 && selectedRow !== null) {
      updateCell(cell.id, {
        ...cell.content,
        rows: cell.content.rows - 1,
        data: cell.content.data.filter(
          (_, rowIndex) => rowIndex !== selectedRow
        ),
      });
      setSelectedRow(null);
    }
  };

  const addColumn = () => {
    updateCell(cell.id, {
      ...cell.content,
      cols: cell.content.cols + 1,
      data: cell.content.data.map((row) => [...row, ""]),
    });
  };

  const removeColumn = () => {
    if (cell.content.cols > 1 && selectedCol !== null) {
      updateCell(cell.id, {
        ...cell.content,
        cols: cell.content.cols - 1,
        data: cell.content.data.map((row) =>
          row.filter((_, colIndex) => colIndex !== selectedCol)
        ),
      });
      setSelectedCol(null);
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="cell"
      onMouseEnter={() => setShowTools(true)}
      onMouseLeave={() => setShowTools(false)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {cell.type === "table" ? (
        <div className="table-container">
          {showTools && (
            <div className="table-toolbar">
              <button onClick={addRow}>➕ Row</button>
              <button onClick={removeRow}>❌ Row</button>
              <button onClick={addColumn}>➕ Col</button>
              <button onClick={removeColumn}>❌ Col</button>
              <button onClick={() => deleteCell(cell.id)}>
                🗑️ Delete Table
              </button>
            </div>
          )}
          <table className="editable-table">
            <tbody>
              {cell.content.data.map((row, rowIndex) => (
                <tr key={rowIndex} onClick={() => setSelectedRow(rowIndex)}>
                  {row.map((cellData, colIndex) => (
                    <td key={colIndex} onClick={() => setSelectedCol(colIndex)}>
                      <input
                        type="text"
                        value={cellData}
                        onChange={(e) =>
                          updateTableCell(rowIndex, colIndex, e.target.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <textarea
            value={cell.content}
            onChange={(e) =>
              permission !== "view" && updateCell(cell.id, e.target.value)
            }
            placeholder={`Write ${
              cell.type === "text" ? "text" : cell.type + " code"
            } here...`}
            disabled={permission === "view"}
          />

          <div className="cell-actions">
            {permission !== "view" && (
              <>
                <button onClick={() => addCell(cell.type)}>➕</button>
                <button onClick={() => deleteCell(cell.id)}>❌</button>
                <button onClick={() => runAI(cell.id, cell.content)}>🤖</button>
              </>
            )}
          </div>
          <button
            className="run-button"
            onClick={() => runCell(cell.id, cell.type, cell.content)}
          >
            ▶️
          </button>

          {cell.output && (
            <div className="cell-output">
              <pre>{cell.output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Editor = () => {
  const { documentId } = useParams();
  const [permission, setPermission] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [cells, setCells] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    socket.emit("join-document", documentId);

    fetch(`http://localhost:5001/api/documents/${documentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.content) {
          try {
            const parsedCells = JSON.parse(data.content);
            setCells(parsedCells); // Restore saved cells
          } catch (error) {
            console.error("Error parsing saved document:", error);
          }
        }

        // Set user permissions
        if (data.owner === user.uid) {
          setPermission("owner");
        } else {
          const collaborator = data.collaborators.find(
            (c) => c.email.toLowerCase() === user.email.toLowerCase()
          );
          setPermission(collaborator ? collaborator.permission : "no-access");
        }
      })
      .catch(() => setPermission("no-access"));
  }, [documentId, user.uid, user.email]);

  const getDefaultCode = (type) => {
    switch (type) {
      case "python":
        return `# Write your Python code here\nprint("Hello, World!")`;
      case "java":
        return `// Write your Java code here\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`;
      case "javascript":
        return `// Write your JavaScript code here\nconsole.log("Hello, World!");`;
      case "c":
        return `// Write your C code here\n#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`;
      case "cpp":
        return `// Write your C++ code here\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`;
      case "swift":
        return `print("Hello, Swift!")`;
      default:
        return "";
    }
  };

  const addCell = (type) => {
    const newCell = {
      id: Date.now(),
      type,
      content:
        type === "table"
          ? { rows: 3, cols: 3, data: Array(3).fill(Array(3).fill("")) }
          : getDefaultCode(type),
      output: "",
    };
    setCells([...cells, newCell]); // Add at the bottom
  };

  const deleteCell = (id) => {
    setCells(cells.filter((c) => c.id !== id));
  };

  const updateCell = (id, content) => {
    setCells(cells.map((c) => (c.id === id ? { ...c, content } : c)));
  };

  const moveCell = (fromIndex, toIndex) => {
    const updatedCells = [...cells];
    const [movedCell] = updatedCells.splice(fromIndex, 1);
    updatedCells.splice(toIndex, 0, movedCell);
    setCells(updatedCells);
  };

  const runCell = async (id, type, content) => {
    if (!type) return;
    if (type === "text") {
      setCells(cells.map((c) => (c.id === id ? { ...c, output: content } : c)));
      return;
    }
    let apiEndpoint = "";
    if (type === "python") apiEndpoint = "/api/run-python";
    else if (type === "java") apiEndpoint = "/api/run-java";
    else if (type === "javascript") apiEndpoint = "/api/run-javascript";
    else if (type === "c") apiEndpoint = "/api/run-c";
    else if (type === "cpp") apiEndpoint = "/api/run-cpp";
    else if (type === "swift") apiEndpoint = "/api/run-swift";
    try {
      const response = await fetch(`http://localhost:5001${apiEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: content }),
      });

      const data = await response.json();
      setCells(
        cells.map((c) =>
          c.id === id ? { ...c, output: data.output || "No Output" } : c
        )
      );
    } catch (error) {
      setCells(
        cells.map((c) =>
          c.id === id ? { ...c, output: "Error executing code" } : c
        )
      );
    }
  };

  const parseCSV = (csvText) => {
    return csvText
      .split("\n")
      .map((row) => row.split(",").map((cell) => cell.trim())); // Convert CSV to array
  };

  const addCellWithContent = (type, content) => {
    const newCell = {
      id: Date.now(),
      type,
      content: type === "table" ? parseCSV(content) : content, // Convert CSV to table
      output: "",
    };
    setCells([...cells, newCell]); // Add to state
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result; // Read file content as text
      const fileType = file.name.split(".").pop(); // Get file extension

      let cellType;
      if (["txt", "md"].includes(fileType)) {
        cellType = "text";
      } else if (["py", "js", "java", "cpp", "c", "swift"].includes(fileType)) {
        cellType = fileType; // Match with supported code languages
      } else if (fileType === "csv") {
        cellType = "table";
      } else {
        alert("Unsupported file type!");
        return;
      }

      // Create a new cell with the file content
      addCellWithContent(cellType, fileContent);
    };

    reader.readAsText(file); // Read the file as text
  };

  const runAI = async (id, content) => {
    const userPrompt = window.prompt("Enter AI prompt:");
    if (!userPrompt) return;
    const response = await fetch("http://localhost:5001/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt, content }),
    });
    const data = await response.json();
    setCells(
      cells.map((c) => (c.id === id ? { ...c, output: data.response } : c))
    );
  };

  const handleSave = async () => {
    if (!cells.length) return alert("No content to save!");

    try {
      // Save the document's content (cells array) to the database
      await fetch(`http://localhost:5001/api/documents/update/${documentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: JSON.stringify(cells) }),
      });

      // Log the change in the changelog with email and timestamp
      await fetch("http://localhost:5001/api/changelog/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          user: user.uid,
          userEmail: user.email, // Storing user email
          changes: `Saved document at ${new Date().toLocaleString()}`, // Adding timestamp
        }),
      });

      alert("Document saved successfully!");
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Error saving document.");
    }
  };

  if (permission === null) return <p>Loading...</p>;
  if (permission === "no-access")
    return <h2>You don't have access to this document.</h2>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="editor-container">
        <h1 className="editor-title">Real Time Collaborator</h1>

        <div className="editor-layout">
          {/* Main Workspace */}
          <div className="editor-workspace">
            {cells.map((cell, index) => (
              <div
                key={cell.id}
                className="cell"
                onMouseEnter={() => setHoveredCell(cell.id)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                <Cell
                  cell={cell}
                  index={index}
                  moveCell={moveCell}
                  updateCell={updateCell}
                  deleteCell={deleteCell}
                  runCell={runCell}
                  runAI={runAI}
                  addCell={addCell}
                  permission={permission}
                />
              </div>
            ))}
          </div>

          {/* Sidebar */}
          {permission !== "view" && (
            <div className="editor-sidebar">
              <h3>Create Cell</h3>
              <button onClick={() => addCell("text")}>➕ Text Cell</button>
              <button onClick={() => addCell("python")}>➕ Python Cell</button>
              <button onClick={() => addCell("java")}>➕ Java Cell</button>
              <button onClick={() => addCell("javascript")}>
                ➕ JavaScript Cell
              </button>
              <button onClick={() => addCell("c")}>➕ C Cell</button>
              <button onClick={() => addCell("cpp")}>➕ C++ Cell</button>
              <button onClick={() => addCell("swift")}>➕ Swift Cell</button>
              <button onClick={() => addCell("table")}>➕ Table Cell</button>
              <h3>Upload file</h3>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".txt,.md,.py,.js,.java,.cpp,.c,.swift,.csv"
              ></input>
            </div>
          )}
        </div>

        <button onClick={handleSave} className="editor-save-btn">
          Save
        </button>
        <div className="editor-components">
          <OnlineUsers documentId={documentId} user={user} />
          <Collaborators documentId={documentId} />
          <Chat documentId={documentId} user={user} />
        </div>
        <div className="editor-changelog-container">
          <ChangeLog documentId={documentId} />
        </div>
      </div>
    </DndProvider>
  );
};

export default Editor;
