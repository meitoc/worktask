import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import { Button, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CropImage from '../form/CropImage';
import { useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  
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
export default function UserAvatar() {
    const avatarURI = useSelector(state=>state?.user_info.information.avatar);
    const userRealName = useSelector(state=>state?.user_info.information.real_name);
    const userName = useSelector(state=>state?.user_info.name);
    const [openForm, setOpenForm] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const handleFileInputChange = async (event) => {
        setOpenForm(true);
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const url = reader.result;
            setImageUrl(url);
        };
        reader.readAsDataURL(file);
        event.target.value = null;
      };

    return  (
        <>
            <Modal 
                open={openForm}
                onClose={()=> {
                setOpenForm(false);
                setImageUrl("")
                }}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
                sx={{ ...style, width: "100%", height: "100vh" , backgroundColor: "rgba(0,0,0,0.2)"}}
            >
                <div style={{width:"100%", height:"100%"}}>
                <CropImage
                    url={imageUrl}
                    close={()=> {
                        setOpenForm(false);
                    }}
                    />
                </div> 
            </Modal>
            <Typography variant="h5" gutterBottom>
                Avatar
            </Typography>
            <Avatar
                alt={userRealName??`*${userName}`}
                src={avatarURI??""}
                sx={{ width: 56, height: 56, margin: 2}}
            />
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                {avatarURI===""?"Upload Avatar":"Change Avatar"}
                <VisuallyHiddenInput type="file" accept="image/png, image/jpeg, image/png" onChange={handleFileInputChange} />
            </Button>
        </>
    );
}