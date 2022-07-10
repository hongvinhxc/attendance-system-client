import { PlusOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  message,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { RcFile } from "antd/lib/upload";
import WebcamCapture from "components/camera/capture";
import { dataURLtoFile, getBase64 } from "helpers/file";
import { useEffect, useState } from "react";
import * as profileService from "services/profile";

const dummyRequest = ({ file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

type Props = {
  data?: any;
  onClose: Function;
  onReload: Function;
};
const AddEditModal = ({ data, onClose, onReload }: Props) => {
  const [visible, setVisible] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (!data) setVisible(false);
    else {
      setVisible(true);
      if (Object.keys(data).length) {
        form.setFieldsValue(data);
        setProfileId(data._id);
        getProfileImages(data._id);
      }
    }
    // eslint-disable-next-line
  }, [data]);

  const getProfileImages = async (id: string) => {
    let res = await profileService.getProfileImages(id);
    if (res.status) {
      let fileList: UploadFile[] = [];
      res.data.forEach((image: string, index: number) => {
        const file = dataURLtoFile(image, `capture-${index}`);
        const uploadFile: UploadFile = {
          uid: file.name,
          name: file.name,
          fileName: file.name,
          lastModified: file.lastModified,
          originFileObj: file as RcFile,
          type: file.type,
        };
        fileList.push(uploadFile);
      });
      setFileList(fileList);
      form.setFields([
        {
          name: "images",
          value: {
            fileList,
          },
        },
      ]);
    } else {
      message.error("Fail when load profile images");
    }
  };

  const onOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (profileId) {
          onUpdateProfile(values);
        } else {
          onAddProfile(values);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const onAddProfile = async (data: any) => {
    let body = Object.assign({}, data);

    let images = body?.images?.fileList?.map((file: UploadFile) => {
      return getBase64(file.originFileObj as RcFile);
    });

    body.images = await Promise.all(images || []);
    let res = await profileService.addProfile(body);
    if (res.status) {
      message.success(res.message);
      onCancel();
      onReload(1);
    } else {
      message.error(res.message);
    }
  };

  const onUpdateProfile = async (data: any) => {
    let body = Object.assign({}, data);

    let images = body?.images?.fileList.map((file: UploadFile) => {
      return getBase64(file.originFileObj as RcFile);
    });

    body.images = await Promise.all(images);

    let res = await profileService.updateProfile(profileId, body);
    if (res.status) {
      message.success(res.message);
      onCancel();
      onReload();
    } else {
      message.error(res.message);
    }
  };

  const onCancel = () => {
    form.resetFields();
    setFileList([]);
    setProfileId("");
    onClose();
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const beforeUpload = (file: File) => {
    if (file.size / 1024 / 1024 > 10) {
      message.error(`${file.name} is larger than 10MB`);
      return false;
    }
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error(`${file.name} is not a image file`);
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onCapture = (image: string) => {
    const file = dataURLtoFile(image, `capture-${Date.now()}`);
    const uploadFile: UploadFile = {
      uid: file.name,
      name: file.name,
      fileName: file.name,
      lastModified: file.lastModified,
      originFileObj: file as RcFile,
      type: file.type,
    };
    setFileList([...fileList, uploadFile]);
    form.setFields([
      {
        name: "images",
        value: {
          fileList: [...fileList, uploadFile],
        },
      },
    ]);
  };

  return (
    <>
      <Modal
        title={profileId ? "Edit profile" : "Create new profile"}
        centered
        visible={visible}
        onOk={() => onOk()}
        onCancel={() => onCancel()}
        width={1000}
        okText={profileId ? "Update" : "Create"}
      >
        <Form
          form={form}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 14 },
          }}
          labelCol={{
            xs: { span: 24 },
            sm: { span: 6 },
          }}
          layout="horizontal"
          name="form_in_modal"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input name of profile!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
            rules={[
              {
                required: true,
                message: "Please input code of profile!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="position"
            label="Position"
            rules={[
              {
                required: true,
                message: "Please input position of profile!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Images">
            <Form.Item name="images" style={{ marginBottom: 0 }}>
              <Upload
                accept="image/*"
                listType="picture-card"
                customRequest={dummyRequest}
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
            </Form.Item>
            {fileList.length >= 8 ? null : (
              <WebcamCapture onCapture={onCapture}></WebcamCapture>
            )}
          </Form.Item>
        </Form>

        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Modal>
    </>
  );
};

export default AddEditModal;
