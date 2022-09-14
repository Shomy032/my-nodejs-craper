
const btn = document.getElementById("btn");
const loading = document.getElementById("loading");
const input_origin = document.getElementById("origin")
const input_evaluatedSelector = document.getElementById("evaluatedSelector")
const input_folderName = document.getElementById("folderName")
const input_urlListName = document.getElementById("urlListName")
window.electronAPI.setTitle("Renderer 1")

updateJobState("not started")


window.ipcRenderer.on("job-failed", (event, message) => {
    // console.log('message', message)
    updateJobState(message);
})

btn.addEventListener("click", async () => {
    loading.innerText = "loading..."
    btn.disabled = true

    // example of valid data
    // const origin = 'https://www.dota2.com/heroes';
    // const evaluatedSelector = ".herogridpage_HeroIcon_7szOn";
    // const folderName = `extracted-pictures`;
    // const urlListName = "hero-images";

    const origin = input_origin.value;
    const evaluatedSelector = input_evaluatedSelector.value || "div";
    const folderName = input_folderName.value || "default-folder-name";
    const urlListName = input_urlListName.value || "default-list-name";

    try {
        updateJobState("started")
        await window.electronAPI.extractParseAndReadBgImgUrlAll({ origin, evaluatedSelector, folderName, urlListName })
        loading.innerText = "NOT loading..."
        btn.disabled = false
        updateJobState("done")
    } catch (err) {
        updateJobState("job failed")
    }

})

function updateJobState(text) {
    const results = document.getElementById("results");
    results.innerText = text
}