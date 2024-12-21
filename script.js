// User-defined graph
const graph = {};
let nodes = new vis.DataSet(); // Nodes for Vis.js
let edges = new vis.DataSet(); // Edges for Vis.js
let network = null;

// Initialize Vis.js network
function initializeGraph() {
    const container = document.getElementById("graphContainer");
    const data = { nodes: nodes, edges: edges };
    const options = {
        edges: {
            labelHighlightBold: true,
            font: { size: 14, align: "middle" },
        },
        nodes: {
            shape: "circle",
            font: { size: 14, color: "#333" },
        },
        physics: {
            stabilization: false,
        },
    };
    network = new vis.Network(container, data, options);
}

// Function to Add Paths
function addPath() {
    const city1 = document.getElementById("city1").value.trim();
    const city2 = document.getElementById("city2").value.trim();
    const cost = parseInt(document.getElementById("cost").value.trim(), 10);

    if (!city1 || !city2 || isNaN(cost) || cost <= 0) {
        alert("Please enter valid cities and cost.");
        return;
    }

    // Add cities to the graph if they don't already exist
    if (!graph[city1]) graph[city1] = {};
    if (!graph[city2]) graph[city2] = {};
    graph[city1][city2] = cost;
    graph[city2][city1] = cost;

    // Update Vis.js nodes
    if (!nodes.get(city1)) nodes.add({ id: city1, label: city1 });
    if (!nodes.get(city2)) nodes.add({ id: city2, label: city2 });

    // Update Vis.js edges
    edges.add({
        from: city1,
        to: city2,
        label: String(cost),
        length: 200,
    });

    // Clear input fields
    document.getElementById("city1").value = "";
    document.getElementById("city2").value = "";
    document.getElementById("cost").value = "";

    // Reinitialize graph
    initializeGraph();
}


// BFS Algorithm
function bfs(graph, start, goal) {
    const visited = new Set();
    const queue = [[start]];

    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];

        if (node === goal) return path;

        if (!visited.has(node)) {
            visited.add(node);
            for (let neighbor in graph[node]) {
                queue.push([...path, neighbor]);
            }
        }
    }
    return null;
}

// DFS Algorithm
function dfs(graph, start, goal) {
    const visited = new Set();
    const stack = [[start]];

    while (stack.length > 0) {
        const path = stack.pop();
        const node = path[path.length - 1];

        if (node === goal) return path;

        if (!visited.has(node)) {
            visited.add(node);
            for (let neighbor in graph[node]) {
                stack.push([...path, neighbor]);
            }
        }
    }
    return null;
}

// UCS Algorithm
function ucs(graph, start, goal) {
    const visited = new Set();
    const pq = [[0, start, [start]]];

    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [cost, node, path] = pq.shift();

        if (node === goal) return { path, cost };

        if (!visited.has(node)) {
            visited.add(node);
            for (let neighbor in graph[node]) {
                pq.push([cost + graph[node][neighbor], neighbor, [...path, neighbor]]);
            }
        }
    }
    return null;
}

// Main Function to Execute Selected Algorithm
function findPath() {
    const algorithm = document.getElementById("algorithm").value;
    const start = document.getElementById("start").value.trim();
    const end = document.getElementById("end").value.trim();
    const output = document.getElementById("output");

    if (!graph[start] || !graph[end]) {
        output.innerText = "Error: Start or End city does not exist in the graph.";
        return;
    }

    let result;
    switch (algorithm) {
        case "bfs":
            result = bfs(graph, start, end);
            output.innerText = result ? `Path: ${result.join(" -> ")}` : "No path found.";
            break;
        case "dfs":
            result = dfs(graph, start, end);
            output.innerText = result ? `Path: ${result.join(" -> ")}` : "No path found.";
            break;
        case "ucs":
            result = ucs(graph, start, end);
            output.innerText = result ? `Path: ${result.path.join(" -> ")}\nCost: ${result.cost}` : "No path found.";
            break;
        default:
            output.innerText = "Invalid algorithm selected.";
    }
}

// Initialize the graph visualization
initializeGraph();


// Reset Function to Clear the Graph and Inputs
function resetGraph() {
    // Clear the graph structure
    for (let key in graph) {
        delete graph[key];
    }

    // Clear Vis.js nodes and edges
    nodes.clear();
    edges.clear();

    // Clear inputs
    document.getElementById("city1").value = "";
    document.getElementById("city2").value = "";
    document.getElementById("cost").value = "";
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";

    // Clear output
    document.getElementById("output").innerText = "";

    // Reinitialize graph visualization
    initializeGraph();
}

