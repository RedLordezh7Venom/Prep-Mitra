// app.js
const { createDrive } = require('hyperdrive')
const { createSwarm } = require('hyperswarm')
const { createStream } = require('secretstream')

const drive = createDrive()
const swarm = createSwarm()

swarm.join(drive.discoveryKey)

const fileList = document.getElementById('file-list')
const fileInput = document.getElementById('file-input')
const uploadBtn = document.getElementById('upload-btn')

uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0]
    if (!file) return

    const fileStream = file.stream()
    const writer = drive.createWriteStream()
    fileStream.pipe(writer)

    writer.on('finish', () => {
        fileList.innerHTML += `<li>${file.name}</li>`
    })
})

drive.on('content', (content) => {
    content.createReadStream().pipe(process.stdout)
})

drive.on('metadata', (metadata) => {
    console.log('Metadata:', metadata)
})