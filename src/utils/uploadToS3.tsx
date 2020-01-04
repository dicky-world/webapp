const uploadToS3 = async (signedUrls: string, resizedBlob: Blob) => {
  const response = await fetch(signedUrls, {
    body: resizedBlob,
    headers: {
      // prettier-ignore
      'Accept': 'application/json',
      'Content-Type': 'image/jpeg',
    },
    method: 'PUT',
  });
  if (response.status === 200) {
    const fileId = `${response.url.split('/')[4]}/${
      response.url.split('/')[5].split('?')[0]
    }`;
    return fileId;
  } else return null;
};

export { uploadToS3 };
