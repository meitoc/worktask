import axios from 'axios';
const session = localStorage.getItem('loginSession');
async function getSpaces() {
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`,
    }
    const response = await axios.get('http://localhost:8000/api/space',headers);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    console.log("BBBBBBBBB")
    return null;
  }
}

export { getSpaces };