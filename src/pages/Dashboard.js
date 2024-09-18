import React, { useEffect, useState } from "react";
import { Layout, Card, Row, Col, Table, Typography } from "antd";
import api from "../services/api";
import SalesChart from "../pages/SalesChart";

const { Content } = Layout;
const { Text } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await api.getDashboardStats();
      setStats(response);
      setLoading(false);
    }
    async function fetchSalesData() {
        setLoading(true);
        const response = await api.getSalesData();
        setSalesData(response);
        setLoading(false);
    }
    fetchData();
    fetchSalesData();
  }, []);

  const dataSource = [
    {
        key: '1',
        productName: 'Product 1',
        location: 'New York',
        date: '2024-09-01',
        price: '$120',
        status: 'Delivered',
    },
    {
        key: '2',
        productName: 'Product 2',
        location: 'India',
        date: '2024-08-01',
        price: '$80',
        status: 'Pending',
    },
  ];

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Date - Time',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
      <Layout className="site-layout">
        <Content style={{ margin: '16px' }}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card loading={loading} title="Total Users" bordered={false}>
                <Text>{stats.totalUsers || 0}</Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card loading={loading} title="Total Orders" bordered={false}>
                <Text>{stats.totalOrders || 0}</Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card loading={loading} title="Total Sales" bordered={false}>
                <Text>${stats.totalSales || 0}</Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card loading={loading} title="Total Pending" bordered={false}>
                <Text>{stats.totalPending || 0}</Text>
              </Card>
            </Col>
          </Row>

          <Card title="Sales Details" style={{ marginTop: 16 }}>
            <SalesChart data={salesData} />
          </Card>

          <Card title="Product Table" style={{ marginTop: 16 }}>
            <Table dataSource={dataSource} columns={columns} />
          </Card>
        </Content>
        </Layout>
  );
};

export default Dashboard;