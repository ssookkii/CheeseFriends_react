import React from 'react';
import './css/modal.css';

const Searchmodal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open2, close2, yesclose2, header2 } = props;

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open2 ? 'openModal modal' : 'modal'}>
      {open2 ? (
        <section>
          <header class="modalheader">
            {header2}
            <button className="close" onClick={close2}>
              &times;
            </button>
          </header>
          <main>{props.children}</main>
          <footer>
            <button className="close" onClick={yesclose2}>
              추가하기
            </button>
            <button className="close" onClick={close2}>
              닫기
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default Searchmodal;