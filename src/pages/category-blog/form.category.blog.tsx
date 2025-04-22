import { EyeInvisibleOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Form, FormInstance, Input, Modal, Switch, Upload } from 'antd'


interface IProps {
  editingCategory: any;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleSubmit: (values: any) => void;
  uploadProps: any;
  form: FormInstance;
}

const FormCategoriesBlogs = (props: IProps) => {
  const { editingCategory, isModalOpen, handleCancel, handleSubmit, uploadProps, form } = props
  return (
    <Modal
      title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{ isPublic: true }} className='mt-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Form.Item
            name='name'
            label='Tên danh mục'
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
            className='md:col-span-2'
          >
            <Input placeholder='Nhập tên danh mục' />
          </Form.Item>

          <Form.Item
            name='slug'
            label='Slug'
            rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
            className='md:col-span-2'
          >
            <Input placeholder='nhap-slug-danh-muc' />
          </Form.Item>

          <Form.Item name='description' label='Mô tả' className='md:col-span-2'>
            <Input.TextArea rows={4} placeholder='Nhập mô tả danh mục (không bắt buộc)' />
          </Form.Item>

          <Form.Item name='avatar' label='Ảnh đại diện'>
            <Upload {...uploadProps} listType='picture' maxCount={1}>
              <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item name='isPublic' label='Trạng thái' valuePropName='checked'>
            <div className='flex items-center'>
              <Switch checkedChildren={<EyeOutlined />} unCheckedChildren={<EyeInvisibleOutlined />} defaultChecked />
              <span className='ml-2 text-sm text-gray-600'>
                {form.getFieldValue('isPublic') ? 'Công khai' : 'Riêng tư'}
              </span>
            </div>
          </Form.Item>
        </div>

        <div className='flex justify-end gap-2 mt-4'>
          <Button onClick={handleCancel}>Hủy</Button>
          <Button type='primary' htmlType='submit' className='bg-blue-500 hover:bg-blue-600'>
            {editingCategory ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default FormCategoriesBlogs