async function loadSection(type){

    const contentDiv = document.getElementById('content');

    // show loading
    contentDiv.classList.remove('hidden');
    contentDiv.innerHTML = "Loading...";

    // fetch from backend
    const response = await fetch('/' + type);

    const data = await response.text();

    // insert HTML
    contentDiv.innerHTML = data;
}