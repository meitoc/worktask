import axios from 'axios';

/////////SPACE

async function getSpaces() {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`http://localhost:8000/api/space`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function postSpace(data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`http://localhost:8000/api/space`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function putSpace(id,data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.put(`http://localhost:8000/api/space/id/${id}`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function deleteSpace(id) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.delete(`http://localhost:8000/api/space/id/${id}`, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//////COLORS
async function getColors() {
  const session = localStorage.getItem('loginSession');
  console.log("SSSIOS",session,"SSSS")
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`http://localhost:8000/api/color`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
////////USER INFO
async function getUserInfo() {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`http://localhost:8000/api/user-info`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function putUserInfo(data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.put(`http://localhost:8000/api/user-info`,body,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
///////ACCESS
async function getCheckAccess() {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`http://localhost:8000/api/access/check`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function getLogout() {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`http://localhost:8000/api/logout`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function postLogin(data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`http://localhost:8000/api/space`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function getFirstAccess(string) {
  try {
    const headers = {
      accept: 'application/json',
    }
    const response = await axios.get(`http://localhost:8000/api/access/first/${string}`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
/////////TASKS
async function getOwnerTasks() {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`http://localhost:8000/api/task/owner`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function getMemberTasks() {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`http://localhost:8000/api/task/member`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function getTask(id) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`http://localhost:8000/api/task/id${id}`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function postRootTask(data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`http://localhost:8000/api/task`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function putTask(id,data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.put(`http://localhost:8000/api/task/id/${id}`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function deleteTask(id) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.delete(`http://localhost:8000/api/task/id/${id}`, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export {
  getSpaces,postSpace,putSpace,deleteSpace,
  getColors,
  getUserInfo, putUserInfo,
  getCheckAccess, getLogout, postLogin, getFirstAccess,
  getOwnerTasks, getMemberTasks, getTask, postRootTask, putTask, deleteTask,
};
