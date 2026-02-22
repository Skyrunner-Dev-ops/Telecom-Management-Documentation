async function loadDoc(file) {
    const response = await fetch("docs/" + file);
    const text = await response.text();
    document.getElementById("content").innerHTML = marked.parse(text);
}
