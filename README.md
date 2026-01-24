
# Domain Checker 🌐

**Domain Checker** is a high-performance web utility built with **React** and **Vite** designed to streamline lead generation and SEO workflows. It allows users to cross-reference massive lists of prospect URLs against existing domain databases to identify unique opportunities and filter out duplicates instantly.

## 🚀 Key Features

-   **Excel Integration**: Seamlessly upload `.xlsx` or `.csv` files containing prospect lists and existing domain databases.
    
-   **Intelligent Domain Parsing**: Automatically extracts root domains (e.g., `example.com`) from complex URLs, including smart handling of various TLDs and sub-labels.
    
-   **Duplicate Detection**: Instantly identifies which prospect URLs belong to domains you already have in your database.
    
-   **Real-time Reporting**: Generates a comprehensive, multi-sheet Excel report containing "Unique Prospects" and "Duplicate Prospects" for easy data management.
    
-   **Privacy-First**: Processes all data locally within the browser using `FileReader` and `XLSX`, ensuring sensitive lead data is never uploaded to a server.
    
-   **Modern UI**: Features a sleek, dark-themed "Glassmorphism" interface inspired by modern design palettes.
    

## 🛠️ Tech Stack

-   **Frontend**: React.js with Vite for optimized builds.
    
-   **Styling**: Custom CSS with a neon-lime accent theme and responsive card-based layout.
    
-   **Utilities**:
    
    -   **SheetJS (XLSX)**: For robust Excel file parsing and generation.
        
    -   **Lucide React**: For professional iconography.
        
-   **Build Tool**: Vite.
    

## 📁 Project Structure

Plaintext

```
src/
├── assets/           # UI assets and SVGs
├── utils/            # Core logic (Excel processing, domain parsing)
│   └── excelProcessor.js
├── App.jsx           # Main application logic and state
├── App.css           # Custom theme and layout styles
└── main.jsx          # Entry point

```

## ⚙️ Installation & Usage

1.  **Install dependencies**:
    
    Bash
    
    ```
    npm install
    
    ```
    
2.  **Start the app**:
    
    Bash
    
    ```
    npm run dev
    
    ```
    
3.  **Process Data**:
    
    -   Upload your **Prospects List** (new URLs).
        
    -   Upload your **Existing Domains** (database to check against).
        
    -   Click **Process Data** to analyze.
        
    -   Download the **Unique Prospects Report** to save your filtered results.
        

----------

_Created by [Shakeeb](https://shakeeb-sa.github.io/) to automate and secure the domain filtering process._
