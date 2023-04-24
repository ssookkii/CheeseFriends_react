import React from "react";
import DaumPostcode from "react-daum-postcode";
//import './post.css';

const Post = (props) => {

    const complete = (data) =>{
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        console.log(data)
        console.log(fullAddress)
        console.log(data.zonecode)

        props.setcompany({
            ...props.company,
            address:fullAddress,
        })
    }

    function modalclose(){
        props.setModalClose(false)
    }

    return (   
        <div>
            <DaumPostcode                
                autoClose
                onComplete={complete} height={700} onClose={modalclose} />           
        </div> 
            
    );
};

export default Post;

