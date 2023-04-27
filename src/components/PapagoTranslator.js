import React, { useState } from "react";

function PapagoTranslator() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const translate = () => {
    const clientId = "9sPIM4UprmN3lUd6ddie";
    const clientSecret = "nU9WPRg33w";
    const source = "ko";
    const target = "en";
    const apiURL = "https://openapi.naver.com/v1/papago/n2mt";

    fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      body: `source=${source}&target=${target}&text=${encodeURIComponent(text)}`,
    })
      .then((res) => res.json())
      .then((data) => {
        setTranslatedText(data.message.result.translatedText);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={translate}>번역</button>
      <p>{translatedText}</p>
    </div>
  );
}

export default PapagoTranslator;
