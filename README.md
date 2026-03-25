# AgenticAI Frontend UI

The flagship user interface for the AgenticAI platform—a high-performance, aesthetically premium React application designed for managing autonomous agents, tools, and knowledge graphs.

---

## 🚀 Key Features

- **Modern Dashboard**: Real-time monitoring and management of AI agents and their activities.
- **Agent Builder**: Intuitive, step-by-step interface for configuring agent personalities, models, and tools.
- **Knowledge Visualization**: Interactive 2D/3D force-directed graphs for exploring Knowledge Graphs (Neo4j).
- **Tool Management**: Comprehensive UI for registering MCP servers, custom tools, and RAG knowledge bases.
- **Rich Interaction**: Debounced global search, command palettes (CMDK), and smooth animations.
- **Responsive Design**: Mobile-first architecture using Tailwind CSS v4 and Shadcn UI.

---

## 🛠 Technology Stack

- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS v4 (Modern Engine)
- **UI Components**: Shadcn UI & Radix UI
- **Animations**: Framer Motion
- **Data Fetching**: Axios
- **Routing**: React Router v7
- **Visualization**: React Force Graph
- **Icons**: HugeIcons (Premium) & Lucide

---

## 📥 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Backend services (`agent-service`, `tools-service`, `auth-user-service`) running and reachable.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`.

### Development

Run the development server:
```bash
npm run dev
```

### Production

Build the production bundle:
```bash
npm run build
```

Preview the build:
```bash
npm run preview
```

---

## 🏗 Directory Structure

- **`src/components/`**: Atomic UI components and Shadcn primitives.
- **`src/pages/`**: Top-level route components (Dashboard, Agents, Tools, etc.).
- **`src/lib/`**: Shared utilities, API clients, and constants.
- **`src/hooks/`**: Custom React hooks for state and data management.
- **`src/assets/`**: Static assets and global styles.

---

## 🌐 Environment Variables

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL for the backend API gateway |
| `VITE_KEYCLOAK_URL` | URL of the Keycloak authentication server |
| `VITE_KEYCLOAK_REALM` | Keycloak realm name |
| `VITE_KEYCLOAK_CLIENT_ID`| Public client ID for frontend auth |
