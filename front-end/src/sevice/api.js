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
async function getSpace(id) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`http://localhost:8000/api/space/id/${id}`,{headers});
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
//space detail
async function putSpaceColor(id,data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.put(`http://localhost:8000/api/space/id/${id}/color`,body, {headers});
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
    localStorage.removeItem('loginSession')
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
    const response = await axios.get(`http://localhost:8000/api/access/logout`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function postLogin(data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`http://localhost:8000/api/access/login`,body, {headers});
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
/////////USER
async function postCreateUser(data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`http://localhost:8000/api/user`,body, {headers});
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
    const response = await axios.get(`http://localhost:8000/api/task/id/${id}`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function postTask(data) {
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
async function getTaskList(array) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify({tasks:array});
    const response = await axios.post(`http://localhost:8000/api/task/get-list`,body, {headers});
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
//space detail
async function putTaskColor(id,data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.put(`http://localhost:8000/api/task/id/${id}/color`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//SPACE TASKS (TASKS IN A SPACE)
async function putTaskToSpace(data,spaceId) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.put(`http://localhost:8000/api/space/id/${spaceId}/task`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function deleteTaskFromSpace(data,spaceId) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.delete(`http://localhost:8000/api/space/id/${spaceId}/task`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export {
  getSpaces, getSpace,postSpace,putSpace,deleteSpace,
  putSpaceColor,
  getColors,
  getUserInfo, putUserInfo,
  getCheckAccess, getLogout, postLogin, getFirstAccess,
  postCreateUser,
  getOwnerTasks, getMemberTasks, getTask, postTask, putTask, deleteTask, getTaskList,
  putTaskColor,
  putTaskToSpace, deleteTaskFromSpace,
};
