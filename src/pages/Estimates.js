import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Select, Input, Card, Layout, message } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../services/api';
import EditEstimate from './EditEstimate';
import AddEstimate from './AddEstimate';

const { Content } = Layout;
const { Option } = Select;

const Estimates = () => {
  const [estimates, setEstimates] = useState([]);
  const [filteredEstimates, setFilteredEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'All',
    client: '',
  });
  const [selectedEstimateId, setSelectedEstimateId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    fetchEstimates();
  }, []);

  const fetchEstimates = async () => {
    setLoading(true);
    const response = await api.getEstimates();
    setEstimates(response);
    setFilteredEstimates(response);
    setLoading(false);
  };

  const handleFilterChange = (value, type) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    filterEstimates({ ...filters, [type]: value });
  };

  const filterEstimates = (updatedFilters) => {
    let filtered = estimates;

    if (updatedFilters.status !== 'All') {
      filtered = filtered.filter((estimate) => estimate.status === updatedFilters.status);
    }

    if (updatedFilters.client) {
      filtered = filtered.filter((estimate) =>
        estimate.client.toLowerCase().includes(updatedFilters.client.toLowerCase())
      );
    }

    setFilteredEstimates(filtered);
  };

  const handleEditButtonClick = (id) => {
    setSelectedEstimateId(id);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    await api.deleteEstimate(id);
    message.success('Estimate deleted successfully');
    fetchEstimates();
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedEstimateId(null);
  };

  const columns = [
    { title: 'Version', dataIndex: 'id', key: 'id' },
    { title: 'Project', dataIndex: 'project', key: 'project' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Created Date', dataIndex: 'createdDate', key: 'createdDate' },
    { title: 'Last Modified', dataIndex: 'modifiedDate', key: 'modifiedDate' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (id) => (
        <>
          <Button onClick={() => handleEditButtonClick(id)}>Edit</Button>
          <Button danger onClick={() => handleDelete(id)} style={{ marginLeft: 8 }}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout className="site-layout">
      <Content style={{ margin: '16px' }}>
        {isModalVisible ? (
          <EditEstimate Id={selectedEstimateId} onClose={closeModal} />
        ) : (
          <Card title="Estimates" extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)}>
              Add Estimate
            </Button>
          }>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Filter by Status"
                  onChange={(value) => handleFilterChange(value, 'status')}
                  value={filters.status}
                >
                  <Option value="All">All</Option>
                  <Option value="Created">Created</Option>
                  <Option value="Processing">Processing</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Input
                  placeholder="Filter by Client"
                  value={filters.client}
                  onChange={(e) => handleFilterChange(e.target.value, 'client')}
                />
              </Col>
              <Col span={6}>
                <Button type="default" icon={<ReloadOutlined />} onClick={fetchEstimates}>
                  Reset Filters
                </Button>
              </Col>
            </Row>
            <Table
              dataSource={filteredEstimates}
              columns={columns}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 8 }}
            />
          </Card>
        )}

        {isAddModalVisible && (<AddEstimate visible={isAddModalVisible} onClose={() => setIsAddModalVisible(false)}/>) }
      </Content>
    </Layout>
  );
};

export default Estimates;
