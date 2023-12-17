import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import {  Alert, IconButton, Snackbar, Zoom } from '@mui/material';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { postTakeUploadUrl, putFileToServer, putRecheckFile } from '../../sevice/api.js';
import { addToFiles } from '../../sevice/files/slice.js';
import AFile from '../small-component/AFile.jsx';
import FileSkeleton from '../small-component/FileSkeleton.jsx';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


export default function FileList() {
    const dispatch = useDispatch();
    const [editTask, setEditTask] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [uploadStatus, setUploadStatus] = useState("success")
    const [openAlert, setOpenAlert] = useState(false)
    console.log(editTask)
    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
        };
    const files = useSelector(state=>state.files)
    const task = useSelector(state=>state.a_task);
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if(file){
            setUploading(true)
            //3 steps
            const {name,size,type} =  file;
            const response1 = await postTakeUploadUrl(task._id,{name,size,type})
            const alertError = ()=>{
                setUploading(false)
                setUploadStatus("error")
                setOpenAlert(true)
            }
            if(response1?.success===true){
                const response2 = await putFileToServer(response1.data.url,file);
                if(response2) {
                    const response3 = await putRecheckFile(task._id,{name,size,type,_id:response1.data._id})
                    if(response3?.success===true) {
                        dispatch(addToFiles(response3.data))
                        setUploading(false)
                        setUploadStatus("success")
                        setOpenAlert(true)
                    } else alertError()
                } else alertError()
            } else alertError()
        }
        event.target.value = null;
      };

    return (
    <>
        {Array.isArray(files)?
            <>
            <div>

                <Zoom
                    key='secondary'
                    in={true}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${transitionDuration.exit}ms`,
                    }}
                    unmountOnExit
                    onClick={() => {
                        setEditTask(true);
                    }}
                >
                    <IconButton component="label" variant="outlined"
                        
                        style={{
                            color:"rgb(0,100,9)",
                            backgroundColor: 'rgb(200,200,255)',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <AddIcon />
                        <VisuallyHiddenInput type="file" accept="*" onChange={handleFileUpload} />
                    </IconButton>
                </Zoom>
            </div>
                {uploading? <FileSkeleton />: null}
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openAlert} autoHideDuration={3000} onClose={()=>setOpenAlert(false)}>
                    <Alert onClose={()=>setOpenAlert(false)} severity={uploadStatus} sx={{ width: '100%' }}>
                    {uploadStatus==="success"?"Your file was uploaded!":"Can not upload your file!"}
                    </Alert>
                </Snackbar>
                <List sx={{ width: '100%'}}>
                    {files?.map((item)=> {
                        return(
                            <div key={item._id}>
                                <AFile file={item} />
                                <Divider variant="inset" component="li" />
                            </div>
                        )
                    })}
                </List>
            </>
            :
            <FileSkeleton />
        }
    </>
    );
}