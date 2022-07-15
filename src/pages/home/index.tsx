import { message, notification } from "antd";
import { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as detectFaceService from "services/detect-face";
import "./style.scss";

function Home() {
  const webcamRef = useRef<any>(null);
  const throttling = useRef(false);
  const isNotDestroy = useRef(true);

  const capture = useCallback(() => {
    return webcamRef.current.getScreenshot();
  }, [webcamRef]);

  useEffect(() => {
    isNotDestroy.current = true;
    const interval = setInterval(() => {
      if (!throttling.current) {
        getPredictFace();
      }
    }, 1000);

    message.open({
      key: "title",
      content: (
        <div className="title">Hệ thống điểm danh bằng nhận diện khuôn mặt</div>
      ),
      duration: 0,
    });

    return () => {
      message.destroy();
      notification.destroy();
      clearInterval(interval);
      isNotDestroy.current = false;
    };
    // eslint-disable-next-line
  }, []);

  const getPredictFace = async () => {
    throttling.current = true;
    const image = capture();
    let res = await detectFaceService.detectFace(image);
    throttling.current = false;
    if (res.status && isNotDestroy.current) {
      for (let item of res.data) {
        notification.open({
          placement: "bottomRight",
          key: item.code,
          message: (
            <div className="hello-message">
              <div className="name">
                <span className="label">Xin chào, </span>
                <span className="content">{item.name}</span>
              </div>
              <div className="code">
                <span className="label">Mã nhân viên: </span>
                <span className="content">{item.code}</span>
              </div>
              <div className="position">
                <span className="label">Vị trí: </span>
                <span className="content">{item.position}</span>
              </div>
            </div>
          ),
        });
      }
    }
  };

  return (
    <div className="home">
      <Webcam
        audio={false}
        height={window.innerHeight - 10}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={window.innerWidth - 10}
      />
    </div>
  );
}

export default Home;
