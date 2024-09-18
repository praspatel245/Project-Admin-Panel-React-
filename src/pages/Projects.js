import React, { useEffect, useState } from "react";
import { Layout, Table, Button, Row, Col, Select, Card, Modal, Form, Input, message, Space } from "antd";
import { PlusOutlined, ReloadOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import api from "../services/api";
import { format, isWithinInterval, subDays } from "date-fns";

const { Content } = Layout;
const { Option } = Select;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "All",
    date: "All",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const response = await api.getProjects();
    setProjects(response);
    setFilteredProjects(response);
    setLoading(false);
  };

  const filterByDate = (projects, filterValue) => {
    const now = new Date();
    if (filterValue === "LastWeek") {
      const lastWeek = subDays(now, 7);
      return projects.filter((project) =>
        isWithinInterval(new Date(project.createdDate), { start: lastWeek, end: now })
      );
    }
    if (filterValue === "LastMonth") {
      const lastMonth = subDays(now, 30);
      return projects.filter((project) =>
        isWithinInterval(new Date(project.createdDate), { start: lastMonth, end: now })
      );
    }
    return projects;
  };

  const filterByStatus = (projects, status) => {
    if (status === "All") return projects;
    return projects.filter((project) => project.status === status);
  };

  const handleFilterChange = (value, type) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    let filtered = projects;
    if (type === "date") filtered = filterByDate(projects, value);
    if (type === "status") filtered = filterByStatus(projects, value);
    setFilteredProjects(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      status: "All",
      date: "All",
    });
    setFilteredProjects(projects);
  };

  const handleAddEditProject = async (values) => {
    try {
      if (editingProject) {
        await api.updateProject(editingProject.refNumber, values);
        message.success("Project updated successfully");
      } else {
        await api.addProject(values);
        message.success("Project added successfully");
      }
      fetchProjects();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save project");
    }
  };

  const handleDeleteProject = async (refNumber) => {
    try {
      await api.deleteProject(refNumber);
      message.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      message.error("Failed to delete project");
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    form.setFieldsValue(project);
    setIsModalVisible(true);
  };

  const handleAddClick = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const columns = [
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "REF Number", dataIndex: "refNumber", key: "refNumber" },
    { title: "Project Name", dataIndex: "projectName", key: "projectName" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Created Date", dataIndex: "createdDate", key: "createdDate", render: (text) => format(new Date(text), "yyyy-MM-dd") },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteProject(record.refNumber)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="site-layout">
      <Content style={{ margin: "16px" }}>
        <Card title="Projects" extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>Add Project</Button>
          }>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                onChange={(value) => handleFilterChange(value, "date")}
                value={filters.date}
                placeholder="Filter By Date"
              >
                <Option value="All">All Dates</Option>
                <Option value="LastWeek">Last Week</Option>
                <Option value="LastMonth">Last Month</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                onChange={(value) => handleFilterChange(value, "status")}
                value={filters.status}
                placeholder="Filter By Status"
              >
                <Option value="All">All Statuses</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Pending">Pending</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Button type="default" icon={<ReloadOutlined />} onClick={handleResetFilters}>Reset Filters</Button>
            </Col>
          </Row>
          <Table dataSource={filteredProjects} columns={columns} loading={loading} rowKey="refNumber" pagination={{ pageSize: 8 }} />
        </Card>
      </Content>
      <Modal
        title={editingProject ? "Edit Project" : "Add Project"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAddEditProject} layout="vertical">
          <Form.Item name="customer" label="Customer" rules={[{ required: true, message: "Please enter the customer" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="projectName" label="Project Name" rules={[{ required: true, message: "Please enter the project name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please enter the location" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select the status" }]}>
            <Select>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Projects;
