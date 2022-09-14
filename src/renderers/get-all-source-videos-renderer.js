const videoHolder = document.getElementById("allVideos")

window.electronAPI.getAllVideoUrlsFromPage("https://www.dota2.com/hero/ancientapparition").then((srcList) => {

    console.log("srcList", srcList)

    const listOfLinks = srcList.map((srcUrl) => {
        const linkEl = document.createElement("a")
        linkEl.href = srcUrl;
        linkEl.innerText = srcUrl;
        linkEl.classList.add("resource-link")
        return linkEl;
    })

    videoHolder.append(...listOfLinks)

})

