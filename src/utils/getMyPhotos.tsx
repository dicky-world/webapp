const GetMyPhotos = async (apiEndpoint: string) => {
  try {
    const response = await fetch(apiEndpoint, {
      body: JSON.stringify({
        jwtToken: localStorage.getItem('jwtToken'),
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
    } else return null;
  } catch (err) {
    return err;
  }
};

export { GetMyPhotos };
