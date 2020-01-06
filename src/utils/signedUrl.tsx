const SignedUrl = async (signedUrlApiEndpoint: string) => {
  try {
    const response = await fetch(signedUrlApiEndpoint, {
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
      return content.signedUrl;
    }
    throw Error;
  } catch (error) {
    return error;
  }
};

export { SignedUrl };
