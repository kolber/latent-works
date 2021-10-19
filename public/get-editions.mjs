import fs from "fs"
import fetch from 'node-fetch'

async function init(count) {
  const counter = [...Array(count).keys()]
  const images = []
  for (const i in counter) {
    console.log(+i+1)
    const r = await fetch(`http://localhost:3000/api/77x7/info/${+i+1}`)
    const json = await r.json()
    images.push(json.image)
  }
  //console.log(images)
  await fs.writeFile(
    './editions.json',
    JSON.stringify(images),
    () => console.log('Results written to "./editions.json"')
  )
}

//
init(77)
