import { Skeleton } from "@mui/material";

export default function FileSkeleton() {
  return (
    <div style={{display:"flex"}}>
        <Skeleton variant="circular" width={56} height={56} />
        <div style={{flexGrow:1}}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
        </div>
    </div> 
  );
}