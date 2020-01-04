const signedUrl = async (signedUrlApiEndpoint: string) => {
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
  } else return null;
};

export { signedUrl };
