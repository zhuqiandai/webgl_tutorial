function loadShaderFromFile (fileName) {
  const request = new XMLHttpRequest()


  request.onload = function () {
    console.log(request.responseText)
  }

  request.open('GET', fileName, true)

  request.rend()
}

export default loadShaderFromFile