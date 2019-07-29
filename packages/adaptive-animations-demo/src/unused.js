    // useEffect(() => {
    //   const img = new Image()
    //   img.src = src
    //   img.draggable = 'false'

    //   const swapImg = (parent, img) => {
    //     if (!parent) return
    //     parent.removeChild(parent.firstChild)
    //     parent.appendChild(img)
    //   }

    //   if (img.decode) {
    //     img.decode().then(() => {
    //       swapImg(imgContainerRef.current, img)
    //     })
    //   } else {
    //     img.onload = () => {
    //       swapImg(imgContainerRef.current, img)
    //     }
    //   }
    // }, [])
