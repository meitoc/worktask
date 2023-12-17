import {  Button, Slider } from '@mui/material'
import { useState } from 'react'
import Cropper from 'react-easy-crop'
import { postAvatar } from '../../sevice/api'
import { useDispatch } from 'react-redux'
import { updateUserInformation } from '../../sevice/user_info/slice'


export default function CropImage (prop) {
  const dispatch = useDispatch();
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [finalArea, setFinalArea] = useState(null)
  const [finalPixels, setFinalPixels] = useState(null)
  
  const [uploading, setUploading] = useState(false)

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setFinalArea(croppedArea);
    setFinalPixels(croppedAreaPixels)
    console.log(croppedArea, croppedAreaPixels)
  }

  const handleSubmit = ()=>{
    setUploading(true);
    console.log('Cropped area:', finalArea);
    console.log('Cropped area (pixels):', finalPixels);
    const canvas = document.createElement('canvas');
    const image = document.createElement('img');
    image.src = prop.url;
    image.onload = async () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = finalPixels.width;
      canvas.height = finalPixels.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        finalPixels.x * scaleX,
        finalPixels.y * scaleY,
        finalPixels.width * scaleX,
        finalPixels.height * scaleY,
        0,
        0,
        finalPixels.width,
        finalPixels.height
      );
      canvas.toBlob(async (blob) => {
        const croppedImageFile = new File([blob], 'croppedImage.jpg', { type: 'image/jpeg' });
        const response = await postAvatar(croppedImageFile);
        if(response?.success===true){
          dispatch(updateUserInformation(response.data))
          handleCancel();
        } else{
          setUploading(false);
        }
      }, 'image/jpeg');
    };
  }

  const handleCancel = ()=>{
    setUploading(false);
    if(typeof(prop.close) === "function") prop.close();
    // setCrop({x:0,y:0});
    // setZoom(1);

  }
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",height:"100%"}}>
      <div style={{width:300,height:300, position:"relative"}}>
        <Cropper
          image={prop.url}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          onCropChange={(event)=>{if(!uploading) setCrop(event)}}
          onCropComplete={onCropComplete}
          onZoomChange={(event)=>{if(!uploading) setZoom(event)}}
        />
      </div>
      <div style={{width:300, position:"relative"}}>
      <Slider
        disabled={uploading} 
        size="small"
        value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => {
            setZoom(e.target.value)
          }}
          />
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <Button disabled={uploading} variant="contained" sx={{margin:1}} onClick={handleSubmit} >OK</Button>
        <Button disabled={uploading} variant="contained" sx={{margin:1}} color="warning" onClick={handleCancel} >CANCEL</Button>
      </div>
    </div>
  )
}