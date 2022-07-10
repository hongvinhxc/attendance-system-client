import { CameraOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row } from "antd";
import React, { useState } from "react";
import Webcam from "react-webcam";
import "./capture.scss";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

type Props = {
  onCapture: Function;
};

const WebcamCapture = ({ onCapture }: Props) => {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState<any>(null);
  const webcamRef = React.useRef<any>(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const onOk = () => {
    onCapture(image);
    onCancel();
  };

  const onCancel = () => {
    setVisible(false);
    setImage(null);
  };

  return (
    <>
      <Button icon={<CameraOutlined />} onClick={() => setVisible(true)}>
        Capture
      </Button>
      <Modal
        className="webcam-capture"
        width={1400}
        visible={visible}
        title={"Capture image from Camera"}
        onCancel={onCancel}
        onOk={onOk}
        okButtonProps={{
          disabled: !image,
        }}
      >
        <Row justify="space-around">
          <Col>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Webcam
                audio={false}
                height={480}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                videoConstraints={videoConstraints}
              />
              <Button
                style={{ width: 640 }}
                icon={<CameraOutlined />}
                onClick={capture}
              >
                Capture photo
              </Button>
            </div>
          </Col>
          <Col>
            <div className="preview-image">
              {image ? (
                <img src={image} alt="Screenshot" />
              ) : (
                <div className="no-image">No image was captured</div>
              )}
            </div>
            <div className="preview-title">Preview image</div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default WebcamCapture;
