import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
// import CircularProgress from '@mui/material/CircularProgress';

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
// import FetchComments from '../../features/fetch-data/FetchComments';
import { IconButton, Paper, Skeleton, TextareaAutosize } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { postComment } from '../../sevice/api';
import { addAComment } from '../../sevice/comments/slice';
import AComment from '../small-component/AComment.jsx';
  
export default function Comment() {
    const comments = useSelector(state=>state.comments)
    const taskId = useSelector(state=>state.a_task?._id)
    const [aComment,setAComment] = useState("")
    const [sendingComment,setSendingComment] = useState(false)
    const dispatch = useDispatch();
    const addNewComment = async ()=>{
        const filterredComment = aComment.replace(/[\r\n]+$/, "");
        if(filterredComment!==""){
            setSendingComment(true)
            setAComment("");
            console.log(filterredComment)
            const response = await postComment({comment:filterredComment},taskId)
            if(response?.success===true) {
                dispatch(addAComment(response.data));
                setSendingComment(false)
            } else setSendingComment(false)
        }
    }
    return (
    <>
        {Array.isArray(comments)?
            <>
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
                >
                    <TextareaAutosize
                        style={{width:"100%"}}
                        placeholder="Add comment"
                        id="outlined-textarea"
                        value={aComment}
                        minRows={1}
                        onChange={(event)=>{
                            if (!((event.key === "Enter" || event.key === "Done") && !event.shiftKey)){ setAComment(event.target.value)}
                        }}
                        onKeyUp={async (event)=>{
                            if ((event.key === "Enter" || event.key === "Done") && !event.shiftKey){
                                await addNewComment();
                            }
                        }}
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton
                        color="primary"
                        variant="outlined"
                        sx={{ p: '5px', width:60, height:60 }}
                        aria-label="send"
                        disabled={sendingComment}
                        onClick={
                            addNewComment
                        }
                        fontSize="large" 
                    >
                        <SendIcon sx={{width:"70%",height:"70%"}}/>
                    </IconButton>
                </Paper>
                {sendingComment?
                    <div style={{display:"flex"}}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <div style={{flexGrow:1}}>
                            <Skeleton />
                            <Skeleton animation="wave" />
                            <Skeleton animation={false} />
                        </div>
                    </div> 
                : null
                }
                <List sx={{ width: '100%'}}>
                    {comments?.map((item)=> {
                        return(
                            <div key={item._id}>
                                <AComment comment={item} />
                                <Divider variant="inset" component="li" />
                            </div>
                        )
                    })}
                </List>
            </>
            :
            <div style={{display:"flex"}}>
                <Skeleton variant="circular" width={40} height={40} />
                <div style={{flexGrow:1}}>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                </div>
            </div> 
        }
    </>
    );
}