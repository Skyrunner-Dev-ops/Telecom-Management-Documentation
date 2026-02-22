document.addEventListener("DOMContentLoaded", () => {

    const search = document.getElementById("searchInput");

    search.addEventListener("keyup", async (e) => {
        const term = e.target.value.toLowerCase();
        if (term.length < 2) return;

        const files = [
            "README.md","FEATURES.md","ARCHITECTURE.md","DATABASE_SCHEMA.md",
            "MODULES.md","DATA_FLOW.md","ANALYSIS_ENGINE.md","FORENSIC_USE_CASES.md",
            "SECURITY.md","SETUP.md","USER_GUIDE.md","ADMIN_GUIDE.md",
            "TESTING.md","TROUBLESHOOTING.md"
        ];

        let results = "";

        for (let file of files) {
            const res = await fetch("docs/" + file);
            const text = await res.text();

            if (text.toLowerCase().includes(term)) {
                results += `<div class="search-result" onclick="loadDoc('${file}')">📄 ${file}</div>`;
            }
        }

        if (results) {
            document.getElementById("content").innerHTML = `<h2>Search Results</h2>` + results;
        }
    });

});
