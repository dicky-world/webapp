const DataURLToBlob = async (dataURL: string) => {
  try {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const theParts = dataURL.split(',');
      const theContentType = theParts[0].split(':')[1];
      const theRaw = theParts[1];
      return new Blob([theRaw], { type: theContentType });
    }
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  } catch (error) {
    return error;
  }
};

const ResizeImage = async (
  originalImage: HTMLImageElement,
  maxSize: number,
  positionId: string
) => {
  try {
    const image = originalImage;
    const resizeCanvas = document.createElement('canvas');
    resizeCanvas.width = maxSize;
    resizeCanvas.height = maxSize;
    const ctx: CanvasRenderingContext2D = resizeCanvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    let width = image.width;
    let height = image.height;
    let pos = 0;
    if (width > height && width > maxSize) {
      const id = positionId || 'lc';
      width *= maxSize / height;
      height = maxSize;
      if (id === 'll') pos = 0;
      if (id === 'lc') pos = -(width - maxSize) / 2;
      if (id === 'lr') pos = -(width - maxSize);
      ctx.drawImage(image, pos, 0, width, height);
    } else if (height > maxSize) {
      const id = positionId || 'pc';
      height *= maxSize / width;
      width = maxSize;
      if (id === 'pt') pos = 0;
      if (id === 'pc') pos = -(height - maxSize) / 2;
      if (id === 'pb') pos = -(height - maxSize);
      ctx.drawImage(image, 0, pos, width, height);
    }
    const base64 = resizeCanvas.toDataURL('image/jpeg');
    const blob = await DataURLToBlob(base64);
    return blob;
  } catch (error) {
    return error;
  }
};

export { ResizeImage, DataURLToBlob };
