async function getRecorder () {
    const mediaDevices = navigator.mediaDevices

    if (!mediaDevices && !mediaDevices.getUserMedia) return

    try {
        const stream = await mediaDevices.getUserMedia({
            audio: true
        })

        return new MediaRecorder(stream)
    } catch (err) {
        console.error(err)
    }
}

async function start () {
    const record = document.querySelector(".record")
    const stop = document.querySelector(".stop")
    const status = document.querySelector(".status")
    const audio = document.querySelector(".audio");

    const recorder = await getRecorder()
    const chunks = []

    recorder.addEventListener("dataavailable", (e) => chunks.push(e.data))
    recorder.addEventListener("stop", () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
        audio.src = window.URL.createObjectURL(blob)
        chunks.slice(0)
    })

    record.onclick = async () => {
        recorder.start(1000)

        status.textContent = recorder.state
        stop.disabled = false
        record.disabled = true
    }

    stop.onclick = async () => {
        recorder.stop()

        status.textContent = recorder.state
        stop.disabled = true
        record.disabled = false
    }
}

start()