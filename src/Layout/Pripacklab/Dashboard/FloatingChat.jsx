
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { site_url } from "../../../config/config";



const FloatingChat = () => {

    const navigate = useNavigate();
  return (
    <div>
        <button onClick={()=> navigate('/pripacklab/support')}  className="fixed top-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white   flex items-center justify-center">

       <IoChatbubbleEllipsesOutline className=" text-white w-8 h-8"></IoChatbubbleEllipsesOutline>
   </button>
    </div>
  )
}

export default FloatingChat