import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { getNotify } from '../../sevice/api';
import { useSelector } from 'react-redux';

export default function Notify() {
    const userInfo = useSelector(state=>state.user_info)
    const [unreadNotify, setUnreadNotify] = useState(0)
    useEffect(() => {
        const fetchData = async ()=>{
            const response = getNotify()
            if(response?.status===true) {
                setUnreadNotify(5)
            }
        }
        const timer = setTimeout(() => {
          fetchData();
        }, 15000); // 15 giây
    
        return () => {
          clearTimeout(timer); // Xóa bộ đếm khi component bị hủy
        };
    }, []);
    return (
        <>
            {userInfo?
            <Button  >
                <Badge badgeContent={unreadNotify} color="primary" sx={{ width: 27, height: 27}}>
                    <MailIcon color="action" />
                </Badge>
            </Button>
            :null}
        </>
    );
}