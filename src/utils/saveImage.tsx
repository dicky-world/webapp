const SaveImage = async (
  apiEndpoint: string,
  category: string,
  previewId: string,
  thumbnailId: string,
  zoomId: string
) => {
  try {
    const response = await fetch(apiEndpoint, {
      body: JSON.stringify({
        category,
        jwtToken: localStorage.getItem('jwtToken'),
        previewId,
        thumbnailId,
        zoomId,
      }),
      headers: {
        // prettier-ignore
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const content = await response.json();
    if (response.status === 200) {
      return content;
    }
    throw Error;
  } catch (error) {
    return error;
  }
};

export { SaveImage };
