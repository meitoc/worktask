import { useContext } from 'react';
import { ContextStatus } from '../../App';
import { ButtonBase } from '@mui/material';
export default function LetLogin () {
    const {setShowLoginForm} = useContext(ContextStatus)
    return(
        <ButtonBase onClick={()=>setShowLoginForm(true)}>
            <img
                style={{margin: "5px", maxHeight:"100vh", width:"100vw"}}
                src={"/let-log-in.svg"}>
            </img>
        </ButtonBase>
    )
}