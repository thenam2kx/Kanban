import { UseMutationResult } from '@tanstack/react-query'
import { Form, FormInstance, Input, Modal, Select } from 'antd'

const { Option } = Select

interface IProps {
  isModalOpen: boolean
  // eslint-disable-next-line no-unused-vars
  setIsModalOpen: (isOpen: boolean) => void
  createTagsMutation: UseMutationResult<ITags, Error, ITags, unknown>
  updateTagsMutation: UseMutationResult<ITags, Error, { id: string, data: IFormTags }, unknown>
  editingTag: ITags | null
  // eslint-disable-next-line no-unused-vars
  setEditingTag: (tag: ITags | null) => void
  handleOk: () => void
  form: FormInstance
}

const FormTags = (props: IProps) => {
  const {
    isModalOpen,
    setIsModalOpen,
    createTagsMutation,
    updateTagsMutation,
    editingTag,
    setEditingTag,
    handleOk,
    form
  } = props

  return (
    <Modal
      title={editingTag ? 'Edit Tag' : 'Create New Tag'}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={() => {
        setIsModalOpen(false)
        setEditingTag(null)
        form.resetFields()
      }}
      okText={editingTag ? 'Update' : 'Create'}
      okButtonProps={{ loading: createTagsMutation.isPending || updateTagsMutation.isPending }}
    >
      <Form
        form={form}
        layout='vertical'
        className='mt-4'
        initialValues={editingTag || { isPublic: 'true', color: 'blue' }}
      >
        <Form.Item name='name' label='Tên thẻ' rules={[{ required: true, message: 'Tên thẻ không được để trống!' }]}>
          <Input placeholder='Nhập tên thẻ...' />
        </Form.Item>

        <Form.Item name='isPublic' label='Trạng thái' rules={[{ required: true, message: 'Trạng thái không được để trống!' }]}>
          <Select
            placeholder='Chọn trạng thái thẻ'
            allowClear
          >
            <Option value={true}>Công khai</Option>
            <Option value={false}>Riêng tư</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FormTags
