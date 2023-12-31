import axios from 'axios';
const {VITE_BACK_END_BASE_URL} = import.meta.env
/////////SPACE
//update space oder
async function putSpaces(data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.put(`${VITE_BACK_END_BASE_URL}/api/space/`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getSpaces() {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/space`,{headers});
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
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/space/id/${id}`,{headers});
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
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/space`,body, {headers});
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
    const response = await axios.put(`${VITE_BACK_END_BASE_URL}/api/space/id/${id}`,body, {headers});
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
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.delete(`${VITE_BACK_END_BASE_URL}/api/space/id/${id}`, {headers});
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
    const response = await axios.put(`${VITE_BACK_END_BASE_URL}/api/space/id/${id}/color`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//////COLORS
async function getColors() {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/color`,{headers});
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
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/user-info`,{headers});
    return response.data;
  } catch (error) {
    localStorage.removeItem('loginSession')
    console.error(error);
    return null;
  }
}
async function getOtherUserInfo(userName) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  //prevent multi request
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/user/${userName}/info`,{headers});
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
    const response = await axios.put(`${VITE_BACK_END_BASE_URL}/api/user-info`,body,{headers});
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
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/access/check`,{headers});
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
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/access/logout`,{headers});
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
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/access/login`,body, {headers});
    console.log("Login",response)
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function getFirstAccess(string) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/access/url-login/${string}`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function postForgotPassword(data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/access/forgot-password`,body,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
/////////GOOGLE LOGIN
async function postGoogleLogin(data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/google-login`,body, {headers});
    console.log("GoogleLogin",response)
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
/////////USER
async function getUser(type,value) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`,
    }
    if(!type || !value) return null;
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/user?${type}=${value}`, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function postCreateUser(data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/user`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function putUpdateUser(data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.put(`${VITE_BACK_END_BASE_URL}/api/user`,body, {headers});
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
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/task/owner`,{headers});
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
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/task/member`,{headers});
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
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/task/id/${id}`,{headers});
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
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/task`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function postTaskOnTask(taskId,data) {
  const session = localStorage.getItem('loginSession');
  console.log("HHHHHHHHHHH",data)
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/task/id/${taskId}`,body, {headers});
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
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/task/get-list`,body, {headers});
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
    const response = await axios.put(`${VITE_BACK_END_BASE_URL}/api/task/id/${id}`,body, {headers});
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
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.delete(`${VITE_BACK_END_BASE_URL}/api/task/id/${id}`, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//task user
async function putTaskUser(id,data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.put(`${VITE_BACK_END_BASE_URL}/api/task/id/${id}/user`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function deleteTaskUser(id,data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.delete(`${VITE_BACK_END_BASE_URL}/api/task/id/${id}/user/${data.user}`, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//task detail
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
    const response = await axios.put(`${VITE_BACK_END_BASE_URL}/api/task/id/${id}/color`,body, {headers});
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
    const response = await axios.put(`${VITE_BACK_END_BASE_URL}/api/space/id/${spaceId}/task`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
// async function deleteTaskFromSpace(taskId,spaceId) {
//   const session = localStorage.getItem('loginSession');
//   if (!session) return null;
//   try {
//     const headers = {
//       'Content-Type': 'application/json',
//       accept: 'application/json',
//       Authorization: `Bearer ${session}`
//     }
//     const response = await axios.delete(`${VITE_BACK_END_BASE_URL}/api/space/id/${spaceId}/task/${taskId}`, {headers});
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }
//Comments of a task
async function getComments(taskId) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/task/id/${taskId}/comment`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function postComment(data,taskId) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/task/id/${taskId}/comment`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function deleteComment(commentId,taskId) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.delete(`${VITE_BACK_END_BASE_URL}/api/task/id/${taskId}/comment/${commentId}`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//FILE
//Get file
async function getFiles(taskId) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/task/id/${taskId}/file`,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//Delete file
async function deleteFile(taskId,data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/task/id/${taskId}/file/delete`,body,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//Dowwnload file
async function postTakeDownloadUrl(taskId,data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/task/id/${taskId}/file/download`,body,{headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
// upload a file
// Step1
async function postTakeUploadUrl(taskId,data) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const body = JSON.stringify(data);
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/task/id/${taskId}/file/upload`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
// Step2
async function putFileToServer(url, file) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': file.type,
    }
    const response = await axios.put(url,file, {headers});
    if(response?.status===200) return true;
    else return false;
  } catch (error) {
    console.error(error);
    return null;
  }
}
// Step3
async function putRecheckFile(taskId,data) {
    const session = localStorage.getItem('loginSession');
    if (!session) return null;
    try {
      const headers = {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${session}`
      }
      const body = JSON.stringify(data);
      const response = await axios.put(`${VITE_BACK_END_BASE_URL}/api/task/id/${taskId}/file`,body, {headers});
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
async function postAvatar(imageFile) {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const body = new FormData();
    body.append('image', imageFile);
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${session}`
    }
    const response = await axios.post(`${VITE_BACK_END_BASE_URL}/api/file/avatar`,body, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
//Noify
/////////USER
async function getNotify() {
  const session = localStorage.getItem('loginSession');
  if (!session) return null;
  try {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${session}`,
    }
    const response = await axios.get(`${VITE_BACK_END_BASE_URL}/api/notify`, {headers});
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export {
  putSpaces,
  getSpaces, getSpace,postSpace,putSpace,deleteSpace,
  putSpaceColor,
  getColors,
  getUserInfo,getOtherUserInfo, putUserInfo,
  getCheckAccess, getLogout, postLogin, getFirstAccess, postForgotPassword,
  postGoogleLogin,
  getUser,
  postCreateUser, putUpdateUser,
  getOwnerTasks, getMemberTasks, getTask, postTask, postTaskOnTask, putTask, deleteTask, getTaskList,
  putTaskUser, deleteTaskUser,
  putTaskColor,
  putTaskToSpace,
  // deleteTaskFromSpace,
  getComments,postComment,deleteComment,
  getFiles, deleteFile,
  postTakeDownloadUrl,
  postTakeUploadUrl, 
  putFileToServer,
  putRecheckFile,
  postAvatar,
  getNotify,
};
