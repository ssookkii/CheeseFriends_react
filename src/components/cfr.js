import React, { useState } from 'react';

function CFR() {
    const [similarity, setSimilarity] = useState(null);

    const handleCompareButtonClick = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/compareFaces', {
                //const response = await fetch(`http://localhost:3000/api/imgcrop/member1`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const error = await response.json();
                console.error('Error from server:', error);
                // 이 부분에서 오류를 처리하거나 상태를 업데이트하여 사용자에게 메시지를 표시할 수 있습니다.
                return;
            }
    
            const result = await response.json();
            setSimilarity(result);
        } catch (error) {
            console.error('Error while fetching data:', error);
            // 이 부분에서 오류를 처리하거나 상태를 업데이트하여 사용자에게 메시지를 표시할 수 있습니다.
        }
    };    

    return (
        <div>
            <h1>치즈 프렌드 출석 시스템</h1>
            <button onClick={handleCompareButtonClick}>출석 시스템 실행</button>
            {similarity !== null && (
                <div>
                    <h2>Similarity: {similarity}</h2>
                </div>
            )}
        </div>
    );
}

export default CFR;



