import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

export default function UploadFileButton(prop) {
  return (
    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
      {prop.name}
      <VisuallyHiddenInput type="file" accept={prop.type==="image"?"image/png, image/jpeg, image/png":"*"} />
    </Button>
  );
}