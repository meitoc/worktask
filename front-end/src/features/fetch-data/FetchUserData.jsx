import { useEffect,useContext} from "react";
import { ContextStatus } from "../../App";

export default function FetchUserData(prop) {
    const { loginStatus, setUserData} = useContext(ContextStatus);
    // const [changeData,setChangData] =useState(null);
    useEffect(()=>{
        async function fetchData(session) {
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${session}`,
                }
              };
              console.log(`http://localhost:8000/api/user-info`);
              fetch(`http://localhost:8000/api/user-info`, options)
                .then(response => response.json())
                .then(response => {
                    if(response.success){
                        console.log("User Data")
                        console.log(response.data);
                        setUserData(response.data.data);
                        console.log("Fetched your account info.")
                    }
                    else console.log("No data.")
                })
                .catch(err => {
                    console.log("Error when fetch account info!")
                    console.error(err);
                });
        }
        let session = localStorage.getItem('loginSession');
        if(loginStatus===true && session!==null && session!=undefined) {
            fetchData(session);
            console.log("Fetching user data...")
        }
    },[setUserData,loginStatus]);
        return(<>
            {prop.children}
        </>)
}