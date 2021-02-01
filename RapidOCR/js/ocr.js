const ocr = async () => {
    var image;
    var reader = new FileReader();
    reader.onload = function (){
        image = reader.result;
        document.getElementById("preview-img").src = reader.result;
        document.getElementById("loading").style.visibility = "visible";
    }
    reader.readAsDataURL(event.target.files[0]);
    const { createWorker } = Tesseract;
    const worker = createWorker({
        workerPath: chrome.runtime.getURL('js/worker.min.js'),
        langPath: chrome.runtime.getURL('traineddata'),
        corePath: chrome.runtime.getURL('js/tesseract-core.wasm.js'),
    });

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(image);
    console.log(text);
    document.getElementById("textarea").value = text;
    document.getElementById("loading").style.visibility = "hidden";
    await worker.terminate();
}

const file = document.getElementById('file');
file.onchange = ocr;

document.getElementById("button").addEventListener("click", function () {
    let textarea = document.getElementById("textarea");
    textarea.select();
    document.execCommand("copy");
})