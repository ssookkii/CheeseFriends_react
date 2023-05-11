import React from 'react';
import './css/modal.css';

const Cancelmodal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open3, close3, yesclose3, header3 } = props;

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open3 ? 'openModal modal' : 'modal'}>
      {open3 ? (
        <section>
          <header class="modalheader">
            {header3}
            <button className="close" onClick={close3}>
              &times;
            </button>
          </header>
          <main>{props.children}</main>
          <footer>
            <button className="close" onClick={yesclose3}>
              취소하기
            </button>
            <button className="close" onClick={close3}>
              닫기
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default Cancelmodal;