const PhotoDetail = async (apiEndpoint: string) => {
  try {
    const response = await fetch(apiEndpoint, {
      headers: {
        // prettier-ignore
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
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

export { PhotoDetail };
