const myApi = async (url) => {
  try {
    if (url) {
      let fetchGet = await fetch(url);
      let data = await fetchGet.json();
      return data;
    }

  } catch (e) {
    throw new Error('failed to fetch');
    console.error(e);
  } finally {
    console.log(url)
  }
}

export { myApi };