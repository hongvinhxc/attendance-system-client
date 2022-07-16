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
import { isMobile } from "helpers/utils";
import { useEffect, useState } from "react";
import * as profileService from "services/profile";

const ExportModal = () => {
  const [visible, setVisible] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [form] = Form.useForm();
  const imagesField = Form.useWatch("images", form);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [invalidForm, setInValidForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
   
    // eslint-disable-next-line
  }, []);



  const onOk = () => {
    form
      .validateFields()
      .then((values) => {
        setIsLoading(true);
        if (profileId) {
        } else {
          onAddProfile(values);
        }
        setIsLoading(false);
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
    } else {
      message.error(res.message);
    }
  };


  const onCancel = () => {
    form.resetFields();
    setFileList([]);
    form.setFields([
      {
        name: "images",
        value: {
          fileList: [],
        },
        touched: false,
      },
    ]);
    setInValidForm(true);
  };

  const onFieldsChange = (values: any) => {
    setInValidForm(
      (!profileId
        ? !form.isFieldsTouched(["name", "code", "position"], true)
        : !form.isFieldsTouched()) ||
        !!form.getFieldsError().filter(({ errors }) => errors.length).length
    );
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
        okButtonProps={{ disabled: invalidForm || isLoading }}
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
          onFieldsChange={onFieldsChange}
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
          
        </Form>
      </Modal>
    </>
  );
};

export default ExportModal;
