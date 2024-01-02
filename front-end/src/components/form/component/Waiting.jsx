import Link from '@mui/material/Link';
import { Typography } from '@mui/material';

export default function Waiting(prop) {
    return(
        <>
        <Typography variant="body1" gutterBottom>{`Access your email and click the link we have sent to you.`}</Typography>
        <Link
            underline="none"
            style={{cursor: "pointer"}}
            onClick={()=>{
                prop.goTo("login")
            }}
        >
            Go back
        </Link>
        </>
    )
}
